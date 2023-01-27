<script setup lang="ts">
import { onMounted, onUnmounted, inject } from 'vue'
import {
  Layer,
  Viewpoint,
  vectorStyleSymbol,
  OpenlayersMap,
  StyleItem,
} from '@vcmap/core'
import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'
import ComponentsAboveMap from '@/components/map/aboveMap/ComponentsAboveMap.vue'

import { generatePoiStyle, generatePoiStyleWithoutLabel } from '@/styles/common'

import {
  useLayersStore,
  RENNES_LAYERNAMES,
  RENNES_LAYER,
} from '@/stores/layers'
import { useMapStore } from '@/stores/map'
import {
  useLineViewsStore,
  useTravelTimesViewStore,
  useViewsStore,
} from '@/stores/views'
import { useStationsStore } from '@/stores/stations'
import { useComponentAboveMapStore } from '@/stores/componentsAboveMapStore'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'
import type { LineNumber } from '@/model/lines.model'
import { isStationOnLine } from '@/services/station'
import { stationsFixtures } from '@/model/stations.fixtures'
import { Point } from 'ol/geom'
import { transform } from 'ol/proj'
import type { Feature } from 'ol'
import type { SelectedTrambusLine } from '@/model/selected-line.model'
import {
  getViewpointFromFeature,
  cloneViewPointAndResetCameraPosition,
} from '@/helpers/viewpointHelper'
import type { RennesApp } from '@/services/RennesApp'
import {
  updateLineViewStyle,
  updateTravelTimesViewStyle,
  updateStationViewStyle,
  updateHomeViewStyle,
} from '@/services/viewStyle'
import { updateTraveltimeArrow } from '@/services/arrow'
import { View, viewList } from '@/model/views.model'
import { shorterName } from '@/services/poi'
import { setDistanceDisplayConditionFeature } from '@/services/setDistanceDisplayCondition'
import { NearFarScalar } from '@vcmap/cesium'
import { usePoiStore } from '@/stores/poi'

const vcsApp = inject('vcsApp') as RennesApp

const layerStore = useLayersStore()
const poiStore = usePoiStore()
const mapStore = useMapStore()
const lineViewStore = useLineViewsStore()
const stationsStore = useStationsStore()
const travelTimesViewStore = useTravelTimesViewStore()
const viewStore = useViewsStore()
const componentAboveMapStore = useComponentAboveMapStore()
const traveltimeInteractionStore = useTraveltimeInteractionStore()

onMounted(async () => {
  await vcsApp.initializeMap()
  await updateLayersVisibility()
  updateMapStyle()
})

// The following code is needed to cleanup resources we created
// (in this case, the vcsApp) once a component gets destroyed (unmounted).
// Otherwise, we will keep on rendering the vcsApp in its container after a hot reload.
onUnmounted(() => {
  vcsApp.destroy()
})

async function removeFilterOnLayers(layerName: string) {
  await vcsApp.layers.getByKey(layerName)?.reload()
}

/**
 * Reload parking and poi layers, and hide them during restyling
 */
async function removeFiltersOnPoiAndParking() {
  layerStore.toggleLayer(RENNES_LAYER.poi)
  layerStore.toggleLayer(RENNES_LAYER.parking)
  await removeFilterOnLayers(RENNES_LAYER.poi)
  await removeFilterOnLayers(RENNES_LAYER.parking)
  fixGeometryOfPoi()
  layerStore.toggleLayer(RENNES_LAYER.poi)
  layerStore.toggleLayer(RENNES_LAYER.parking)
}

async function filterFeatureByParkingAndLine(line: SelectedTrambusLine) {
  await filterFeatureByLayerAndKeyAndValue(
    RENNES_LAYER.parking,
    'li_code',
    `T${line.valueOf()}`
  )
}

async function filterFeatureByPoiAndLine(line: number) {
  let layer = await vcsApp.getLayerByKey(RENNES_LAYER.poi)
  let featuresToDelete = layer
    .getFeatures()
    .filter(
      (f) =>
        !isStationOnLine(
          stationsFixtures(),
          f.getProperties()['station_nom'],
          line as LineNumber
        )
    )
    .map((f) => f.getId()!)
  layer.removeFeaturesById(featuresToDelete)
}

async function filterFeatureByPoiAndStation(station: string) {
  let layer = await vcsApp.getLayerByKey(RENNES_LAYER.poi)
  let featuresToDelete = layer
    .getFeatures()
    .filter((f) => f.getProperties()['station_nom'] !== station)
    .map((f) => f.getId()!)
  layer.removeFeaturesById(featuresToDelete)
}

async function resetStyleOfPoi(view: View) {
  let layer = await vcsApp.getLayerByKey(RENNES_LAYER.poi)
  layer.getFeatures().forEach((f) => {
    let styleItem: StyleItem
    if (view === viewList.station) {
      styleItem = generatePoiStyle(
        shorterName(f.getProperties()['site_nom']),
        f.getProperties()['distance'],
        mapStore.is3D()
      )
    } else {
      styleItem = generatePoiStyleWithoutLabel()
      setDistanceDisplayConditionFeature(
        styleItem,
        vcsApp.maps.getByKey('ol') as OpenlayersMap
      )
    }

    //@ts-expect-error
    f[vectorStyleSymbol] = styleItem
    f.setStyle(styleItem.style)
  })
}

async function fixGeometryOfPoi() {
  let layer = await vcsApp.getLayerByKey(RENNES_LAYER.poi)

  layer.getFeatures().forEach((f) => {
    let coordinates = [f.getProperties()['site_x'], f.getProperties()['site_y']]
    f.setGeometry(new Point(transform(coordinates, 'EPSG:4326', 'EPSG:3857')))
    const echelleMax = f.get('echelle_max') / 5
    f.set(
      'olcs_scaleByDistance',
      new NearFarScalar(echelleMax - 1, 1, echelleMax, 0)
    )
  })
}

async function filterFeatureByLayerAndKeyAndValue(
  layerName: string,
  featureKey: string,
  featureValue: string
) {
  let layer = await vcsApp.getLayerByKey(layerName)
  let featuresToDelete = layer
    .getFeatures()
    .filter((feature: Feature) => {
      return feature.getProperties()[featureKey] !== featureValue
    })
    .map((f) => f.getId()!)
  layer.removeFeaturesById(featuresToDelete)
}

async function setLayerVisible(layerName: string, visible: boolean) {
  const layer: Layer = vcsApp.maps.layerCollection.getByKey(layerName)
  if (visible) {
    await layer?.activate()
  } else {
    layer?.deactivate()
  }
}

async function updateLayersVisibility() {
  RENNES_LAYERNAMES.forEach(async (layer) => {
    await setLayerVisible(layer, layerStore.visibilities[layer])
  })
}

async function updateViewPoint() {
  const activeMap = vcsApp.maps.activeMap
  if (viewStore.currentView == viewList.station) {
    const stationName = stationsStore.currentStationView
    let layer = await vcsApp.getLayerByKey(RENNES_LAYER.trambusStops)
    let viewpoint: Viewpoint | null = null
    layer.getFeatures().forEach((f) => {
      const properties = f.getProperties()
      if (stationName == properties.nom) {
        viewpoint = getViewpointFromFeature(f)
      }
    })
    if (viewpoint !== null) {
      const newVp = cloneViewPointAndResetCameraPosition(viewpoint, null)
      await activeMap.gotoViewpoint(newVp)
    }
  } else {
    const selectedViewPoint = vcsApp.viewpoints.getByKey(mapStore.viewPoint)

    if (selectedViewPoint) {
      await activeMap.gotoViewpoint(selectedViewPoint)
    } else {
      // go to home
      const homeViewPoint = vcsApp.viewpoints.getByKey('rennes')
      await activeMap.gotoViewpoint(homeViewPoint!)
    }
  }
}

async function updateActiveMap() {
  await vcsApp.maps.setActiveMap(mapStore.activeMap)
  componentAboveMapStore.addListenerForUpdatePositions(vcsApp)
}

async function updateMapStyle() {
  switch (viewStore.currentView) {
    case viewList.home:
      updateHomeViewStyle(vcsApp)
      break
    case viewList.line:
      updateLineViewStyle(vcsApp)
      break
    case viewList.traveltimes:
      updateTravelTimesViewStyle(vcsApp)
      break
    case viewList.station:
      await updateStationViewStyle(vcsApp)
      break
  }
}

layerStore.$subscribe(async () => {
  await updateLayersVisibility()
})

mapStore.$subscribe(async () => {
  // Update map
  await updateActiveMap()
  await updateLayersVisibility()
  await updateViewPoint()
  if (poiStore.currentDisplay) {
    await resetStyleOfPoi(poiStore.currentDisplay)
  }
  await updateTraveltimeArrow(vcsApp)
})

viewStore.$subscribe(async () => {
  await updateMapStyle()
})

travelTimesViewStore.$subscribe(async () => {
  await updateTravelTimesViewStyle(vcsApp)
})

stationsStore.$subscribe(async () => {
  await updateMapStyle()
  await componentAboveMapStore.updateListLabelsStations(vcsApp)
})

poiStore.$subscribe(async () => {
  if (
    poiStore.currentDisplay === viewList.station &&
    stationsStore.currentStationView
  ) {
    await fixGeometryOfPoi()
    await filterFeatureByParkingAndLine(lineViewStore.selectedLine)
    await filterFeatureByPoiAndStation(stationsStore.currentStationView)
    await resetStyleOfPoi(viewList.station)
  } else if (
    poiStore.currentDisplay === viewList.line &&
    lineViewStore.selectedLine
  ) {
    await removeFiltersOnPoiAndParking()
    await fixGeometryOfPoi()
    await filterFeatureByParkingAndLine(lineViewStore.selectedLine)
    await filterFeatureByPoiAndLine(lineViewStore.selectedLine)
    await resetStyleOfPoi(viewList.line)
  } else {
    await removeFiltersOnPoiAndParking()
  }
})
traveltimeInteractionStore.$subscribe(async () => {
  await updateMapStyle()
})
</script>

<template>
  <UiMap></UiMap>
  <NavigationButtons />
  <ComponentsAboveMap />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, inject } from 'vue'
import { FeatureLayer, Layer, Viewpoint, ArrowEnd } from '@vcmap/core'
import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'
import ComponentsAboveMap from '@/components/map/aboveMap/ComponentsAboveMap.vue'

import { parkingStyle, poiStyle } from '@/styles/common'
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
import type { StyleFunction } from 'ol/style/Style'
import type { LineNumber } from '@/model/lines.model'
import {
  trambusLineTravelTimesViewStyleFunction,
  trambusStopLineViewStyleFunction,
  trambusStopTravelTimesViewStyleFunction,
} from '@/styles/trambusStop'
import { isStationOnLine, isTrambusStopBelongsToLine } from '@/services/station'
import { stationsFixtures } from '@/model/stations.fixtures'
import { LineString, Point } from 'ol/geom'
import { transform } from 'ol/proj'
import type { Feature } from 'ol'
import type { Style } from 'ol/style'
import { trambusLineViewStyleFunction } from '@/styles/line'
import { SelectedTrambusLine } from '@/model/selected-line.model'
import {
  getScratchLayer,
  updateArrowFeatures,
  updateArrowLayerStyle,
} from '@/styles/arrow'
import {
  getViewpointFromFeature,
  cloneViewPointAndResetCameraPosition,
} from '@/helpers/viewpointHelper'
import { viewList } from '@/model/views.model'
import { lineStringsFromTraveltimes } from '@/helpers/traveltimesHelper'
import { apiClientService } from '@/services/api.client'
import { lineStringsFromStationPois } from '@/helpers/stationHelper'
import type { RennesApp } from '@/services/RennesApp'

const vcsApp = inject('vcsApp') as RennesApp

const layerStore = useLayersStore()
const mapStore = useMapStore()
const lineViewStore = useLineViewsStore()
const stationsStore = useStationsStore()
const travelTimesViewStore = useTravelTimesViewStore()
const viewStore = useViewsStore()
const componentAboveMapStore = useComponentAboveMapStore()
const traveltimeInteractionStore = useTraveltimeInteractionStore()

onMounted(async () => {
  console.log('MapComponent.vue on mounted')

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

function removeFilterOnLayers(layerName: string) {
  vcsApp.layers.getByKey(layerName)?.reload()
}

async function removeAllFilters() {
  removeFilterOnLayers(RENNES_LAYER.parking)
  removeFilterOnLayers(RENNES_LAYER.poi)
  await fixGeometryOfPoi()
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

async function fixGeometryOfPoi() {
  let layer = await vcsApp.getLayerByKey(RENNES_LAYER.poi)
  layer.getFeatures().forEach((f) => {
    let coordinates = [f.getProperties()['site_x'], f.getProperties()['site_y']]
    f.setGeometry(new Point(transform(coordinates, 'EPSG:4326', 'EPSG:3857')))
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

function clearLayerAndApplyStyle(
  layerName: string,
  style: Style | StyleFunction | undefined
) {
  const layer = vcsApp.layers.getByKey(layerName) as FeatureLayer
  layer.clearStyle()
  if (style) {
    layer.setStyle(style)
  }
}

async function updatePOIArrow() {
  // Get scratch layer for POI arrow
  const arrowLayer = getScratchLayer(vcsApp, RENNES_LAYER._poiArrow)

  // Get station
  const stationName = stationsStore.currentStationView
  if (stationName === null) {
    return
  }
  const selectedStationFeature = await vcsApp.getFeatureByAttributeFromLayer(
    RENNES_LAYER.trambusStops,
    'nom',
    stationName
  )

  // Get POI that related to the selected station (note: not all station has a POIs)
  const selectedPoiFeatures = await vcsApp.getFeaturesByAttributeFromLayer(
    RENNES_LAYER.poi,
    'station_nom',
    stationName
  )

  // Create line string from station to POI
  const lineStrings = await lineStringsFromStationPois(
    selectedStationFeature!,
    selectedPoiFeatures
  )
  // Update features
  updateArrowFeatures(lineStrings, arrowLayer)
  // Update style
  updateArrowLayerStyle(arrowLayer, mapStore.is3D())
}

async function updateTraveltimeArrow() {
  // Arrow style for travel time
  const arrowLayer = getScratchLayer(vcsApp, RENNES_LAYER._traveltimeArrow)
  let lineStrings: LineString[] = []

  if (traveltimeInteractionStore.selectedTraveltime) {
    lineStrings = await lineStringsFromTraveltimes(
      [traveltimeInteractionStore.selectedTraveltime],
      vcsApp
    )
  } else if (viewStore.currentView === viewList.line) {
    const travelTimes = await apiClientService.fetchTravelTimeByLine(
      lineViewStore.selectedLine
    )
    lineStrings = await lineStringsFromTraveltimes(travelTimes, vcsApp)
  }
  updateArrowFeatures(lineStrings, arrowLayer)
  // False negative: Property 'BOTH' does not exist on type 'typeof ArrowEnd'
  // @ts-ignore
  updateArrowLayerStyle(arrowLayer, mapStore.is3D(), ArrowEnd.BOTH)
}

async function updateLineViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYER.trambusLines, (feature) =>
    trambusLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      lineViewStore.displayedOtherLines,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYER.trambusStops, (feature) =>
    trambusStopLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      isTrambusStopBelongsToLine(feature, lineViewStore.selectedLine),
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYER.poi, poiStyle)
  clearLayerAndApplyStyle(RENNES_LAYER.parking, parkingStyle)

  await updateTraveltimeArrow()
}

async function updateTravelTimesViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYER.trambusLines, (feature) =>
    trambusLineTravelTimesViewStyleFunction(
      feature,
      traveltimeInteractionStore.selectedTraveltime!,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYER.trambusStops, (feature) =>
    trambusStopTravelTimesViewStyleFunction(
      feature,
      traveltimeInteractionStore.selectedTraveltime!,
      mapStore.is3D()
    )
  )
  await updateTraveltimeArrow()
}

async function updateStationViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYER.trambusLines, (feature) =>
    trambusLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      lineViewStore.displayedOtherLines,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYER.trambusStops, (feature) =>
    trambusStopLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      isTrambusStopBelongsToLine(feature, lineViewStore.selectedLine),
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYER.poi, poiStyle)
  clearLayerAndApplyStyle(RENNES_LAYER.parking, parkingStyle)
  await updatePOIArrow()
}

function updateHomeViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYER.trambusLines, undefined)
  clearLayerAndApplyStyle(RENNES_LAYER.parking, parkingStyle)
}

async function updateActiveMap() {
  await vcsApp.maps.setActiveMap(mapStore.activeMap)
  componentAboveMapStore.addListenerForUpdatePositions(vcsApp)
}

async function updateMapStyle() {
  switch (viewStore.currentView) {
    case viewList.home:
      updateHomeViewStyle()
      break
    case viewList.line:
      updateLineViewStyle()
      break
    case viewList.traveltimes:
      updateTravelTimesViewStyle()
      break
    case viewList.station:
      await updateStationViewStyle()
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
  await updateTraveltimeArrow()
})

viewStore.$subscribe(async () => {
  await updateMapStyle()
})

travelTimesViewStore.$subscribe(async () => {
  updateTravelTimesViewStyle()
})

lineViewStore.$subscribe(async () => {
  if (lineViewStore.selectedLine !== SelectedTrambusLine.NONE) {
    await fixGeometryOfPoi()
    await filterFeatureByParkingAndLine(lineViewStore.selectedLine)
    await filterFeatureByPoiAndLine(lineViewStore.selectedLine)
    await updateLineViewStyle()
  } else {
    await removeAllFilters()
  }
})

stationsStore.$subscribe(async () => {
  await updateMapStyle()
  await componentAboveMapStore.updateListLabelsStations(vcsApp)
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

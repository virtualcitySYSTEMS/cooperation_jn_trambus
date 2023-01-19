<script setup lang="ts">
import { onMounted, onUnmounted, provide } from 'vue'
import {
  CesiumMap,
  Context,
  FeatureLayer,
  GeoJSONLayer,
  Layer,
  VcsApp,
  EventType,
  Viewpoint,
} from '@vcmap/core'
import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'

import { parkingStyle, poiStyle } from '@/styles/common'
import { useLayersStore, RENNES_LAYERS, RENNES_LAYER } from '@/stores/layers'
import { useMapStore } from '@/stores/map'
import {
  useLineViewsStore,
  useTravelTimesViewStore,
  useStationViewsStore,
  useViewsStore,
} from '@/stores/views'
import { useStationInteractionStore } from '@/stores/interactionMap'

import mapConfig from '../../map.config.json'
import type { StyleFunction } from 'ol/style/Style'
import type { LineNumber } from '@/model/lines.model'
import {
  trambusLineTravelTimesViewStyleFunction,
  trambusStopLineViewStyleFunction,
  trambusStopTravelTimesViewStyleFunction,
} from '@/styles/trambusStop'
import { isStationOnLine, isTrambusStopBelongsToLine } from '@/services/station'
import { stationsFixtures } from '@/model/stations.fixtures'
import { Point } from 'ol/geom'
import { transform } from 'ol/proj'
import type { Feature } from 'ol'
import type { Style } from 'ol/style'
import { trambusLineViewStyleFunction } from '@/styles/line'
import { SelectedTrambusLine } from '@/model/selected-line.model'
import SelectStationInteraction from '@/interactions/selectStation'
import {
  getArrowScratchLayer,
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

const vcsApp = new VcsApp()
provide('vcsApp', vcsApp)

const layerStore = useLayersStore()
const mapStore = useMapStore()
const lineViewStore = useLineViewsStore()
const stationViewStore = useStationViewsStore()
const travelTimesViewStore = useTravelTimesViewStore()
const viewStore = useViewsStore()
const stationInteractionStore = useStationInteractionStore()

onMounted(async () => {
  const context = new Context(mapConfig)
  await vcsApp.addContext(context)
  const cesiumMap = vcsApp.maps.getByKey('cesium')
  await cesiumMap?.initialize()
  if (cesiumMap && cesiumMap instanceof CesiumMap) {
    cesiumMap.getScene().globe.maximumScreenSpaceError = 1
  }
  // window.vcmap = vcsApp
  await updateLayersVisibility()
  updateMapStyle()

  vcsApp.maps.eventHandler.featureInteraction.setActive(EventType.CLICKMOVE)
  vcsApp.maps.eventHandler.addPersistentInteraction(
    new SelectStationInteraction(vcsApp, 'trambusStops')
  )
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

function removeAllFilters() {
  removeFilterOnLayers('parking')
  removeFilterOnLayers('poi')
  fixGeometryOfPoi()
}

function filterFeatureByParkingAndLine(line: SelectedTrambusLine) {
  filterFeatureByLayerAndKeyAndValue('parking', 'li_code', `T${line.valueOf()}`)
}

function filterFeatureByPoiAndLine(line: number) {
  let layer: GeoJSONLayer = vcsApp.layers.getByKey('poi') as GeoJSONLayer
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

function fixGeometryOfPoi() {
  let layer: GeoJSONLayer = vcsApp.layers.getByKey('poi') as GeoJSONLayer
  layer.getFeatures().forEach((f) => {
    let coordinates = [f.getProperties()['site_x'], f.getProperties()['site_y']]
    f.setGeometry(new Point(transform(coordinates, 'EPSG:4326', 'EPSG:3857')))
  })
}

function filterFeatureByLayerAndKeyAndValue(
  layerName: string,
  featureKey: string,
  featureValue: string
) {
  let layer: GeoJSONLayer = vcsApp.layers.getByKey(layerName) as GeoJSONLayer
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
    layer.deactivate()
  }
}

async function updateLayersVisibility() {
  RENNES_LAYERS.forEach(async (layer) => {
    await setLayerVisible(layer, layerStore.visibilities[layer])
  })
}

async function updateViewPoint() {
  const activeMap = vcsApp.maps.activeMap
  if (viewStore.currentView == viewList.station) {
    const stationName = stationViewStore.nameSelectedStation
    let layer: GeoJSONLayer = vcsApp.layers.getByKey(
      RENNES_LAYER.trambusStops
    ) as GeoJSONLayer
    let viewpoint: Viewpoint | null = null
    await layer.fetchData()
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

async function updateTraveltimeArrow() {
  // Arrow style for travel time
  const scratchTraveltimeArrowLayerName = '_traveltimeArrowLayer'
  const arrowLayer = getArrowScratchLayer(
    vcsApp,
    scratchTraveltimeArrowLayerName
  )

  if (
    viewStore.currentView === viewList.traveltimes &&
    travelTimesViewStore.selectedTravelTime
  ) {
    const lineStrings = lineStringsFromTraveltimes(
      [travelTimesViewStore.selectedTravelTime],
      vcsApp
    )
    updateArrowFeatures(lineStrings, arrowLayer)
    updateArrowLayerStyle(arrowLayer, mapStore.is3D())

    arrowLayer.activate()
  } else if (viewStore.currentView === viewList.line) {
    if (lineViewStore.selectedTravelTime) {
      const lineStrings = lineStringsFromTraveltimes(
        [lineViewStore.selectedTravelTime],
        vcsApp
      )
      updateArrowFeatures(lineStrings, arrowLayer)
      updateArrowLayerStyle(arrowLayer, mapStore.is3D())

      arrowLayer.activate()
    } else {
      const travelTimes = await apiClientService.fetchTravelTimeByLine(
        lineViewStore.selectedLine
      )
      const lineStrings = lineStringsFromTraveltimes(travelTimes, vcsApp)
      updateArrowFeatures(lineStrings, arrowLayer)
      updateArrowLayerStyle(arrowLayer, mapStore.is3D())

      arrowLayer.activate()
    }
  } else {
    arrowLayer.removeAllFeatures()
    arrowLayer.deactivate()
  }
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
      travelTimesViewStore.selectedTravelTime!,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYER.trambusStops, (feature) =>
    trambusStopTravelTimesViewStyleFunction(
      feature,
      travelTimesViewStore.selectedTravelTime!,
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
}

function updateHomeViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYER.trambusLines, undefined)
  clearLayerAndApplyStyle(RENNES_LAYER.parking, parkingStyle)
}

async function updateActiveMap() {
  await vcsApp.maps.setActiveMap(mapStore.activeMap)
}

function updateMapStyle() {
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
      updateStationViewStyle()
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
  if (viewStore.currentView === viewList.traveltimes) {
    updateTraveltimeArrow()
  }
})

viewStore.$subscribe(async () => {
  updateMapStyle()
})

travelTimesViewStore.$subscribe(async () => {
  updateTravelTimesViewStyle()
})

lineViewStore.$subscribe(() => {
  if (lineViewStore.selectedLine !== SelectedTrambusLine.NONE) {
    fixGeometryOfPoi()
    filterFeatureByParkingAndLine(lineViewStore.selectedLine)
    filterFeatureByPoiAndLine(lineViewStore.selectedLine)
    updateLineViewStyle()
  } else {
    removeAllFilters()
  }
})

stationInteractionStore.$subscribe(async () => {
  updateMapStyle()
})
</script>

<template>
  <UiMap></UiMap>
  <NavigationButtons />
</template>

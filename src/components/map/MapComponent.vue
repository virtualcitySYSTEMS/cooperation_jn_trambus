<script setup lang="ts">
import { onMounted, onUnmounted, provide } from 'vue'
import {
  CesiumMap,
  Context,
  VcsApp,
  Layer,
  FeatureLayer,
  GeoJSONLayer,
} from '@vcmap/core'
import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'
import { parkingStyle, poiStyle } from '@/styles/common'
import { useLayersStore, RENNES_LAYERS } from '@/stores/layers'
import { useMapStore } from '@/stores/map'
import { useLineViewsStore, useTravelTimesViewStore } from '@/stores/views'
import mapConfig from '../../map.config.json'
import type { StyleFunction } from 'ol/style/Style'
import type { LineNumber } from '@/model/lines.model'
import { useViewsStore } from '@/stores/views'
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

const vcsApp = new VcsApp()
provide('vcsApp', vcsApp)

const layerStore = useLayersStore()
const mapStore = useMapStore()
const lineViewStore = useLineViewsStore()
const travelTimesViewStore = useTravelTimesViewStore()
const viewStore = useViewsStore()

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

function filterFeatureByParkingAndLine(line: number) {
  filterFeatureByLayerAndKeyAndValue('parking', 'li_code', `T${line}`)
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
  const selectedViewPoint = vcsApp.viewpoints.getByKey(mapStore.viewPoint)

  if (selectedViewPoint) {
    await activeMap.gotoViewpoint(selectedViewPoint)
  } else {
    // go to home
    const homeViewPoint = vcsApp.viewpoints.getByKey('rennes')
    await activeMap.gotoViewpoint(homeViewPoint!)
  }
}

function clearLayerAndApplyStyle(
  layerName: string,
  style: Style | StyleFunction | undefined
) {
  const layer = vcsApp.layers.getByKey(layerName) as FeatureLayer
  layer.clearStyle()
  if (style) layer.setStyle(style)
}

async function updateLineViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYERS[5], (feature) =>
    trambusLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYERS[6], (feature) =>
    trambusStopLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      isTrambusStopBelongsToLine(feature, lineViewStore.selectedLine),
      mapStore.is3D(),
      lineViewStore.selectedStation
    )
  )
  clearLayerAndApplyStyle('poi', poiStyle)
  clearLayerAndApplyStyle('parking', parkingStyle)
}

async function updateTravelTimesViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYERS[5], (feature) =>
    trambusLineTravelTimesViewStyleFunction(
      feature,
      travelTimesViewStore.selectedTravelTime!,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(RENNES_LAYERS[6], (feature) =>
    trambusStopTravelTimesViewStyleFunction(
      feature,
      travelTimesViewStore.selectedTravelTime!,
      mapStore.is3D()
    )
  )
}

function updateHomeViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYERS[5], undefined)
  clearLayerAndApplyStyle('parking', parkingStyle)
}

async function updateActiveMap() {
  await vcsApp.maps.setActiveMap(mapStore.activeMap)
}

function updateMapStyle() {
  if (viewStore.currentView == 'home') updateHomeViewStyle()
  if (viewStore.currentView == 'line') updateLineViewStyle()
  if (viewStore.currentView == 'traveltimes') updateTravelTimesViewStyle()
}

layerStore.$subscribe(async () => {
  await updateLayersVisibility()
})

mapStore.$subscribe(async () => {
  // Update map
  await updateActiveMap()
  await updateLayersVisibility()
  await updateViewPoint()
})

viewStore.$subscribe(async () => {
  updateMapStyle()
})

travelTimesViewStore.$subscribe(async () => {
  updateTravelTimesViewStyle()
})

lineViewStore.$subscribe(async () => {
  updateLineViewStyle()
  if (lineViewStore.selectedLine !== 0) {
    fixGeometryOfPoi()
    filterFeatureByParkingAndLine(lineViewStore.selectedLine)
    filterFeatureByPoiAndLine(lineViewStore.selectedLine)
  } else {
    removeAllFilters()
  }
})
</script>

<template>
  <UiMap></UiMap>
  <NavigationButtons />
</template>

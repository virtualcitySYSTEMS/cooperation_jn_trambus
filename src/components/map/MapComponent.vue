<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { CesiumMap, Context, VcsApp, Layer, FeatureLayer } from '@vcmap/core'

import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'

import { getTrambusLineNumber, lineColors } from '@/styles/common'

import { useLayersStore, RENNES_LAYERS } from '@/stores/layers'
import { useMapStore } from '@/stores/map'
import { useLineViewsStore, useTravelTimesViewStore } from '@/stores/views'

import mapConfig from '../../map.config.json'
import type { StyleFunction } from 'ol/style/Style'
import type { FeatureLike } from 'ol/Feature'
import Style from 'ol/style/Style'
import { Circle, Fill, Stroke } from 'ol/style'
import type { LineNumber } from '@/model/lines.model'
import { useViewsStore } from '@/stores/views'
import {
  getAllStartEndStations,
  isStartEndStation,
} from '@/model/lines.fixtures'
import { trambusLineStyle, type LineState } from '@/styles/line'
import { trambusStopStyle } from '@/styles/trambusStop'

const vcsApp = new VcsApp()
provide('vcsApp', vcsApp)

const appLoaded = ref(false)
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
  appLoaded.value = true
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
    activeMap.gotoViewpoint(selectedViewPoint)
  } else {
    // go to home
    const homeViewPoint = vcsApp.viewpoints.getByKey('rennes')
    activeMap.gotoViewpoint(homeViewPoint!)
  }
}
const trambusLineViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  const lineNumber = getTrambusLineNumber(feature) as LineNumber
  const selectedLine = lineViewStore.selectedLine
  let lineState: LineState = 'normal'

  if (lineViewStore.selectedLine == null) {
    lineState = 'normal'
  } else if (getTrambusLineNumber(feature) == selectedLine) {
    lineState = 'selected'
  } else {
    lineState = 'hidden'
  }

  return trambusLineStyle(lineNumber, lineState, mapStore.is3D())
}

function isTrambusStopBelongsToLine(
  trambusStopFeature: FeatureLike,
  trambusLine: number
): boolean {
  const lineNumbers: string = trambusStopFeature.get('li_code') // e.g. T1 T2, T1
  return lineNumbers.includes(trambusLine.toString())
}

const trambusStopLineViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  const selectedTrambusLine = Number(lineViewStore.selectedLine) as LineNumber
  if (isTrambusStopBelongsToLine(feature, selectedTrambusLine)) {
    const fill = new Fill({
      color: '#FFFFFF',
    })
    const stroke = new Stroke({
      color: lineColors[selectedTrambusLine],
      width: 3,
    })
    const selectedTrambusStopStyle = new Style({
      image: new Circle({
        fill: fill,
        stroke: stroke,
        radius: 5,
      }),
      fill: fill,
      stroke: stroke,
    })
    return [selectedTrambusStopStyle]
  }
  return []
}

const trambusLineTravelTimesViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  const lineNumber = getTrambusLineNumber(feature) as LineNumber
  const selectedTravelTime = travelTimesViewStore.selectedTravelTime
  let lineState: LineState = 'normal'

  if (selectedTravelTime == null) {
    lineState = 'normal'
  } else if (getTrambusLineNumber(feature) == selectedTravelTime.line) {
    lineState = 'selected'
  } else {
    lineState = 'unselected'
  }
  return trambusLineStyle(lineNumber, lineState, mapStore.is3D())
}

const trambusStopTravelTimesViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  const lineNumber = getTrambusLineNumber(feature) as LineNumber

  // no travel time selected, only show the start and end stations
  let shownStations = getAllStartEndStations()
  // There is a travel time selected, show only the selected station from
  // the selected travel time
  if (travelTimesViewStore.selectedTravelTime != null) {
    shownStations = [
      travelTimesViewStore.selectedTravelTime.start,
      travelTimesViewStore.selectedTravelTime.end,
    ]
  }
  const stationName = feature.get('nom')
  const isHidden = shownStations.indexOf(stationName) == -1

  return trambusStopStyle(lineNumber, isStartEndStation(stationName), isHidden)
}

// TODO: probably merge these two functions. i.e. updateTrambusStyle(currentView: home | line)
async function updateLineViewStyle() {
  const trambusLayer = vcsApp.layers.getByKey(RENNES_LAYERS[5]) as FeatureLayer
  trambusLayer.clearStyle()
  trambusLayer.setStyle(trambusLineViewStyleFunction)

  const trambusStopLayer = vcsApp.layers.getByKey(
    RENNES_LAYERS[6]
  ) as FeatureLayer
  trambusStopLayer.clearStyle()

  trambusStopLayer.setStyle(trambusStopLineViewStyleFunction)
}

async function updateTravelTimesViewStyle() {
  // No selection
  const trambusLayer = vcsApp.layers.getByKey(RENNES_LAYERS[5]) as FeatureLayer
  trambusLayer.clearStyle()
  trambusLayer.setStyle(trambusLineTravelTimesViewStyleFunction)

  const trambusStopLayer = vcsApp.layers.getByKey(
    RENNES_LAYERS[6]
  ) as FeatureLayer
  trambusStopLayer.clearStyle()
  trambusStopLayer.setStyle(trambusStopTravelTimesViewStyleFunction)
}

function updateHomeViewStyle() {
  const trambusLayer = vcsApp.layers.getByKey(RENNES_LAYERS[5]) as FeatureLayer
  // const defaultTrambusLineStyle = vcsApp.styles.getByKey(
  //   'trambusLineStyle'
  // ) as StyleItem
  trambusLayer.clearStyle()
  // TODO: it throws an error, but it works without this one
  // trambusLayer.setStyle(defaultTrambusLineStyle, true)
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
</script>

<template>
  <UiMap v-if="appLoaded"></UiMap>
  <NavigationButtons />
</template>

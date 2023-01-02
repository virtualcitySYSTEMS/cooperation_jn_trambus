<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { CesiumMap, Context, VcsApp, Layer, FeatureLayer } from '@vcmap/core'

import * as ol_color from 'ol/color'

import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'

import { useLayersStore, RENNES_LAYERS } from '@/stores/layers'
import { useMapStore } from '@/stores/map'
import { useLineViewsStore } from '@/stores/lineviews'

import mapConfig from '../../map.config.json'
import type { StyleFunction } from 'ol/style/Style'
import type { FeatureLike } from 'ol/Feature'
import Style from 'ol/style/Style'
import { Circle, Fill, Stroke } from 'ol/style'
import type { LineNumber } from '@/model/lines.model'
import { useViewsStore } from '@/stores/views'

const vcsApp = new VcsApp()
provide('vcsApp', vcsApp)

const appLoaded = ref(false)
const layerStore = useLayersStore()
const mapStore = useMapStore()
const lineStore = useLineViewsStore()
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
  } else if (layer?.active) {
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

// TODO: some of the following code are copy paste from PlanningMapComponent, refactor it to utils module
function getLineNumber(feature: FeatureLike): number {
  let lineNumberString = feature.get('li_code') // e.g. T1
  return Number(lineNumberString.substr(lineNumberString.length - 1))
}

const lineColors: Record<LineNumber, ol_color.Color> = {
  1: ol_color.fromString('#4338CA'), // indigo-600
  2: ol_color.fromString('#DB2777'), // pink-600
  3: ol_color.fromString('#057857'), // emerald-600
  4: ol_color.fromString('#9333EA'), // purple-600
}

const trambusLineViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  if (getLineNumber(feature) == lineStore.selectedLine) {
    const selectedLineStyle = new Style({
      stroke: new Stroke({
        color: lineColors[getLineNumber(feature) as LineNumber],
        width: 4,
      }),
      zIndex: 0,
    })
    return [selectedLineStyle]
  } else {
    return []
  }
}

function isTrambusStopBelongsToLine(feature: FeatureLike, trambusLine: number) {
  let lineNumbers: string = feature.get('li_code') // e.g. T1 T2, T1
  if (lineNumbers.includes(trambusLine.toString())) {
    return true
  } else {
    return false
  }
}

const trambusStopLineViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  const selectedTrambusLine = Number(lineStore.selectedLine) as LineNumber
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

layerStore.$subscribe(async () => {
  await updateLayersVisibility()
})

mapStore.$subscribe(async () => {
  // Update map
  await updateLayersVisibility()
  await updateViewPoint()
  await updateActiveMap()
})

viewStore.$subscribe(async () => {
  if (viewStore.currentView == 'home') updateHomeViewStyle()
  if (viewStore.currentView == 'line') updateLineViewStyle()
})
</script>

<template>
  <UiMap v-if="appLoaded"></UiMap>
  <NavigationButtons />
</template>

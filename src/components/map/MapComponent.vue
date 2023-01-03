<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { CesiumMap, Context, VcsApp, Layer, FeatureLayer } from '@vcmap/core'

import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'

import {
  getTrambusLineNumber,
  lineColors,
  lineDimmedColors,
} from '@/styles/common'

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
import { getAllStartEndStations } from '@/model/lines.fixtures'

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
  if (getTrambusLineNumber(feature) == lineViewStore.selectedLine) {
    const selectedLineStyle = new Style({
      stroke: new Stroke({
        color: lineColors[getTrambusLineNumber(feature) as LineNumber],
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
  if (!mapStore.is3D()) {
    const lineStyle = new Style({
      stroke: new Stroke({
        color: lineColors[getTrambusLineNumber(feature) as LineNumber],
        width: 3,
      }),
      zIndex: 0,
    })
    return [lineStyle]
  } else {
    const lineStyle = new Style({
      stroke: new Stroke({
        color: lineColors[getTrambusLineNumber(feature) as LineNumber],
        width: 3,
      }),
      zIndex: 1,
    })
    const lineBorderStyle = new Style({
      stroke: new Stroke({
        color: '#FFFFFF',
        width: 5,
      }),
      zIndex: 0,
    })
    return [lineBorderStyle, lineStyle]
  }
}

const trambusLineTravelTimesViewSelectedStyleFunction: StyleFunction =
  function (feature: FeatureLike): Style[] {
    if (!mapStore.is3D()) {
      let lineColor = lineColors[getTrambusLineNumber(feature) as LineNumber]
      let zIndex = 1
      if (
        (getTrambusLineNumber(feature) as LineNumber) !=
        travelTimesViewStore.selectedTravelTime?.line
      ) {
        lineColor =
          lineDimmedColors[getTrambusLineNumber(feature) as LineNumber]
        zIndex = 0
      }
      const lineStyle = new Style({
        stroke: new Stroke({
          color: lineColor,
          width: 3,
        }),
        zIndex: zIndex,
      })
      return [lineStyle]
    } else {
      const lineStyle = new Style({
        stroke: new Stroke({
          color: lineColors[getTrambusLineNumber(feature) as LineNumber],
          width: 3,
        }),
        zIndex: 1,
      })
      const lineBorderStyle = new Style({
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 5,
        }),
        zIndex: 0,
      })
      return [lineBorderStyle, lineStyle]
    }
  }

const trambusStopTravelTimesViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  // no travel time selected, only show the start and end stations
  let shownStations = getAllStartEndStations()
  let lineColor = lineColors[getTrambusLineNumber(feature) as LineNumber]

  // There is a travel time selected, show only the selected station from
  // the selected travel time
  if (travelTimesViewStore.selectedTravelTime != null) {
    shownStations = [
      travelTimesViewStore.selectedTravelTime.start,
      travelTimesViewStore.selectedTravelTime.end,
    ]
    lineColor = lineColors[travelTimesViewStore.selectedTravelTime.line]
  }
  const stationName = feature.get('nom')

  if (!mapStore.is3D()) {
    if (shownStations.indexOf(stationName) > -1) {
      const fill = new Fill({
        color: '#FFFFFF',
      })
      const stroke = new Stroke({
        color: lineColor,
        width: 2,
      })
      const ShownTrambusStopStyle = new Style({
        image: new Circle({
          fill: fill,
          stroke: stroke,
          radius: 6,
        }),
        fill: fill,
        stroke: stroke,
      })
      return [ShownTrambusStopStyle]
    } else {
      return []
    }
  } else {
    // TODO: Change it with disk style
    if (shownStations.indexOf(stationName) > -1) {
      const fill = new Fill({
        color: lineColor,
      })
      const stroke = new Stroke({
        color: '#FFFFFF',
        width: 2,
      })
      const ShownTrambusStopStyle = new Style({
        image: new Circle({
          fill: fill,
          stroke: stroke,
          radius: 6,
        }),
        fill: fill,
        stroke: stroke,
      })
      return [ShownTrambusStopStyle]
    } else {
      return []
    }
  }
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
  const trambusStopLayer = vcsApp.layers.getByKey(
    RENNES_LAYERS[6]
  ) as FeatureLayer
  trambusLayer.clearStyle()
  trambusStopLayer.clearStyle()

  if (travelTimesViewStore.selectedTravelTime == null) {
    // TrambusLine style
    trambusLayer.setStyle(trambusLineTravelTimesViewStyleFunction)

    // Trambus Stop (only start and end)
    trambusStopLayer.setStyle(trambusStopTravelTimesViewStyleFunction)
  } else {
    // set selected line style
    trambusLayer.setStyle(trambusLineTravelTimesViewSelectedStyleFunction)
    // set selected station style
    trambusStopLayer.setStyle(trambusStopTravelTimesViewStyleFunction)
  }
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

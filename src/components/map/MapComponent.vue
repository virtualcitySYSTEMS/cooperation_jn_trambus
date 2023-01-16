<script setup lang="ts">
import { onMounted, onUnmounted, provide } from 'vue'
import {
  CesiumMap,
  Context,
  VcsApp,
  Layer,
  FeatureLayer,
  GeoJSONLayer,
  EventType,
  VectorLayer,
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
} from '@/stores/views'
import { useStationInteractionStore } from '@/stores/interactionMap'

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
import { Point, LineString } from 'ol/geom'
import { transform } from 'ol/proj'
import { Feature } from 'ol'
import type { Style } from 'ol/style'
import { trambusLineViewStyleFunction } from '@/styles/line'
import SelectStationInteraction from '@/interactions/selectStation'
import { getTrambusStopArrowScratchLayer } from '@/styles/traveltimes'
import {
  getViewpointFromFeature,
  cloneViewPointAndResetCameraPosition,
} from '@/helpers/viewpointHelper'
import { viewList } from '@/model/views.model'
import { getTrambusStopByName } from '@/helpers/layerHelper'

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
  window.vcmap = vcsApp
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
  if (viewStore.currentView == viewList.station) {
    const stationName = stationViewStore.nameSelectedStation
    let layer: GeoJSONLayer = vcsApp.layers.getByKey(
      RENNES_LAYERS[6]
    ) as GeoJSONLayer
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
  if (style) layer.setStyle(style)
}

function updateTraveltimeArrow() {
  // Arrow style for travel time
  const scratchTraveltimeArcLayerName = '_traveltimeArcLayer'
  const arcLayer = getTrambusStopArrowScratchLayer(
    vcsApp,
    scratchTraveltimeArcLayerName
  )
  const trambusStopLayer = vcsApp.layers.getByKey(
    RENNES_LAYER.trambusStops
  ) as VectorLayer

  if (travelTimesViewStore.selectedTravelTime) {
    arcLayer.removeAllFeatures()
    // Get location of the trambus stop of the travel time
    const startTrambusStop = getTrambusStopByName(
      travelTimesViewStore.selectedTravelTime.start,
      trambusStopLayer
    )
    const endTrambusStop = getTrambusStopByName(
      travelTimesViewStore.selectedTravelTime.end,
      trambusStopLayer
    )
    const lineString = new LineString([
      startTrambusStop?.getGeometry()?.getCoordinates(),
      endTrambusStop?.getGeometry()?.getCoordinates(),
    ])
    const arcFeature = new Feature(lineString)
    arcLayer.addFeatures([arcFeature])
    arcLayer.activate()
  } else {
    arcLayer.removeAllFeatures()
    arcLayer.deactivate()
  }
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
      mapStore.is3D()
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
  updateTraveltimeArrow()
}

async function updateStationViewStyle() {
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
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle('poi', poiStyle)
  clearLayerAndApplyStyle('parking', parkingStyle)
}

function updateHomeViewStyle() {
  clearLayerAndApplyStyle(RENNES_LAYERS[5], undefined)
  clearLayerAndApplyStyle('parking', parkingStyle)
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

stationInteractionStore.$subscribe(async () => {
  updateMapStyle()
})
</script>

<template>
  <UiMap></UiMap>
  <NavigationButtons />
</template>

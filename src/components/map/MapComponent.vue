<script setup lang="ts">
import { onMounted, onUnmounted, inject } from 'vue'
import { Layer, Viewpoint, vectorStyleSymbol, StyleItem } from '@vcmap/core'
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
import { usePoiStore } from '@/stores/poi'
import {
  filterFeatureByParkingAndLine,
  filterFeatureByPoiAndStation,
  filterFeatureByPoiAndLine,
  removeFiltersOnPoiAndParking,
} from '@/services/filter'

import { fixGeometryOfPoi } from '@/services/poi'

const rennesApp = inject('rennesApp') as RennesApp

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
  await rennesApp.initializeMap()
  await updateLayersVisibility()
  updateMapStyle()
})

// The following code is needed to cleanup resources we created
// (in this case, the rennesApp) once a component gets destroyed (unmounted).
// Otherwise, we will keep on rendering the rennesApp in its container after a hot reload.
onUnmounted(() => {
  rennesApp.destroy()
})

async function resetStyleOfPoi(view: View) {
  let layer = await rennesApp.getLayerByKey(RENNES_LAYER.poi)
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
      setDistanceDisplayConditionFeature(styleItem, rennesApp.get2DMap())
    }

    //@ts-expect-error
    f[vectorStyleSymbol] = styleItem
    f.setStyle(styleItem.style)
  })
}

async function setLayerVisible(layerName: string, visible: boolean) {
  const layer: Layer = rennesApp.maps.layerCollection.getByKey(layerName)
  if (visible) {
    await layer?.activate()
  } else {
    layer?.deactivate()
  }
}

async function updateLayersVisibility() {
  for (const layer of RENNES_LAYERNAMES) {
    await setLayerVisible(layer, layerStore.visibilities[layer])
  }
}

async function updateViewPoint() {
  const activeMap = rennesApp.maps.activeMap
  if (viewStore.currentView == viewList.station) {
    const stationName = stationsStore.currentStationView
    let layer = await rennesApp.getLayerByKey(RENNES_LAYER.trambusStops)
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
    const selectedViewPoint = rennesApp.viewpoints.getByKey(mapStore.viewPoint)

    if (selectedViewPoint) {
      await activeMap.gotoViewpoint(selectedViewPoint)
    } else {
      // go to home
      const homeViewPoint = rennesApp.viewpoints.getByKey('rennes')
      await activeMap.gotoViewpoint(homeViewPoint!)
    }
  }
}

async function updateActiveMap() {
  await rennesApp.maps.setActiveMap(mapStore.activeMap)
  componentAboveMapStore.addListenerForUpdatePositions(rennesApp)
}

async function updateMapStyle() {
  switch (viewStore.currentView) {
    case viewList.home:
      updateHomeViewStyle(rennesApp)
      break
    case viewList.line:
      updateLineViewStyle(rennesApp)
      break
    case viewList.traveltimes:
      updateTravelTimesViewStyle(rennesApp)
      break
    case viewList.station:
      await updateStationViewStyle(rennesApp)
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
  await updateTraveltimeArrow(rennesApp)
})

viewStore.$subscribe(async () => {
  await updateMapStyle()
})

travelTimesViewStore.$subscribe(async () => {
  await updateTravelTimesViewStyle(rennesApp)
})

stationsStore.$subscribe(async () => {
  await updateMapStyle()
  await componentAboveMapStore.updateListLabelsStations(rennesApp)
})

poiStore.$subscribe(async () => {
  if (
    poiStore.currentDisplay === viewList.station &&
    stationsStore.currentStationView
  ) {
    await fixGeometryOfPoi(rennesApp)
    await filterFeatureByParkingAndLine(rennesApp, lineViewStore.selectedLine)
    await filterFeatureByPoiAndStation(
      rennesApp,
      stationsStore.currentStationView
    )
    await resetStyleOfPoi(viewList.station)
  } else if (
    poiStore.currentDisplay === viewList.line &&
    lineViewStore.selectedLine
  ) {
    await removeFiltersOnPoiAndParking(rennesApp)
    await fixGeometryOfPoi(rennesApp)
    await filterFeatureByParkingAndLine(rennesApp, lineViewStore.selectedLine)
    await filterFeatureByPoiAndLine(rennesApp, lineViewStore.selectedLine)
    await resetStyleOfPoi(viewList.line)
  } else {
    await removeFiltersOnPoiAndParking(rennesApp)
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

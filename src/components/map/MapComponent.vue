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
import { useMap3dStore, useMapViewPointStore } from '@/stores/map'
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
  tiltViewpoint,
  untiltViewpoint,
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
import { usePoiParkingStore } from '@/stores/poiParking'
import {
  filterFeatureByParkingAndLine,
  filterFeatureByPoiAndStation,
  filterFeatureByPoiAndLine,
  removeFiltersOnPoiAndParking,
} from '@/services/filter'

import { fixGeometryOfPoi } from '@/services/poi'

const rennesApp = inject('rennesApp') as RennesApp

const layerStore = useLayersStore()
const poiStore = usePoiParkingStore()
const map3dStore = useMap3dStore()
const mapViewPointStore = useMapViewPointStore()
const lineViewStore = useLineViewsStore()
const stationsStore = useStationsStore()
const travelTimesViewStore = useTravelTimesViewStore()
const viewStore = useViewsStore()
const componentAboveMapStore = useComponentAboveMapStore()
const traveltimeInteractionStore = useTraveltimeInteractionStore()

onMounted(async () => {
  await rennesApp.initializeMap()
  await updateLayersVisibility()
  await updateMapStyle()
  componentAboveMapStore.addListenerForUpdatePositions(rennesApp)
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
        map3dStore.is3D(),
        true
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

async function updateViewPoint(viewPoint: string) {
  const activeMap = rennesApp.maps.activeMap
  if (viewPoint === viewList.station) {
    let featureStation = await rennesApp.getFeatureByAttributeFromLayer(
      RENNES_LAYER.trambusStops,
      'nom',
      stationsStore.currentStationView!
    )
    let viewpoint: Viewpoint | null = getViewpointFromFeature(featureStation)
    if (viewpoint !== null) {
      const newVp = cloneViewPointAndResetCameraPosition(viewpoint, null)
      await activeMap.gotoViewpoint(newVp)
    }
  } else {
    let selectedViewPoint = rennesApp.viewpoints.getByKey(viewPoint)

    if (selectedViewPoint) {
      if (map3dStore.is3D()) {
        selectedViewPoint = tiltViewpoint(selectedViewPoint!)
      }
      await activeMap.gotoViewpoint(selectedViewPoint)
    } else {
      // go to home
      let homeViewPoint = rennesApp.viewpoints.getByKey('rennes')
      if (map3dStore.is3D()) {
        homeViewPoint = tiltViewpoint(homeViewPoint!)
      }
      await activeMap.gotoViewpoint(homeViewPoint!)
    }
  }
}

async function updateActiveMap() {
  // Notes(IS): Currently there is no way to set custom tilt when switch active map
  // Get current tilt
  const oldViewpoint = await rennesApp.maps.activeMap.getViewpoint()

  await rennesApp.maps.setActiveMap(map3dStore.activeMap)

  let newViewpoint
  if (map3dStore.is3D()) {
    newViewpoint = tiltViewpoint(oldViewpoint!)
  } else {
    newViewpoint = untiltViewpoint(oldViewpoint!)
  }
  rennesApp.maps.activeMap.gotoViewpoint(newViewpoint)
}

async function updateMapStyle() {
  switch (viewStore.currentView) {
    case viewList.home:
      updateHomeViewStyle(rennesApp)
      break
    case viewList.line:
      await updateLineViewStyle(rennesApp)
      break
    case viewList.traveltimes:
      await updateTravelTimesViewStyle(rennesApp)
      break
    case viewList.station:
      await updateStationViewStyle(rennesApp)
      break
  }
}

layerStore.$subscribe(async () => {
  await updateLayersVisibility()
})

map3dStore.$subscribe(async () => {
  await updateActiveMap()
  await updateTraveltimeArrow(rennesApp)
  componentAboveMapStore.addListenerForUpdatePositions(rennesApp)
})

mapViewPointStore.$subscribe(async () => {
  await updateViewPoint(mapViewPointStore.viewPoint)
})

viewStore.$subscribe(async () => {
  await updateMapStyle()
})

travelTimesViewStore.$subscribe(async () => {
  await updateTravelTimesViewStyle(rennesApp)
})

stationsStore.$subscribe(async () => {
  await updateTraveltimeArrow(rennesApp)
  await componentAboveMapStore.updateListLabelsStations(rennesApp)
})

async function filterFeaturesOnLine() {
  await filterFeatureByParkingAndLine(rennesApp, lineViewStore.selectedLine)
}

poiStore.$subscribe(async () => {
  await removeFiltersOnPoiAndParking(rennesApp)
  await fixGeometryOfPoi(rennesApp)
  if (
    poiStore.currentProfile === viewList.station &&
    stationsStore.currentStationView
  ) {
    await filterFeaturesOnLine()
    await filterFeatureByPoiAndStation(
      rennesApp,
      stationsStore.currentStationView
    )
  } else if (
    poiStore.currentProfile === viewList.line &&
    lineViewStore.selectedLine
  ) {
    await filterFeaturesOnLine()
    await filterFeatureByPoiAndLine(rennesApp, lineViewStore.selectedLine)
  }
  await resetStyleOfPoi(poiStore.currentProfile!)
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

<script setup lang="ts">
import { onMounted, onUnmounted, inject } from 'vue'
import {
  Layer,
  Viewpoint,
  vectorStyleSymbol,
  StyleItem,
  getMidPoint,
  cartesian2DDistance,
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
import { useMap3dStore, useMapViewPointStore } from '@/stores/map'
import {
  useLineViewsStore,
  useTravelTimesViewStore,
  useViewsStore,
} from '@/stores/views'
import { useStationsStore } from '@/stores/stations'
import { useComponentAboveMapStore } from '@/stores/componentsAboveMapStore'
import {
  useTravelTimeBoxesStore,
  useTraveltimeInteractionStore,
} from '@/stores/interactionMap'

import {
  tiltViewpoint,
  untiltViewpoint,
  getViewpointFromFeatureDistance,
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
import type { TravelTimeModel } from '@/model/travel-time.model'
import { lineStringsFromTraveltimes } from '@/helpers/traveltimesHelper'
import { LineString, Point } from 'ol/geom'
import { Feature } from 'ol'
import { Cartesian2 } from '@vcmap-cesium/engine'
import type { Coordinate } from 'ol/coordinate'

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
const travelTimeBoxesStore = useTravelTimeBoxesStore()

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

function determineArcHeight(p1, p2, factor) {
  const distance = cartesian2DDistance(p1, p2)
  return distance * factor
}
function getMidPointOnArc(p1: Coordinate, p2: Coordinate, arcHeight) {
  const lineVector = new Cartesian2(p2[0] - p1[0], p2[1] - p1[1])
  let perp = Cartesian2.normalize(lineVector, new Cartesian2())
  const { x, y } = perp
  perp = new Cartesian2(y, -x)
  Cartesian2.multiplyByScalar(perp, arcHeight, perp)
  const midPoint = getMidPoint(p1, p2)
  Cartesian2.add(perp, new Cartesian2(midPoint[0], midPoint[1]), perp)
  return [perp.x, perp.y]
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
    // 2000 is the distance where the view of the station looks good
    let viewpoint: Viewpoint | null = getViewpointFromFeatureDistance(
      featureStation,
      2000
    )
    if (map3dStore.is3D()) {
      viewpoint = tiltViewpoint(viewpoint!)
    }
    await activeMap.gotoViewpoint(viewpoint!)
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

async function getCenterOfArrow(selectedTraveltime: TravelTimeModel | null) {
  let lineStrings: LineString[] = []
  console.log('travelTime', selectedTraveltime)
  lineStrings = await lineStringsFromTraveltimes(
    [selectedTraveltime!],
    rennesApp,
    map3dStore.is3D()
  )
  let feature = new Feature()
  // feature.setGeometry(new Point(lineStrings[0].getFlatMidpoint()))
  let midPoint = getMidPointOnArc(
    lineStrings[0].getFirstCoordinate(),
    lineStrings[0].getLastCoordinate(),
    determineArcHeight(
      lineStrings[0].getFirstCoordinate(),
      lineStrings[0].getLastCoordinate(),
      0.15
    )
  )
  feature.setGeometry(new Point(midPoint))
  console.log('Feature', feature)
  return feature
}
async function addTravelTimeBox(selectedTraveltime: TravelTimeModel | null) {
  let feature = await getCenterOfArrow(selectedTraveltime)
  travelTimeBoxesStore.addTravelTimeBox(rennesApp, selectedTraveltime!, feature)
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
  await addTravelTimeBox(traveltimeInteractionStore.selectedTraveltime)
})
</script>

<template>
  <UiMap></UiMap>
  <NavigationButtons />
  <ComponentsAboveMap />
</template>

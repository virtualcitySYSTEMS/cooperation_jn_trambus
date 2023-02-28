import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import { Point } from 'ol/geom'
import { transform } from 'ol/proj'
import { NearFarScalar } from '@vcmap/cesium'
import type { Feature } from 'ol'
import { generatePoiStyle, generatePoiStyleWithoutLabel } from '@/styles/common'
import { useMap3dStore } from '@/stores/map'
import { usePoiInteractionStore } from '@/stores/interactionMap'
import type { Geometry } from 'ol/geom'
import {
  filterFeatureByParkingAndLine,
  filterFeatureByPoiAndStation,
  filterFeatureByPoiAndLine,
  removeFiltersOnPoiAndParking,
} from '@/services/filter'
import { viewList } from '@/model/views.model'
import type { View } from '@/model/views.model'
import { vectorStyleSymbol, StyleItem } from '@vcmap/core'
import { setDistanceDisplayConditionFeature } from '@/services/setDistanceDisplayCondition'
import { usePoiParkingStore } from '@/stores/poiParking'
import { useStationsStore } from '@/stores/stations'
import { useLineViewsStore } from '@/stores/views'

const CHAR_MAX = 25
export function shorterName(poiName: string) {
  let shorterName = poiName.replace("'", ' ')
  if (poiName.length > CHAR_MAX) {
    shorterName = shorterName.slice(0, CHAR_MAX).concat('...')
  }
  return shorterName
}

export async function fixGeometryOfPoi(rennesApp: RennesApp) {
  const layer = await rennesApp.getLayerByKey(RENNES_LAYER.poi)

  layer.getFeatures().forEach((f) => {
    const coordinates = [
      f.getProperties()['site_x'],
      f.getProperties()['site_y'],
    ]
    f.setGeometry(new Point(transform(coordinates, 'EPSG:4326', 'EPSG:3857')))
    const echelleMax = f.get('echelle_max') / 5
    f.set(
      'olcs_scaleByDistance',
      new NearFarScalar(echelleMax - 1, 1, echelleMax, 0)
    )
  })
}

export function displayCurrentPoi(feature: Feature<Geometry>) {
  const map3dStore = useMap3dStore()
  if (feature === null) return
  const full_name = feature.getProperties()['site_nom']
  let name = full_name.slice(0, CHAR_MAX)
  if (full_name.length > CHAR_MAX) {
    name += '\n' + full_name.slice(CHAR_MAX, full_name.length)
  }

  const styleItem = generatePoiStyle(
    name,
    feature.getProperties()['distance'],
    map3dStore.is3D(),
    false
  )
  feature.setStyle(styleItem.style)
}

/**
 * Normally the name of one poi should be displayed at once
 * It happens that the name of the previous poi are still displayed when displaying the name of a new poi
 * To correct this, we call this function to hide the name of all previous poi and only display the name of the current poi
 */
export function undisplayPreviousPoiExpectCurrent() {
  const poiInteractionStore = usePoiInteractionStore()
  if (poiInteractionStore.previousFeaturesPoi.length === 0) return
  poiInteractionStore.previousFeaturesPoi.forEach((feature) => {
    const styleItem = generatePoiStyleWithoutLabel()
    feature.setStyle(styleItem.style)
  })
}

export function undisplayCurrentPoi() {
  const poiInteractionStore = usePoiInteractionStore()
  if (poiInteractionStore.currentFeaturePoi === null) return

  const styleItem = generatePoiStyleWithoutLabel()
  poiInteractionStore.currentFeaturePoi.setStyle(styleItem.style)
  poiInteractionStore.currentFeaturePoi = null
  undisplayPreviousPoiExpectCurrent()
}

async function resetStyleOfPoi(view: View, rennesApp: RennesApp) {
  const map3dStore = useMap3dStore()
  const layer = await rennesApp.getLayerByKey(RENNES_LAYER.poi)
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

async function filterFeaturesOnLine(rennesApp: RennesApp) {
  const lineViewStore = useLineViewsStore()
  await filterFeatureByParkingAndLine(rennesApp, lineViewStore.selectedLine)
}

export async function poiStoreSubcribe(rennesApp: RennesApp) {
  const poiStore = usePoiParkingStore()
  const stationsStore = useStationsStore()
  const lineViewStore = useLineViewsStore()
  await removeFiltersOnPoiAndParking(rennesApp)
  await fixGeometryOfPoi(rennesApp)
  if (
    poiStore.currentProfile === viewList.station &&
    stationsStore.currentStationView
  ) {
    await filterFeaturesOnLine(rennesApp)
    await filterFeatureByPoiAndStation(
      rennesApp,
      stationsStore.currentStationView
    )
  } else if (
    poiStore.currentProfile === viewList.line &&
    lineViewStore.selectedLine
  ) {
    await filterFeaturesOnLine(rennesApp)
    await filterFeatureByPoiAndLine(rennesApp, lineViewStore.selectedLine)
  }
  await resetStyleOfPoi(poiStore.currentProfile!, rennesApp)
}

import type { FeatureLike } from 'ol/Feature'
import Style from 'ol/style/Style'
import type { StyleFunction } from 'ol/style/Style'
import { getTrambusLineNumber, lineColors } from './common'
import { Circle, Fill, Stroke } from 'ol/style'
import type { LineNumber } from '@/model/lines.model'
import type { FeatureLayer, VcsApp } from '@vcmap/core'

import { RENNES_LAYERS } from '@/stores/layers'
import { useLineViewsStore } from '@/stores/views'

const lineStore = useLineViewsStore()

const trambusLineViewStyleFunction: StyleFunction = function (
  feature: FeatureLike
): Style[] {
  if (getTrambusLineNumber(feature) == lineStore.selectedLine) {
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
  const lineNumbers: string = feature.get('li_code') // e.g. T1 T2, T1
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

export async function updateLineViewStyle(vcsApp: VcsApp) {
  const trambusLayer = vcsApp.layers.getByKey(RENNES_LAYERS[5]) as FeatureLayer
  trambusLayer.clearStyle()
  trambusLayer.setStyle(trambusLineViewStyleFunction)

  const trambusStopLayer = vcsApp.layers.getByKey(
    RENNES_LAYERS[6]
  ) as FeatureLayer
  trambusStopLayer.clearStyle()
  trambusStopLayer.setStyle(trambusStopLineViewStyleFunction)
}

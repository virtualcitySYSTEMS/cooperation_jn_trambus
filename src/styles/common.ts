import type { LineNumber } from '@/model/lines.model'
import * as ol_color from 'ol/color'
import type { FeatureLike } from 'ol/Feature'
import { Icon, Style } from 'ol/style'

export function getTrambusLineNumber(feature: FeatureLike): number {
  const lineNumberString = feature.get('li_code') // e.g. T1
  return Number(lineNumberString.substr(lineNumberString.length - 1))
}

export const lineColors: Record<LineNumber, ol_color.Color> = {
  1: ol_color.fromString('#4338CA'), // indigo-600
  2: ol_color.fromString('#DB2777'), // pink-600
  3: ol_color.fromString('#057857'), // emerald-600
  4: ol_color.fromString('#9333EA'), // purple-600
}

// TODO: it seems the dimmed color is not so dimmed
export const lineDimmedColors: Record<LineNumber, ol_color.Color> = {
  1: ol_color.fromString('#A5B4FC'), // indigo-200
  2: ol_color.fromString('#F9A8D5'), // pink-200
  3: ol_color.fromString('#6EE7B7'), // emerald-200
  4: ol_color.fromString('#C084FC'), // purple-200
}

export const poiStyle: Style = new Style({
  image: new Icon({
    opacity: 1,
    src: '/src/assets/icons/mapPin.png',
    scale: 0.1,
  }),
})

export const parkingStyle: Style = new Style({
  image: new Icon({
    opacity: 1,
    src: '/src/assets/icons/parkingLocation.svg',
    scale: 1,
  }),
})

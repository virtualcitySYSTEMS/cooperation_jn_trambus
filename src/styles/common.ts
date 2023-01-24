// @ts-nocheck

import type { LineNumber } from '@/model/lines.model'
import * as ol_color from 'ol/color'
import type { FeatureLike } from 'ol/Feature'
import { Icon, Style } from 'ol/style'
import parkingIcon from '../assets/icons/parkingRelais.png'
import pinIcon from '../assets/icons/pin.png'
import { VectorStyleItem } from '@vcmap/core'

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
    src: pinIcon,
    scale: 1,
  }),
})

export const parkingStyle: Style = new Style({
  image: new Icon({
    opacity: 1,
    src: parkingIcon,
    scale: 1,
  }),
})

export function generatePoiStyle(
  label: string,
  distance: string,
  is3D: boolean
) {
  // @ts-ignore
  return new VectorStyleItem({
    text: {
      text: 'LABEL',
      font: is3D ? 'bold 14px DM Sans' : '14px DM Sans',
      fill: {
        color: is3D ? '#ffffff' : '#000000',
      },
      stroke: {
        color: is3D ? '#000000' : '#ffffff',
        width: 1,
      },
      offsetX: 25,
      offsetY: is3D ? -40 : -10,
      textAlign: 'left',
      justify: 'left',
    },

    label: label + '\n' + distance + 'm',
    image: {
      src: pinIcon,
      scale: 0.75,
    },
  })
}

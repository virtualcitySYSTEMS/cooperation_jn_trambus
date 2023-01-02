import type { LineNumber } from '@/model/lines.model'
import * as ol_color from 'ol/color'
import type { FeatureLike } from 'ol/Feature'

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

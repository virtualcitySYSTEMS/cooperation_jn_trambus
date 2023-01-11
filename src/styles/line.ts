import type { LineNumber } from '@/model/lines.model'
import { Stroke, Style } from 'ol/style'
import { getTrambusLineNumber, lineColors, lineDimmedColors } from './common'
import type { FeatureLike } from 'ol/Feature'

export type LineState = 'selected' | 'normal' | 'unselected' | 'hidden'

export function trambusLineStyle(
  lineNumber: LineNumber,
  lineState: LineState,
  is3DStyle: boolean
): Style[] {
  const lineStyles = []

  const basicLineStyle = new Style({
    stroke: new Stroke({
      color: lineColors[lineNumber],
      width: 4,
    }),
    zIndex: 1,
  })
  const unselectedLineStyle = new Style({
    stroke: new Stroke({
      color: lineDimmedColors[lineNumber],
      width: 4,
    }),
    zIndex: 1,
  })
  const lineBorderStyle = new Style({
    stroke: new Stroke({
      color: '#FFFFFF',
      width: 6,
    }),
    zIndex: 0,
  })

  if (lineState == 'hidden') {
    return []
  }

  if (is3DStyle) {
    lineStyles.push(lineBorderStyle)
  }

  if (lineState == 'selected') {
    const selectedLineStyle = basicLineStyle.clone()
    selectedLineStyle.setZIndex(2)
    lineStyles.push(selectedLineStyle)
  } else if (lineState == 'normal') {
    lineStyles.push(basicLineStyle)
  } else if (lineState == 'unselected') {
    lineStyles.push(unselectedLineStyle)
  }

  return lineStyles
}

export function trambusLineViewStyleFunction(
  feature: FeatureLike,
  selectedLine: number,
  is3D: boolean
): Style[] {
  const lineNumber = getTrambusLineNumber(feature) as LineNumber
  let lineState: LineState = 'normal'

  if (selectedLine == null) {
    lineState = 'normal'
  } else if (getTrambusLineNumber(feature) == selectedLine) {
    lineState = 'selected'
  } else {
    lineState = 'hidden'
  }
  return trambusLineStyle(lineNumber, lineState, is3D)
}

import type { LineNumber } from '@/model/lines.model'
import { Stroke, Style } from 'ol/style'
import { lineColors, lineDimmedColors } from './common'

export type LineState = 'selected' | 'normal' | 'unselected' | 'hidden'
export type MapType = '2D' | '3D'

export function trambusLineStyle(
  lineNumber: LineNumber,
  lineState: LineState,
  mapType: MapType
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

  if (mapType == '3D') {
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

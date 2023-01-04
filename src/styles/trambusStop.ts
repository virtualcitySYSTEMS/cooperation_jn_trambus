import type { LineNumber } from '@/model/lines.model'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { lineColors } from './common'

export function trambusStopStyle(
  lineNumber: LineNumber,
  isStartEndStation: boolean,
  isHidden: boolean
): Style[] {
  const fill = new Fill({
    color: '#FFFFFF',
  })
  if (isHidden) {
    return []
  }
  const stroke = new Stroke({
    color: lineColors[lineNumber],
    width: 2,
  })

  let circleRadius = 6
  // Make the circle bigger
  if (isStartEndStation) {
    circleRadius = 8
  }

  const style = new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: circleRadius,
    }),
    fill: fill,
    stroke: stroke,
  })

  return [style]
}

import type { LineNumber } from '@/model/lines.model'
import { Circle, Fill, Stroke, Style, Text, Icon } from 'ol/style'
import { lineColors } from './common'
import * as ol_color from 'ol/color'
import type { IconAnchorUnits } from 'ol/style/Icon'

function getCircleStyle(
  lineNumber: LineNumber,
  isStartEndStation: boolean,
  isShowTextStation: boolean,
  is3D: boolean
): Style {
  let fillColor = ol_color.fromString('#FFFFFF')
  let strokeColor = lineColors[lineNumber]

  // TODO: change to use disk style
  if (is3D) {
    fillColor = lineColors[lineNumber]
    strokeColor = ol_color.fromString('#FFFFFF')
  }

  const fill = new Fill({
    color: fillColor,
  })

  let circleRadius = 6
  let strokeWidth = 3
  // Make the circle bigger
  if (isStartEndStation || isShowTextStation) {
    circleRadius = 8
    strokeWidth = 4
  }

  const stroke = new Stroke({
    color: strokeColor,
    width: strokeWidth,
  })

  const style_circle = new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: circleRadius,
    }),
    fill: fill,
    stroke: stroke,
    zIndex: 5,
  })
  return style_circle
}

function getScaleFromStationName(stationName: string): number[] {
  let width = 1
  const lengthStationName = stationName.length
  if (lengthStationName >= 13) {
    width += 0.5
  }
  return [width, 1]
}

function getTextOffsetXFromImgScale(scaleImg: number[]): number {
  if (scaleImg[0] > 1) {
    return 30
  }
  return 20
}

function getTextStyle(
  lineNumber: LineNumber,
  isStartEndStation: boolean,
  stationName: string
): Style {
  const scaleImg = getScaleFromStationName(stationName)
  const anchorXUnits: IconAnchorUnits = 'pixels'
  const style_text = new Style({
    image: new Icon({
      src:
        './../src/assets/background-map/background-station-T' +
        lineNumber.toString() +
        '.png',
      scale: scaleImg,
      anchorXUnits: anchorXUnits,
    }),
    text: new Text({
      textAlign: 'start',
      textBaseline: 'middle',
      font: 'Normal 12px Arial',
      text: stationName,
      fill: new Fill({
        color: ol_color.fromString('#FFFFFF'),
      }),
      offsetX: getTextOffsetXFromImgScale(scaleImg),
      offsetY: 0,
      rotation: 0,
    }),
    zIndex: 10,
  })
  return style_text
}

export function trambusStopStyle(
  lineNumber: LineNumber,
  isStartEndStation: boolean,
  isShown: boolean,
  isShowTextStation: boolean,
  is3D: boolean,
  stationName: string
): Style[] {
  if (!isShown) {
    return []
  }
  const circleStyle = getCircleStyle(
    lineNumber,
    isStartEndStation,
    isShowTextStation,
    is3D
  )
  const textStyle = getTextStyle(lineNumber, isStartEndStation, stationName)
  if (!isShowTextStation) {
    return [circleStyle]
  }
  return [circleStyle, textStyle]
}

import type { LineNumber } from '@/model/lines.model'
import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
import { getTrambusLineNumber, lineColors } from './common'
import * as ol_color from 'ol/color'
import type { FeatureLike } from 'ol/Feature'
import type { LineState } from '@/styles/line'
import { trambusLineStyle } from '@/styles/line'
import {
  getAllStartEndStations,
  isStartEndStation,
  getStartEndStationsOfLine,
  isStartEndStationOfLine,
} from '@/model/lines.fixtures'
import type { TravelTimeModel } from '@/model/travel-time.model'

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
  const backgroundFillColor = lineColors[lineNumber]
  const style_text = new Style({
    text: new Text({
      textAlign: 'start',
      textBaseline: 'middle',
      font: 'Normal 12px Arial',
      text: stationName,
      fill: new Fill({
        color: ol_color.fromString('#FFFFFF'),
      }),
      backgroundFill: new Fill({
        color: backgroundFillColor,
      }),
      offsetX: getTextOffsetXFromImgScale(scaleImg),
      offsetY: 0,
      rotation: 0,
      padding: [5, 3, 5, 3],
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

function showTextStation(
  selectedStation: string | null,
  stationName: string,
  lineNumber: LineNumber
): boolean {
  if (selectedStation == stationName) {
    return true
  }
  const shownStations = getStartEndStationsOfLine(lineNumber)

  return shownStations.includes(stationName)
}

export function trambusLineTravelTimesViewStyleFunction(
  feature: FeatureLike,
  selectedTravelTime: TravelTimeModel,
  is3D: boolean
): Style[] {
  const lineNumber = getTrambusLineNumber(feature) as LineNumber
  let lineState: LineState = 'normal'

  if (selectedTravelTime == null) {
    lineState = 'normal'
  } else if (getTrambusLineNumber(feature) == selectedTravelTime.line) {
    lineState = 'selected'
  } else {
    lineState = 'unselected'
  }
  return trambusLineStyle(lineNumber, lineState, is3D)
}

export function trambusStopTravelTimesViewStyleFunction(
  feature: FeatureLike,
  selectedTravelTime: TravelTimeModel,
  is3D: boolean
): Style[] {
  let lineNumber = getTrambusLineNumber(feature) as LineNumber

  // no travel time selected, only show the start and end stations
  let shownStations = getAllStartEndStations()
  // There is a travel time selected, show only the selected station from
  // the selected travel time
  if (selectedTravelTime != null) {
    shownStations = [selectedTravelTime.start, selectedTravelTime.end]
    lineNumber = selectedTravelTime?.line
  }
  const stationName = feature.get('nom')
  const isShown = shownStations.indexOf(stationName) > -1

  return trambusStopStyle(
    lineNumber,
    isStartEndStation(stationName),
    isShown,
    isShown, //always shown text when tranmbusStop is shown
    is3D,
    stationName
  )
}

export function trambusStopLineViewStyleFunction(
  feature: FeatureLike,
  selectedLine: number,
  isShown: boolean,
  is3D: boolean,
  selectedStation: string | null
): Style[] {
  const selectedTrambusLine = Number(selectedLine) as LineNumber
  const stationName = feature.get('nom')
  const isShowTextStation = showTextStation(
    selectedStation,
    stationName,
    selectedTrambusLine
  )

  return trambusStopStyle(
    selectedTrambusLine,
    isStartEndStationOfLine(selectedTrambusLine, stationName),
    isShown,
    isShowTextStation,
    is3D,
    stationName
  )
}

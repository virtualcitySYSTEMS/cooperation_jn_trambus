import type { LineNumber } from '@/model/lines.model'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { getTrambusLineNumber, lineColors } from './common'
import * as ol_color from 'ol/color'
import type { FeatureLike } from 'ol/Feature'
import type { LineState } from '@/styles/line'
import { trambusLineStyle } from '@/styles/line'
import {
  getAllStartEndStations,
  isStartEndStation,
} from '@/model/lines.fixtures'
import type { TravelTimeModel } from '@/model/travel-time.model'

export function trambusStopStyle(
  lineNumber: LineNumber,
  isStartEndStation: boolean,
  isShown: boolean,
  is3D: boolean
): Style[] {
  if (!isShown) {
    return []
  }

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
  if (isStartEndStation) {
    circleRadius = 8
    strokeWidth = 4
  }

  const stroke = new Stroke({
    color: strokeColor,
    width: strokeWidth,
  })

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
    is3D
  )
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

export function trambusStopLineViewStyleFunction(
  feature: FeatureLike,
  selectedLine: number,
  isShown: boolean,
  is3D: boolean
): Style[] {
  const selectedTrambusLine = Number(selectedLine) as LineNumber
  const stationName = feature.get('nom')

  return trambusStopStyle(
    selectedTrambusLine,
    isStartEndStation(stationName),
    isShown,
    is3D
  )
}

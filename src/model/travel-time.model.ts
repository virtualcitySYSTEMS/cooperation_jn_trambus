import type { LineNumber } from './lines.model'
export interface TravelTimeModel {
  id: number
  line: LineNumber
  new: number
  old: number
  start: string
  end: string
}

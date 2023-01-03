export type LineFigureTypes = 'station' | 'parking' | 'frequency'
export type LineNumber = 1 | 2 | 3 | 4
export interface LineFigureModel {
  id: LineFigureTypes
  idLine: LineNumber
  figure: number
  unit?: string
  description: string
  icon?: string
  moreInformation?: string
}

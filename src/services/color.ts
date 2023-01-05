import type { LineNumber } from '@/model/lines.model'
import type { BusNumber } from '@/model/bus.model'

export const lineColors: Record<LineNumber, String> = {
  1: 'indigo',
  2: 'pink',
  3: 'emerald',
  4: 'purple',
}

export function getColorLine(
  colorType: String,
  lineNumber: LineNumber,
  variant: Number
): string {
  return `${colorType}-${lineColors[lineNumber]}-${variant}`
}

export const busColors: Record<BusNumber, String> = {
  C1: '#95C11E',
  C2: '#008BD2',
  C3: '#FFCC00',
  C4: '#6F2282',
  C5: '#F39200',
  C6: '#61C3D9',
  C7: '#D39D2F',
  C7ex: '#D39D2F',
}

export function getColorBus(colorType: String, busNumber: BusNumber): string {
  return `${colorType}-[${busColors[busNumber]}]`
}

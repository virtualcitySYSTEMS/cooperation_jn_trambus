const CHAR_MAX = 25
export function shorterName(poiName: string) {
  let shorterName = poiName.replace("'", ' ')
  if (poiName.length > CHAR_MAX) {
    shorterName = shorterName.slice(0, CHAR_MAX).concat('...')
  }
  return shorterName
}

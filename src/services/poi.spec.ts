import { describe, it, expect } from 'vitest'

import { shorterName } from '@/services/poi'

describe('PoiService', () => {
  describe('#shorterName', () => {
    it('short when more than 20 chars', () => {
      const nameTooLong = 'THIS_NAME_IS_REALLY_TOO_LONG'
      const shortName = shorterName(nameTooLong)
      expect(shortName).toBe('THIS_NAME_IS_REALLY_TOO_L...')
    })
    it('does not short when less than 20 chars', () => {
      const nameOk = 'SHORT_ENOUGH'
      const shortName = shorterName(nameOk)
      expect(shortName).toBe(nameOk)
    })
  })
})

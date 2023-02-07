import { describe, it, expect, beforeEach } from 'vitest'

import type { StationModel } from '@/model/stations.model'
import {
  formatLiCode,
  keepOnlyUsefulDessertes,
  sortStationsByOrder,
} from '@/services/station'

describe('StationService', () => {
  let stations: StationModel[]
  beforeEach(() => {
    stations = [
      {
        id: 1,
        li_code: 'T1 T2 T3',
        nom: 'Musée Beaux Arts',
        ordre_t1: 1,
        ordre_t2: 3,
        ordre_t3: 2,
        ordre_t4: null,
        desserte: '12 67 C1 C3 C4 C6 N4 N5 Relais_b TTZ',
      },
      {
        id: 2,
        li_code: 'T1 T2 T3',
        nom: 'Pont de Bretagne',
        ordre_t1: 2,
        ordre_t2: 2,
        ordre_t3: 3,
        ordre_t4: null,
        desserte: '153 154 155 53 54 55 56',
      },
      {
        id: 3,
        li_code: 'T1 T2 T3',
        nom: 'République',
        ordre_t1: 3,
        ordre_t2: 1,
        ordre_t3: 2,
        ordre_t4: null,
        desserte:
          '100 11 153 154 155 156 167 53 54 55 56 67 API Bzh7 C1 C2 C3 C4 C5 C6 N1 N2 N3 N4 N5 Relais_a a',
      },
    ]
  })

  describe('#sortStationsByOrder', () => {
    it('sort t1', () => {
      sortStationsByOrder(stations, 1)
      expect(stations[0].id).toBe(1)
      expect(stations[1].id).toBe(2)
      expect(stations[2].id).toBe(3)
    })
    it('sort t2', () => {
      sortStationsByOrder(stations, 2)
      expect(stations[0].id).toBe(3)
      expect(stations[1].id).toBe(2)
      expect(stations[2].id).toBe(1)
    })
    it('sort t3', () => {
      sortStationsByOrder(stations, 3)
      expect(stations[0].id).toBe(1)
      expect(stations[1].id).toBe(3)
      expect(stations[2].id).toBe(2)
    })
  })

  describe('#keepOnlyUsefulDessertes', () => {
    it('remove desserte on station', () => {
      keepOnlyUsefulDessertes(stations)
      expect(stations[0].desserte).toBe('C1 C3 C4 C6')
    })
  })

  describe('#formatLiCode', () => {
    it('do not keep line number', () => {
      formatLiCode(stations, 'T1')
      expect(stations[0].li_code).not.toContain('1')
    })
    it('reformat other line number', () => {
      formatLiCode(stations, 'T1')
      expect(stations[0].li_code).not.toContain('T')
      expect(stations[0].li_code).toContain('2')
      expect(stations[0].li_code).toContain('3')
    })
  })
})

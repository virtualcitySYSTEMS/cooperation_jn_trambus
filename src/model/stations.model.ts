export interface StationModel {
  id: number
  nom: string
  li_code: string
  ordre_t1: number | null
  ordre_t2: number | null
  ordre_t3: number | null
  ordre_t4: number | null
  parking?: boolean
  desserte?: string | number
  desserte_scolaire?: string | number
  desserte_soirs_we?: string | number
  desserte_dimanche?: string | number
}

export interface StationModel {
  id: number
  nom: string
  li_code: string
  ordre_t1: number | null
  ordre_t2: number | null
  ordre_t3: number | null
  ordre_t4: number | null
  parking?: boolean
  desserte: string
  desserte_scolaire?: string
  desserte_soirs_we?: string
  desserte_dimanche?: string
}

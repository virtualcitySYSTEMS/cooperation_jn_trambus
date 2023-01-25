<script lang="ts" setup>
import ThermometerStations from './ThermometerStations.vue'

const stations = [
  {
    id: 1548,
    nom: 'La Plesse',
    li_code: '3',
    ordre_t1: 1,
    ordre_t2: null,
    ordre_t3: 11,
    ordre_t4: null,
    parking: true,
    desserte: 'C2',
    desserte_scolaire: '204',
    desserte_soirs_we: null,
    desserte_dimanche: null,
  },
  {
    id: 1530,
    nom: 'Cerisaie',
    li_code: '',
    ordre_t1: 2,
    ordre_t2: null,
    ordre_t3: null,
    ordre_t4: null,
    parking: false,
    desserte: '',
    desserte_scolaire: null,
    desserte_soirs_we: null,
    desserte_dimanche: null,
  },
  {
    id: 1512,
    nom: 'Grand Quartier',
    li_code: '',
    ordre_t1: 3,
    ordre_t2: null,
    ordre_t3: null,
    ordre_t4: null,
    parking: false,
    desserte: 'C4',
    desserte_scolaire: null,
    desserte_soirs_we: null,
    desserte_dimanche: null,
  },
  {
    id: 1511,
    nom: 'Dulac',
    li_code: '',
    ordre_t1: 4,
    ordre_t2: null,
    ordre_t3: null,
    ordre_t4: null,
    parking: false,
    desserte: 'C4',
    desserte_scolaire: null,
    desserte_soirs_we: null,
    desserte_dimanche: null,
  },
  {
    id: 1545,
    nom: 'Léonard',
    li_code: '',
    ordre_t1: 5,
    ordre_t2: null,
    ordre_t3: null,
    ordre_t4: null,
    parking: false,
    desserte: 'C4',
    desserte_scolaire: null,
    desserte_soirs_we: '52',
    desserte_dimanche: '52',
  },
]

function initState() {
  return {
    lineNumber: 1,
    stations: stations,
  }
}
</script>

<template>
  <Story
    title="ThermometerStations"
    :layout="{
      type: 'grid',
      width: 450,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <ThermometerStations
        :line="state.lineNumber"
        :stations="state.stations"
      ></ThermometerStations>
    </template>
  </Story>
</template>

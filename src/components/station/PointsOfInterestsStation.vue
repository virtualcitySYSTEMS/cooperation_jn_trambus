<script setup lang="ts">
import { ref } from 'vue'
import ItemPOI from '@/components/station/ItemPOI.vue'

const pointsOfInterests = ref([
  {
    urlImg: '',
    name: 'Ville de Rennes - Service formalités Centre',
    distance: 400,
  },
  {
    urlImg: '/src/assets/photos/poi/bains-douches-saint-georges.png',
    name: 'Bains douches Saint-Georges',
    distance: 400,
  },
  {
    urlImg: '',
    name: 'Rennes Métroppole - Direction des risques',
    distance: 300,
  },
  {
    urlImg: '/src/assets/photos/poi/direction-ressources.png',
    name: 'Ville de Rennes - Rennes Métropole - Direction ressources',
    distance: 400,
  },
])
</script>

<template>
  <h2 class="font-dm-sans font-bold text-lg leading-6 mb-2 mt-3">
    Centres d'intérêt
  </h2>

  <ItemPOI
    v-for="poi in pointsOfInterests"
    :key="poi.name"
    :urlImg="poi.urlImg"
    :name="poi.name"
    :distance="poi.distance"
  />
</template>

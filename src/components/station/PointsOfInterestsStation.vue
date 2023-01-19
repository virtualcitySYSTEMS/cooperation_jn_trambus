<script setup lang="ts">
import { ref } from 'vue'
import ItemPOI from '@/components/station/ItemPOI.vue'

const pointsOfInterests = ref([
  {
    img: '',
    name: 'Ville de Rennes - Service formalités Centre',
    distance: 400,
  },
  {
    img: 'bains-douches-saint-georges.png',
    name: 'Bains douches Saint-Georges',
    distance: 400,
  },
  {
    img: '',
    name: 'Rennes Métroppole - Direction des risques',
    distance: 300,
  },
  {
    img: 'direction-ressources.png',
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
    :img="poi.img"
    :name="poi.name"
    :distance="poi.distance"
  />
</template>

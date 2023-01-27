<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import ItemPOI from '@/components/station/ItemPOI.vue'
import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'

const props = defineProps<{
  nameStation: string
}>()

const rennesApp = inject('rennesApp') as RennesApp
const pointsOfInterests: Ref<
  { img: string; name: string; distance: number }[]
> = ref([])

onMounted(async () => {
  const poiFeatures = await rennesApp.getFeaturesByAttributeFromLayer(
    RENNES_LAYER.poi,
    'station_nom',
    props.nameStation
  )
  poiFeatures.forEach((feature) => {
    pointsOfInterests.value.push({
      img: '',
      name: feature.get('site_nom'),
      distance: feature.get('distance'),
    })
  })
})
</script>

<template>
  <template v-if="pointsOfInterests.length > 0">
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
</template>

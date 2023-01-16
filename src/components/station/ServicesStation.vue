<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue'
import { apiClientService } from '@/services/api.client'
import type { ServiceModel } from '@/model/services.model'
import ItemService from '@/components/station/ItemService.vue'

const props = defineProps({
  nameStation: String,
  idStation: Number,
})

const state = reactive({
  services: null as null | ServiceModel[],
})

onBeforeMount(async () => {
  state.services = await apiClientService.fetchServicesByStation(
    props.idStation!
  )
})
</script>

<template>
  <template v-if="state.services && state.services.length > 0">
    <h2 class="font-dm-sans font-bold text-lg leading-6 mb-2 mt-3">
      Services disponibles
    </h2>
    <div
      class="px-4 py-3 bg-slate-50 border rounded-lg border-slate-100 grid grid-cols-2 gap-4"
    >
      <ItemService
        v-for="service in state.services"
        :key="service.type"
        :type="service.type"
      />
    </div>
  </template>
</template>

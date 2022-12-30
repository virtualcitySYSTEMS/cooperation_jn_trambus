<script setup lang="ts">
import { onBeforeMount, reactive, onMounted, ref } from 'vue'
import router from '@/router'

import UiLineDescription from '@/components/ui/UiLineDescription.vue'
import ChevronArrowRight from '@/assets/icons/chevron-left.svg'
import type { LineModel } from '@/model/lines.model'
import { apiClientService } from '@/services/api.client'
import UiButton from '@/components/ui/UiButton.vue'
import { useRoute } from 'vue-router'

import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

const state = reactive({
  lineDescription: null as null | LineModel,
})

onBeforeMount(async () => {
  const { params } = useRoute()
  const routeParams = ref(params)

  state.lineDescription = await apiClientService.fetchLineDescription(
    routeParams.value.id as unknown as number
  )
})

onMounted(async () => {
  const { params } = useRoute()
  const routeParams = ref(params)

  mapStore.viewPoint = `line${routeParams.value.id}`
})

function backButtonClicked() {
  router.go(-1)
  // TODO: this should use the same starting viewpoint (rennes), but for
  // some reason the starting view point (rennes) is rendered differently
  // from the configuration.
  mapStore.viewPoint = `home`
}
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <UiButton
        class="shadow-md rounded-lg p-2 flex gap-2.5 shrink-0 grow-0"
        @click="backButtonClicked"
      >
        <img :src="ChevronArrowRight" />
      </UiButton>
      <!-- TODO: Make it a title size (currently the component is smaller than the design) -->
      <UiLineDescription
        v-if="state.lineDescription"
        :line="state.lineDescription?.id!"
        :name="state.lineDescription?.name"
        :start="state.lineDescription?.start"
        :end="state.lineDescription?.end"
        :frequency="state.lineDescription?.frequency"
        :duration="false"
      >
      </UiLineDescription>
    </div>
  </div>

  <h2>Line View</h2>

  <div>Line : {{ $route.params.id }}</div>
</template>

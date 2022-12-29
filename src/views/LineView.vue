<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue'
import router from '@/router'

import UiLineDescription from '@/components/ui/UiLineDescription.vue'
import ChevronArrowRight from '@/assets/icons/chevron-left.svg'
import type { LineModel } from '@/model/lines.model'
import { apiClientService } from '@/services/api.client'
import UiButton from '@/components/ui/UiButton.vue'

const state = reactive({
  lineDescription: null as null | LineModel,
})

onBeforeMount(async () => {
  state.lineDescription = await apiClientService.fetchLineDescription(1)
})
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <UiButton
        class="shadow-md rounded-lg p-2 flex gap-2.5 shrink-0 grow-0"
        @click="router.go(-1)"
      >
        <img :src="ChevronArrowRight" />
      </UiButton>
      <UiLineDescription
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

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import router from '@/router'

import { apiClientService } from '@/services/api.client'
import type { LineModel } from '@/model/lines.model'
import UiLineDescription from '@/components/ui/UiLineDescription.vue'
import { useLinesStore } from '@/stores/lines'

const state = reactive({
  lineDescription: null as null | LineModel[],
})

onMounted(async () => {
  state.lineDescription = await apiClientService.fetchLineDescriptions()
})

const lineStore = useLinesStore()

function selectLine(line: String) {
  lineStore.selectLine(line)
}

function goToLinePage(line: number) {
  router.push(`/line/${line}`)
}
</script>

<template>
  <section class="flex flex-col p-0 gap-2">
    <h2 class="font-dm-sans font-bold text-lg leading-6">
      Les nouvelles lignes
    </h2>
    <div class="flex flex-col p-0 gap-2 grow">
      <UiLineDescription
        v-for="lineDescription in state.lineDescription"
        role="button"
        @click="goToLinePage(lineDescription.id)"
        :key="lineDescription.id"
        :line="lineDescription.id"
        :name="lineDescription.name"
        :start="lineDescription.start"
        :end="lineDescription.end"
        :frequency="lineDescription.frequency"
        v-on:click="selectLine(lineDescription.name)"
      >
      </UiLineDescription>
    </div>
  </section>
</template>

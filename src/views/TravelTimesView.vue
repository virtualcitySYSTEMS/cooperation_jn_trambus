<script setup lang="ts">
import { useViewsStore } from '@/stores/views'
import { onMounted } from 'vue'
import ChevronArrowRight from '@/assets/icons/chevron-left.svg'
import UiButton from '../components/ui/UiButton.vue'
import router from '@/router/index'

const viewStore = useViewsStore()

onMounted(() => {
  viewStore.currentView = 'traveltimes'
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

      <div class="flex flex-col items-start p-0 gap-2">
        <h1 class="font-dm-sans font-bold text-2xl">
          Les temps de parcours théoriques
        </h1>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-start p-0 gap-3">
    <div class="flex items-center p-0 gap-4">
      <p class="font-dm-sans font-medium text-sm text-neutral-800">
        Ces temps de parcours sont calculés à l’heure de pointe du matin en
        direction Rennes
      </p>
    </div>
  </div>

  <div>Travel times list</div>
</template>

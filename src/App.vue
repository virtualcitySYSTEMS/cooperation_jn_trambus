<script setup lang="ts">
import { computed, onBeforeMount, provide } from 'vue'

import PhotoGallery from '@/components/home/PhotoGallery.vue'
import MapComponent from '@/components/map/MapComponent.vue'
import SidePanel from '@/components/home/SidePanel.vue'
import HeadToolbarTrambus from '@/components/map/HeadToolbarTrambus.vue'
import PlanningView from '@/views/PlanningView.vue'
import LegalLink from '@/components/home/LegalLink.vue'
import { viewList } from '@/model/views.model'
import { usePanelsStore } from '@/stores/panels'
import { useViewsStore } from '@/stores/views'
import { RennesApp } from '@/services/RennesApp'
import mapConfig from './map.config.json'

const panelStore = usePanelsStore()
const viewStore = useViewsStore()

onBeforeMount(() => {
  const rennesApp = new RennesApp(mapConfig)
  provide('rennesApp', rennesApp)
})

const isPhotoGalleryVisible = computed(() => {
  if (panelStore.isPlanningViewShown) {
    return false
  }
  if (viewStore.currentView == viewList.home) {
    return true
  }
  return false
})
</script>

<template>
  <main class="h-screen flex">
    <aside class="z-10 absolute">
      <SidePanel v-show="panelStore.isPlanningViewShown === false">
        <RouterView :key="$route.fullPath" />
      </SidePanel>
    </aside>

    <HeadToolbarTrambus
      v-show="panelStore.isPlanningViewShown === false"
    ></HeadToolbarTrambus>

    <div class="grow">
      <MapComponent></MapComponent>
    </div>

    <LegalLink
      class="absolute z-20 bottom-3 left-3"
      v-show="
        panelStore.isInformationPanelShown === false ||
        panelStore.isPlanningViewShown === true
      "
      :text-color="'neutral-900'"
    >
    </LegalLink>

    <PhotoGallery
      class="z-10 absolute inset-x-0 bottom-0 max-w-max m-auto"
      v-show="isPhotoGalleryVisible"
    ></PhotoGallery>

    <!--Do lazy loading for planning view.
      Only render it once, and after that 'hide' the planning view so that we can keep its state and no need to load it again. -->
    <div
      class="absolute h-screen w-screen"
      v-if="panelStore.hasPlanningViewRendered"
      v-show="panelStore.isPlanningViewShown"
    >
      <PlanningView></PlanningView>
    </div>
  </main>
</template>

<style scoped></style>

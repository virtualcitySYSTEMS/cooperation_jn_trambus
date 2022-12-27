<script setup lang="ts">
import PhotoGallery from '@/components/home/PhotoGallery.vue'
import MapComponent from '@/components/map/MapComponent.vue'

import SidePanel from '@/components/home/SidePanel.vue'
import PlanningView from '@/views/PlanningView.vue'

import { usePanelsStore } from '@/stores/panels'
import HeadToolbarTrambus from '@/components/map/HeadToolbarTrambus.vue'

const panelStore = usePanelsStore()
</script>

<template>
  <main class="h-screen flex">
    <aside class="z-10 absolute">
      <SidePanel v-show="panelStore.isPlanningViewShown === false">
        <RouterView />
      </SidePanel>
    </aside>

    <HeadToolbarTrambus
      v-show="panelStore.isPlanningViewShown === false"
    ></HeadToolbarTrambus>

    <div class="grow">
      <MapComponent></MapComponent>
    </div>

    <div class="z-10 absolute inset-x-0 bottom-0 max-w-max m-auto">
      <PhotoGallery></PhotoGallery>
    </div>

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

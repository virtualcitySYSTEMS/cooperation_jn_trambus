<script setup lang="ts">
import type { VcsApp } from '@vcmap/core'
import { Viewpoint } from '@vcmap/core'
import { inject } from 'vue'

import IconHome from '@/components/ui/icons/IconHome.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import CompassComponent from '@/components/map/CompassComponent.vue'
import NavigationHelp from '@/components/map/NavigationHelp.vue'

import { useMapStore } from '@/stores/map'
import { useLayersStore } from '@/stores/layers'

const vcsApp = inject('vcsApp') as VcsApp

const mapStore = useMapStore()
const layerStore = useLayersStore()

async function toggleMap() {
  mapStore.toggle3D()
  layerStore.update3DBaseLayer(mapStore.is3D())

  // TODO: set via pinia store
  await vcsApp.maps.setActiveMap(mapStore.is3D() ? 'cesium' : 'ol')
}

async function zoom(out = false, zoomFactor = 2): Promise<void> {
  const activeMap = vcsApp.maps.activeMap
  const viewpoint = await activeMap?.getViewpoint()

  if (activeMap && viewpoint) {
    if (out) {
      viewpoint.distance *= zoomFactor
    } else {
      viewpoint.distance /= zoomFactor
    }

    viewpoint.animate = true
    viewpoint.duration = 0.5
    viewpoint.cameraPosition = [0, 0]

    await activeMap.gotoViewpoint(viewpoint)
  }
}

async function returnToHome() {
  const activeMap = vcsApp.maps?.activeMap
  const homeViewPoint = new Viewpoint({
    cameraPosition: [-1.7219, 48.09, 30000],
    groundPosition: [-1.7219, 48.09, 30000],
  })

  await activeMap?.gotoViewpoint(homeViewPoint)
}

const shouldDisplayNavHelp = () => {
  return (
    sessionStorage.getItem('nav-help-displayed') !== 'true' && mapStore.is3D()
  )
}
</script>

<template>
  <div
    v-bind:class="{ 'h-[23rem]': mapStore.is3D() }"
    class="h-90 transition-[height] absolute right-2 bottom-10 flex flex-col [&>*]:m-2 text-gray-dark items-center overflow-hidden w-32 select-none"
  >
    <UiIconButton class="rounded-lg px-3 py-3" @click="returnToHome"
      ><IconHome
    /></UiIconButton>
    <div class="flex flex-col zoom-buttons text-2xl [&>*]:p-2" role="group">
      <UiIconButton class="rounded-t-lg" @click="() => zoom(false)"
        >+</UiIconButton
      >
      <UiIconButton class="rounded-b-lg" @click="() => zoom(true)"
        >-</UiIconButton
      >
    </div>
    <UiIconButton class="font-semibold rounded-lg" @click="toggleMap">{{
      mapStore.is3D() ? '2D' : '3D'
    }}</UiIconButton>
    <CompassComponent v-if="mapStore.is3D()" />
  </div>
  <NavigationHelp v-if="shouldDisplayNavHelp()" />
</template>

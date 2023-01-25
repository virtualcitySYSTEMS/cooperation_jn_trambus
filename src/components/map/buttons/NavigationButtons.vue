<script setup lang="ts">
import { inject } from 'vue'
import { cloneViewPointAndResetCameraPosition } from '@/helpers/viewpointHelper'

import IconHome from '@/components/ui/icons/IconHome.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import CompassComponent from '@/components/map/CompassComponent.vue'
import NavigationHelp from '@/components/map/NavigationHelp.vue'

import { useMapStore } from '@/stores/map'
import { useLayersStore } from '@/stores/layers'
import { useViewsStore } from '@/stores/views'
import { viewList } from '@/model/views.model'
import type { RennesApp } from '@/services/RennesApp'

const vcsApp = inject('vcsApp') as RennesApp

const mapStore = useMapStore()
const layerStore = useLayersStore()
const viewStore = useViewsStore()

async function toggle3DMap() {
  mapStore.toggle3D()
  // TODO: if the layer store is merged into map store, we can do the following
  // line in pinia
  layerStore.update3DBaseLayer(mapStore.is3D())
}

async function zoom(out = false, zoomFactor = 2): Promise<void> {
  const activeMap = vcsApp.maps.activeMap
  const viewpoint = await activeMap?.getViewpoint()

  if (activeMap && viewpoint) {
    let distance = viewpoint.distance / zoomFactor
    if (out) {
      distance = viewpoint.distance * zoomFactor
    }

    const newVp = cloneViewPointAndResetCameraPosition(viewpoint, distance)
    await vcsApp.maps?.activeMap.gotoViewpoint(newVp)
  }
}

async function returnToHome() {
  mapStore.updateViewpoint('home', true)
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
    <UiIconButton
      class="rounded-lg px-3 py-3"
      @click="returnToHome"
      v-show="viewStore.currentView != viewList.traveltimes"
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
    <UiIconButton class="font-semibold rounded-lg" @click="toggle3DMap">{{
      mapStore.is3D() ? '2D' : '3D'
    }}</UiIconButton>
    <CompassComponent v-if="mapStore.is3D()" />
  </div>
  <NavigationHelp v-if="shouldDisplayNavHelp()" />
</template>

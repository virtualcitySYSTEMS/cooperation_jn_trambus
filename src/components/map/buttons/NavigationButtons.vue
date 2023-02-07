<script setup lang="ts">
import { inject } from 'vue'
import { cloneViewPointAndResetCameraPosition } from '@/helpers/viewpointHelper'

import IconHome from '@/components/ui/icons/IconHome.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import CompassComponent from '@/components/map/CompassComponent.vue'

import { useMap3dStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { viewList } from '@/model/views.model'
import type { RennesApp } from '@/services/RennesApp'
import { useRouter } from 'vue-router'

const rennesApp = inject('rennesApp') as RennesApp

const map3dStore = useMap3dStore()
const viewStore = useViewsStore()
const router = useRouter()

async function toggle3DMap() {
  map3dStore.toggle3D()
  // TODO: if the layer store is merged into map store, we can do the following
  // line in pinia
}

async function zoom(out = false, zoomFactor = 2): Promise<void> {
  const activeMap = rennesApp.maps.activeMap
  const viewpoint = await activeMap?.getViewpoint()

  if (activeMap && viewpoint) {
    let distance = viewpoint.distance / zoomFactor
    if (out) {
      distance = viewpoint.distance * zoomFactor
    }

    const newVp = cloneViewPointAndResetCameraPosition(viewpoint, distance)
    await rennesApp.maps?.activeMap.gotoViewpoint(newVp)
  }
}

const shouldDisplayHomeButton = () => {
  return ![viewList.traveltimes, viewList.home].includes(viewStore.currentView)
}
</script>

<template>
  <div
    v-bind:class="{ 'h-[23rem]': map3dStore.is3D() }"
    class="h-90 transition-[height] absolute right-2 bottom-10 flex flex-col [&>*]:m-2 text-gray-dark items-center overflow-hidden w-32 select-none"
  >
    <UiIconButton
      class="rounded-lg px-3 py-3"
      @click="router.push('/home')"
      v-show="shouldDisplayHomeButton()"
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
      map3dStore.is3D() ? '2D' : '3D'
    }}</UiIconButton>
    <CompassComponent v-if="map3dStore.is3D()" />
  </div>
</template>

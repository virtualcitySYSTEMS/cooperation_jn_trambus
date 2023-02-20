<script setup lang="ts">
import { inject, computed } from 'vue'
import { cloneViewPointAndResetCameraPosition } from '@/helpers/viewpointHelper'

import { IconHome } from 'cooperation_jn_common_ui'
import { IconPlus } from 'cooperation_jn_common_ui'
import { IconMinus } from 'cooperation_jn_common_ui'
import { UiIconButton } from 'cooperation_jn_common_ui'

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

const heightClass = computed(() => {
  if (!shouldDisplayHomeButton() && map3dStore.is3D()) {
    return ['h-[17rem]']
  } else if (map3dStore.is3D()) {
    return ['h-[21rem]']
  }
  return ['h-90']
})
</script>

<template>
  <div
    :class="heightClass"
    class="transition-[height] absolute right-2 bottom-10 flex flex-col [&>*]:m-2 text-gray-dark items-center overflow-hidden w-32 select-none"
  >
    <UiIconButton
      class="rounded-lg"
      @click="router.push('/home')"
      v-show="shouldDisplayHomeButton()"
      ><IconHome
    /></UiIconButton>
    <div class="flex flex-col zoom-buttons text-2xl [&>*]:p-2" role="group">
      <UiIconButton class="rounded-t-lg" @click="() => zoom(false)">
        <IconPlus />
      </UiIconButton>
      <UiIconButton class="rounded-b-lg" @click="() => zoom(true)">
        <IconMinus />
      </UiIconButton>
    </div>
    <UiIconButton class="font-semibold rounded-lg" @click="toggle3DMap">{{
      map3dStore.is3D() ? '2D' : '3D'
    }}</UiIconButton>
    <CompassComponent v-if="map3dStore.is3D()" />
  </div>
</template>

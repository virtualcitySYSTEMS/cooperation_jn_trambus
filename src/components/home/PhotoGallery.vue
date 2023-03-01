<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue'

import { apiClientService } from '@/services/api.client'
import type { PhotoModel } from '@/model/photos.model'
import UiPhotoGalery from '../ui/UiPhotoGalery.vue'
import UiPhotoCaroussel from '../ui/UiPhotoCaroussel.vue'
import { usePanelsStore } from '@/stores/panels'

const state = reactive({
  photos: null as null | PhotoModel[],
  galleryShown: Boolean,
})

const photoUrls = computed(() => {
  return state.photos?.map((p) => p.url)
})

onMounted(async () => {
  state.photos = await apiClientService.fetchPhotos()
})

const panelsStore = usePanelsStore()
const imageToDisplayInCaroussel = ref<string | null>(null)

function toggleGallery() {
  panelsStore.toggleGallery()
}
</script>

<template>
  <div>
    <UiPhotoCaroussel
      v-if="imageToDisplayInCaroussel !== null"
      :photos="photoUrls"
      :currentImage="imageToDisplayInCaroussel"
      @closeCaroussel="imageToDisplayInCaroussel = null"
    />
    <UiPhotoGalery
      :photos="photoUrls"
      :galleryShown="panelsStore.isGalleryShown"
      @toggleEvent="toggleGallery"
      @clickImage="imageToDisplayInCaroussel = $event"
    >
    </UiPhotoGalery>
  </div>
</template>

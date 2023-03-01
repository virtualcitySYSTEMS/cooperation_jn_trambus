<script lang="ts" setup>
import UiPhotoCaroussel from './UiPhotoCaroussel.vue'
import photo1 from '@/assets/photos/samples/photo1.png'
import photo2 from '@/assets/photos/samples/photo2.png'
import photo3 from '@/assets/photos/samples/photo3.png'

function initState() {
  return {
    photos: [photo1, photo2, photo3],
    currentImage: photo1,
  }
}
</script>

<template>
  <Story
    title="UiPhotoCaroussel"
    :layout="{
      type: 'grid',
      width: 1500,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <div class="h-[900px]">
        <UiPhotoCaroussel
          :photos="state.photos"
          :currentImage="state.currentImage"
        />
      </div>
    </template>
  </Story>
</template>

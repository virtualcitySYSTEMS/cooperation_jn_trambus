<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted } from 'vue'
import iconMultiply from '@/assets/icons/icon-multiply.svg'
import iconArrowRight from '@/assets/icons/arrow-right-caroussel.svg'
import iconArrowLeft from '@/assets/icons/arrow-left-caroussel.svg'

const props = defineProps({
  photos: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  currentImage: {
    type: String,
    default: null,
  },
})

const indexCurrentImage = ref<number>(0)
const emit = defineEmits(['closeCaroussel'])

onMounted(async () => {
  props.photos.forEach((photo, index) => {
    if (photo == props.currentImage) {
      indexCurrentImage.value = index
    }
  })
})
</script>
<template>
  <div class="fixed top-0 left-0 w-full h-full z-20 bg-slate-900 bg-opacity-60">
    <div class="flex flex-row mt-14 mx-auto h-[85%] w-[80%] justify-center">
      <div class="flex flex-col">
        <div
          class="w-9 h-9 bg-white p-2 mr-3 rounded flex justify-center items-center my-auto cursor-pointer"
          @click="
            indexCurrentImage > 0
              ? indexCurrentImage--
              : (indexCurrentImage = props.photos.length - 1)
          "
        >
          <img :src="iconArrowLeft" class="w-4 h-4" />
        </div>
      </div>
      <div class="bg-white p-3 rounded-lg mr-3">
        <img
          :key="props.photos[indexCurrentImage]"
          :src="props.photos[indexCurrentImage]"
          class="w-full h-[90%]"
        />
        <span class="font-dm-sans font-normal text-base">
          Simulation 3D d’une voie aménagée avec un couloir de bus avec piste
          cyclable, une voie automobile, une piste cyclable , une bande végétale
          et 2 voies piétonnes dans une rue résidentielle.
        </span>
      </div>
      <div class="flex flex-col">
        <img
          :src="iconMultiply"
          class="w-4 h-4 cursor-pointer -mb-6"
          @click="emit('closeCaroussel')"
        />

        <div
          class="w-9 h-9 bg-white p-2 mr-3 rounded flex justify-center items-center my-auto cursor-pointer"
          @click="
            indexCurrentImage < props.photos.length - 1
              ? indexCurrentImage++
              : (indexCurrentImage = 0)
          "
        >
          <img :src="iconArrowRight" class="w-4 h-4" />
        </div>
      </div>
    </div>
  </div>
</template>

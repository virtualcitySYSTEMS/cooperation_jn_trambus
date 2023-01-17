<script setup lang="ts">
import localizationIcon from '@/assets/icons/localization-icon.svg'

const props = defineProps<{
  urlImg: string
  name: string
  distance: number
}>()
</script>

<template>
  <div class="flex">
    <img
      class="w-32 h-20 rounded"
      :src="
        props.urlImg ? props.urlImg : '/src/assets/photos/poi/poi-no-img.png'
      "
      :alt="props.name"
    />
    <div class="flex flex-col justify-center items-start py-0 px-3 gap-2">
      <div class="flex">
        <span class="font-dm-sans font-medium text-sm">
          {{ props.name }}
        </span>
      </div>
      <div class="flex gap-2">
        <img class="" :src="localizationIcon" />
        <span class="w-10 h-4 font-dm-sans font-normal text-xs text-gray-500">
          {{ props.distance }} m
        </span>
      </div>
    </div>
  </div>
</template>

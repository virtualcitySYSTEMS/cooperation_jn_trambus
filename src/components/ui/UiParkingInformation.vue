<script setup lang="ts">
import ParkingIcon from '@/assets/icons/parking.svg'
const props = defineProps({
  name: String,
  station: String,
  place: Number,
})
</script>
<template>
  <div class="flex flex-row items-center gap-4 h-20">
    <img :src="ParkingIcon" />
    <div class="flex flex-col items-start p-0 h-16">
      <div class="font-dm-sans font-bold text-base leading-6">
        Parking {{ props.name }}
      </div>
      <div class="flex flex-row items-center p-0 gap-3 h-5">
        <div class="h-5 font-dm-sans font-normal text-sm leading-5">
          {{ props.station }}
        </div>
      </div>
    </div>
    <div
      class="box-border h-[52px] w-[60px] ml-auto flex flex-col items-start py-2 px-3 border-slate-200 rounded border-2 border-solid"
    >
      <div
        class="w-7 h-5 font-dm-sans font-bold text-sm leading-5 text-neutral-800"
      >
        {{ props.place }}
      </div>
      <div
        class="w-9 h-4 font-dm-sans font-normal text-xs leading-4 text-neutral-800"
      >
        places
      </div>
    </div>
  </div>
</template>

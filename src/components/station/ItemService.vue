<script setup lang="ts">
import type { ServiceType } from '@/model/services.model'
import { TEXT_OF_SERVICE } from '@/model/services.model'
import defaultImg from '@/assets/icons/services/newspaper-distributor.svg'
import type { PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  type: String as PropType<ServiceType>,
})

let urlImg = ref(defaultImg)
if (props.type) {
  urlImg.value = defaultImg.replace('newspaper-distributor', props.type)
}
</script>

<template>
  <div class="flex w-44 h-8 py-2 gap-3">
    <img class="w-4 h-4" :src="urlImg" :alt="props.type" />
    <p class="font-dm-sans text-sm -tracking-[1%]">
      {{ props.type !== undefined ? TEXT_OF_SERVICE[props.type] : '' }}
    </p>
  </div>
</template>

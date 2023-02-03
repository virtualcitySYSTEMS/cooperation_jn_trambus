<script setup lang="ts">
import type { ServiceType } from '@/model/services.model'
import { TEXT_OF_SERVICE, IMG_OF_SERVICE } from '@/model/services.model'

import type { PropType } from 'vue'

const props = defineProps({
  type: String as PropType<ServiceType>,
})
</script>

<template>
  <div class="flex w-44 h-8 py-2 gap-3">
    <img
      class="w-4 h-4"
      :src="props.type !== undefined ? IMG_OF_SERVICE[props.type] : ''"
      :alt="props.type"
    />
    <p class="font-dm-sans text-sm -tracking-[1%]">
      {{ props.type !== undefined ? TEXT_OF_SERVICE[props.type] : '' }}
    </p>
  </div>
</template>

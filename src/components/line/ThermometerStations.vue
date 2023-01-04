<script setup lang="ts">
import type { PropType } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import ItemThermometerStations from '@/components/line/ItemThermometerStations.vue'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col items-start p-0 gap-2">
    <h2 class="font-dm-sans font-bold text-lg leading-6">
      Toutes les stations
    </h2>
  </div>

  <div>
    <ul class="list-stations">
      <template v-for="index in 15" :key="index">
        <ItemThermometerStations :index="index" :line="props.line" />
      </template>
    </ul>
  </div>
</template>

<style scoped>
.list-stations {
  list-style: none;
}

.list-stations > li {
  position: relative;
}
</style>

<script lang="ts" setup>
import LineFigures from './LineFigures.vue'
function initState() {
  return {
    id: 1,
    nb_parking: 2,
    nb_station: 30,
  }
}
</script>

<template>
  <Story
    title="LineFigure"
    :layout="{
      type: 'grid',
      width: 450,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <LineFigures
        :line="state.id"
        :nb_parking="state.nb_parking"
        :nb_station="state.nb_station"
      ></LineFigures>
    </template>
  </Story>
</template>

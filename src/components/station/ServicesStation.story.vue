<script lang="ts" setup>
import ServicesStation from './ServicesStation.vue'
function initState() {
  return {
    nameStation: 'Dulac',
    idStation: 1511,
  }
}
</script>

<template>
  <Story
    title="ServicesStation"
    :layout="{
      type: 'grid',
      width: 450,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <ServicesStation
        :nameStation="state.nameStation"
        :idStation="state.idStation"
      />
    </template>
  </Story>
</template>

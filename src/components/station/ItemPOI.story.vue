<script lang="ts" setup>
import ItemPOI from './ItemPOI.vue'
function initState() {
  return {
    urlImg: '/src/assets/photos/poi/bains-douches-saint-georges.png',
    name: 'Bains douches Saint-Georges',
    distance: 400,
  }
}
</script>

<template>
  <Story
    title="ItemPOI"
    :layout="{
      type: 'grid',
      width: 450,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <ItemPOI
        :urlImg="state.urlImg"
        :name="state.name"
        :distance="state.distance"
      />
    </template>
  </Story>
</template>

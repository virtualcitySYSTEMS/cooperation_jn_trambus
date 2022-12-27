<script setup lang="ts">
import { useViewsStore } from '@/stores/views'
import { onMounted } from 'vue'

const viewStore = useViewsStore()

onMounted(() => {
  viewStore.currentView = 'traveltimes'
})
</script>

<template>
  <div>
    <h2>Travel Times View</h2>
  </div>
</template>

<script lang="ts" setup>
import UiLineHeader from '@/components/ui/UiLineHeader.vue'

function initState() {
  return {
    id: 1,
    name: 'Ligne T1',
    start: 'Stade Rennais',
    end: 'Brécé',
  }
}
</script>

<template>
  <Story
    title="UiLineHeader"
    :layout="{
      type: 'grid',
      width: 500,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <UiLineHeader
        :line="state.id"
        :name="state.name"
        :start="state.start"
        :end="state.end"
      >
      </UiLineHeader>
    </template>
  </Story>
</template>

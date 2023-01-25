<script lang="ts" setup>
import LegalLink from './LegalLink.vue'
</script>

<template>
  <Story
    title="Legal Links"
    :layout="{
      type: 'grid',
      width: 500,
    }"
    group="sidepanel"
  >
    <Variant :title="'Default Color'">
      <template #default>
        <LegalLink></LegalLink>
      </template>
    </Variant>
    <Variant :title="'neutral-900'">
      <template #default>
        <LegalLink :text-color="'neutral-900'"></LegalLink>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { ServiceType } from '@/model/services.model'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  type: String as PropType<ServiceType>,
})

const getTextOfService = computed(() => {
  switch (props.type) {
    case 'ticket-machine':
      return 'Distributeur de titre'
    case 'box-bike':
      return 'Box vélo et casier sécurisés'
    case 'newspaper-distributor':
      return 'Distributeur de journeaux'
    case 'vegetable-garden':
      return 'Potager'
    case 'bike-rack':
      return 'Arceau vélo'
    case 'usb-charging':
      return 'Prise recharge USB'
    case 'parcel-locker':
      return 'Casier livraison colis'
    case 'public-sanitary':
      return 'Sanitaire public'
  }
  return ''
})
</script>

<template>
  <div class="flex w-44 h-8 py-2 gap-3">
    <img
      class="w-4 h-4"
      :src="'/src/assets/icons/services/' + props.type + '.svg'"
      :alt="props.type"
    />
    <p class="font-dm-sans text-sm -tracking-[1%]">
      {{ getTextOfService }}
    </p>
  </div>
</template>

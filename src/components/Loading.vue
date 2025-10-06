<script setup lang="ts">
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  }
})
</script>
<template>
  <v-progress-circular 
    class="mx-auto my-auto"
    v-if="isLoading"
    model-value="20" 
    :size="60" 
    :width="6"
    indeterminate
  />
</template>

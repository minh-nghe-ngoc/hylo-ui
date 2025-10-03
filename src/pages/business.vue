<script setup lang="ts">
import Import from './import.vue';
import Export from './export.vue';
const isImporting = ref(false);
const componentRef = computed(() => (isImporting.value ? Import : Export));

</script>
<template>
  <Component :is="componentRef" />
</template>

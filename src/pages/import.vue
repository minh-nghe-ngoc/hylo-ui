<script setup lang="ts">
import ImportForm from './importForm.vue';
import ImportList from './importList.vue';

const isShowingDetail = ref(true);
const importId = ref();

const onHeaderIconClick = () => {
  isShowingDetail.value = !isShowingDetail.value;
};

const onEditIconClick = (item: any) => {
  importId.value = item.id;
  isShowingDetail.value = true;
};
</script>
<template>
  <ImportForm v-if="isShowingDetail" :import-id="importId" @iconClick="onHeaderIconClick"/>
  <ImportList v-else @iconClick="onHeaderIconClick" @editClick="onEditIconClick"/>
</template>

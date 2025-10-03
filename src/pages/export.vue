<script setup lang="ts">
import ExportForm from './exportForm.vue';
import ExportList from './exportList.vue';

const currentExportId = ref();
const isShowingDetail = ref(true);
const onHeaderIconClick = () => {
  isShowingDetail.value = !isShowingDetail.value;
};

const onEditIconClick = (item: any) => {
  isShowingDetail.value = true;
  currentExportId.value = item.id;
};
</script>
<template>
  <ExportForm v-if="isShowingDetail" @iconClick="onHeaderIconClick" :exportId="currentExportId"/>
  <ExportList v-else @iconClick="onHeaderIconClick" @editClick="onEditIconClick"/>
</template>

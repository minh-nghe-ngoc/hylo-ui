<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import ExportForm from './exportForm.vue';
import ExportList from './exportList.vue';

const route = useRoute();
const router = useRouter();
const currentExportId = ref();
const isShowingDetail = ref(false);
const onHeaderIconClick = () => {
  isShowingDetail.value = !isShowingDetail.value;
};

const onEditIconClick = (item: any) => {
  currentExportId.value = item.id;
  isShowingDetail.value = true;
};

onMounted(() => {
  if (route.query.id) {
    currentExportId.value = route.query.id;
    isShowingDetail.value = true;
  } else {
    isShowingDetail.value = false;
  }
});
</script>
<template>
  <ExportForm v-if="isShowingDetail" @iconClick="onHeaderIconClick" :exportId="currentExportId"/>
  <ExportList v-else @iconClick="onHeaderIconClick" @editClick="onEditIconClick"/>
</template>

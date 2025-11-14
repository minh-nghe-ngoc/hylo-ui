<script setup lang="ts">
import { ProductHistoryRequest } from '@/models/requests/productRequestModel';
import { ProductHistoryResponse } from '@/models/responses/ProductHistoryModel';
import warehouseService from '@/services/warehouseService';
import { HistoryType } from '@/shared/enums';
import moment from 'moment';
import { useRoute } from 'vue-router';
import { VDataTable } from "vuetify/labs/VDataTable";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const pagination = ref({
  page: 1,
  totalPages: 1,
  totalItems: 11
});

const tableHeaders = [
  { title: 'Giao dịch', key: 'info', width: '60%' },
  { title: 'SL', key: 'quantityChange' },
  { title: 'Tồn', key: 'remain' },
];
const workingItem = ref<ProductHistoryResponse>(new ProductHistoryResponse());

onMounted(async () => {
  try {
    loading.value = true;
    await fetchData();
  } catch (error) {
    console.error('Error fetching product history:', error);
  } finally {
    loading.value = false;
  }
});

const fetchData = async () => {
  const queryParams: ProductHistoryRequest = new ProductHistoryRequest();
  queryParams.id = Number(route.params.id) || 0;
  queryParams.pageNo = pagination.value.page;

  const res = await warehouseService.getHistory(queryParams);
  if (res) {
    workingItem.value = res;
    pagination.value.page = res.pageNo;
    pagination.value.totalItems = res.totalItems;
    pagination.value.totalPages = res.totalPages;
  }
};

const onItemClick = (item: any) => {
  switch (item.raw.historyType) {
    case HistoryType.IMPORT:
      router.push({ name: 'import', query: { id: item.raw.referenceId } });
      break;
    case HistoryType.EXPORT:
      router.push({ name: 'export', query: { id: item.raw.referenceId } });
      break;
    default:
      return;
  }
};

const onPaginationChange = (options: any) => {
  console.log('Pagination changed:', options);
};

const getIcon = (item: HistoryType) => {
  console.log('Getting icon for history type:', item);
  switch (item) {
    case HistoryType.IMPORT:
      return 'mdi-download';
    case HistoryType.EXPORT:
      return 'mdi-upload';
    case HistoryType.ADJUSTMENT:
      return 'mdi-swap-horizontal';
    default:
      return 'mdi-help-circle';
  }
};
</script>
<template>
  <v-card
    :loading="loading"
  >
    <v-card-title>
      <h3>{{ workingItem.productName }}</h3>
      <v-row>
        <v-col cols="2">
          <div>Tồn: {{ workingItem.productRemain }}</div>
        </v-col>
      </v-row>
      <v-divider />
    </v-card-title>
    <VDataTable
      :loading="loading"
      :items="workingItem.items"
      :headers="tableHeaders"
      fixed-header
      @update:options="onPaginationChange">
      <template #item.info="{ item }">
        <div @click="onItemClick(item)">
          <h4><v-icon>{{ getIcon(item.raw.historyType) }}</v-icon> {{ item.raw.referenceName }}</h4>
          <div>{{ moment(item.raw.updatedAt).format('DD/MM/YYYY HH:mm') }}</div>
          <div>Giá vốn: {{ item.raw.unitPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
          <div>Giá bán: {{ item.raw.sellPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
        </div>
      </template>
      <template #bottom>
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalPages"
          total-visible="5"
          class="my-4"
          @@update="onPaginationChange"
        ></v-pagination>
      </template>
    </VDataTable>
  </v-card>
</template>

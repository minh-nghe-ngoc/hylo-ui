<script setup lang="ts">
import { ProductHistoryRequest } from '@/models/requests/productRequestModel';
import { ProductHistoryModel } from '@/models/responses/ProductHistoryModel';
import moment from 'moment';
import { useRoute } from 'vue-router';
import { VDataTable } from "vuetify/labs/VDataTable";

const route = useRoute();
console.log(route.params.id);

const tableHeaders = [
  { title: '', key: 'info', width: '60%' },
  { title: 'SL', key: 'quantity' },
  { title: 'Tồn', key: 'remain' },
];
const workingItem = ref<ProductHistoryModel>(new ProductHistoryModel({
  id: 1,
  name: 'Product 1',
  unitPrice: 100,
  sellPrice: 120,
  remain: 50,
  histories: [
    {
      id: 1,
      isExport: false,
      quantity: 10,
      date: new Date(),
      name: 'Minh Nghê',
      unitPrice: 100,
      remain: 40
    }
  ]
}));

const fetchData = (pageNo: number = 1, pageSize: number = 10) => {
  const queryParams: ProductHistoryRequest = {
    id: parseInt(route.params.id as string),
    pageSize: pageSize,
    pageNo: pageNo
  };
}

const onItemClick = (item: any) => {
  console.log('Item clicked:', item.raw);
};

const onPaginationChange = (options: any) => {
  fetchData(options.page, options.itemsPerPage);
};
</script>
<template>
  <v-card>
    <v-card-title>
      <h3>{{ workingItem.name }}</h3>
      <v-row>
        <v-col cols="4">
          <div>Giá nhập: <br />{{ workingItem.unitPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
        </v-col>
        <v-col cols="4">
          <div>Giá bán: <br />{{ workingItem.sellPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
        </v-col>
        <v-col cols="2">
          <div>Tồn kho: <br />{{ workingItem.remain }}</div>
        </v-col>
      </v-row>
      <v-divider />
    </v-card-title>
    <VDataTable
      :items="workingItem.histories"
      :headers="tableHeaders"
      fixed-header
      @update:options="onPaginationChange">
      <template #item.info="{ item }">
        <div @click="onItemClick(item)">
          <h4><v-icon>{{ item.raw.isExport ? 'mdi-upload' : 'mdi-download' }}</v-icon> {{ item.raw.name }}</h4>
          <div>{{ moment(item.raw.date).format('DD/MM/YYYY HH:mm') }}</div>
          <div>Giá vốn: {{ item.raw.unitPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
        </div>
      </template>
    </VDataTable>
  </v-card>
</template>

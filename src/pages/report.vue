<script setup lang="ts">
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue';
import { ReportRequest } from '@/models/requests/reportRequestModel';
import { ReportResponse } from '@/models/responses/reportResponseModel';
import reportService from '@/services/reportService';
import defaultValue from '@/shared/defaultValue';
import { ReportRange } from '@/shared/enums';
import moment from 'moment';

const reportRangeOptions = ref(defaultValue.reportRangeOptions)
const queryParams = ref<ReportRequest>(new ReportRequest())

const data = ref<ReportResponse>(new ReportResponse());

watch(() => queryParams.value, (newVal) => {
}, { immediate: true });

const fetchData = async () => {
  try {
    data.value = await reportService.getReport(queryParams.value);
  } catch (error) {
    console.error('Error fetching report data:', error);
  }
}

onMounted(async () => {
  await fetchData();
});
</script>
<template>
<div class="page__container">
  <div class="page__header">
    <div class="d-flex align-center justify-space-between">
      <h2>Báo cáo</h2>
      <v-select
        v-model="queryParams.range"
        :items="reportRangeOptions"
        item-title="label"
        item-value="value"
        dense
        outlined
        style="max-width: 150px;"
        @update:model-value="fetchData"
      />
    </div>
    <AppDateTimePicker
      v-model="queryParams.fromDate"
      label="Từ ngày"
      :disabled="queryParams.range !== ReportRange.CUSTOM"
      :config="{ dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y' }"
      clearable
      outlined
      dense
      class="app-picker-field"
    />
  </div>
  <div class="page__content">
    <v-row no-gutters class="mt-2">
      <v-col cols="4" offset="1">
        <div class="d-flex flex-column align-end">
          <span>Doanh số</span>
          <small>{{ (data.totalRevenue || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</small>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="d-flex flex-column align-end">
          <span>Vốn</span>
          <small>{{ (data.totalCapital || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</small>
        </div>
      </v-col>
      <v-col cols="3">
        <div class="d-flex flex-column align-end">
          <span>Lãi</span>
          <small>{{ (data.totalProfit || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</small>
        </div>
      </v-col>
    </v-row>
    <template v-for="item in data.items" :key="item.id">
      <v-divider class="my-2"></v-divider>
      <v-row no-gutters class="align-center">
        <v-col cols="1">
          <div class="d-flex flex-column">
            <span style="color: green">{{ moment(item.exportDate).format('DD/MM') }}</span>
            <small>{{ moment(item.exportDate).format('YYYY') }}</small>
          </div>
        </v-col>
        <v-col cols="4">
          <div class="d-flex flex-column align-end">
            <div>
              <small>{{ (item.totalRevenue || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</small>
            </div>
          </div>
        </v-col>
        <v-col cols="4">
          <div class="d-flex flex-column align-end">
            <small>{{ (item.totalCapital || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</small>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="d-flex flex-column align-end">
            <small>{{ (item.totalProfit || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</small>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
  <div class="page__footer">
    <v-pagination
      :length="data.totalPages"
      v-model="queryParams.pageNo"
      @update:model-value="fetchData"
      total-visible="7"
      color="primary"
    />
  </div>
</div>  
</template>
<style scoped ="scss">
:deep(.app-picker-field) {
  min-width: 150px;
}
</style>

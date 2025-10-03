<script setup lang="ts">
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue';
import App from '@/App.vue';
import defaultValue from '@/shared/defaultValue';
import { ReportRange } from '@/shared/enums';
import { all } from 'axios';
import moment from 'moment';
import FlatPickr from 'vue-flatpickr-component'

const reportRangeOptions = ref(defaultValue.reportRangeOptions)
const queryParams = ref({
  range: ReportRange.TODAY,
  fromDate: '',
  toDate: ''
})
const data = ref({
  totalRevenue: 10000,
  totalCapital: 8000,
  totalProfit: 2000,
  detail: [
    {
      exportDate: '2023-10-01',
      totalRevenue: 10000,
      totalCapital: 8000,
      totalProfit: 2000,
    }
  ]
})

watch(() => queryParams.value, (newVal) => {
  console.log('Range changed to:', newVal);
}, { immediate: true });

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
    <v-row dense>
      <v-col cols="4" offset="2">
        <p>Doanh thu</p>
        <p>{{ data.totalRevenue }}</p>
      </v-col>
      <v-col cols="3">
        <p>Vốn</p>
        <p>{{ data.totalCapital }}</p>
      </v-col>
      <v-col cols="3">
        <p>Lợi nhuận</p>
        <p>{{ data.totalProfit }}</p>
      </v-col>
    </v-row>
    <v-row dense v-for="(item, index) in data.detail" :key="index" class="mt-4">
      <v-col cols="2">
        <p>{{ moment(item.exportDate).format('DD/MM') }}</p>
        <p>{{ moment(item.exportDate).format('YYYY') }}</p>
      </v-col>
      <v-col cols="4">
        <p>{{ item.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</p>
      </v-col>
      <v-col cols="3">
        <p>{{ item.totalCapital.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</p>
      </v-col>
      <v-col cols="3">
        <p>{{ item.totalProfit.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</p>
      </v-col>

    </v-row>
  </div>
</div>  
</template>
<style scoped ="scss">
:deep(.app-picker-field) {
  min-width: 150px;
}
</style>

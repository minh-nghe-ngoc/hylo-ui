<script setup lang="ts">
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue';
import Loading from '@/components/Loading.vue';
import { ReportRequest } from '@/models/requests/reportRequestModel';
import { ReportResponse } from '@/models/responses/reportResponseModel';
import reportService from '@/services/reportService';
import defaultValue from '@/shared/defaultValue';
import { ReportRange } from '@/shared/enums';
import moment from 'moment';

const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref('');
const reportRangeOptions = ref(defaultValue.reportRangeOptions)
const queryParams = ref<ReportRequest>(new ReportRequest())

const data = ref<ReportResponse>(new ReportResponse());


const fetchData = async () => {
  console.log('Fetching data with params:', queryParams.value);
  try {
    isLoading.value = true;
    data.value = await reportService.getReport(queryParams.value);
  } catch (error) {
    isError.value = true;
    errorMessage.value = 'Đã có lỗi xảy ra, vui lòng thử lại.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});
</script>
<template>
  <div class="page__container">
    <Loading v-if="isLoading" :is-loading="isLoading"/>
    <template v-else>
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
        <v-row dense class="mt-2" v-if="queryParams.range === ReportRange.CUSTOM">
          <v-col cols="6">
            <AppDateTimePicker
              v-model="queryParams.fromDate"
              label="Từ ngày"
              :config="{ dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y' }"
              outlined
              class="app-picker-field"
              @update:model-value="fetchData"
            />
          </v-col>
          <v-col cols="6">
            <AppDateTimePicker
              v-model="queryParams.toDate"
              label="Đến ngày"
              :config="{ dateFormat: 'Y-m-d', altInput: true, altFormat: 'd/m/Y' }"
              outlined
              class="app-picker-field"
              @update:model-value="fetchData"
            />
          </v-col>
        </v-row>
      </div>
      <div class="page__content">
        <v-row no-gutters class="mt-2">
          <v-col cols="4" offset="1">
            <div class="d-flex flex-column align-end">
              <span style="color: blue;">Doanh số</span>
              <small>{{ (data.totalRevenue || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="d-flex flex-column align-end">
              <span style="color: blue;">Vốn</span>
              <small>{{ (data.totalCapital || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
            </div>
          </v-col>
          <v-col cols="3">
            <div class="d-flex flex-column align-end">
              <span style="color: blue;">Lãi</span>
              <small style="font-weight: bold;">{{ (data.totalProfit || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
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
                  <small>{{ (item.totalRevenue || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="d-flex flex-column align-end">
                <small>{{ (item.totalCapital || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
              </div>
            </v-col>
            <v-col cols="3">
              <div class="d-flex flex-column align-end">
                <small style="font-weight: bold;">{{ (item.totalProfit || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
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
    </template>
  </div>
</template>
<style scoped lang="scss">
:deep(.app-picker-field) {
  min-width: 150px;
}

small {
  color: black;
}
</style>

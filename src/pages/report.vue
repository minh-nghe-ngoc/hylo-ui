<script setup lang="ts">
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue';
import Loading from '@/components/Loading.vue';
import { ReportRequest } from '@/models/requests/reportRequestModel';
import { ReportResponse } from '@/models/responses/reportResponseModel';
import reportService from '@/services/reportService';
import defaultValue from '@/shared/defaultValue';
import { ReportRange } from '@/shared/enums';
import moment from 'moment';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref('');
const reportRangeOptions = ref(defaultValue.reportRangeOptions)
const queryParams = ref<ReportRequest>(new ReportRequest())

const data = ref<ReportResponse>(new ReportResponse());


const fetchData = async () => {
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

const onInvoiceClick = (invoice: any) => {
  router.push({ name: 'export', query: { id: invoice.id } });
}
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
      <div class="page__content pa-0 px-2">
        <v-row no-gutters class="mt-2 px-4 py-2">
          <v-col cols="4">
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
          <v-col cols="4">
            <div class="d-flex flex-column align-end">
              <span style="color: blue;">Lãi</span>
              <small style="font-weight: bold;">{{ (data.totalProfit || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
            </div>
          </v-col>
        </v-row>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="item in data.items"
            :key="item.id"
            variant="accordion"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-center justify-space-between" style="margin-right: 5px; width: 100%;">
                <span style="color: green;">{{ moment(item.exportDate).format('DD/MM') }}</span>
                <small class="invoice-info">{{ (item.totalRevenue || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
                <small class="invoice-info">{{ (item.totalCapital || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
                <small class="invoice-info" style="font-weight: bold;">{{ (item.totalProfit || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div 
                v-for="detailItem in item.detail"
                :key="detailItem.id"
                class="d-flex mb-2 align-center justify-space-between py-2"
                style="margin: 0 -0.5rem;"
                @click="onInvoiceClick(detailItem)"  
              >
                <span style="color: black; min-width: 30%;">{{ detailItem.customerName }}</span>
                <small class="invoice-info">{{ (detailItem.totalRevenue || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
                <small class="invoice-info">{{ (detailItem.totalCapital || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
                <small class="invoice-info" style="font-weight: bold;">{{ (detailItem.totalProfit || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</small>
                <v-icon color="success">mdi-chevron-right</v-icon>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="page__footer">
        <v-pagination
          :length="data.totalPages"
          v-model="queryParams.pageNo"
          @update:model-value="fetchData"
          total-visible="5"
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

.invoice-info {
  min-width: 80px;
  text-align: end;
}

:deep(.v-expansion-panel-title) {
  padding: 15px 5px;
}
</style>

<script setup lang="ts">
import { BasePaginationResponse } from '@/models/BasePaginationReponse';
import { ExportListQueryParams } from '@/models/requests/exportRequestModels';
import { ExportResponse } from '@/models/responses/exportResponseModels';
import exportService from '@/services/exportService';
import { CommonColor, ExportStatus } from '@/shared/enums';
import moment from 'moment';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const emit = defineEmits<{
  (e: 'iconClick'): void;
  (e: 'editClick', item: ExportResponse): void;
}>();

const onCloseIconClick = () => {
  emit('iconClick');
};

const isLoading = ref(false);
const isError = ref(false);
const { smAndDown } = useDisplay();
const queryParams = ref<ExportListQueryParams>(new ExportListQueryParams());
const data = ref<BasePaginationResponse<ExportResponse>>(new BasePaginationResponse<ExportResponse>());
const isActionError = ref(false);
const errorMessage = ref('');

const onFilterChange = (status: ExportStatus) => {
  queryParams.value.pageNo = 1;
  queryParams.value.status = status;
  fetchData();
}

const computeColor = (item: ExportResponse) => {
  switch (item.status) {
    case ExportStatus.PENDING:
      return CommonColor.WARNING;
    case ExportStatus.PAID:
      return CommonColor.SUCCESS;
    default:
      return CommonColor.INFO;
  }
}

const onDeleteIconClick = async (item: ExportResponse) => {
  try {
    await exportService.cancelExport(item.id);
    await fetchData();
    isActionError.value = true;
    errorMessage.value = 'Hủy thành công';
  } catch (error) {
    isError.value = true;
    console.error("Error cancelling import:", error);
  }
};

const onEditIconClick = (item: ExportResponse) => {
  emit('editClick', item);
};

const onPaidIconClick = async (item: ExportResponse) => {
  try {
    await exportService.paidExport(item.id);
    await fetchData();
    isActionError.value = true;
    errorMessage.value = 'Thanh toán thành công';
  } catch (error) {
    isError.value = true;
    console.error("Error marking import as paid:", error);
  }
};

onMounted(async () => {
  await fetchData();
})

const fetchData = async () => {
  try {
    isLoading.value = true;
    data.value = await exportService.getExportList(queryParams.value);
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="page__container">
    <div class="page__header">
      <div class="d-flex align-center justify-space-between">
        <h2>Lịch sử bán hàng</h2>
        <v-icon color="primary" @click="onCloseIconClick">mdi-close</v-icon>
      </div>
      <v-row>
        <v-col :cols="smAndDown ? 12 : 4" class="px-2 py-0 mt-5">
          <v-text-field
            v-model="queryParams.searchText"
            label="Tìm kiếm"
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>
        <v-col :cols="smAndDown ? 12 : 4" class="d-flex align-center justify-center">
          <v-btn-group color="primary" density="compact" variant="tonal" rounded="xl">
            <v-btn @click="onFilterChange(ExportStatus.ALL)">All</v-btn>
            <v-btn @click="onFilterChange(ExportStatus.PENDING)">Pending</v-btn>
            <v-btn @click="onFilterChange(ExportStatus.PAID)">Paid</v-btn>
          </v-btn-group>
        </v-col>
      </v-row>
    </div>
    <div class="page__content">
      <v-expansion-panels>
        <v-expansion-panel
          v-for="item in data.items"
          :key="item.id"
          variant="accordion"
        >
          <v-expansion-panel-title>
            <v-row>
              <v-col cols="6">
                <div class="d-cols">
                  <h3 class="mb-2">{{ item.customerName }}</h3>
                  <h5 style="font-style: italic; color: #ccc;">{{ moment(item.exportDate).format('DD/MM/YYYY') }}</h5>
                </div>
              </v-col>
              <v-col cols="2" class="d-flex align-center justify-start">
                <v-chip :color="computeColor(item)">{{ item.totalProducts }}</v-chip>
              </v-col>
              <v-col cols="4" class="d-flex align-center justify-end">
                <h3>{{ item.totalAmount.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h3>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="i in item.detail" :key="i.id" class="mb-2">
              <v-row>
                <v-col cols="6">
                  <h4>{{ i.productName }}</h4>
                </v-col>
                <v-col cols="3" class="d-flex align-center justify-center">
                  <h4>{{ i.quantity }}</h4>
                </v-col>
                <v-col cols="3" class="d-flex align-center justify-end">
                  <h4>{{ (i.unitPrice * i.quantity).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h4>
                </v-col>
              </v-row>
            </div>
            <v-row dense v-if="item.status === ExportStatus.PENDING">
              <v-col cols="3">
                <v-btn color="error" @click="onDeleteIconClick(item)">Xóa</v-btn>
              </v-col>
              <v-spacer />
              <v-col cols="3">
                <v-btn color="secondary" @click="onEditIconClick(item)">Sửa</v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn color="primary" @click="onPaidIconClick(item)">Thanh toán</v-btn>
              </v-col>
            </v-row>
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
  </div>
</template>

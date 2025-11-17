<script setup lang="ts">
import { BasePaginationResponse } from '@/models/BasePaginationReponse';
import { ImportListQueryParams } from '@/models/requests/importRequestModels';
import { ImportResponse } from '@/models/responses/importResponseModels';
import importService from '@/services/importService';
import { ImportStatus } from '@/shared/enums';
import moment from 'moment';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const emit = defineEmits<{
  (e: 'iconClick'): void;
  (e: 'editClick', item: ImportResponse): void;
}>();

const isLoading = ref(false);
const isError = ref(false);
const { xs, sm } = useDisplay();
const isMobile = computed(() => xs.value || sm.value);
const queryParams = ref<ImportListQueryParams>(new ImportListQueryParams());
const data = ref<BasePaginationResponse<ImportResponse>>();
const isActionError = ref(false);
const errorMessage = ref('');
const onCloseIconClick = () => {
  emit('iconClick');
};

const onDeleteIconClick = async (item: ImportResponse) => {
  try {
    await importService.cancelImport(item.id);
    await fetchData();
    isActionError.value = true;
    errorMessage.value = 'Hủy thành công';
  } catch (error) {
    isError.value = true;
    console.error("Error cancelling import:", error);
  }
}

const onEditIconClick = (item: ImportResponse) => {
  emit('editClick', item);
}

const onPaidBtnClick = async (item: ImportResponse) => {
  try {
    await importService.paidImport(item.id);
    await fetchData();
    isActionError.value = true;
    errorMessage.value = 'Thanh toán thành công';
  } catch (error) {
    isError.value = true;
    console.error("Error marking import as paid:", error);
  }
}

const computeColor = (item: ImportResponse) => {
  switch (item.status) {
    case ImportStatus.PENDING:
      return 'warning';
    case ImportStatus.PAID:
      return 'success';
    default:
      return 'disabled';
  }
}

const onFilterChange = (status: ImportStatus) => {
  queryParams.value.pageNo = 1;
  queryParams.value.status = status;
  fetchData();
}

onBeforeMount(async () => {
  await fetchData();
}); 

const fetchData = async () => {
  try {
    isLoading.value = true;
    data.value = await importService.getImportList(queryParams.value);
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
        <h2>Lịch sử nhập hàng</h2>
        <v-icon color="primary" @click="onCloseIconClick">mdi-close</v-icon>
      </div>
      <v-text-field
        class="mt-2"
        v-model="queryParams.searchText"
        label="Tìm kiếm"
        prepend-inner-icon="mdi-magnify"
        clearable
        @update:model-value="fetchData"
      />
      <v-col :cols="isMobile ? 12 : 4" class="d-flex align-center justify-center px-0">
        <v-btn-group color="primary" density="compact" variant="tonal" rounded="xl">
          <v-btn @click="onFilterChange(ImportStatus.ALL)">All</v-btn>
          <v-btn @click="onFilterChange(ImportStatus.PENDING)">Pending</v-btn>
          <v-btn @click="onFilterChange(ImportStatus.PAID)">Paid</v-btn>
        </v-btn-group>
      </v-col>
    </div>
    <div class="page__content">
      <v-expansion-panels class="my-4">
          <v-expansion-panel
            v-for="importItem in data?.items"
            :key="importItem.id"
            variant="accordion"
          >
            <v-expansion-panel-title>
              <v-row>
                <v-col cols="6">
                  <div class="d-cols">
                    <h3 class="mb-2">{{ moment(importItem.importDate).format('DD/MM/YYYY') }} <v-chip :color="computeColor(importItem)">{{ importItem.totalProducts }}</v-chip></h3>
                  </div>
                </v-col>
                <v-spacer />
                <v-col cols="4" class="d-flex align-center justify-end">
                  <h3>{{ importItem.totalAmount.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h3>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-for="product in importItem.detail" :key="product.id" class="mb-2">
                <v-row>
                  <v-col cols="6">
                    <h4>{{ product.productName }}</h4>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center justify-center">
                    <h4>{{ product.quantity }}</h4>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center justify-end">
                    <h4>{{ (product.unitPrice * product.quantity).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h4>
                  </v-col>
                </v-row>
              </div>
              <v-row dense>
                <v-col cols="3" v-if="importItem.status === ImportStatus.PENDING">
                  <v-btn color="error" @click="onDeleteIconClick(importItem)">Xóa</v-btn>
                </v-col>
                <v-spacer />
                <v-col cols="3">
                  <v-btn color="secondary" @click="onEditIconClick(importItem)">Sửa</v-btn>
                </v-col>
                <v-col cols="4"  v-if="importItem.status === ImportStatus.PENDING">
                  <v-btn color="primary" @click="onPaidBtnClick(importItem)">Thanh toán</v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <div class="page__footer">
      <v-pagination
          v-model="queryParams.pageNo"
          :length="data?.totalPages"
          total-visible="5"
          color="primary"
          @update:model-value="fetchData"
        />
    </div>
  </div>
</template>

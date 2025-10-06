<script setup lang="ts">
import SearchBoxMock from '@/mocks/SearchBoxMock';
import { BaseQueryParams } from '@/models/QueryParams';
import { ImportDetailResponse, ImportResponse } from '@/models/responses/importResponseModels';
import { WarehouseItem } from '@/models/responses/warehouseResponseModels';
import importService from '@/services/importService';
import warehouseService from '@/services/warehouseService';
import { ImportStatus } from '@/shared/enums';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps<{
  importId: number;
}>();

const isLoading = ref(false);
const isError = ref(false);
const isActionError = ref(false);
const errorMessage = ref(''); 
const { xs, sm } = useDisplay();
const isMobile = computed(() => xs.value || sm.value);
const cols = computed(() => isMobile.value ? [12, 12] : [6, 6]);
const productRef = ref<WarehouseItem[]>([]);
const selectedProduct = ref()
const workingItem = ref<ImportResponse>(new ImportResponse());
const newProduct = ref<ImportDetailResponse>(new ImportDetailResponse());
const defaultFullScreenContentRef = ref();
const maxWidth = ref(1440);

watch(workingItem, (newVal) => {
  if (newVal) {
    newVal.totalProducts = newVal.detail.reduce((sum, item) => sum + item.quantity, 0);
    newVal.totalAmount = newVal.detail.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }
}, { deep: true });

const productProps = (item: any) => {
  return {
    title: item.name,
    subtitle: `Tồn: ${item.remain}`,
    value: item.id
  }
}

const emit = defineEmits(['iconClick']);

const onHistoryIconClick = () => {
  emit('iconClick');
};

const onProductSelect = (productId: number) => {
  const product = SearchBoxMock.products.find(p => p.id === productId);
  if (product && workingItem.value) {
    const existingItem = workingItem.value.detail.find(item => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      workingItem.value.detail.push({
        id: Math.floor(Math.random() * -1000), // Temporary negative ID for new items
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.unitPrice,
        sellPrice: 0
      });
    }
  }
  selectedProduct.value = null; // Clear selection after adding
};

const formatPrice = (value: number | string): string => {
  if (!value) return '';
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
  return numValue.toLocaleString('vi-VN');
};

const updateUnitPrice = (item: any, value: string, priceType: 'unitPrice' | 'sellPrice' = 'unitPrice') => {
  const numericValue = parseFloat(value.replace(/\./g, ''));
  if (!isNaN(numericValue)) {
    item[priceType] = numericValue;
  }
};

const onRemoveIconClick = (item: ImportDetailResponse) => {
  if (workingItem.value) {
    workingItem.value.detail = workingItem.value.detail.filter(i => i.id !== item.id);
  }
};
const onAddIconClick = () => {
  if (workingItem.value.detail.some(item => item.productName === newProduct.value.productName)) {
    isActionError.value = true;
    errorMessage.value = 'Sản phẩm đã được thêm. Vui lòng chỉnh sửa số lượng nếu cần.';
    return;
  }
  if (newProduct.value && workingItem.value) {
    if (newProduct.value.quantity > 0 && newProduct.value.unitPrice > 0 && newProduct.value.sellPrice > 0) {
      workingItem.value.detail.push({ ...newProduct.value });
      newProduct.value = new ImportDetailResponse();
    } else {
      isActionError.value = true;
      errorMessage.value = 'Vui lòng nhập đầy đủ thông tin sản phẩm trước khi thêm.';
    }
  }
};

const onCancelClick = () => {
  workingItem.value = new ImportResponse();
};

const onSaveClick = async () => {
  workingItem.value.status = ImportStatus.PENDING;
  await saveImport();
};

const onImportClick = async () => {
  workingItem.value.status = ImportStatus.PAID;
  await saveImport();
};

const saveImport = async () => {
  if (workingItem.value.detail.length === 0) {
    isActionError.value = true;
    errorMessage.value = 'Vui lòng chọn sản phẩm để nhập hàng.';
    return;
  }
  try {
    isLoading.value = true;
    if (workingItem.value.id > 0) {
      await importService.updateImport(workingItem.value);
    } else {
      await importService.createImport(workingItem.value);
      await fetchProducts();
      onCancelClick();
      isActionError.value = true;
      errorMessage.value = 'Lưu đơn nhập hàng thành công.';
    }
  } catch (error) {
    isActionError.value = true;
    errorMessage.value = 'Đã xảy ra lỗi khi lưu đơn nhập hàng.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (defaultFullScreenContentRef.value) {
    const orderCardWidth = defaultFullScreenContentRef.value.offsetWidth;
    maxWidth.value = orderCardWidth;
    newProduct.value.id = Math.floor(Math.random() * -1000);
  }
  if (props.importId && props.importId > 0) {
    await fetchImport(props.importId);
  } else {
    workingItem.value = new ImportResponse();
  }
  await fetchProducts();
});

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    var params = new BaseQueryParams();
    params.pageNo = -1;
    const result = await warehouseService.getWareHouseInfo(params);
    productRef.value = result.items;
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const fetchImport = async (importId: number) => {
  try {
    isLoading.value = true;
    const importData = await importService.getImportById(importId);
    workingItem.value = importData;
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="page__container">
    <div class="page__header">
      <div class="d-flex align-center justify-space-between">
        <h2>Nhập hàng</h2>
        <v-icon color="primary" @click="onHistoryIconClick">tabler-notes</v-icon>
      </div>
      <v-autocomplete 
        class="mt-2"
        v-model="selectedProduct"
        append-inner-icon="none"
        prepend-inner-icon="mdi-magnify"
        clearable
        label="Tìm sản phẩm"
        :items="productRef"
        item-value="id"
        item-title="title"
        :item-props="productProps"
        @update:modelValue="onProductSelect"
      />
    </div>
    <div class="page__content">
      <div v-for="item in workingItem?.detail" :key="item.id" class="mt-3">
        <v-row class="flex-wrap" dense>
          <v-col :cols="cols[0]" class="d-flex align-center justify-space-between">
            <h4>{{ item.productName }}</h4>
            <v-icon v-if="isMobile" color="error" @click="onRemoveIconClick(item)">mdi-close</v-icon>
          </v-col>
          <v-col :cols="cols[1]">
            <v-row dense>
              <v-col :cols="isMobile ? 5 : 4">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  class="highlight-input no-label text-bold"
                  :model-value="formatPrice(item.unitPrice)"
                  @update:model-value="(value: any) => updateUnitPrice(item, value)"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  class="no-label text-bold"
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                />
              </v-col>
              <v-col cols="4" class="d-flex align-center justify-end">
                <h4>{{ (item.quantity * item.unitPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</h4>
              </v-col>
              <v-col cols="1" v-if="!isMobile" class="d-flex align center justify-end">
                <v-icon color="error" @click="onRemoveIconClick(item)">mdi-close</v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="page__footer">
      <div class="mb-4">
        <v-row class="flex-wrap" dense>
          <v-col :cols="cols[0]" class="d-flex align-center justify-space-between">
            <v-text-field
              v-model="newProduct.productName"
              label="Tên sản phẩm"
              :style="{ 'max-inline-size': (isMobile) ? (maxWidth * 0.8) + 'px' : '100%' }"
            />
            <v-icon v-if="isMobile" color="primary" @click="onAddIconClick">mdi-plus</v-icon>
          </v-col>
          <v-col :cols="cols[1]">
            <v-row dense>
              <v-col :cols="isMobile ? 5 : 4">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  class="highlight-input no-label text-bold"
                  :model-value="formatPrice(newProduct.unitPrice)"
                  @update:model-value="(value: any) => updateUnitPrice(newProduct, value)"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  class="no-label text-bold"
                  v-model.number="newProduct.quantity"
                  type="number"
                />
              </v-col>
              <v-col cols="4" class="d-flex align-center justify-end">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  class="highlight-input no-label text-bold"
                  :model-value="formatPrice(newProduct.sellPrice!)"
                  @update:model-value="(value: any) => updateUnitPrice(newProduct, value, 'sellPrice')"
                />
              </v-col>
              <v-col cols="1" v-if="!xs && !sm" class="d-flex align center justify-end">
                <v-icon color="primary" @click="onAddIconClick">mdi-plus</v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col cols="9" class="d-flex align-center">
          <h4>Tổng tiền hàng:</h4> <v-chip color="success" class="ml-4">{{ workingItem?.totalProducts }}</v-chip>
        </v-col>
        <v-spacer />
        <v-col cols="3" class="d-flex align-center justify-end">
          <h4 style="color: blue;">{{ workingItem?.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</h4>
        </v-col>
      </v-row>
      <v-row class="px-2 pb-2">
        <v-btn color="error" @click="onCancelClick">Hủy</v-btn>
        <v-spacer />
        <v-btn class="mr-3" color="secondary" @click="onSaveClick">Lưu</v-btn>
        <v-btn color="primary" @click="onImportClick">Nhập kho</v-btn>
      </v-row>
    </div>
  </div>
</template>

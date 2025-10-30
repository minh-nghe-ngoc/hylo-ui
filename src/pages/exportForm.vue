<script setup lang="ts">
import CustomerMock from '@/mocks/CustomerMock';
import { BaseQueryParams } from '@/models/QueryParams';
import { ExportDetailResponse, ExportResponse } from '@/models/responses/exportResponseModels';
import { WarehouseItem } from '@/models/responses/warehouseResponseModels';
import customerService from '@/services/customerService';
import exportService from '@/services/exportService';
import warehouseService from '@/services/warehouseService';
import { ExportStatus } from '@/shared/enums';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const emit = defineEmits(['iconClick']);
const onHistoryIconClick = () => {
  emit('iconClick');
};

const props = defineProps({
  exportId: {
    type: Number,
    required: false
  }
});

const isLoading = ref(false);
const isActionError = ref(false);
const errorMessage = ref('');
const { smAndDown } = useDisplay();
const customerId = ref();
const customerDS = ref(CustomerMock.customerDS);
const cols = ref<number[]>(smAndDown.value ? [12, 12] : [6, 6]);
const selectedProduct = ref();
const productRef = ref<WarehouseItem[]>([]);
const workingItem = ref<ExportResponse>(new ExportResponse());

watch(smAndDown, (newVal) => {
  cols.value = newVal ? [12, 12] : [6, 6];
});

watch(workingItem, (newVal) => {
  if (newVal) {
    newVal.totalProducts = newVal.detail.reduce((sum, item) => sum + item.quantity, 0);
    newVal.totalAmount = newVal.detail.reduce((sum, item) => sum + item.quantity * item.sellPrice, 0);
  }
}, { deep: true });

const productProps = (item: any) => {
  return {
    title: item.name,
    subtitle: `Tồn: ${item.remain}`,
    value: item.id
  }
}

const onProductSelect = (productId: number) => {
  const product = productRef.value.find(p => p.id === productId);
  if (workingItem.value && product && !workingItem.value.detail.some(i => i.productId === product.id)) {
    var newItem = new ExportDetailResponse();
    newItem.productId = product.id;
    newItem.productName = product.name;
    newItem.quantity = 1;
    newItem.unitPrice = product.unitPrice;
    newItem.sellPrice = product.sellPrice;
    workingItem.value.detail.unshift(newItem);
    selectedProduct.value = null; // Clear selection after adding
  }
};

const onUpdateCustomerId = (value: any) => {
  if (typeof value === 'object') {
    workingItem.value.customerId = value.id;
    workingItem.value.customerName = value.name;
  } else {
    workingItem.value.customerId = null;
    workingItem.value.customerName = value;
  }
};

const onChangeQuantity = (item: any, value: string) => {
  const numericValue = parseInt(value);
  if (!isNaN(numericValue)) {
    item.quantity = numericValue;
    const remain = productRef.value.find(p => p.id === item.productId)?.remain || 0;
    item.isDirty = item.quantity > remain;
  } else {
    item.quantity = 0;
  }
};

const onClearIconClicked = (item: any) => {
  if (workingItem.value) {
    workingItem.value.detail = workingItem.value.detail.filter(i => i.id !== item.id);
  }
};

const onCancelClick = () => {
  workingItem.value = new ExportResponse();
  customerId.value = null;
};

const onSaveClick = async () => {
  workingItem.value.status = ExportStatus.PENDING;
  await saveExport();
}

const onPaidClick = async () => {
  if (workingItem.value.detail.some(i => i.isDirty)) {
    isActionError.value = true;
    errorMessage.value = 'Số lượng bán vượt quá tồn kho. Vui lòng kiểm tra lại.';
    return;
  }
  workingItem.value.status = ExportStatus.PAID;
  await saveExport();
}

const saveExport = async () => {
  if (isLoading.value) return; // Prevent multiple submissions
  if (workingItem.value.detail.length === 0) {
    isActionError.value = true;
    errorMessage.value = 'Vui lòng chọn sản phẩm để bán hàng.';
    return;
  }
  try {
    isLoading.value = true;
    if (workingItem.value.id > 0) {
      await exportService.updateExport(workingItem.value);
    } else {
      await exportService.createExport(workingItem.value);
      await fetchProducts();
      onCancelClick();
      isActionError.value = true;
      errorMessage.value = 'Lưu đơn bán hàng thành công.';
    }
    onCancelClick();
  } catch (error) {
    isActionError.value = true;
    errorMessage.value = 'Đã xảy ra lỗi khi lưu đơn bán hàng.';
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (value: number | string): string => {
  if (!value) return '';
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
  return numValue.toLocaleString('vi-VN');
};

const updateSellPrice = (item: any, value: string) => {
  const numericValue = parseFloat(value.replace(/\./g, ''));
  if (!isNaN(numericValue)) {
    item.sellPrice = numericValue;
  }
};

onMounted(async () => {
  await fetchCustomers();
  await fetchProducts();
  if (props.exportId) {
    await fetchExport(props.exportId);
  }
});

const fetchCustomers = async () => {
  try {
    isLoading.value = true;
    customerDS.value = await customerService.getCustomers(new BaseQueryParams());
  } catch (error) {
    isActionError.value = true;
    errorMessage.value = 'Đã xảy ra lỗi khi lấy danh sách khách hàng.';
    console.error('Error fetching customers:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    var params = new BaseQueryParams();
    params.pageNo = -1;
    const result = await warehouseService.getWareHouseInfo(params);
    productRef.value = result.items;
  } catch (error) {
    isActionError.value = true;
    errorMessage.value = 'Đã xảy ra lỗi khi lấy danh sách sản phẩm.';
  } finally {
    isLoading.value = false;
  }
};

const fetchExport = async (id: number) => {
  try {
    isLoading.value = true;
    workingItem.value = await exportService.getExportById(id);
    customerId.value = {
      id: workingItem.value.customerId,
      name: workingItem.value.customerName,
      isDeleted: false
    };
  } catch (error) {
    isActionError.value = true;
    errorMessage.value = 'Đã xảy ra lỗi khi lấy thông tin đơn bán hàng.';
    console.error('Error fetching export:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="page__container">
    <div class="page__header">
      <div class="d-flex align-center justify-space-between">
        <h2>Bán hàng</h2>
        <v-icon color="primary" @click="onHistoryIconClick">tabler-notes</v-icon>
      </div>
      <v-combobox
        class="mt-2"
        v-model="customerId"
        clearable
        :items="customerDS"
        item-title="name"
        item-value="id"
        label="Khách hàng"
        @update:modelValue="onUpdateCustomerId"
      />
      <v-autocomplete 
        class="mt-2"
        label="Tìm sản phẩm"
        v-model="selectedProduct"
        append-inner-icon="none"
        :items="productRef"
        item-value="id"
        item-title="title"
        :item-props="productProps"
        @update:modelValue="onProductSelect"
        prepend-inner-icon="mdi-magnify"
      />
    </div>
    <div class="page__content">
      <div class="mt-2" v-for="item in workingItem?.detail" :key="item.id">
        <v-row class="flex-wrap" dense>
          <v-col :cols="cols[0]" class="d-flex align-center justify-space-between">
            <h4>{{ item.productName }}</h4>
            <v-icon v-if="smAndDown" color="error" @click="onClearIconClicked(item)">mdi-close</v-icon>
          </v-col>
          <v-col :cols="cols[1]">
            <v-row dense>
              <v-col cols="5">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  class="highlight-input no-label text-bold"
                  :model-value="formatPrice(item.sellPrice)"
                  @update:model-value="(value: any) => updateSellPrice(item, value)"
                />
              </v-col>
              <v-col cols="4" offset="1">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  class="no-label text-bold"
                  :class="item.isDirty ? 'dirty' : ''"
                  v-model.number="item.quantity"
                  type="number"
                  @update:model-value="onChangeQuantity(item, $event)"
                />
              </v-col>
              <v-col cols="1" v-if="!smAndDown" class="d-flex align center justify-end">
                <v-icon color="error" @click="onClearIconClicked(item)">mdi-close</v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="page__footer">
      <v-row>
        <v-col cols="9" class="d-flex align-center">
          <h4>Tổng tiền hàng:</h4> <v-chip color="success" class="ml-4">{{ workingItem.totalProducts }}</v-chip>
        </v-col>
        <v-spacer />
        <v-col cols="3" class="d-flex align-center justify-end">
          <h4 style="color: blue;">{{ workingItem?.totalAmount.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h4>
        </v-col>
      </v-row>
      <v-row class="px-2 pb-2">
        <v-btn color="error" @click="onCancelClick">Hủy</v-btn>
        <v-spacer />
        <v-btn class="mr-3" color="secondary" @click="onSaveClick">Lưu</v-btn>
        <v-btn color="primary" @click="onPaidClick">Thanh Toán</v-btn>
      </v-row>
    </div>
  </div>
  <v-snackbar
    v-model="isActionError"
  >
    {{ errorMessage }}

    <template v-slot:actions>
      <v-icon @click="isActionError = false" color="error" timeout="2000">mdi-close</v-icon>
    </template>
  </v-snackbar>
</template>
<style lang="scss" scoped>
.dirty {
  color: red;
}
</style>

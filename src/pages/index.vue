<script setup lang="ts">
import { BaseQueryParams } from '@/models/QueryParams';
import { WarehouseItem, WareHouseResponse } from '@/models/responses/warehouseResponseModels';
import warehouseService from '@/services/warehouseService';
import { SortBy } from '@/shared/enums';
import { onMounted, ref } from 'vue';

const isLoading = ref(false);
const isError = ref(false);
const data = ref<WareHouseResponse>(new WareHouseResponse());
const queryParams = ref<BaseQueryParams>(new BaseQueryParams().addSort(SortBy.REMAINING_PRICE, false));
const menuItems = ref([
  {
    icon: 'mdi-pencil',
    action: (product: WarehouseItem) => onEditIconClick(product)
  },
  {
    icon: 'mdi-delete',
    action: (product: WarehouseItem) => onDeleteIconClick(product)
  }
]);

const onEditIconClick = (product: WarehouseItem) => {
  product.isEditing = true;
};

const onDeleteIconClick = async (product: WarehouseItem) => {
  try {
    await warehouseService.deleteProduct(product.id);  
    await fetchData();
  } catch (error) {
    isError.value = true;
    console.error('Error deleting product:', error);
  }
};

const onSaveIconClick = async (product: any) => {
  if (isLoading.value) return; // Prevent multiple submissions
  try {
    isLoading.value = true;
    await warehouseService.updateProduct(product.id, product);
    await fetchData();
  } catch (error) {
    isError.value = true;
    console.error('Error saving product:', error);
  } finally {
    isLoading.value = false;
  }
};

const onSortByRemainClick = (sortBy: SortBy) => {
  const index = queryParams.value.sorts?.findIndex(s => s.field === sortBy) ?? -1;
  if (index !== -1) {
    if (queryParams.value.sorts![index].isAscending) {
      queryParams.value.sorts![index].isAscending = false;
    } else {
      queryParams.value.sorts?.splice(index, 1);
    }
  } else {
    queryParams.value.sorts?.push({ field: sortBy, isAscending: true });
  }
  fetchData();
}

const onPageChange = () => {
  fetchData();
};

const fetchData = async () => {
  try {
    data.value = await warehouseService.getWareHouseInfo(queryParams.value);
  } catch (error) {
    isError.value = true;
    console.error('Error fetching warehouse data:', error);
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    await fetchData();
  } catch (error) {
    isError.value = true;
    console.error('Error during component mount:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="page__container no-btn-group">
    <div class="page__header">
      <div class="d-flex justify-space-between align-center">
        <h3>Kho <v-chip color="success">{{ data?.remain }}</v-chip></h3>
        <h3 style="color: blue;">{{ data?.totalAmount.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h3>
      </div>
      <v-text-field 
        class="my-2"
        v-model="queryParams.searchText"
        label="Tìm kiếm"
        prepend-inner-icon="mdi-magnify"
        @update:modelValue="fetchData"
      />
      <div class="d-flex justify-space-between align-center">
        <v-btn 
          width="120" 
          :append-icon="queryParams.sorts && queryParams.sorts.some(s => s.field === SortBy.REMAINING_QUANTITY) ? queryParams.sorts.find(s => s.field === SortBy.REMAINING_QUANTITY)?.isAscending ? 'mdi-arrow-up' : 'mdi-arrow-down' : 'mdi-minus'"
          @click="onSortByRemainClick(SortBy.REMAINING_QUANTITY)"
          text="SL tồn"
        />
        <v-btn 
          width="120" 
          :append-icon="queryParams.sorts && queryParams.sorts.some(s => s.field === SortBy.REMAINING_PRICE) ? queryParams.sorts.find(s => s.field === SortBy.REMAINING_PRICE)?.isAscending ? 'mdi-arrow-up' : 'mdi-arrow-down' : 'mdi-minus'"
          @click="onSortByRemainClick(SortBy.REMAINING_PRICE)"
          text="Giá trị"
        />
      </div>
    </div>
    <div class="page__content">
      <template v-for="product in data.items" :key="product.id" >
        <div class="my-4 d-flex justify-space-between align-center">
          <h4 v-if="!product.isEditing">{{ product.name }} <v-chip color="success">{{ product.remain }}</v-chip></h4>
          <v-text-field 
            v-else 
            v-model="product.name" 
            type="text" 
            label="Tên sản phẩm" 
            style="max-width: 200px;"
          />
          <div class="d-flex align-center">
            <h4 style="color: blue;">{{ product.totalAmount.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h4>
            <v-menu v-if="!product.isEditing">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, i) in menuItems"
                  :key="i"
                  :value="i"
                >
                  <v-list-item-title @click="item.action(product)">
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-icon class="ml-2" v-else color="primary" @click="onSaveIconClick(product)">mdi-tick</v-icon>
          </div>
        </div>
        <div v-if="product.isEditing">
          <v-row dense no-gutters>
            <v-col :cols="5" class="pr-2">
              <v-text-field 
                v-model.number="product.sellPrice" 
                type="number" 
                label="Giá bán" 
                min="0"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field 
                v-model.number="product.remain" 
                type="number" 
                label="SL" 
                min="0"
              />
            </v-col>
            <v-col :cols="5" class="pl-2">
              <v-text-field 
                v-model.number="product.unitPrice" 
                type="number" 
                label="Giá nhập" 
                min="0"
              />
            </v-col>
          </v-row>
        </div>
      </template>
    </div>
    <div class="page__footer">
      <v-pagination
        v-model="queryParams.pageNo"
        :length="data.totalPages"
        total-visible="4"
        color="primary"
        @update:modelValue="onPageChange"
      />
    </div>
  </div>
</template>

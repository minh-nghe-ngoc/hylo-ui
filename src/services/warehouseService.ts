import { BaseQueryParams } from "@/models/QueryParams";
import { WarehouseItem, WareHouseResponse } from "@/models/responses/warehouseResponseModels";
import axiosIns from "@/plugins/axios";

const getWareHouseInfo = async (params: BaseQueryParams): Promise<WareHouseResponse> => {
  try {
    const response = await axiosIns.post("/warehouse/GetWareHouseInfo", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse info:", error);
    throw error;
  }
};

const updateProduct = async (id: string | number, data: Partial<WarehouseItem>): Promise<void> => {
  try {
    await axiosIns.put(`/warehouse`, data);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (id: string | number): Promise<void> => {
  try {
    await axiosIns.delete(`/warehouse/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export default {
  getWareHouseInfo,
  updateProduct,
  deleteProduct,
};

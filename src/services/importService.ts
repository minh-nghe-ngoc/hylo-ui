import { BasePaginationResponse } from "@/models/BasePaginationReponse";
import { ImportListQueryParams } from "@/models/requests/importRequestModels";
import { ImportResponse } from "@/models/responses/importResponseModels";
import axiosIns from "@/plugins/axios";

const controller = 'import'

const getImportList = async (params: ImportListQueryParams): Promise<BasePaginationResponse<ImportResponse>> => {
  try {
    const response = await axiosIns.get(controller, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching import list:", error);
    throw error;
  }
}

const getImportById = async (id: number): Promise<ImportResponse> => {
  try {
    const response = await axiosIns.get(`${controller}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching import by ID:", error);
    throw error;
  }
}

const createImport = async (importData: ImportResponse): Promise<ImportResponse> => {
  try {
    const response = await axiosIns.post(`${controller}`, importData);
    return response.data;
  } catch (error) {
    console.error("Error creating import:", error);
    throw error;
  }
}

const updateImport = async (importData: ImportResponse): Promise<ImportResponse> => {
  try {
    const response = await axiosIns.put(`${controller}`, importData);
    return response.data;
  } catch (error) {
    console.error("Error updating import:", error);
    throw error;
  }
}

const paidImport = async (id: number): Promise<void> => {
  try {
    await axiosIns.patch(`${controller}/${id}`);
  } catch (error) {
    console.error("Error marking import as paid:", error);
    throw error;
  }
}

const cancelImport = async (id: number): Promise<void> => {
  try {
    await axiosIns.delete(`${controller}/${id}`);
  } catch (error) {
    console.error("Error cancelling import:", error);
    throw error;
  }
}

export default {
  getImportList,
  getImportById,
  createImport,
  updateImport,
  paidImport,
  cancelImport,
};

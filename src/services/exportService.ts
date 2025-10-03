import { BasePaginationResponse } from "@/models/BasePaginationReponse";
import { ExportListQueryParams } from "@/models/requests/exportRequestModels";
import { ExportResponse } from "@/models/responses/exportResponseModels";
import axiosIns from "@/plugins/axios";

const controller = 'export';
const getExportList = async (params: ExportListQueryParams): Promise<BasePaginationResponse<ExportResponse>> => {
  try {
    const response = await axiosIns.get(controller, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching export list:", error);
    throw error;
  }
}

const getExportById = async (id: number): Promise<ExportResponse> => {
  try {
    const response = await axiosIns.get(`${controller}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching export by ID:", error);
    throw error;
  }
}

const createExport = async (exportData: ExportResponse): Promise<ExportResponse> => {
  try {
    const response = await axiosIns.post(`${controller}`, exportData);
    return response.data;
  } catch (error) {
    console.error("Error creating export:", error);
    throw error;
  }
}

const updateExport = async (exportData: ExportResponse): Promise<ExportResponse> => {
  try {
    const response = await axiosIns.put(`${controller}`, exportData);
    return response.data;
  } catch (error) {
    console.error("Error updating export:", error);
    throw error;
  }
}

const paidExport = async (id: number): Promise<void> => {
  try {
    await axiosIns.patch(`${controller}/${id}`);
  } catch (error) {
    console.error("Error marking import as paid:", error);
    throw error;
  }
}

const cancelExport = async (id: number): Promise<void> => {
  try {
    await axiosIns.delete(`${controller}/${id}`);
  } catch (error) {
    console.error("Error cancelling import:", error);
    throw error;
  }
}

export default {
  getExportList,
  getExportById,
  createExport,
  updateExport,
  paidExport,
  cancelExport,
};

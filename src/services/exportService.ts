import { BasePaginationResponse } from "@/models/BasePaginationReponse";
import { ExportListQueryParams } from "@/models/requests/exportRequestModels";
import { ExportResponse } from "@/models/responses/exportResponseModels";
import axiosIns from "@/plugins/axios";
  
const API_PREFIX = '/api/export';
const getExportList = async (params: ExportListQueryParams): Promise<BasePaginationResponse<ExportResponse>> => {
  try {
    const response = await axiosIns.get(API_PREFIX, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching export list:", error);
    throw error;
  }
}

const getExportById = async (id: number): Promise<ExportResponse> => {
  try {
    const response = await axiosIns.get(`${API_PREFIX}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching export by ID:", error);
    throw error;
  }
}

const createExport = async (exportData: ExportResponse): Promise<ExportResponse> => {
  try {
    const response = await axiosIns.post(`${API_PREFIX}`, exportData);
    return response.data;
  } catch (error) {
    console.error("Error creating export:", error);
    throw error;
  }
}

const updateExport = async (exportData: ExportResponse): Promise<ExportResponse> => {
  try {
    const response = await axiosIns.put(`${API_PREFIX}`, exportData);
    return response.data;
  } catch (error) {
    console.error("Error updating export:", error);
    throw error;
  }
}

const paidExport = async (id: number): Promise<void> => {
  try {
    await axiosIns.patch(`${API_PREFIX}/${id}`);
  } catch (error) {
    console.error("Error marking import as paid:", error);
    throw error;
  }
}

const cancelExport = async (id: number): Promise<void> => {
  try {
    await axiosIns.delete(`${API_PREFIX}/${id}`);
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

import { BaseQueryParams } from "@/models/QueryParams";
import { LookUp } from "@/models/shared/LookUp";
import axiosIns from "@/plugins/axios";
const API_PREFIX = "/api/supplier";
  
const getSuppliers = async (params?: BaseQueryParams): Promise<LookUp[]> => {
  try {
    var response = await axiosIns.get(API_PREFIX, { params });
    return response.data as LookUp[];
  } catch (error) {
    console.error('Error in getSuppliers:', error);
    throw error;
  }
};

export default {
  getSuppliers,
}

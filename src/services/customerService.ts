import { BaseQueryParams } from "@/models/QueryParams";
import { LookUp } from "@/models/shared/LookUp";
import axiosIns from "@/plugins/axios";
const API_PREFIX = '/api/customer';
const getCustomers = async (params?: BaseQueryParams, refresh: boolean = false): Promise<LookUp[]> => {
  try {
    var response = await axiosIns.get(API_PREFIX, { params });
    return response.data as LookUp[];
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error;
  }
};

export default {
  getCustomers,
}

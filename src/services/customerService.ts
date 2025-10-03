import { BaseQueryParams } from "@/models/QueryParams";
import { LookUp } from "@/models/shared/LookUp";
import axiosIns from "@/plugins/axios";
const baseUrl = "/customer";

const getCustomers = async (params?: BaseQueryParams, refresh: boolean = false): Promise<LookUp[]> => {
  try {
    var response = await axiosIns.get(baseUrl, { params });
    return response.data as LookUp[];
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error;
  }
};

export default {
  getCustomers,
}

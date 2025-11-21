import { ReportRequest } from "@/models/requests/reportRequestModel";
import { ReportResponse } from "@/models/responses/reportResponseModel";
import axiosIns from "@/plugins/axios";

const API_PREFIX = '/api/report';
const getReport = async (params: ReportRequest): Promise<ReportResponse> => {
  const res = await axiosIns.get(API_PREFIX, { params });
  return res.data;
};

export default {
  getReport
}

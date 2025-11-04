import { ReportRequest } from "@/models/requests/reportRequestModel";
import { ReportResponse } from "@/models/responses/reportResponseModel";
import axiosIns from "@/plugins/axios";

const baseUrl = "/report";

const getReport = async (params: ReportRequest): Promise<ReportResponse> => {
  const res = await axiosIns.get(baseUrl, { params });
  console.log('ReportService - getReport - res:', res);
  return res.data;
};

export default {
  getReport
}

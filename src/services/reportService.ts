import { ReportRequest } from "@/models/requests/reportRequestModel";
import { ReportResponse } from "@/models/responses/reportResponseModel";
import axiosIns from "@/plugins/axios";

const baseUrl = "/report";

export const getReport = async (params: ReportRequest): Promise<ReportResponse> => {
  const res = await axiosIns.get(baseUrl, { params });
  return res.data;
};

export default {
  getReport
}

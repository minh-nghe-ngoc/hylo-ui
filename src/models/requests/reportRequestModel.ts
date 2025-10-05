import { ReportRange } from "@/shared/enums";
import { BaseQueryParams } from "../QueryParams";

export class ReportRequest extends BaseQueryParams {
  range: ReportRange = ReportRange.TODAY;
  fromDate: Date = new Date();
  toDate: Date = new Date();

  constructor(init?: Partial<ReportRequest>) {
    super(init);
    Object.assign(this, init);
  }
}

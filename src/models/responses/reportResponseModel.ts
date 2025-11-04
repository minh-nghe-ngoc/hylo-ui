import { BasePaginationResponse } from "../BasePaginationReponse";

export class ReportItem {
  id: number = 0;
  exportDate: Date = new Date();
  totalRevenue: number = 0;
  totalCapital: number = 0;
  totalProfit: number = 0;
  customerName: string = "";
  detail: ReportItem[] = [];

  constructor(init?: Partial<ReportItem>) {
    Object.assign(this, init);
  }
}

export class ReportResponse extends BasePaginationResponse<ReportItem> {
  totalRevenue: number = 0;
  totalCapital: number = 0;
  totalProfit: number = 0;

  constructor(init?: Partial<ReportResponse>) {
    super(init);
    Object.assign(this, init);
  }
}

import { ExportStatus } from "@/shared/enums";

export class ExportResponse {
  id: number = 0;
  exportDate: Date = new Date();
  totalProducts: number = 0;
  totalAmount: number = 0;
  customerId?: number | null = null;
  customerName: string = '';
  status: ExportStatus = ExportStatus.PENDING;
  detail: ExportDetailResponse[] = [];
  
  constructor(init?: Partial<ExportResponse>) {
    Object.assign(this, init);
  }
}

export class ExportDetailResponse {
  id: number = 0;
  productId: number = 0;
  productName: string = '';
  quantity: number = 0;
  unitPrice: number = 0;
  sellPrice: number = 0;

  constructor(init?: Partial<ExportDetailResponse>) {
    Object.assign(this, init);
  }
}

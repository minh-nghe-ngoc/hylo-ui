import { HistoryType } from '@/shared/enums';
import { BasePaginationResponse } from '../BasePaginationReponse';

export class ProductHistoryResponse extends BasePaginationResponse<ProductHistoryDetail> {
  productId: number = 0;
  productName: string = '';
  productRemain: number = 0;

  constructor(data?: Partial<ProductHistoryResponse>) {
    super();
    if (data) {
      Object.assign(this, data);
      if (data.items && Array.isArray(data.items)) {
        this.items = data.items.map(item => new ProductHistoryDetail(item));
      }
    }
  }
}

export class ProductHistoryDetail {
  remain: number = 0;
  quantityChange: number = 0;
  sellPrice: number = 0;
  unitPrice: number = 0;
  historyType: HistoryType = HistoryType.IMPORT;
  updatedAt: Date = new Date();
  referenceId: number = 0;
  referenceName: string = '';

  constructor(data?: Partial<ProductHistoryDetail>) {
    if (data) {
      Object.assign(this, data);
      if (data.updatedAt) {
        this.updatedAt = new Date(data.updatedAt);
      }
    }
  }
}

// Deprecated: Use ProductHistoryResponse instead
export class ProductHistoryModel extends ProductHistoryResponse {
  constructor(data?: Partial<ProductHistoryModel>) {
    super(data);
  }
}

// Deprecated: Use ProductHistoryDetail instead
export class HistoryModel extends ProductHistoryDetail {
  constructor(data?: Partial<HistoryModel>) {
    super(data);
  }
}

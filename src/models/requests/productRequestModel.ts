import { BaseQueryParams } from "../QueryParams";

export class ProductHistoryRequest extends BaseQueryParams {
  id: number = 0;

  constructor(data?: Partial<ProductHistoryRequest>) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}


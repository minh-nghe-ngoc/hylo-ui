import { BasePaginationResponse } from "../BasePaginationReponse";

export class WareHouseResponse extends BasePaginationResponse<WarehouseItem> {
  remain: number = 0;
  totalAmount: number = 0;

  constructor(init?: Partial<WareHouseResponse>) {
    super(init);
    Object.assign(this, init);
  }
}

export class WarehouseItem {
  id: number = 0;
  name: string = '';
  remain: number = 0;
  totalAmount: number = 0;
  sellPrice: number = 0;
  unitPrice: number = 0;
  isEditing?: boolean = false;

  constructor(init?: Partial<WarehouseItem>) {
    Object.assign(this, init);
  }
}

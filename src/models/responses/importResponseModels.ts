import { ImportStatus } from "@/shared/enums";

export class ImportResponse {
  id: number = 0;
  totalProducts: number = 0;
  totalAmount: number = 0;
  importDate: Date = new Date();
  status: ImportStatus = ImportStatus.PENDING;
  detail: ImportDetailResponse[] = [];

  constructor(init?: Partial<ImportResponse>) {
    Object.assign(this, init);
  }
}

export class ImportDetailResponse {
  id: number = 0;
  productId: number = 0;
  productName: string = "";
  quantity: number = 0;
  unitPrice: number = 0;
  sellPrice: number = 0;
  
  constructor(init?: Partial<ImportDetailResponse>) {
    Object.assign(this, init);
    this.id = init?.id ?? parseInt(Math.random().toString()) * -1000; // Assign a random id if not provided
  }
}

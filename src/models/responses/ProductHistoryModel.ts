export class ProductHistoryModel {
  id: number = 0;
  name: string = '';
  unitPrice: number = 0;
  sellPrice: number = 0;
  remain: number = 0;
  histories: HistoryModel[] = [];

  constructor(data?: Partial<ProductHistoryModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class HistoryModel {
  id: number = 0;
  isExport: boolean = false;
  quantity: number = 0
  date: Date = new Date();
  name: string = '';
  unitPrice: number = 0;
  remain: number = 0;

  constructor(data?: Partial<HistoryModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

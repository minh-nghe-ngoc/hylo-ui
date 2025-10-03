export class BasePaginationResponse<T> {
  pageNo: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;
  totalPages: number = 1;
  items: T[] = [];

  constructor(init?: Partial<BasePaginationResponse<T>>) {
    Object.assign(this, init);
  }
}

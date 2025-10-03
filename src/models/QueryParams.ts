import { SortBy } from "@/shared/enums";

export interface IBaseQueryParams {
  pageNo?: number;
  pageSize?: number;
  searchText?: string;
  sorts?: ISortParam[];
}

export interface ISortParam {
  field: SortBy;
  isAscending: boolean;
}

export class BaseQueryParams implements IBaseQueryParams {
  pageNo?: number;
  pageSize?: number = 20;
  searchText?: string = '';
  sorts?: ISortParam[] = [];

  constructor(init?: Partial<BaseQueryParams>) {
    Object.assign(this, init);
  }

  addSort(field: SortBy, isAscending: boolean = true): BaseQueryParams {
    if (!this.sorts) {
      this.sorts = [];
    }
    const existingSort = this.sorts.find(s => s.field === field);
    if (existingSort) {
      existingSort.isAscending = isAscending;
    } else {
      this.sorts.push(new SortParam({ field, isAscending }));
    }
    return this;
  }
}

export class SortParam {
  field: SortBy = SortBy.REMAINING_QUANTITY;
  isAscending: boolean = true;

  constructor(init?: Partial<SortParam>) {
    Object.assign(this, init);
  }
}

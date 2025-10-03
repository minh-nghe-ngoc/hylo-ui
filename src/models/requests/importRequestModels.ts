import { ImportStatus } from "@/shared/enums";
import { BaseQueryParams } from "../QueryParams";

export class ImportListQueryParams extends BaseQueryParams {
  status?: ImportStatus = ImportStatus.ALL;

  constructor(init?: Partial<ImportListQueryParams>) {
    super(init);
    Object.assign(this, init);
  }
}

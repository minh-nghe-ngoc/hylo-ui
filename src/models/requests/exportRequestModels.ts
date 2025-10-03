import { ExportStatus } from "@/shared/enums";
import { BaseQueryParams } from "../QueryParams";

export class ExportListQueryParams extends BaseQueryParams {
  status?: ExportStatus = ExportStatus.ALL;

  constructor(init?: Partial<ExportListQueryParams>) {
    super(init);
    Object.assign(this, init);
  }
}

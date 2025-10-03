export enum ImportStatus {
  ALL = -1,
  PENDING = 0,
  PAID = 1
}

export enum ExportStatus {
  ALL = -1,
  PENDING = 0,
  PAID = 1
}

export enum CommonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info'
}

export enum SortBy {
  REMAINING_QUANTITY = 0,
  REMAINING_PRICE = 1,
}

export enum SortDirection { 
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none'
}

export enum ReportRange {
  TODAY = 0,
  LAST_7_DAYS = 1,
  LAST_30_DAYS = 2,
  THIS_WEEK = 3,
  THIS_MONTH = 4,
  THIS_YEAR = 5,
  CUSTOM = 6
}

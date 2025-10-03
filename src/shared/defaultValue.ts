import { ReportRange } from "./enums";

const reportRangeOptions = [
  { label: 'Hôm nay', value: ReportRange.TODAY },
  { label: '7 ngày qua', value: ReportRange.LAST_7_DAYS },
  { label: '30 ngày qua', value: ReportRange.LAST_30_DAYS },
  { label: 'Tuần này', value: ReportRange.THIS_WEEK },
  { label: 'Tháng này', value: ReportRange.THIS_MONTH },
  { label: 'Năm này', value: ReportRange.THIS_YEAR },
  { label: 'Tùy chọn', value: ReportRange.CUSTOM },
];

export default {
  reportRangeOptions,
}

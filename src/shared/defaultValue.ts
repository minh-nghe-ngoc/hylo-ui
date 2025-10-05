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

const reportTableHeaders = [
  {
    title: '',
    key: 'exportDate',
    fixed: true,
  },
  {
    title: 'Doanh số',
    key: 'totalRevenue',
    align: 'end',
    fixed: true,
  },
  {
    title: 'Vốn',
    key: 'totalCapital',
    align: 'end',
    fixed: true,
  },
  {
    title: 'Lãi',
    key: 'totalProfit',
    align: 'end',
    fixed: true,
  }
]

export default {
  reportRangeOptions,
  reportTableHeaders
}

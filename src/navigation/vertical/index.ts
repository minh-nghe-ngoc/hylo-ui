import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Bán hàng',
    to: { name: 'export' },
    icon: { icon: 'tabler-file-export' },
  },
  {
    title: 'Nhập hàng',
    to: { name: 'import' },
    icon: { icon: 'tabler-file-import' },
  },
  {
    title: 'Báo cáo',
    icon: { icon: 'tabler-report' },
    to: { name: 'report' }
  }
] as VerticalNavItems

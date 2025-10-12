import type { VerticalNavItems } from '@/@layouts/types'
import { size } from '@floating-ui/dom'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Nghiệp vụ',
    icon: { icon: 'tabler-file' },
    children: [
      {
        title: 'Bán hàng',
        to: { name: 'export' },
        icon: { icon: 'tabler-file-export', size: 20},
      },
      {
        title: 'Nhập hàng',
        to: { name: 'import' },
        icon: { icon: 'tabler-file-import' , size: 20},
      }
    ],
  },
  {
    title: 'Báo cáo',
    icon: { icon: 'tabler-report' },
    to: { name: 'report' }
  }
] as VerticalNavItems

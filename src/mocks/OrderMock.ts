import { IOrder } from "@/interfaces/IOrder";

const order = {
  id: 0,
  customerId: 1,
  orderDate: new Date(),
  status: 0,
  totalAmount: 100000,
  items: [
    {
      id: 0,
      orderId: 0,
      productId: 1,
      productName: 'Sản phẩm A',
      quantity: 1,
      unitPrice: 100000
    }, {
      id: 1,
      orderId: 0,
      productId: 2,
      productName: 'Sản phẩm B',
      quantity: 2,
      unitPrice: 200000
    }, {
      id: 2,
      orderId: 0,
      productId: 3,
      productName: 'Sản phẩm C',
      quantity: 3,
      unitPrice: 300000
    }, {
      id: 3,
      orderId: 0,
      productId: 4,
      productName: 'Sản phẩm D',
      quantity: 4,
      unitPrice: 400000
    }, {
      id: 4,
      orderId: 0,
      productId: 5,
      productName: 'Sản phẩm E',
      quantity: 5,
      unitPrice: 500000
    }, {
      id: 5,
      orderId: 0,
      productId: 6,
      productName: 'Sản phẩm F',
      quantity: 6,
      unitPrice: 600000
    }
  ]
} as IOrder;

const historyMock = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    createdAt: '2024-01-01',
    totalAmount: 100000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    createdAt: '2024-01-02',
    totalAmount: 200000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  }, {
    id: 1,
    customerName: 'Nguyễn Văn A',
    createdAt: '2024-01-01',
    totalAmount: 100000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    createdAt: '2024-01-02',
    totalAmount: 200000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  }, {
    id: 1,
    customerName: 'Nguyễn Văn A',
    createdAt: '2024-01-01',
    totalAmount: 100000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    createdAt: '2024-01-02',
    totalAmount: 200000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  }, {
    id: 1,
    customerName: 'Nguyễn Văn A',
    createdAt: '2024-01-01',
    totalAmount: 100000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    createdAt: '2024-01-02',
    totalAmount: 200000,
    status: 1,
    items: [
      {
        id: 1,
        productName: 'Sản phẩm A',
        quantity: 1,
        unitPrice: 100000
      }, {
        id: 2,
        productName: 'Sản phẩm B',
        quantity: 2,
        unitPrice: 200000
      }
    ]
  }
]

const OrderMock = {
  order,
  history: historyMock
}

export default OrderMock

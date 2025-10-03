import { IImport } from "@/interfaces/IImport";

const importMock: IImport = {
  id: 1,
  date: new Date(),
  totalAmount: 0,
  items: [
    {
      id: 1,
      importId: 1,
      productId: 1,
      productName: 'Sản phẩm A',
      quantity: 10,
      unitPrice: 100000
    },
    {
      id: 2,
      importId: 1,
      productId: 2,
      productName: 'Sản phẩm A',
      quantity: 10,
      unitPrice: 100000
    },
    {
      id: 3,
      importId: 1,
      productId: 3,
      productName: 'Sản phẩm A',
      quantity: 10,
      unitPrice: 100000
    },
    {
      id: 4,
      importId: 1,
      productId: 4,
      productName: 'Sản phẩm A',
      quantity: 10,
      unitPrice: 100000
    },
    {
      id: 5,
      importId: 1,
      productId: 5,
      productName: 'Sản phẩm A',
      quantity: 10,
      unitPrice: 100000
    },
    {
      id: 6,
      importId: 1,
      productId: 6,
      productName: 'Sản phẩm A',
      quantity: 10,
      unitPrice: 100000
    },
  ]
};

export default {
  importMock
};

type Product = {
  name: string;
  price: number;
  stock: number;
};

/** 기본 재고 */
const defaultProduct: Product[] = [
  {
    name: '콜라',
    price: 1100,
    stock: 10,
  },
  {
    name: '물',
    price: 600,
    stock: 10,
  },
  {
    name: '커피',
    price: 700,
    stock: 10,
  },
];

class VendingMachine {
  money: number;
  cardPayment: boolean = false;
  product: Product[] = [];
  constructor(determinedProducts?: Product[]) {
    this.money = 0;
    this.cardPayment = false;
    this.product = determinedProducts ?? defaultProduct;
  }
}

// *
// * 이하는 로그 입니다.
// *

import { messages } from './message';
import { beverageCheck, makeLogAndReturn, moneyCheck, stockCheck } from './util';

type ProductName = '콜라' | '물' | '커피';
interface Options {
  /** 카드가 정상인지 여부 */
  cardPaymentSuccess?: boolean;
  /** 자판기 이용가능 여부 */
  useAble?: boolean;
}

export type Product = {
  name: ProductName;
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
/** 기본 자판기 상태 */
const defaultOptions: Options = {
  cardPaymentSuccess: true,
  useAble: true,
};

class VendingMachine {
  /** 투입한 금액 */
  money: number;
  /** 카드 사용 유무 */
  useCardPayment: boolean = false;
  /** 상품 리스트 */
  products: Product[] = [];

  options: Options;

  constructor(args?: { products?: Product[]; options?: Options }) {
    this.money = 0;
    this.useCardPayment = false;
    this.products = args?.products ?? defaultProduct.map((product) => ({ ...product }));
    this.options = args?.options ?? { ...defaultOptions };
    console.log('------------- 자판기 초기화 -------------');
  }

  /**
   * @param amount 'card' 혹은 금액(number)을 입력받습니다.
   */
  addPayment(amount: number | 'card') {
    try {
      if (!this.options.useAble) {
        console.log(messages.NOT_USING_AVAILABLE);
        throw messages.NOT_USING_AVAILABLE;
      }
      switch (amount) {
        case 'card': {
          console.log('카드가 삽입되었습니다.');
          if (this.options.cardPaymentSuccess) this.useCardPayment = true;
          else throw messages.INVALID_CARD;

          break;
        }
        default: {
          this.useCardPayment = false;
          this.money += amount;
          console.log(`${amount}원이 투입 되었습니다. 현재 잔액은 ${this.money}원 입니다.`);
        }
      }
    } catch (message) {
      return message;
    }
  }
  /** 상품을 선택합니다. */
  selectProduct(productName: ProductName) {
    if (!this.options.useAble) return makeLogAndReturn(messages.NOT_USING_AVAILABLE);

    if (!beverageCheck(productName, this.products)) return makeLogAndReturn(messages.NOT_SERVING_BEVERAGE);

    const targetProduct = this.products.filter((elem) => elem.name === productName)[0];

    const stockExist = stockCheck(targetProduct.stock);
    if (!stockExist) return makeLogAndReturn(messages.OUT_OF_STOCK);

    const enoughMoney = moneyCheck(this.money, targetProduct.price);
    if (!this.useCardPayment && !enoughMoney) return makeLogAndReturn(messages.LACK_MONEY);

    console.log(`선택한 상품은 '${targetProduct.name}' 입니다.`);
    return this.servingProduct(targetProduct);
  }

  /** 음료 제공 */
  servingProduct(product: Product) {
    if (!this.useCardPayment) {
      this.money -= product.price;
    }
    product.stock -= 1;
    return messages.SERVING_PRODUCT.replace(`{{product}}`, product.name);
  }
  /** 거스름돈을 반환 합니다. */
  returnChangeMoney() {
    if (this.useCardPayment) return messages.DO_NOT_NEED_CHANGE_MONEY;
    if (this.money > 0) {
      console.log(`잔돈 ${this.money}가 반환 되었습니다.`);
      return this.money;
    }
    return 0;
  }
}

export default VendingMachine;

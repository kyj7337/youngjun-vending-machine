import VendingMachine from '..';
import { messages } from '../message';

let machine: VendingMachine;

beforeEach(() => {
  machine = new VendingMachine();
});

describe('정상 케이스', () => {
  console.log(' --- 정상 케이스 실행  --- ');
  test('1. 1100원을 넣고 1100원 콜라를 뽑는 정상케이스', () => {
    console.log('1. 1100원을 넣고 1100원 콜라를 뽑는 정상케이스');
    machine.addPayment(1000);
    machine.addPayment(100);
    expect(machine.selectProduct('콜라')).toBe(messages.SERVING_PRODUCT.replace('{{product}}', '콜라'));
    const 콜라 = machine.products.filter((elem) => elem.name === '콜라')[0];
    expect(콜라.stock).toBe(9);
    expect(machine.returnChangeMoney()).toBe(0);
  });

  test('2. 카드를 넣고 물을 뽑는 케이스', () => {
    console.log('2. 카드를 넣고 물을 뽑는 케이스');
    machine.addPayment('card');
    expect(machine.selectProduct('물')).toBe(messages.SERVING_PRODUCT.replace('{{product}}', '물'));
    expect(machine.returnChangeMoney()).toBe(messages.DO_NOT_NEED_CHANGE_MONEY);
  });

  test('3. 2000원을 넣고 콜라를 뽑고 거스름돈을 받아야 하는 케이스', () => {
    console.log('3. 2000원을 넣고 콜라를 뽑고 거스름돈을 받아야 하는 케이스');
    machine.addPayment(1000);
    machine.addPayment(1000);
    expect(machine.selectProduct('콜라')).toBe(messages.SERVING_PRODUCT.replace('{{product}}', '콜라'));
    const 콜라 = machine.products.filter((elem) => elem.name === '콜라')[0];
    expect(machine.returnChangeMoney()).toBe(900);
    expect(콜라.stock).toBe(9);
  });

  test('4. 1500원을 넣고 콜라와 물을 구매하려고 하는 경우', () => {
    console.log('4. 1500원을 넣고 콜라와 물을 구매하려고 하는 경우');
    machine.addPayment(1000);
    machine.addPayment(500);
    expect(machine.selectProduct('콜라')).toBe(messages.SERVING_PRODUCT.replace('{{product}}', '콜라'));
    expect(machine.selectProduct('물')).toBe(messages.LACK_MONEY);
  });
  test('5. 돈 넣고 음료구매 돈 넣고 음료구매 반복 하는 케이스', () => {
    console.log('5. 돈 넣고 음료구매 돈 넣고 음료구매 반복 하는 케이스');
    machine.addPayment(1000);
    machine.addPayment(1000);
    machine.addPayment(1000);
    machine.selectProduct('커피');
    expect(machine.money).toBe(2300);
    machine.addPayment(100);
    expect(machine.money).toBe(2400);
    expect(machine.selectProduct('콜라')).toBe(messages.SERVING_PRODUCT.replace('{{product}}', '콜라'));
    expect(machine.selectProduct('콜라')).toBe(messages.SERVING_PRODUCT.replace('{{product}}', '콜라'));
    const 콜라 = machine.products.filter((elem) => elem.name === '콜라')[0];
    const 커피 = machine.products.filter((elem) => elem.name === '커피')[0];
    expect(콜라.stock).toBe(8);
    expect(커피.stock).toBe(9);
    expect(machine.returnChangeMoney()).toBe(200);
  });
});

// *
// * 이하 상품 제공 실패 케이스
// *

describe('상품 제공 실패 케이스', () => {
  test('1. 돈이 모자를 경우', () => {
    console.log('1. 돈이 모자를 경우');
    machine.addPayment(100);
    expect(machine.selectProduct('커피')).toBe(messages.LACK_MONEY);
  });
  test('2. 없는 음료(제로콜라) 를 주문할 경우', () => {
    console.log('2. 없는 음료(제로콜라) 를 주문할 경우');
    machine.addPayment(10000);
    expect(machine.selectProduct('제로콜라' as any)).toBe(messages.NOT_SERVING_BEVERAGE);
  });
  test('3. 자판기가 사용할 수 없는 상태인 경우', () => {
    console.log('3. 자판기가 사용할 수 없는 상태인 경우');
    const machine = new VendingMachine({
      options: {
        useAble: false,
      },
    });
    expect(machine.addPayment(1000)).toBe(messages.NOT_USING_AVAILABLE);
  });
  test('4. 사용할 수 없는 카드를 넣은 케이스', () => {
    console.log('4. 사용할 수 없는 카드를 넣은 케이스');
    const machine = new VendingMachine({
      options: {
        cardPaymentSuccess: false,
        useAble: true,
      },
    });
    expect(machine.addPayment('card')).toBe(messages.INVALID_CARD);
  });
  test('5. 재고가 모자름', () => {
    console.log('5. 재고가 모자름');
    const lackMachine = new VendingMachine({
      products: [
        {
          name: '물',
          stock: 0,
          price: 1000,
        },
      ],
    });
    lackMachine.addPayment(5000);
    expect(lackMachine.selectProduct('물')).toBe(messages.OUT_OF_STOCK);
  });
});

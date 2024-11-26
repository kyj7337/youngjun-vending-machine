import { Product } from '.';

/** 재고가 있는지 체크 */
export const stockCheck = (stockCount: number) => stockCount > 0;
/** 보유한 돈이 충분한지 체크 */
export const moneyCheck = (insertMoney: number, price: number) => insertMoney >= price;

/** 제공할 수 있는 음료가 선택되었는지 체크 */
export const beverageCheck = (selectName: string, products: Product[]) => {
  const productNames = products.map((item) => item.name);
  return productNames.includes(selectName as any);
};
/**
 * @param text 로그 및 리턴 텍스트
 */
export const makeLogAndReturn = (text: string) => {
  console.log(text);
  return text;
};

import Cart from './pages/cart'

const cart = new Cart();

describe('체크박스 선택/해제에 맞게 결제정보, 버튼명 보이는지 확인', () => {
  it('주소지 확인', () => {
    cy.resetAddress();
  })
  it('상품 담기', function() {
    cy.addCartItemInBest(3);
  });
  it('장바구니 이동하여 체크박스 선택 해제', ()=> {
    // 선택된 상품들의 가격 합
    // 장바구니 버튼 금액
    cart.cartItem('checkBox', 0).uncheck({force:true})
  })
  it('체크박스 선택된 상품의 금액 계산', () => {
    let cartPrice = 0;
    cy.get('[data-cy="cy_cart_panel_option_checkbox_select"]>input')      // * 장바구니 내 체크박스
      .each(($el, index) => {
        if ($el.is(':checked')) {
          cy.get('[data-cy="cy_cart_panel_option_current_price"]')
          .eq(index)
          .each(($el) => {
            let itemPrice = parseInt($el.text().replace(',', ''));
            cartPrice += itemPrice;
          });
        }
      })
      .then(() => {
        cy.log(cartPrice);
        cart.orderBtn().then((body) => {
          // //button[contains(text(),'원 주문하기')] -> * 장바구니 내 [n종 n원 주문하기] 버튼
          const priceText = body.text();
          const subIndex = priceText.indexOf('원');
          const buttonPrice = parseInt(
            priceText.substring(3, subIndex).replace(',', '')
          );
          if (cartPrice < 40000) {
            cartPrice += 4000;
          }
          expect(cartPrice, '체크박스 선택에 맞게 버튼명 노출 확인').to.equal(
            buttonPrice
          );
        });
      });
  });
});

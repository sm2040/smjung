// 카트 총 갯수 비교
// 선택한 상품 비교
// 총 가격 비교

describe('장바구니 재진입시에도 장바구니 정보 유지되는지 확인', () => {
  let beforeCartItems;
  let beforeCartPrice;
  let afterCartItems;
  let afterCartPrice;
  
  it('장바구니 담기 후 카트 정보 획득', () => {
        // cy.addCartItemInBest(2)
    cy.addCartItemInBest(1);
    // 상품명 불러오기
    cy.get('[data-cy="cy_cart_price_button_order"]')
    .should('be.visible');
    cy.get('body').then(body => {
      beforeCartItems = body
        .find(
          '[data-cy="cy_cart_panel_option_title"]'
        )
        // div[data-cy='cy_cart_shop_panel_option_0']>div>div:nth-of-type(1)>>p:nth-of-type(1) -> * 장바구니 내 옵션명
        // div[data-cy='cy_cart_shop_panel_option_0']>div>div:nth-of-type(1)>>p:nth-of-type(2) -> * 장바구니 내 상품명
        .text();
      cy.log("beforeCartItems"+beforeCartItems);
    })

    cy.contains('원 주문하기').then(body => {
      beforeCartPrice = body.text();
    });
    cy.go('back')
  });
  
  it('장바구니 재진입', () => {
    cy.goCart()
    cy.get('body').then(body => {
      afterCartItems = body
        .find(
          '[data-cy="cy_cart_panel_option_title"]'
        )
        // * 장바구니 내 옵션명
        .text();
      cy.log(afterCartItems);
    });
    cy.contains('원 주문하기').then(body => {
      afterCartPrice = body.text();
    }).then(() => {
      expect(beforeCartItems).to.equal(
        afterCartItems,
        '장바구니 상품 동일한지 확인'
      );
      expect(beforeCartPrice).to.equal(
        afterCartPrice,
        '장바구니 금액 동일한지 확인'
      );
    })
  });
});
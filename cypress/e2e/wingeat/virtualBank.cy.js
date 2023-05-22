describe('무통장 결제', () => {
  it ('주소지 추가', () => {
    cy.addAddress('서울');
  })
  it('상품 장바구니 담기', () => {
    cy.searchItems('tc1');
    cy.addCartInList();
  });

  it('주문_가상결제 시도 후 취소 및 확인', () => {
    cy.orderInCart();
    cy.orderVirtualBank();
  });
});

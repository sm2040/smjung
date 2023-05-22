describe('결제 중 주문취소 동작 및 주문 완료 동작 확인', () => {
  it('상품 장바구니 담기', () => {
    cy.searchItems('tc1');
    cy.addCartInList();
  });

  it('주문_가상결제 시도 후 취소 및 확인', () => {
    cy.orderInCart();
    cy.orderVirtualBank(0);
  });

  it('주문지면 복귀 후 주문하기 버튼 활성화 확인', () => {
    cy.contains('결제하기')
    .should('not.be.disabled', '주문지면 복귀 후 주문하기 버튼 활성화 확인')
  })
  it('주문 완료 동작 확인', () => {
    cy.log('주문완료 페이지 확인 및 주문 내역 보기 버튼 활성화 확인')
    cy.orderVirtualBank()
  })
});

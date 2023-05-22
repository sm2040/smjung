describe('구매불가 상품 테스트 확인 (결제수단, 배송일 변경, 무료배송)', () => {
  // 221013_현재 가상계좌 이슈로 해당 테스트항목은 주석처리.
  it('배송지 추가 및 배송지(서울) 선택', () => {
    cy.addAddress('서울')
    cy.addAddress('제주')

    // cy.resetAddress()
  })

  it('테스트 상품 A 담기', () => {
    cy.searchItems('TC028');
    cy.addCart(0);
    cy.orderInOptionModal()
    cy.continueInModal();

  });
  it('테스트 상품 B 담기 및 주문하기', () => {
    cy.searchItems('고른');
    cy.addCart(0);
    cy.orderInOptionModal()
    cy.goCartInModal();
    cy.wait(1000)

  });

  it('주소 변경 전 배송일 변경, 배송비, 가상계좌 확인', () => {
    // 배송일 변경 불가 확인
    cy.orderInCart()
    cy.wait(3000);
    cy.contains('배송일 변경 불가').should('exist');

    // 배송비 무료 확인 (주문상품)
    cy.get('div')
    .contains('배송비')
    .next()
    .should('have.text', '무료');

    // 배송비 무료 확인 (결제정보)
    cy.get('span')
    .contains('배송비')
    .next()
    .should('have.text', '0 원');

    // 가상계좌 결제 불가 확인
    // cy.contains('일반 결제').click();
    // cy.get('button').contains('가상계좌').should('be.disabled');
    // cy.get('p[class*="Accordion_summary"]').should('have.text', "가상계좌 입금 불가 사유")
  });
  it('배송지 변경', () => {
    // 배송지 선택 지면 진입
    cy.intercept('GET', '/api/user/shipping-address').as('address');
    cy.get('button').contains('변경').click()
    cy.wait('@address');
    // 배송지 '제주'로 변경
    cy.contains('제주특별자치도')
        .eq(0)
        .next()
        .contains('선택')
        .click();
  });
  it('배송일 변경 불가 > 가능', () => {
    cy.wait(3000);
    cy.contains('배송일 변경 불가').should('not.exist');
  });
  it('배송비 무료 > 유료 (주문 상품 / 결제정보)', () => {
    cy.get('div')
    .contains('배송비')
    .next()
    .should('not.have.text', '무료');

    cy.get('span')
    .contains('배송비')
    .next()
    .should('not.have.text', '0 원');
  });
  // it('가상계좌 불가 > 가능 확인', () => {
  //   cy.contains('일반 결제').click();
  //   cy.get('button').contains('가상계좌').should('be.enabled');
  //   cy.get('p[class*="Accordion_summary"]').should('not.have.text', "가상계좌 입금 불가 사유")
  // });

});

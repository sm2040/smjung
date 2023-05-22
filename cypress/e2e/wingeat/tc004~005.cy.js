// cleaercart 필요

describe('새벽배송 지역에서 새벽배송전용상품 장바구니 담기 동작 확인', () => {
  let freshItemName = '새벽배송테스트상품';
  it('배송지 서울로 설정', () => {
    cy.addAddress('제주');
    // 배송지 추가 (제주)
    cy.get('[data-cy="cy_top_nav_icon_delivery_select"]').click();
    // 홈 > 배송지 선택 진입
    cy.get("div[data-cy='cy_data_address_book_item_0']").then((body) => {
      // 
      if (body.text().includes('서울') === false) {
        cy.get(
          "div[data-cy*='cy_data_address_book_list']"
          // //div[contains(@class,'app-template__main')] -> * 배송지 선택 > 배송지 목록 전체 영역
        ).then((body) => {
          cy.contains('서울')
            .next()
            .contains('선택')
            .click();
        });
      } else {
        cy.go('back');
      }
    });
  });

  it('새벽배송 상품 담기 가능여부 확인', () => {
    cy.searchItems(freshItemName);
    cy.openOptionModalInList();
    cy.get('[data-cy="cy_data_item_option_modal_button_cart"]').should(
      'include.text',
      '장바구니 담기'
    );

    cy.orderInOptionModal();
    
    cy.goCartInModal();
    cy.get('[data-cy="cy_cart_panel_option_description"]').then(
      // * 장바구니 내 옵션명
      (body) => {
        const name = body.text();

        expect(name).contain(freshItemName);
      }
    );
    cy.get(
      'div[data-cy="cy_cart_panel_invalid"]'
    ).should('not.exist');
  });

  it('새벽배송 불가 지역으로 변경시 구매불가상품으로 이동 확인', () => {
    cy.get('section[data-cy="cy_cart_shipping_banner"]').click(); // 장바구니 > 배송지 선택
    cy.get("div[data-cy*='cy_data_address_book_list']").then((body) => {
      cy.contains('제주특별자치도')
        .next()
        .contains('선택')
        .click();
    });
    cy.get('body').then((body) => {
      body.find('[data-cy="cy_cart_panel_invalid"]').length > 0;
    });
    cy.get('[data-cy="cy_cart_panel_invalid"]')
      .contains('구매 불가 상품')
      .should('exist')
      .then((body) => {
        cy.get('[data-cy="cy_cart_panel_invalid"]').should(
          'include.text',
          freshItemName
        );
      });
  });

  it('새벽배송 가능 지역으로 변경시 구매가능상품으로 이동 확인', () => {
    cy.get('section[data-cy="cy_cart_shipping_banner"]').click();
    cy.get("div[data-cy*='cy_data_address_book_list']").then((body) => {
      cy.contains('서울')
        .next()
        .contains('선택')
        .click();
    });
    cy.get('[data-cy="cy_cart_panel_invalid"]')
      .should('exist')
      .then((body) => {
        expect(body.length).equal(1);
      });
  });
});

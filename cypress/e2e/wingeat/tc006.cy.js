//div[@data-cy='cy_cart_shop_panel_0']/preceding-sibling::div[1]
// 장바구니 > 배송지 영역

describe('택배배송 지역에서 새벽배송전용상품 장바구니 담기 불가 확인', () => {
  let freshItemName = '새벽배송테스트상품';
  it('배송지 확인', () => {
    cy.addAddress('제주');
    cy.selectAddress('제주');
    // 배송지 선택
  });

  it('새벽배송 상품 담기 불가 확인(상품카드)', () => {
    cy.searchItems(freshItemName);
    cy.get('[data-cy="cy_data_card_product_list"]')
      .eq(0)
      .find('[data-cy="cy_data_card_product_button_cart"]')
      .click(); // 상품카드내 장바구니 버튼 선택
    cy.get('[class*="ModalBottomSheet_content"]>div>button').should(
      'include.text',
      '새벽배송 전용 상품'
    );
  });

  it('새벽배송 상품 담기 불가 확인(상페)', () => {
    cy.get('[data-cy="cy_data_search_result_item_list"]')
    .find('[data-cy="cy_data_card_product_item_0"]').click();

    cy.get('button[data-cy="cy_data_item_detail_button_show_option"]').should(
      'be.disabled'
    );
  });
});

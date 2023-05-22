class itemList {
  searchItemList() {
    return cy.get(
      '[data-cy="cy_data_search_result_item_list"]>>[data-cy="cy_data_card_product_list"]'
    ); // 검색지면 상품 목록
  }
  itemList() {
    return cy.get('[data-cy="cy_data_card_product_list"]'); // 베스트, 신상품 등의 상품목록 지면
  }

  /**
   * 상품 목록에서 n번쨰 상품 // 상세페이지 진입시 사용
   * @param {n} n 미입력시 첫 번째
   * @returns 
   */
  item(n=0) {
    return cy
      .get('[data-cy="cy_data_card_product_list"]')
      .eq(0)
      .find(`[data-cy="cy_data_card_product_item_${n}"]`);
  };

  /**
   * 상품 목록에서 n번째 상품의 장바구니 버튼 선택
   * @param {*} n (미입력시 첫 번째)
   * @returns n번째 상품의 장바구니 버튼
   */
  CartBtnInCard(n=0) {
    return cy
      .get('[data-cy="cy_data_card_product_list"]')
      .eq(0)
      .find(`[data-cy="cy_data_card_product_item_${n}"]`)
      .find('[data-cy="cy_data_card_product_button_cart"]');
  }
}
export default itemList;

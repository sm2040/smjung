class Cart {
  addressBanner(){
    return cy.get('[data-cy="cy_cart_shipping_banner"]')
  }
  cartPanel(n){
    return cy.get(`[data-cy*="cy_cart_panel_valid_${n}"]`)
  }
  invalidCartPanel(){
    return cy.get(`[data-cy="cy_cart_panel_invalid"]`)
  }
  selectAllCheckBox(){
    return cy.get('[data-cy="cy_cart_panel_checkbox_select_all"]>input')
  }
  selectItemDeleteBtn(){
    return cy.get('button[data-cy="cy_cart_panel_button_delete_selected"]')
  }
  normalCartItem(){
    return cy.get('[data-cy*="cy_cart_panel_option_normal"]')
  }
  freshCartItem(){
    return cy.get('[data-cy*="cy_cart_panel_option_fresh"]')
  }

  orderBtn(){
    return cy.get('[data-cy="cy_cart_price_button_order"]')
  }
  /**
   * n번쨰 상품의 정보 불러오기 (n=0)
   * @param {*} keyword itemName, optionName, price, plusBtn, minusBtn, checkBox
   * @param {*} n n 번째 상품 선택
   * @returns 
   */
  cartItem(keyword, n=0){
    switch(keyword){
      case 'optionName':
        return cy.get('[data-cy="cy_cart_panel_option_description"]')
        break;
      case 'itemName':
        return cy.get('[data-cy="cy_cart_panel_option_title"]')
        break;
      case 'price':
      case 'plusBtn':
        return cy.get('[data-cy="cy_data_input_stepper_button_plus"]').eq(n).click();
        break;
      case 'minusBtn':
        return cy.get('[data-cy="cy_data_input_stepper_button_minus"]').eq(n).click();
        break;
      case 'checkBox':
        return cy.get('[data-cy="cy_cart_panel_option_checkbox_select"]>input').eq(n)
        break;
    }
  }
}

export default Cart;
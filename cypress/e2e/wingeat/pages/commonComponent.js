class commonComponent {
 /**
  * 옵션모달에서 n번째 옵션의 수량 증가
  * @param {n} n n번째 옵션의 수량 증가
  * @returns 
  */ 
  plusBtn(n=0){
    return cy.get('[data-cy="cy_data_input_stepper_button_plus"]').eq(n);
  }
  /**
   * 옵션모달에서 n번째 옵션의 수량 감소
   * @param {n} n n번째 옵션의 수량 감소
   * @returns 
   */
  minusBtn(n=0){
    return cy.get('[data-cy="cy_data_input_stepper_button_minus"]').eq(n);
  }
  addCartInOptionModal(){
    return cy.get('[data-cy="cy_data_item_option_modal_button_cart"]');
  }
  cartBtnInDetail(){
    return cy.get('[data-cy="cy_data_item_detail_button_show_option"]');
  }
  
}
export default commonComponent;

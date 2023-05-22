class addressList {
  addressList(){
    // 주소지 목록
    return cy.get('[data-cy="cy_data_address_book_list"]')
  }
  addressItem(n){
    // n번째 주소지
    return cy.get(`[data-cy="cy_data_address_book_item_${n}"]`)
  }
  addressUpdateBtn(){
    // 주소지 수정
    return cy.get('[data-cy="cy_data_address_book_item_button_update"]')
  }
  addressSelectBtn(){
    // 주소지 선택
    return cy.get('[data-cy="cy_data_address_book_item_button_select"]')
  }
  addressDeleteBtn(){
    // 주소지 삭제
    return cy.get('[data-cy="cy_data_address_book_item_button_delete"]')
  }
  addressInfo(){
    // 주소지 정보
    return cy.get('[data-cy="cy_data_address_book_item_0"]>div>div:nth-child(2)')
  }
}


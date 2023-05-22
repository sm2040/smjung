
describe('상세페이지에서 장바구니 담기 동작 확인', () => {


  it('상세페이지 진입', function() {
    cy.enterDetail();
  })

  it('장바구니 담기', function() {
    cy.addCart_detail(2);
  })
})
import Homepage from './pages/homePage';
import Cart from './pages/cart';
import Itemlist from './pages/item';

const homePage = new Homepage();
const cart = new Cart();
const itemList = new Itemlist();

describe('위수탁 상품만 주문하는 케이스', () => {
  it('위수탁 상품 담기', () => {
    cy.searchItems('QA위수탁상품');
    cy.addCartInList();
  });
  it('장바구니 지면과 주문지면 상품갯수 동일한지 확인', () => {
    cy.orderInCart();
    cy.get('body').then((body) => {
      // 사용가능 쿠폰이 있는 경우 모달에서 '아니오' 선택
      const couponModal = body.find("div[data-pc-fixed-style='modal-block']")
        .length;
      expect(couponModal).equals(
        0,
        '위수탁 상품에 대해 쿠폰 관련 팝업 미노출되는지 확인'
      );
    });
    cy.contains('일반 결제').click();
    cy.contains('가상계좌').should('not.be.disabled', '가상계좌 불가 상품');
    cy.contains('가상계좌').click();
    cy.get('input[name="isAgreeAll"]').check({ force: true });
    cy.get('button')
      .contains('결제하기')
      .click();
    cy.get('[data-pc-fixed-style="modal-block"]')
      .contains('확인')
      .click();

      cy.get('.imp-dialog iframe:visible')
      .its('0.contentDocument')
      .should('exist', {timeout : 10000})
      .its('body')
      .should('not.be.undefined')
      .find('iframe:visible')
      .its('0.contentDocument')
      .should('exist', {timeout : 10000})
      .its('body')
      .should('not.be.undefined')
      .find('#usrCancel')
      .click();
      
    cy.get('div[data-pc-fixed-style="modal-block"]').should(
      'exist',
      '주문취소 팝업 확인'
    );
  });
});

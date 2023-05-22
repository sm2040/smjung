import Cart from './pages/cart'
import Homepage from './pages/homePage'
import commonComponent from './pages/commonComponent';

const cart = new Cart();
const homePage = new Homepage();
const commonCpnt = new commonComponent();

describe('비회원으로 장바구니에 담은 상품이 로그인 후에도 유지되는지 확인', () => {
  let itemName;

  it('로그아웃', function() {
    cy.logout();
  });
  it('상품 검색', () => {
    cy.searchItems('고른');
  });
  it('검색된 상품 장바구니 담기', () => {
    cy.addCart(0);
    cy.orderInOptionModal();
    cy.goCartInModal();
  });

  it('비회원 장바구니에서 상품 확인', () => {
    cart.cartItem('optionName').then((body)=> {
      itemName = body.text();
    })
  })
  it('로그인', function() {
    cy.log(itemName);
    cy.login('smtest@wingeat.com', 'tmdah12!@');
  });
  it('회원 장바구니에서 상품 확인', () => {
    homePage.topNavIcon('cart').click();
    cart.cartItem('optionName').then((body)=> {
      expect(body.text()).to.include(itemName);
    })
    
  });
});

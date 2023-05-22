class homePage {
  
/**
 * 바텀내비 버튼 선택 (홈, 검색, 카테고리, 커뮤니티, 로그인(마이윙잇))
 * @param {*} page home, search, category, community, myWingeat
 * @returns 
 */
  bottomNavBtn(page) {
    switch (page) {
      case 'home':
        return cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(1)>a');
        break;
      case 'search':
        return cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(2)>a');
        break;
      case 'category':
        return cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(3)>a');
        break;
      case 'community':
        return cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(4)>a');
        break;
      case 'myWingeat':
        return cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(5)>a');
        break;
    }
  }
  /**
   * 탑 내비 버튼 (베스트, 마감세일, 신상품, 이벤트)
   * @param {} page best, saving, new, event
   * @returns 
   */
  topNavBtn(page) {
    switch (page){
      case 'best':
        return cy.get('[data-cy="cy_top_nav"]').find('a[href="/best"]');
        break;
      case 'saving':
        return cy.get('[data-cy="cy_top_nav"]').find('a[href="/saving"]');
        break;
      case 'new':
        return cy.get('[data-cy="cy_top_nav"]').find('a[href="/new-items"]');
        break;
      case 'event':
        return cy.get('[data-cy="cy_top_nav"]').find('a[href="/all-events"]');
        break;
    }
  }
/**
 * 탑 아이콘 버튼 (배송지, 검색, 장바구니)
 * @param {*} icon address, search, cart
 * @returns 
 */
  topNavIcon(icon) {
    switch (icon){
      case 'address':
        return cy.get('[data-cy="cy_top_nav_icon_delivery_select"]');
        break;
      case 'search':
        return cy.get('[data-cy="cy_top_nav_icon_search"]');
        break;
      case 'cart':
        return cy.get('[data-cy="cy_top_nav_icon_cart"]');
        break;
    }
  }
}

export default homePage;

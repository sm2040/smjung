import homePage from './pages/homePage.js';

const homepage = new homePage();

describe('윙잇 홈페이지 진입', () => {
  it('페이지 진입', () => {
    // cy.get('[data-cy="cy_data_card_product_button_cart"]')
    //   .eq(0)
    //   .click();
    // cy.window()
    //   .its('dataLayer')
    //   .then((dataLayer) => {
    //     const addCartEvent = dataLayer.find(
    //       (event) => event.event === 'openCartPopup'
    //     );
    //     cy.log(addCartEvent);
    //     expect(addCartEvent).to.have.property('from', 'itemCard');
    //   });
    homepage.topNavBtn('best').click();
    cy.get('[data-cy="cy_data_card_product_item_0"]').click();
    cy.wait(1000);
    cy.window()
      .its('dataLayer')
      .then((dataLayer) => {
        const clickItem = dataLayer.find(
          (event) => event.event === 'clickItemCard'
        );
        expect(clickItem).to.have.property('from', '/best');
      });
  });
});

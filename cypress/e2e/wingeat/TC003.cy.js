// 수량 변경 전 금액 확인
// 수량 변경 후 금액 확인

describe('수량 변경시 수량에 맞게 버튼명 보이는지 확인', () => {
  it('수량 변경 후 카트 정보 확인', () => {
    cy.addCartItemInBest(2)
    cy.get("button[data-cy='cy_data_input_stepper_button_plus")
      .eq(0)
      .click();
    cy.wait(2000)
    let sum = 0;

    cy.get(
      "[data-cy='cy_cart_panel_option_checkbox_select']>input[type='checkbox']"
    )
      // 윙잇샵 상품중 체크박스 선택된 상품의 가격의 합 구하기 (다른 샵 추가되는 경우 실행 안됨 ..ㅠ)
      .each(($el, index) => {
        if ($el.is(':checked') == true) {
          cy.get('[data-cy="cy_cart_panel_option_current_price"]')
          .eq(index)
              // 상품 가격
          .each($el => {
            var price = parseInt($el.text().replace(',', ''));
            sum += price;
            cy.log('각 상품의 가격' + price);
            cy.log('섬1 : ' + sum);
          });
        }
      })
      // 버튼명에 있는 가격정보와 체크박스 선택된 상품의 가격 합 비교하기
      .then(() => {
        cy.log('최종 SUM : ' + sum);
        cy.xpath("//button[contains(text(),'원 주문하기')]").then(body => {
          const priceText = body.text();
          const subIndex = priceText.indexOf('원');
          const buttonPrice = parseInt(
            priceText.substring(3, subIndex).replace(',', '')
          );
          if (sum < 40000) {
            sum += 4000;
          }
          expect(sum, '체크박스 선택에 맞게 버튼명 노출 확인').to.equal(
            buttonPrice
          );
        });
      });
  });
});

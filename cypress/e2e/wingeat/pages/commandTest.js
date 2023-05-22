Cypress.Commands.add('addAddress', function(keyword) {
  const getIframe = () => {
    cy.get('iframe[title="우편번호서비스 레이어 프레임"]', { timeout: 10000 })
      .iframe()
      .find('iframe[title="우편번호 검색 프레임"]')
      .iframe();

    return cy
      .get('iframe[title="우편번호서비스 레이어 프레임"]')
      .iframe()
      .find('iframe[title="우편번호 검색 프레임"]')
      .iframe()
      .as('iframebody');
  };

  let region = '';

  switch (keyword) {
    case '서울':
      region = '테헤란로 32길 26';
      break;

    case '충청':
      region = '천안대로 980-17';
      break;

    case '도서산간':
      region = '효자동 378-1';
      break;

    case '제주':
      region = '애월읍 가문동길 2';
      break;

    default:
  }

  // 배송지 선택 지면 진입
  cy.get('[data-cy="cy_top_nav_icon_delivery_select"]').click();
  // * 윙잇 홈 > 배송지 선택
  cy.get("div[data-cy*='cy_data_address_book_item']").then(() => {
    // * 배송지 관리 지면내 각 각의 주소록 영역
    // 신규 배송지 추가
    cy.contains('신규 배송지 추가').click();
    cy.get('#title').type('테스트배송지');
    cy.get('#name').type('테스트');
    cy.get('#phone').type('01112341234');
    cy.contains('주소 찾기').click();
    cy.wait(2000);

    // 주소 입력

    getIframe()
      .find('#region\\_name')
      .should('exist')
      .type(region + '{enter}', { force: true });
    // 검색결과 내 주소 선택
    cy.wait(1000);
    getIframe();
    cy.get('@iframebody')
      // .find('.info_address.info_fst.main_address.main_road')
      .find('dd')
      .eq(0)
      .find('.link_post')
      .click();

    // cy.get('input[placeholder="[필수] 상세 주소 (동·호수·층)"]').type('상세주소123')
    cy.get('#address\\.address2').type('테스트 상세주소');

    if (keyword === '서울' || keyword === '충청') {
      cy.contains('새벽배송 정보 입력').should(
        'exist',
        '새벽배송 정보 입력 영역 확인'
      );

      cy.contains('새벽배송 도착 알림').should(
        'exist',
        '새벽배송 도착 알림 영역 확인'
      );

      cy.get('input[value="FREE_ACCESS"]').check({ force: true });

      // 현관 출입 방법 > 자유 출입 가능
    }

    cy.contains('저장하기').click();
    cy.get('[data-pc-fixed-style="modal-block"]')
      .should('contain.text', '배송지가 등록되었습니다.')
      .contains('확인')
      .click();
    cy.wait(1500);
  });

  cy.goHome();
  cy.closeModal();
});
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// Cypress.Commands.add('loginWingeat', (username, password) => {
// 	cy.get('#user_login').type(username)
// 	cy.get('#user_password').type(password)
// 	cy.get('#user_remember_me').click()
// 	cy.contains('Sign in').click()
// })
import Item from '../e2e/wingeat/pages/item';
import Homepage from '../e2e/wingeat/pages/homePage';
import Commoncpnt from '../e2e/wingeat/pages/commonComponent';

const item = new Item();
const homePage = new Homepage();
const commonCpnt = new Commoncpnt();

// 주소 검색시 iFrame 컨트롤
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

// 주소 검색/반환
function searchAddress(keyword) {
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
  return region;
}

// iFrame내 iFrame을 Handling 하기 위한 Command
Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.ready(function() {
      resolve($iframe.contents().find('body'));
    });
  });
});

// fixturs/user.json "visitURL"의 URL로 이동
Cypress.Commands.add('visitPage', (url) => {
  cy.visit(url);
  cy.wait(500);
});

// 회원가입
Cypress.Commands.add('signUp', () => {
  let rand1 = Math.floor(Math.random() * 99999999);
  homePage.bottomNavBtn('myWingeat').click();
  cy.get('a[href*="/account/signup"]').click();

  cy.get('input[name="phone"]') // 휴대폰 번호 입력
    .clear()
    .type('011' + rand1);
  cy.contains('인증번호 받기').click(); // 인증번호 받기
  cy.get('[data-pc-fixed-style="modal-block"]') // 인증요청 팝업 확인
    .should('include.text', '인증 번호를 보냈습니다.');
  cy.get('[data-pc-fixed-style="modal-block"]') // 인증요청 팝업 닫기
    .contains('확인')
    .click();
  cy.get('input[name="verificationCode"]').type('000000'); // 인증번호 입력
  cy.get('button') // 인증하기
    .contains('인증하기')
    .click();

  // 인증완료 팝업 확인
  cy.get('[data-pc-fixed-style="modal-block"]')
    .should('be.visible')
    .should('include.text', '인증 완료!');
  cy.get('[data-pc-fixed-style="modal-block"]')
    .contains('확인')
    .click();

  cy.get('input[type="email"]').type('sm' + rand1 + '@wingeat.com');
  cy.get('input[name="password"]').type('tmdah12!@');
  cy.get('input[name="checkPassword"]').type('tmdah12!@');
  cy.get('input[name="name"]').type('정승모test');

  cy.contains('전체동의').click();
  cy.get('button[type=submit')
    .contains('윙잇 가입하기')
    .click();
});
// 가상계좌 결제 진행
Cypress.Commands.add('orderVirtualBank', (d = 1) => {
  // d= 성공/실패 여부 (1 :성공 / 0 : 실패)
  const paymentIframeBody = () => {
    const iamportIframe = cy
      .get('.imp-dialog iframe:visible')
      .its('0.contentDocument')
      .should('exist', {timeout : 10000})
      .its('body')
      .should('not.be.undefined')
      .then(cy.wrap);

    return iamportIframe
      .find('iframe:visible')
      .its('0.contentDocument')
      .should('exist', {timeout : 10000})
      .its('body')
      .should('not.be.undefined')
      .then(cy.wrap);
  };

  cy.get('body').then((body) => {
    if (body.find("div[data-pc-fixed-style='modal-block']").length > 0) {
      cy.contains('그냥 주문하기').click();
    }
  });
  cy.wait(2000);
  cy.contains('일반 결제').click();
  cy.contains('가상계좌').should('not.be.disabled', "가상계좌 불가 상품");
  cy.contains('가상계좌').click();
  cy.get('input[name="isAgreeAll"]').check({ force: true });
  cy.contains('결제하기').click();
  cy.get('[data-pc-fixed-style="modal-block"]')
    .contains('확인')
    .click();
  cy.wait(4000);

  if (d) {
    // 결제 성공 케이스
    cy.get('.imp-dialog iframe:visible');
    paymentIframeBody()
      .find('label[for="chk_all"]')
      .click();
    paymentIframeBody()
      .find('#select_bank')
      .select('기업은행');
    // 다음

    paymentIframeBody()
      .find('#spayNext')
      .click();
    cy.wait(2000);
    paymentIframeBody()
      .find('label[for="chk_num2"]')
      .click();
    // 결제요청
    paymentIframeBody()
      .find('#spayNext')
      .click();
    cy.wait(2000);
    cy.url().should((url) => {
      expect(url).to.include('/done');
    });
    cy.contains('주문 상세보기').should('be.visible');
    cy.contains('쇼핑 계속하기').should('be.visible');
  } else {
    // 결제 취소
    cy.get('.imp-dialog iframe:visible');
    paymentIframeBody()
      .find('#usrCancel')
      .click();

    cy.get('div[data-pc-fixed-style="modal-block"]').should(
      'exist',
      '주문취소 팝업 확인'
    );
  }
});
// 로그인
Cypress.Commands.add('login', (userId, userPass) => {
  // 로그인 내비 선택
  cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(5)>a').then((body) => {
    // 로그인이 되어있지 않은 경우에만 로그인
    if (body.hasClass('bottom-nav-login') == true) {
      cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(5)').click();
      cy.xpath("//span[contains(text(),'이메일')]").click();
      cy.get('input[type="email"]')
        .clear()
        .type(userId);
      cy.get('input[type="password"]').type(userPass);
      cy.get('button[type=submit]')
        .contains('로그인')
        .click();
      cy.wait(1500);
    }
  });
});

// 로그아웃
Cypress.Commands.add('logout', () => {
  homePage.bottomNavBtn('myWingeat').click();
  cy.wait(1000);
  cy.contains('로그아웃').click({ force: true });
  cy.clearCookies();
  cy.closeModal();
});

// 모달창 닫기 (회원가입 유도, 카카오톡 연동 등)
Cypress.Commands.add('closeModal', () => {
  cy.wait(1000);
  cy.get('body').then((body) => {
    const modal = body.find('div[data-pc-fixed-style="modal-block"]');
    const modal_braze = body.find('.ab-page-blocker');

    if (modal.length) {
      cy.get(modal).then((text) => {
        cy.get(modal)
          .find('button')
          .eq(0)
          .click({ force: true });
      });
    }
    if (modal_braze.length) {
      cy.get('[aria-label="Close Message"]').click();
    }
  });
});
// 상세페이지 진입 (베스트 상품)
Cypress.Commands.add('enterDetail', () => {
  cy.get("[data-cy='cy_top_nav']>li:nth-child(1)").click(); // 베스트 지면 진입
  // //ul[@data-scroll-header='navigation']/li[n] -> * 메인화면에서 각 지면 진입 (베스트, 마감세일, 신상품, 이벤트, 전체상품)
  cy.get('[data-cy="cy_data_card_product_list"]>li:nth-child(1)').click();
  // 1번째 상품의 상세페이지 진입
  cy.wait(500); // 베스트 지면내 n번째 상품 선택
});

// 상품 검색
Cypress.Commands.add('searchItems', (keyword) => {
  cy.get('[data-pc-layout="pc-left-container"')
    .find('input[name="search"]')
    .clear()
    .type(keyword + '{enter}'); // 검색어 입력
});

// 장바구니 지면에서 '주문하기' 버튼 선택
Cypress.Commands.add('orderInCart', () => {
  cy.get('[data-cy="cy_cart_price_button_order"]').click();
  cy.get('body').then((body) => {
    // 사용가능 쿠폰이 있는 경우 모달에서 '아니오' 선택
    if (body.find("div[data-pc-fixed-style='modal-block']").length > 0) {
      cy.get('[data-cy="cy_data_modal_default_button_left"]').click();
    }
  });
});

// 홈 > 장바구니 아이콘 선택 (장바구니 진입)
Cypress.Commands.add('goCart', () => {
  cy.get('[data-cy="cy_top_nav_icon_cart"]').click();
});

// 목록에서 1번째 상품의 '장바구니' 아이콘 선택
Cypress.Commands.add('openOptionModalInList', () => {
  cy.get('[data-cy="cy_data_card_product_list"]')
    .eq(0)
    .find('[data-cy="cy_data_card_product_item_0"]')
    .find('[data-cy="cy_data_card_product_button_cart"]')
    .click();
});

Cypress.Commands.add('orderInOptionModal', (n = 0) => {
  commonCpnt.plusBtn(n).click(); // n번째 옵션 수량 증가
  commonCpnt.addCartInOptionModal().click(); // n원 장바구니 담기 버튼 선택
});

// 장바구니 담기완료 모달에서 "바로가기" 선택 (장바구니 이동)
Cypress.Commands.add('goCartInModal', () => {
  cy.get('div[data-pc-fixed-style="modal-block"]');
  cy.get('a[href="/cart"]')
    .contains('바로 가기')
    .click();
});

Cypress.Commands.add('addCartInList', () => {
  cy.openOptionModalInList();
  cy.orderInOptionModal();
  cy.goCartInModal();
});
// 장바구니 담기 완료 모달에서 '계속쇼핑' 선택
Cypress.Commands.add('continueInModal', () => {
  cy.get('div[data-pc-fixed-style="modal-block"]');
  cy.get('button')
    .contains('닫기')
    .click();
});

/**
 * keyword ='서울', '충청', '도서산간', '제주'
 * 배송지 추가
 */
Cypress.Commands.add('addAddress', function(keyword) {
  let region = searchAddress(keyword);
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
      .should('exist', {timeout : 10000})
      .type(region + '{enter}', { force: true });
    // 검색결과 내 주소 선택
    cy.wait(1000);
    getIframe();
    cy.get('@iframebody')
      // .find('.info_address.info_fst.main_address.main_road')
      .find('dd')
      .should('exist', {timeout : 10000})
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

// 주소지 모두 삭제
Cypress.Commands.add('removeAllAddress', function() {
  cy.intercept('GET', '/api/user/shipping-address').as('address');
  cy.goMypageAddress();
  cy.wait('@address');
  cy.get("div[data-cy*='cy_data_address_book_item']").each(
    // * 배송지 관리 지면내 각 각의 주소록 영역
    ($el, index, list) => {
      var listLength = list.length - 1;
      if (index >= 0) {
        var itemIndex = listLength - index;
        cy.get(
          'div[data-cy="cy_data_address_book_item_' + itemIndex + '"]'
          // //div[contains(@class, "app-template__main")]/div/div[n] -> * 배송지 관리 지면내 각 각의 주소록 영역
        )
          .contains('삭제')
          .click();
        cy.wait(1000);
        cy.get('[data-cy="cy_data_modal_default_button_right"]').click(); // 삭제하기 [확인]
        cy.get('[data-cy="cy_data_modal_default_button_right"]').click(); // 삭제 완료 [확인]
        cy.wait(1000);
      }
    }
  );

  cy.goHome();
});

// 베스트 지면에서 임의 상품 장바구니 담고, 장바구니로 이동
Cypress.Commands.add('addCartItemInBest', (prdqnt = 0) => {
  homePage.topNavBtn('best').click();
  // * 메인화면에서 각 지면 진입 (베스트, 마감세일, 신상품, 이벤트, 전체상품)
  for (var i = 0; i <= prdqnt; i++) {
    cy.get(
      '[data-cy="cy_data_card_product_item_' +
        i +
        '"] >> [data-cy="cy_data_card_product_button_cart"]'
    ).click();
    cy.wait(500);
    cy.get('button[data-cy="cy_data_input_stepper_button_plus"]')
      .first()
      .click();
    cy.contains('원 장바구니 담기').click();

    if (i === prdqnt) {
      cy.get('div[data-pc-fixed-style="modal-block"]');
      cy.get('a[href="/cart"]')
        .contains('바로 가기')
        .click();
      cy.get('[data-cy="cy_cart_price_button_order"]').should('be.visible','6000');

    } else {
      cy.get('div[data-pc-fixed-style="modal-block"]');
      cy.get('button')
        .contains('닫기')
        .click();
    }
  }
});

// 장바구니 아이템 모두 삭제
Cypress.Commands.add('removeCartItems', function() {
  cy.visit(this.user.visitURL + 'cart');

  cy.wait(1500);

  cy.get('body').then((body) => {
    const cart1 = body.find(
      '[data-cy*="cy_cart_panel_"]>div[data-cy*="cy_cart_panel"]'
    );
    cy.log(cart1.length);
    if (cart1.length > 0) {
      // 전체 선택 체크박스
      cy.get('[data-cy="cy_cart_panel_checkbox_select_all"]>input').check({
        force: true,
      });
      // 전체삭제 버튼 선택
      cy.get('[data-cy="cy_cart_panel_button_delete_selected"]').click();
      cy.get('[data-pc-fixed-style="modal-block"]')
        .contains('확인')
        .click();
    }
    cy.goHome();
  });

  cy.wait(2000);
});

// 주소 선택
Cypress.Commands.add('selectAddress', (keyword) => {
  cy.intercept('GET', '/api/user/shipping-address').as('address');
  cy.get('[data-cy="cy_top_nav_icon_delivery_select"]').click();

  // * 윙잇 홈 > 배송지 선택
  cy.wait('@address');

  let region = searchAddress(keyword);
  cy.get(
    '[data-cy="cy_data_address_book_item_0"]>div>div:nth-child(2)' // 배송지의 주소 영역
  ).then((body) => {
    if (!body.text().includes(region)) {
      cy.contains(region)
        .eq(0)
        .next()
        .contains('선택')
        .click();
    } else {
      cy.goHome();
    }
  });
});

// 배송지 서울로 변경
Cypress.Commands.add('resetAddress', () => {
  cy.get('[data-cy="cy_top_nav_icon_delivery_select"]').click();

  // * 윙잇 홈 > 배송지 선택
  cy.get(
    '[data-cy="cy_data_address_book_item_0"]>div>div:nth-child(2)'
    // * 배송지 선택 > 배송지의 주소 영역
  ).then((body) => {
    if (!body.text().includes('서울')) {
      cy.contains('서울')
        .next()
        .contains('선택')
        .click();
    } else {
      cy.goHome();
    }
  });
});

Cypress.Commands.add('goHome', () => {
  cy.get('body').then((body) => {
    if (body.find('[data-cy="cy_bottom_nav"]').length > 0) {
      homePage.bottomNavBtn('home').click();
    } else cy.get('[data-pc-layout="pc-left-container"]>div>a').click();
  });

  // 홈 화면 진입
});

Cypress.Commands.add('goMyWingeat', () => {
  cy.get('[data-cy="cy_bottom_nav"]>>li:nth-child(5)').click();
});

// 배송지 선택 지면 진입
Cypress.Commands.add('goHomeAddress', () => {
  cy.goHome();
  cy.get('[data-cy="cy_top_nav_icon_delivery_select"]').click();
});

Cypress.Commands.add('goMypageAddress', () => {
  // 마이윙잇 > 배송지 관리 지면 진입
  homePage.bottomNavBtn('myWingeat').click();
  cy.get("a[href='/mypage/address']").click();
});

//
Cypress.Commands.add('addCart', (n = 0) => {
  item.CartBtnInCard(n).click();
  commonCpnt.plusBtn().click();
  // cy.get('[data-cy=cy_data_input_stepper_button_plus]') // 수량 증가 버튼
  //   .eq(0)
  //   .click();
  // cy.get('[data-cy=cy_data_item_option_modal_button_cart]').click(); // 장바구니 담기 버튼
  // cy.get('[data-pc-fixed-style=modal-block')
  //   .contains('장바구니로 이동')
  //   .click(); // 장바구니 이동
});

//상세페이지에서 장바구니 담기
Cypress.Commands.add('addCart_detail', () => {
  cy.get('[data-cy="cy_data_item_detail_button_show_option"]').click();
  cy.orderInOptionModal();
  cy.goCartInModal();
});

//상세 페이지 진입
Cypress.Commands.add('enterDetail', () => {
  cy.contains("[data-cy='cy_top_nav'] li a", '베스트').click();
  cy.get('[data-cy="cy_data_card_product_list"]>li:nth-child(1)').click();
  // 1번째 상품의 상세페이지 진입
  cy.wait(500); // 베스트 지면내 n번째 상품 선택
});

// 옵션모달에서 '주문하기' 버튼 선택

// 장바구니 담기 완료 모달에서 '장바구니로 이동' 선택

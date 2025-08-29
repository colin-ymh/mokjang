import { LOCALE } from '@mokjang/constants';

export const getTranslatedMaxRegisterMember = (
  basePath: LOCALE,
  memberCount: number
): string => {
  if (basePath === LOCALE.EN) {
    if (memberCount === 1) {
      return 'Register up to 1 member';
    } else {
      return `Register up to ${memberCount} members`;
    }
  } else {
    return `최대 ${memberCount}명까지 등록`;
  }
};

export const getTranslatedVerifyNumber = (
  basePath: LOCALE,
  phone: string
): string => {
  if (basePath === LOCALE.EN) {
    return `Verify Number sent to ${phone}`;
  } else {
    return `${phone}로 인증번호가 발송되었습니다`;
  }
};

export const getTranslatedCompleteRequest = (
  basePath: LOCALE,
  churchName: string
): string => {
  if (basePath === LOCALE.EN) {
    return `${churchName} administrator registration has been requested!`;
  } else {
    return `${churchName}에 관리자 등록이 신청되었습니다!`;
  }
};

export const getTranslatedMonthlySubscriptionPrice = (
  basePath: LOCALE,
  price: number
) => {
  const formattedPrice = price.toLocaleString();

  if (basePath === LOCALE.EN) {
    return `￦ ${formattedPrice} per month`;
  } else {
    return `월 ${formattedPrice} 원`;
  }
};

export const getTranslatedYearlySubscriptionPrice = (
  basePath: LOCALE,
  price: number
) => {
  const formattedPrice = price.toLocaleString();

  if (basePath === LOCALE.EN) {
    return `￦ ${formattedPrice} per year`;
  } else {
    return `연 ${formattedPrice} 원`;
  }
};

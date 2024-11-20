// 휴대폰 번호 string을 010-xxxx-xxxx 형식으로 포맷
export const getFormattedMobilePhone = (personalPhone: string) => {
  // 숫자만 남기기
  const cleaned = personalPhone.replace(/\D/g, "");

  // 전화번호가 너무 긴 경우, 잘라내기
  const lengthLimit = 11;
  const limited = cleaned.slice(0, lengthLimit);

  // 각 구간에 하이픈(-) 추가
  if (limited.length < 4) {
    return limited;
  } else if (limited.length < 8) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
  }
};

// 집 전화번호 string을 032-xxx-xxxx, 02-xxx-xxxx 형식으로 포맷
export const getFormattedHomePhone = (homePhone: string) => {
  // 숫자만 남기기
  const cleaned = homePhone.replace(/\D/g, "");

  // 앞자리가 02 일때
  if (cleaned.slice(0, 2) === "02") {
    const lengthLimit = 9;
    const limited = cleaned.slice(0, lengthLimit);

    if (limited.length < 3) {
      return limited;
    } else if (limited.length < 6) {
      return `${limited.slice(0, 2)}-${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}-${limited.slice(2, 5)}-${limited.slice(5)}`;
    }
  }
  // 앞자리가 세자리일 때 (예: 032-xxx-xxxx)
  else {
    const lengthLimit = 10;
    const limited = cleaned.slice(0, lengthLimit);

    // 각 구간에 하이픈(-) 추가
    if (limited.length < 4) {
      return limited;
    } else if (limited.length < 7) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  }
};

// 휴대폰 번호 string을 010-xxxx-xxxx 형식으로 포맷
export const getFormattedDate = (birth: string) => {
  // 숫자만 남기기
  const cleaned = birth.replace(/\D/g, "");

  // 전화번호가 너무 긴 경우, 잘라내기
  const lengthLimit = 8;
  const limited = cleaned.slice(0, lengthLimit);

  // 각 구간에 dot(.) 추가
  if (limited.length < 5) {
    return limited;
  } else if (limited.length < 7) {
    return `${limited.slice(0, 4)}.${limited.slice(4)}`;
  } else {
    return `${limited.slice(0, 4)}.${limited.slice(4, 6)}.${limited.slice(6)}`;
  }
};

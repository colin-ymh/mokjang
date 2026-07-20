import { BLANK, LOCALE, STATUS } from '@mokjang/constants';
import {
  Notification,
  NOTIFICATION_ACTION,
  NOTIFICATION_DOMAIN,
  Payload,
  PAYLOAD_FIELD,
} from '@mokjang/models';
import { useI18n } from '../../locales/client';
import {
  getTranslatedDateFromDateString,
  getTranslatedTerm,
} from '@mokjang/utils';

// 번역 함수 타입. 훅은 컴포넌트에서 useI18n()으로 한 번 호출해 아래 함수들에 주입한다
// (유틸 내부에서 훅을 호출하면 rules-of-hooks 위반).
type TFn = ReturnType<typeof useI18n>;

/**
 * payload에서 특정 필드의 이전/이후 값을 추출
 */
const findFieldChange = (payload: Payload[], field: string) => {
  const p = payload.find((p) => p.fields === field);
  return { prev: p?.previous ?? BLANK, curr: p?.current ?? BLANK };
};

/**
 * 한국어 기준 문구 생성
 */
function getKoMention(n: Notification, t: TFn): string {
  const action = n.action!;
  const domain = n.domain;

  let domainTitle = n.domainTitle;

  if (domain === NOTIFICATION_DOMAIN.EDUCATION_TERM) {
    const [education, term] = domainTitle.split('__');
    domainTitle = `${education} ${getTranslatedTerm(LOCALE.KO, term)}`;
  }

  if (domain === NOTIFICATION_DOMAIN.EDUCATION_SESSION) {
    const [education, term, session] = domainTitle.split('__');
    domainTitle = `${education} ${getTranslatedTerm(LOCALE.KO, term)} ${session}`;
  }

  const { prev, curr } = findFieldChange(n.payload, 'status');

  if (domain === NOTIFICATION_DOMAIN.MANAGER) {
    if (n.domainTitle) {
      return `[${t(domain)}] ${n.domainTitle}의 관리자 권한이 변경되었습니다.`;
    } else {
      return `[${t(domain)}] 당신의 관리자 권한이 변경되었습니다.`;
    }
  }

  if (domain === NOTIFICATION_DOMAIN.PERMISSION) {
    if (n.payload.length > 0) {
      return `[${t(domain)}] 당신의 권한 유형이 변경되었습니다.`;
    }
  }

  if (domain === NOTIFICATION_DOMAIN.CHURCH_INFO) {
    return `[${t(domain)}] 교회 정보가 변경되었습니다.`;
  }

  switch (action) {
    case NOTIFICATION_ACTION.CREATED:
      return `[${t(domain)}] "${domainTitle}"이 생성되었습니다.`;
    case NOTIFICATION_ACTION.UPDATED:
      return `[${t(domain)}] "${domainTitle}"이 수정되었습니다.`;
    case NOTIFICATION_ACTION.STATUS_UPDATED:
      return `[${t(domain)}] "${domainTitle}"의 상태가 '${t(prev as STATUS)}'에서 '${t(curr as STATUS)}'으로 변경되었습니다.`;
    case NOTIFICATION_ACTION.DELETED:
      return `[${t(domain)}] "${domainTitle}"이 삭제되었습니다.`;
    case NOTIFICATION_ACTION.IN_CHARGE_ADDED:
      return `[${t(domain)}] "${domainTitle}"의 담당자로 지정되었습니다.`;
    case NOTIFICATION_ACTION.IN_CHARGE_REMOVED:
      return `[${t(domain)}] "${domainTitle}"의 담당자에서 제외되었습니다.`;
    case NOTIFICATION_ACTION.IN_CHARGE_CHANGED:
      return `[${t(domain)}] "${domainTitle}"의 담당자가 변경되었습니다.`;
    case NOTIFICATION_ACTION.REPORT_ADDED:
      return `[${t(domain)}] "${domainTitle}"의 보고대상자로 추가되었습니다.`;
    case NOTIFICATION_ACTION.REPORT_REMOVED:
      return `[${t(domain)}] "${domainTitle}"의 보고대상자에서 제외되었습니다.`;
    default:
      return `[${t(domain)}] "${domainTitle}" 알림`;
  }
}

/**
 * 영어 기준 문구 생성
 */
function getEnMention(n: Notification, t: TFn): string {
  const action = n.action!;
  const domain = n.domain;
  let domainTitle = n.domainTitle;

  if (domain === NOTIFICATION_DOMAIN.EDUCATION_TERM) {
    const [education, term] = domainTitle.split('__');
    domainTitle = `${education} ${getTranslatedTerm(LOCALE.EN, term)}`;
  }

  if (domain === NOTIFICATION_DOMAIN.EDUCATION_SESSION) {
    const [education, term, session] = domainTitle.split('__');
    domainTitle = `${education} ${getTranslatedTerm(LOCALE.EN, term)} ${session}`;
  }

  const { prev, curr } = findFieldChange(n.payload, 'status');

  if (domain === NOTIFICATION_DOMAIN.MANAGER) {
    if (n.domainTitle) {
      return `[${t(domain)}] ${n.domainTitle}'s manager permission has been changed.`;
    } else {
      return `[${t(domain)}] Your manager permission has been changed.`;
    }
  }

  if (domain === NOTIFICATION_DOMAIN.PERMISSION) {
    if (n.payload.length > 0) {
      return `[${t(domain)}] Your permission type has been changed.`;
    }
  }

  if (domain === NOTIFICATION_DOMAIN.CHURCH_INFO) {
    return `[${t(domain)}] Church information has been changed.`;
  }

  switch (action) {
    case NOTIFICATION_ACTION.CREATED:
      return `[${t(domain)}] "${domainTitle}" has been created.`;
    case NOTIFICATION_ACTION.UPDATED:
      return `[${t(domain)}] "${domainTitle}" has been updated.`;
    case NOTIFICATION_ACTION.STATUS_UPDATED:
      return `[${t(domain)}] Status of "${domainTitle}" changed from  ${t(prev as STATUS)} to  ${t(curr as STATUS)}.`;
    case NOTIFICATION_ACTION.DELETED:
      return `[${t(domain)}] "${domainTitle}" has been deleted.`;
    case NOTIFICATION_ACTION.IN_CHARGE_ADDED:
      return `[${t(domain)}] You have been assigned as a person in charge of "${domainTitle}".`;
    case NOTIFICATION_ACTION.IN_CHARGE_REMOVED:
      return `[${t(domain)}] You have been removed from the person in charge of "${domainTitle}".`;
    case NOTIFICATION_ACTION.IN_CHARGE_CHANGED:
      return `[${t(domain)}] The person in charge of "${domainTitle}" has been changed.`;
    case NOTIFICATION_ACTION.REPORT_ADDED:
      return `[${t(domain)}] You have been added as a report recipient for "${domainTitle}".`;
    case NOTIFICATION_ACTION.REPORT_REMOVED:
      return `[${t(domain)}] You have been removed from the report recipient of "${domainTitle}".`;
    default:
      return `[${t(domain)}] Notification for "${domainTitle}".`;
  }
}

/**
 * 메인 함수: 로케일별 알림 문구 생성
 */
export const getTranslatedNotificationMention = (
  basePath: LOCALE,
  notification: Notification,
  t: TFn
): string => {
  if (basePath === LOCALE.KO) {
    return getKoMention(notification, t);
  } else {
    return getEnMention(notification, t);
  }
};

/** 변경된 모든 필드 목록을 배열로 반환 */
const listAllChanges = (
  domain: NOTIFICATION_DOMAIN | undefined,
  payload: Payload[],
  locale: LOCALE,
  t: TFn
): string[] => {
  if (!payload?.length) return [];

  // 상태 제외(메인에 이미 포함)하고 나머지 변경을 나열
  const rows = payload
    .filter((p) => p.fields && p.fields !== PAYLOAD_FIELD.STATUS)
    .map((p) => {
      // ✅ members면 별도 문구 처리
      if (p.fields === PAYLOAD_FIELD.MEMBERS) {
        return locale === LOCALE.KO
          ? '대상 교인이 변경되었습니다.'
          : 'Target members have been changed.';
      }

      const l = t(p.fields);
      const prev =
        p.fields === PAYLOAD_FIELD.START_DATE ||
        p.fields === PAYLOAD_FIELD.END_DATE
          ? getTranslatedDateFromDateString(locale, p.previous as string)
          : String(p.previous ?? BLANK);
      const curr =
        p.fields === PAYLOAD_FIELD.START_DATE ||
        p.fields === PAYLOAD_FIELD.END_DATE
          ? getTranslatedDateFromDateString(locale, p.current as string)
          : String(p.current ?? BLANK);

      return locale === LOCALE.KO
        ? `${l} 변경: ${prev} → ${curr}`
        : `${l} changed: ${prev} → ${curr}`;
    });

  return rows; // 문자열 배열 반환
};

/** 한국어 서브멘트 */
function getKoSubMentions(n: Notification, t: TFn): string[] {
  const action = n.action!;
  const domain = n.domain;

  // 도메인 특수 규칙
  if (domain === NOTIFICATION_DOMAIN.MANAGER) {
    return ['관리자 권한을 확인하십시오'];
  }
  if (domain === NOTIFICATION_DOMAIN.PERMISSION) {
    return ['관리자 권한을 확인하십시오'];
  }
  if (domain === NOTIFICATION_DOMAIN.CHURCH_INFO) {
    return ['변경된 내용을 확인하세요'];
  }
  // if (domain === NOTIFICATION_DOMAIN.WORSHIP_ATTENDANCE) {
  //   const rate =
  //     typeof n.sourceInfo?.attendanceRate === 'number'
  //       ? n.sourceInfo.attendanceRate
  //       : undefined;
  //   // 생성/미입력/완료는 서버 액션 구분이 없다면 title에서만 처리되므로,
  //   // 이 서브멘트는 생성/미입력/완료 케이스 모두 대응
  //   if (action === NOTIFICATION_ACTION.CREATED) {
  //     return '예배와 출석내용을 입력해주세요';
  //   }
  //   if (rate != null) {
  //     return `현재 출석체크률 ${rate}%`;
  //   }
  //   return BLANK;
  // }

  // 일반 규칙
  switch (action) {
    case NOTIFICATION_ACTION.CREATED:
      return [BLANK]; // 생성은 보통 서브멘트 없음(필요 시 확장)
    case NOTIFICATION_ACTION.DELETED:
      return [BLANK]; // 삭제는 서브멘트 없음
    case NOTIFICATION_ACTION.STATUS_UPDATED:
      // 상태 변경은 메인 멘션에 충분 — 서브멘트 없음
      return [BLANK];
    case NOTIFICATION_ACTION.IN_CHARGE_CHANGED: {
      const { prev, curr } = findFieldChange(n.payload, 'inCharge');
      if (prev || curr) return [`변경: ${prev} → ${curr}`];
      return [BLANK];
    }
    case NOTIFICATION_ACTION.UPDATED: {
      // 단일/다중 메타 변경 모두 표시
      const lines = listAllChanges(domain, n.payload, LOCALE.KO, t);
      return lines;
    }
    case NOTIFICATION_ACTION.IN_CHARGE_ADDED:
    case NOTIFICATION_ACTION.IN_CHARGE_REMOVED:
    case NOTIFICATION_ACTION.REPORT_ADDED:
    case NOTIFICATION_ACTION.REPORT_REMOVED:
      // 추가/제외류는 서브멘트 없음
      return [BLANK];
    default:
      return [BLANK];
  }
}

/** 영어 서브멘트 */
function getEnSubMentions(n: Notification, t: TFn): string[] {
  const action = n.action!;
  const domain = n.domain;

  if (domain === NOTIFICATION_DOMAIN.MANAGER) {
    return ['Please review your manager permissions.'];
  }
  if (domain === NOTIFICATION_DOMAIN.PERMISSION) {
    return ['Please review your permission settings.'];
  }
  if (domain === NOTIFICATION_DOMAIN.CHURCH_INFO) {
    return ['Please review the changes.'];
  }
  // if (domain === NOTIFICATION_DOMAIN.WORSHIP_ATTENDANCE) {
  //   const rate =
  //     typeof n.sourceInfo?.attendanceRate === 'number'
  //       ? n.sourceInfo.attendanceRate
  //       : undefined;
  //   if (action === NOTIFICATION_ACTION.CREATED) {
  //     return 'Please fill in the attendance.';
  //   }
  //   if (rate != null) {
  //     return `Current attendance rate ${rate}%`;
  //   }
  //   return BLANK;
  // }

  switch (action) {
    case NOTIFICATION_ACTION.CREATED:
      return [BLANK];
    case NOTIFICATION_ACTION.DELETED:
      return [BLANK];
    case NOTIFICATION_ACTION.STATUS_UPDATED:
      return [BLANK];
    case NOTIFICATION_ACTION.IN_CHARGE_CHANGED: {
      const { prev, curr } = findFieldChange(n.payload, 'inCharge');
      if (prev || curr) return [`Changed: ${prev} → ${curr}`];
      return [BLANK];
    }
    case NOTIFICATION_ACTION.UPDATED: {
      const lines = listAllChanges(domain, n.payload, LOCALE.EN, t);
      return lines;
    }
    case NOTIFICATION_ACTION.IN_CHARGE_ADDED:
    case NOTIFICATION_ACTION.IN_CHARGE_REMOVED:
    case NOTIFICATION_ACTION.REPORT_ADDED:
    case NOTIFICATION_ACTION.REPORT_REMOVED:
      return [BLANK];
    default:
      return [BLANK];
  }
}

/** 공개 함수: 로케일별 서브멘트 생성 */
export const getTranslatedNotificationSubMentions = (
  basePath: LOCALE,
  notification: Notification,
  t: TFn
): string[] => {
  if (basePath === LOCALE.KO) return getKoSubMentions(notification, t);
  return getEnSubMentions(notification, t);
};

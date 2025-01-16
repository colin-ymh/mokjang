import {
  MANAGEMENT_CONTENT_ID,
  MEMBER_CONTENT_ID,
} from '@/constants/layout/content';
import {
  EDUCATION_MANAGEMENT_HEADER_ID,
  EDUCATION_TERM_HEADER_ID,
  GROUP_MANAGEMENT_HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
} from '@/constants/layout/header';

import { useI18n, useScopedI18n } from '../../../locales/client';
import { EducationSession } from '@/models/management/management';

export const useMemberHeaderBarItems = () => {
  const t_memberContent = useScopedI18n('member-content');

  const items = [
    {
      id: MEMBER_CONTENT_ID.MEMBER,
      title: t_memberContent(MEMBER_CONTENT_ID.MEMBER),
    },
    {
      id: MEMBER_CONTENT_ID.ADMINISTRATOR,
      title: t_memberContent(MEMBER_CONTENT_ID.ADMINISTRATOR),
    },
    {
      id: MEMBER_CONTENT_ID.NEW_MEMBER,
      title: t_memberContent(MEMBER_CONTENT_ID.NEW_MEMBER),
    },
  ];

  return items;
};

export const useMemberInformationHeaderBarItems = () => {
  const t = useI18n();
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION),
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION),
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.OFFICER,
      title: t(MEMBER_INFORMATION_HEADER_ID.OFFICER),
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.GROUP,
      title: t(MEMBER_INFORMATION_HEADER_ID.GROUP),
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.MINISTRY,
      title: t(MEMBER_INFORMATION_HEADER_ID.MINISTRY),
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.EDUCATION,
      title: t(MEMBER_INFORMATION_HEADER_ID.EDUCATION),
    },
  ];

  return items;
};

export const useManagementHeaderBarItems = () => {
  const t = useI18n();

  const items = [
    {
      id: MANAGEMENT_CONTENT_ID.GROUP,
      title: t(MANAGEMENT_CONTENT_ID.GROUP),
    },
    {
      id: MANAGEMENT_CONTENT_ID.OFFICER,
      title: t(MANAGEMENT_CONTENT_ID.OFFICER),
    },
    {
      id: MANAGEMENT_CONTENT_ID.MINISTRY,
      title: t(MANAGEMENT_CONTENT_ID.MINISTRY),
    },
    {
      id: MANAGEMENT_CONTENT_ID.EDUCATION,
      title: t(MANAGEMENT_CONTENT_ID.EDUCATION),
    },
  ];

  return items;
};

export const useGroupManagementHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: GROUP_MANAGEMENT_HEADER_ID.GROUP_INFORMATION,
      title: t_header(GROUP_MANAGEMENT_HEADER_ID.GROUP_INFORMATION),
    },
    {
      id: GROUP_MANAGEMENT_HEADER_ID.MEMBER_LIST,
      title: t_header(GROUP_MANAGEMENT_HEADER_ID.MEMBER_LIST),
    },
  ];

  return items;
};

export const useEducationManagementHeaderBarItems = () => {
  const t = useI18n();

  const items = [
    {
      id: EDUCATION_MANAGEMENT_HEADER_ID.TERM,
      title: t(EDUCATION_MANAGEMENT_HEADER_ID.TERM),
    },
  ];

  return items;
};

export const useTermInformationHeaderBarItems = (
  sessions: EducationSession[]
) => {
  const t = useI18n();

  const items = [
    {
      id: EDUCATION_TERM_HEADER_ID.INFORMATION,
      title: t(EDUCATION_TERM_HEADER_ID.INFORMATION),
    },
    ...sessions.map((session) => ({
      id: session.id,
      title: `${session.session}${t('session')}`,
    })),
  ];

  return items;
};

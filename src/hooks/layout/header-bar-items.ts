import {
  ADMINISTRATOR_CONTENT_ID,
  CHURCH_CONTENT_ID,
  MEMBER_CONTENT_ID,
  VISITATION_CONTENT_ID,
} from '@/constants/layout/content';
import {
  EDUCATION_MANAGEMENT_HEADER_ID,
  EDUCATION_TERM_HEADER_ID,
  GROUP_MANAGEMENT_HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
  MINISTRY_MANAGEMENT_HEADER_ID,
} from '@/constants/layout/header';
import { EducationSession } from '@/models/management/management';

import { useI18n, useScopedI18n } from '../../../locales/client';

export const useMainMemberHeaderBarItems = () => {
  const t_memberContent = useScopedI18n('member-content');

  const items = [
    {
      id: MEMBER_CONTENT_ID.ALL,
      title: t_memberContent(MEMBER_CONTENT_ID.ALL),
    },
    {
      id: MEMBER_CONTENT_ID.ADMINISTRATOR,
      title: t_memberContent(MEMBER_CONTENT_ID.ADMINISTRATOR),
    },
    {
      id: MEMBER_CONTENT_ID.NEW,
      title: t_memberContent(MEMBER_CONTENT_ID.NEW),
    },
  ];

  return items;
};

export const useMainVisitationHeaderBarItems = () => {
  const t_visitationContent = useScopedI18n('visitation-content');

  const items = [
    {
      id: VISITATION_CONTENT_ID.ALL,
      title: t_visitationContent(VISITATION_CONTENT_ID.ALL),
    },
    {
      id: VISITATION_CONTENT_ID.MY,
      title: t_visitationContent(VISITATION_CONTENT_ID.MY),
    },
  ];

  return items;
};

export const useMainTaskHeaderBarItems = () => {
  const t_visitationContent = useScopedI18n('visitation-content');

  const items = [
    {
      id: VISITATION_CONTENT_ID.ALL,
      title: t_visitationContent(VISITATION_CONTENT_ID.ALL),
    },
    {
      id: VISITATION_CONTENT_ID.MY,
      title: t_visitationContent(VISITATION_CONTENT_ID.MY),
    },
  ];

  return items;
};

export const useMainEducationHeaderBarItems = () => {
  const t_visitationContent = useScopedI18n('visitation-content');

  const items = [
    {
      id: VISITATION_CONTENT_ID.ALL,
      title: t_visitationContent(VISITATION_CONTENT_ID.ALL),
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

export const useManagementChurchHeaderBarItems = () => {
  const t = useI18n();

  const items = [
    {
      id: CHURCH_CONTENT_ID.GROUP,
      title: t(CHURCH_CONTENT_ID.GROUP),
    },
    {
      id: CHURCH_CONTENT_ID.OFFICER,
      title: t(CHURCH_CONTENT_ID.OFFICER),
    },
    {
      id: CHURCH_CONTENT_ID.MINISTRY,
      title: t(CHURCH_CONTENT_ID.MINISTRY),
    },
  ];

  return items;
};

export const useManagementAdministratorHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: ADMINISTRATOR_CONTENT_ID.SETTING,
      title: t_header(ADMINISTRATOR_CONTENT_ID.SETTING),
    },
    {
      id: ADMINISTRATOR_CONTENT_ID.ADD,
      title: t_header(ADMINISTRATOR_CONTENT_ID.ADD),
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

export const useMinistryManagementHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION,
      title: t_header(MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION),
    },
    {
      id: MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_MEMBER_LIST,
      title: t_header(MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_MEMBER_LIST),
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

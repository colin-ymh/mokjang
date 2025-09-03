import {
  ATTENDANCE_CONTENT_ID,
  CHURCH_CONTENT_ID,
  EDUCATION_CONTENT_ID,
  EDUCATION_SESSION_CONTENT_ID,
  EDUCATION_TERM_CONTENT_ID,
  MANAGER_CONTENT_ID,
  MEMBER_CONTENT_ID,
  TASK_CONTENT_ID,
  VISITATION_CONTENT_ID,
} from '../../constants/layout/content';
import {
  EDIT_MEMBER_HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
} from '../../constants/layout/header';

import { useI18n, useScopedI18n } from '../../../locales/client';
import { MEMBER_TABLE_HEADER_ITEM } from '../../redux/reducers/filter/member-filter-reducer';
import { MEMBER } from '../../constants/column/member-column';

import User from '../../../public/svg/user.svg';
import Users from '../../../public/svg/users.svg';
import Heart from '../../../public/svg/heart.svg';
import Calendar from '../../../public/svg/calendar.svg';
import Clock from '../../../public/svg/clock.svg';

export const useMainMemberHeaderBarItems = () => {
  const t_memberContent = useScopedI18n('member-content');

  const items = [
    {
      id: MEMBER_CONTENT_ID.ALL,
      title: t_memberContent(MEMBER_CONTENT_ID.ALL),
    },
    {
      id: MEMBER_CONTENT_ID.MANAGER,
      title: t_memberContent(MEMBER_CONTENT_ID.MANAGER),
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
    {
      id: VISITATION_CONTENT_ID.REPORTED,
      title: t_visitationContent(VISITATION_CONTENT_ID.REPORTED),
    },
  ];

  return items;
};

export const useMainTaskHeaderBarItems = () => {
  const t_taskContent = useScopedI18n('task-content');

  const items = [
    {
      id: TASK_CONTENT_ID.ALL,
      title: t_taskContent(TASK_CONTENT_ID.ALL),
    },
    {
      id: TASK_CONTENT_ID.MY,
      title: t_taskContent(TASK_CONTENT_ID.MY),
    },
    {
      id: TASK_CONTENT_ID.REPORTED,
      title: t_taskContent(TASK_CONTENT_ID.REPORTED),
    },
  ];

  return items;
};

export const useMainEducationHeaderBarItems = () => {
  const t_educationContent = useScopedI18n('education-content');

  const items = [
    {
      id: EDUCATION_CONTENT_ID.ALL,
      title: t_educationContent(EDUCATION_CONTENT_ID.ALL),
    },
    {
      id: EDUCATION_CONTENT_ID.IN_PROGRESS,
      title: t_educationContent(EDUCATION_CONTENT_ID.IN_PROGRESS),
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
      icon: User,
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION),
      icon: Users,
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.VISITATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.VISITATION),
      icon: Heart,
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.ATTENDANCE,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.ATTENDANCE),
      icon: Calendar,
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.HISTORY,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.HISTORY),
      icon: Clock,
    },
  ];

  return items;
};

export const useEditMemberHeaderBarItems = () => {
  const t = useI18n();

  const items = [
    {
      id: EDIT_MEMBER_HEADER_ID.BASIC_INFORMATION,
      title: t(EDIT_MEMBER_HEADER_ID.BASIC_INFORMATION),
      icon: User,
    },
    {
      id: EDIT_MEMBER_HEADER_ID.PERSONAL_INFORMATION,
      title: t(EDIT_MEMBER_HEADER_ID.PERSONAL_INFORMATION),
      icon: Users,
    },
    {
      id: EDIT_MEMBER_HEADER_ID.CHURCH_INFORMATION,
      title: t(EDIT_MEMBER_HEADER_ID.CHURCH_INFORMATION),
      icon: Heart,
    },
  ];

  return items;
};

export const useManagementChurchHeaderBarItems = () => {
  const t = useI18n();

  const items = [
    {
      id: CHURCH_CONTENT_ID.CHURCH,
      title: t(CHURCH_CONTENT_ID.CHURCH),
    },
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

export const useManagerHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: MANAGER_CONTENT_ID.MANAGER,
      title: t_header(MANAGER_CONTENT_ID.MANAGER),
    },
    {
      id: MANAGER_CONTENT_ID.JOIN,
      title: t_header(MANAGER_CONTENT_ID.JOIN),
    },
  ];

  return items;
};

export const useAttendanceHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: ATTENDANCE_CONTENT_ID.WORSHIP,
      title: t_header(ATTENDANCE_CONTENT_ID.WORSHIP),
    },
    {
      id: ATTENDANCE_CONTENT_ID.ATTENDANCE,
      title: t_header(ATTENDANCE_CONTENT_ID.ATTENDANCE),
    },
  ];

  return items;
};

export const useEducationTermHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      value: EDUCATION_TERM_CONTENT_ID.SESSIONS,
      title: t_header(EDUCATION_TERM_CONTENT_ID.SESSIONS),
    },
    {
      value: EDUCATION_TERM_CONTENT_ID.ENROLLMENTS,
      title: t_header(EDUCATION_TERM_CONTENT_ID.ENROLLMENTS),
    },
  ];

  return items;
};

export const useEducationSessionHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      value: EDUCATION_SESSION_CONTENT_ID.CONTENT,
      title: t_header(EDUCATION_SESSION_CONTENT_ID.CONTENT),
    },
    {
      value: EDUCATION_SESSION_CONTENT_ID.ATTENDANCE,
      title: t_header(EDUCATION_SESSION_CONTENT_ID.ATTENDANCE),
    },
  ];

  return items;
};

export const useManagementHeaderBarItems = (id: CHURCH_CONTENT_ID) => {
  switch (id) {
    case CHURCH_CONTENT_ID.OFFICER:
      return [
        {
          id: MEMBER.NAME,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: true,
          isDate: false,
        },
        {
          id: MEMBER.GROUP,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
        {
          id: MEMBER.AGE,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
        {
          id: MEMBER.MOBILE_PHONE,
          isShown: true,
          isSortable: false,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
      ] as MEMBER_TABLE_HEADER_ITEM[];

    case CHURCH_CONTENT_ID.GROUP:
      return [
        {
          id: MEMBER.NAME,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: true,
          isDate: false,
        },
        {
          id: MEMBER.OFFICER,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
        {
          id: MEMBER.AGE,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
        {
          id: MEMBER.MOBILE_PHONE,
          isShown: true,
          isSortable: false,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
      ] as MEMBER_TABLE_HEADER_ITEM[];

    case CHURCH_CONTENT_ID.MINISTRY:
      return [
        {
          id: MEMBER.NAME,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: true,
          isDate: false,
        },
        {
          id: MEMBER.OFFICER,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
        {
          id: MEMBER.MINISTRIES,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
        {
          id: MEMBER.AGE,
          isShown: true,
          isSortable: true,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
        {
          id: MEMBER.MOBILE_PHONE,
          isShown: true,
          isSortable: false,
          isFilterable: false,
          isFixed: false,
          isDate: false,
        },
      ] as MEMBER_TABLE_HEADER_ITEM[];
    default:
      return [] as MEMBER_TABLE_HEADER_ITEM[];
  }
};

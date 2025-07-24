import {
  ATTENDANCE_CONTENT_ID,
  CHURCH_CONTENT_ID,
  EDUCATION_CONTENT_ID,
  MEMBER_CONTENT_ID,
  TASK_CONTENT_ID,
  VISITATION_CONTENT_ID,
} from '@/constants/layout/content';
import {
  CHURCH_USER_HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
  MINISTRY_MANAGEMENT_HEADER_ID,
  PERMISSION_TEMPLATE_HEADER_ID,
} from '@/constants/layout/header';

import { useI18n, useScopedI18n } from '../../../locales/client';
import { TABLE_HEADER_ITEM } from '@/redux/reducers/filter/member-filter-reducer';
import { MEMBER } from '@/constants/column/member-column';

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

export const useMinistryManagementHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    // {
    //   id: MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION,
    //   title: t_header(MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION),
    // },
    {
      id: MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_MEMBER_LIST,
      title: t_header(MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_MEMBER_LIST),
    },
  ];

  return items;
};

export const usePermissionTemplateHeaderBarItems = () => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: PERMISSION_TEMPLATE_HEADER_ID.PERMISSION_UNIT,
      title: t_header(PERMISSION_TEMPLATE_HEADER_ID.PERMISSION_UNIT),
    },
    {
      id: PERMISSION_TEMPLATE_HEADER_ID.MANAGER,
      title: t_header(PERMISSION_TEMPLATE_HEADER_ID.MANAGER),
    },
  ];

  return items;
};

export const useChurchUserHeaderBarItems = (isManager: boolean) => {
  const t_header = useScopedI18n('header');

  const items = [
    {
      id: CHURCH_USER_HEADER_ID.ACCOUNT,
      title: t_header(CHURCH_USER_HEADER_ID.ACCOUNT),
    },
  ];

  if (isManager) {
    items.push({
      id: CHURCH_USER_HEADER_ID.PERMISSION,
      title: t_header(CHURCH_USER_HEADER_ID.PERMISSION),
    });
  }

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
      ] as TABLE_HEADER_ITEM[];

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
      ] as TABLE_HEADER_ITEM[];

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
      ] as TABLE_HEADER_ITEM[];
    default:
      return [] as TABLE_HEADER_ITEM[];
  }
};

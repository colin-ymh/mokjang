import {
  MAIN_HEADER_ID,
  MANAGEMENT_HEADER_ID,
} from '../../constants/layout/header';

import { useScopedI18n } from '../../../locales/client';

import Home from '../../../public/svg/home.svg';
import Users from '../../../public/svg/users.svg';
import Book from '../../../public/svg/book.svg';
import Heart from '../../../public/svg/heart.svg';
import Briefcase from '../../../public/svg/briefcase.svg';
import AcademicCap from '../../../public/svg/academic-cap.svg';
import Calendar from '../../../public/svg/calendar.svg';
import Cross from '../../../public/svg/cross.svg';
import { usePageRouter } from '../../utils/router';

export const useMainSideBarItems = () => {
  const t_header = useScopedI18n('header');
  const router = usePageRouter();

  const items = [
    {
      id: MAIN_HEADER_ID.HOME,
      title: t_header(MAIN_HEADER_ID.HOME),
      onClick: () => router.push(`/main/home`),
      icon: Home,
    },
    {
      id: MAIN_HEADER_ID.MEMBER,
      title: t_header(MAIN_HEADER_ID.MEMBER),
      onClick: () => router.push(`/main/member/all`),
      icon: Users,
    },
    {
      id: MAIN_HEADER_ID.WORSHIP,
      title: `${t_header(MAIN_HEADER_ID.WORSHIP)}`,
      onClick: () => router.push(`/main/worship`),
      icon: Cross,
    },
    {
      id: MAIN_HEADER_ID.ATTENDANCE,
      title: `${t_header(MAIN_HEADER_ID.ATTENDANCE)}`,
      onClick: () => router.push(`/main/attendance`),
      icon: Book,
    },
    {
      id: MAIN_HEADER_ID.VISITATION,
      title: t_header(MAIN_HEADER_ID.VISITATION),
      onClick: () => router.push(`/main/visitation/all`),
      icon: Heart,
    },
    {
      id: MAIN_HEADER_ID.TASK,
      title: t_header(MAIN_HEADER_ID.TASK),
      onClick: () => router.push(`/main/task/all`),
      icon: Briefcase,
    },
    {
      id: MAIN_HEADER_ID.EDUCATION,
      title: t_header(MAIN_HEADER_ID.EDUCATION),
      onClick: () => router.push(`/main/education/all`),
      icon: AcademicCap,
    },
    {
      id: MAIN_HEADER_ID.CALENDAR,
      title: t_header(MAIN_HEADER_ID.CALENDAR),
      onClick: () => router.push(`/main/calendar`),
      icon: Calendar,
    },
  ];

  return items;
};

export const useManagementSideBarItems = () => {
  const t_header = useScopedI18n('header');
  const router = usePageRouter();

  const items = [
    {
      id: MANAGEMENT_HEADER_ID.CHURCH,
      title: t_header(MANAGEMENT_HEADER_ID.CHURCH),
      onClick: () => router.push(`/management/church/church`),
      icon: Users,
    },
    {
      id: MANAGEMENT_HEADER_ID.MANAGER,
      title: t_header(MANAGEMENT_HEADER_ID.MANAGER),
      onClick: () => router.push(`/management/manager/`),
      icon: Book,
    },
    {
      id: MANAGEMENT_HEADER_ID.PERMISSION,
      title: t_header(MANAGEMENT_HEADER_ID.PERMISSION),
      onClick: () => router.push(`/management/permission`),
      icon: Heart,
    },
    {
      id: MANAGEMENT_HEADER_ID.JOIN,
      title: t_header(MANAGEMENT_HEADER_ID.JOIN),
      onClick: () => router.push(`/management/join`),
      icon: Briefcase,
    },
    {
      id: MANAGEMENT_HEADER_ID.USER,
      title: t_header(MANAGEMENT_HEADER_ID.USER),
      onClick: () => router.push(`/management/user`),
      icon: AcademicCap,
    },
    {
      id: MANAGEMENT_HEADER_ID.SETTING,
      title: t_header(MANAGEMENT_HEADER_ID.SETTING),
      onClick: () => router.push(`/management/setting`),
      icon: Calendar,
    },
  ];

  return items;
};

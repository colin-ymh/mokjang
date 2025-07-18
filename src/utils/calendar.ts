import {
  Schedule,
  ServerReportedSchedule,
  ServerSchedule,
} from '@/models/calendar/calendar';
import { Task } from '@/models/task/task';
import { Visitation } from '@/models/visitation/visitation';
import { Member } from '@/models/member/member';
import { DOMAIN } from '@/models/permission/permission';
import KoreanLunarCalendar from 'korean-lunar-calendar';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import dayjs from 'dayjs';
import { ChurchEvent } from '@/models/church-event/church-event';
import { EducationSession } from '@/models/education/education';
import { Holiday } from '@/api/holiday-api';
import { getFormattedDate } from '@/utils/format';

export const getScheduleFromTask = (event: Task): Schedule => {
  return {
    id: `${DOMAIN.TASK}-${event.id}`,
    title: event.title,
    allDay: false,
    start: event.startDate,
    end: event.endDate,
    task: event,
  };
};

export const getScheduleFromVisitation = (event: Visitation): Schedule => {
  return {
    id: `${DOMAIN.VISITATION}-${event.id}`,
    title: event.title,
    allDay: false,
    start: event.startDate,
    end: event.endDate,
    visitation: event,
  };
};

export const getScheduleFromEducation = (event: EducationSession): Schedule => {
  return {
    id: `${DOMAIN.EDUCATION}-${event.id}`,
    title: event.title,
    allDay: false,
    start: event.startDate,
    end: event.endDate,
    education: event,
  };
};

export const getScheduleFromChurchEvent = (event: ChurchEvent): Schedule => {
  return {
    id: `${DOMAIN.CHURCH_EVENT}-${event.id}`,
    title: event.title,
    allDay: true,
    start: event.date,
    end: event.date,
    churchEvent: event,
  };
};

export const getScheduleFromBirthday = (
  fromDate: string,
  toDate: string,
  event: Member
): Schedule => {
  const from = dayjs(fromDate);
  const to = dayjs(toDate);

  let targetDate: dayjs.Dayjs;

  if (event.isLunar && event.birth) {
    const lunarDate = getDateFromDateString(event.birth);
    const calendar = new KoreanLunarCalendar();

    // 먼저 fromDate 기준 변환
    calendar.setLunarDate(
      from.year(),
      lunarDate.getMonth() + 1,
      lunarDate.getDate(),
      event.isLeafMonth
    );
    const fromConverted = dayjs(
      `${calendar.getSolarCalendar().year}-${String(calendar.getSolarCalendar().month).padStart(2, '0')}-${String(calendar.getSolarCalendar().day).padStart(2, '0')}`
    );

    // from~to 사이에 포함되면 그 날짜로
    if (from <= fromConverted && fromConverted <= to) {
      targetDate = fromConverted;
    } else {
      // to 기준 변환
      calendar.setLunarDate(
        to.year(),
        lunarDate.getMonth() + 1,
        lunarDate.getDate(),
        event.isLeafMonth
      );
      const toConverted = dayjs(
        `${calendar.getSolarCalendar().year}-${String(calendar.getSolarCalendar().month).padStart(2, '0')}-${String(calendar.getSolarCalendar().day).padStart(2, '0')}`
      );

      targetDate = toConverted;
    }
  } else if (event.birthdayMMDD) {
    const [monthStr, dayStr] = event.birthdayMMDD.split('-');

    // 현재 날짜 구간 중 해당 생일이 포함되는 연도 판단
    const fromMonthDay = dayjs(`${from.year()}-${monthStr}-${dayStr}`);
    const toMonthDay = dayjs(`${to.year()}-${monthStr}-${dayStr}`);

    if (from <= fromMonthDay && fromMonthDay <= to) {
      targetDate = fromMonthDay;
    } else {
      targetDate = toMonthDay;
    }
  } else {
    return null as any; // 데이터 누락
  }

  return {
    id: `${DOMAIN.MEMBER}-${event.id}`,
    title: getBirthdayTitle(event),
    allDay: true,
    start: getDateStringFromDate(targetDate.toDate()),
    end: getDateStringFromDate(targetDate.toDate()),
    member: event,
  };
};

const getBirthdayTitle = (member: Member) => {
  if (member.officer) {
    return `${member.name} ${member.officer.name} 생일`;
  } else {
    return `${member.name} 생일`;
  }
};

export const getScheduleFromHoliday = (event: Holiday): Schedule => {
  return {
    id: `${DOMAIN.HOLIDAY}-${event.dateName}`,
    title: event.dateName,
    allDay: true,
    start: getFormattedDate(event.locdate.toString()),
    end: getFormattedDate(event.locdate.toString()),
  };
};

export const getMyWidgetSchedule = (event: ServerSchedule) => {
  return {
    id: `${event.type}-${event.id}`,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    status: event.status,
  } as Schedule;
};

export const getReportedWidgetSchedule = (event: ServerReportedSchedule) => {
  return {
    id: `${event.type}-${event.id}`,
    title: event.schedule.title,
    start: event.schedule.startDate,
    end: event.schedule.endDate,
    status: event.schedule.status,
    inCharge: event.inCharge,
  } as Schedule;
};

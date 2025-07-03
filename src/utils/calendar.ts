import { CalendarEvent } from '@/models/calendar/calendar';
import { Task } from '@/models/task/task';
import { Visitation } from '@/models/visitation/visitation';
import { Member } from '@/models/member/member';
import { DOMAIN } from '@/models/permission/permission';
import KoreanLunarCalendar from 'korean-lunar-calendar';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import dayjs from 'dayjs';

export const getEventFromTask = (event: Task): CalendarEvent => {
  return {
    id: `${DOMAIN.TASK}-${event.id}`,
    title: event.title,
    allDay: false,
    start: event.startDate,
    end: event.endDate,
  };
};

export const getEventFromVisitation = (event: Visitation): CalendarEvent => {
  return {
    id: `${DOMAIN.VISITATION}-${event.id}`,
    title: event.title,
    allDay: false,
    start: event.startDate,
    end: event.endDate,
  };
};

export const getEventFromBirthday = (
  fromDate: string,
  toDate: string,
  event: Member
): CalendarEvent => {
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
    title: getTitle(event),
    allDay: true,
    start: getDateStringFromDate(targetDate.toDate()),
    end: getDateStringFromDate(targetDate.toDate()),
  };
};

const getTitle = (member: Member) => {
  if (member.officer) {
    return `${member.name} ${member.officer.name} 생일`;
  } else {
    return `${member.name} 생일`;
  }
};

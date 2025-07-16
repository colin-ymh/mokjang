import {
  BLACK,
  CALENDAR_COLOR,
  STATUS_BACKGROUND_COLOR,
  STATUS_COLOR,
  STATUS_FONT_COLOR,
  WHITE,
} from '@/constants/styles/color';
import { STATUS } from '@/constants/status/status';
import { DOMAIN } from '@/models/permission/permission';
import { Schedule } from '@/models/calendar/calendar';

export const getStatusBackgroundColor = (status: STATUS) => {
  switch (status) {
    case STATUS.DONE:
      return STATUS_BACKGROUND_COLOR.DONE;
    case STATUS.IN_PROGRESS:
      return STATUS_BACKGROUND_COLOR.IN_PROGRESS;
    case STATUS.RESERVE:
      return STATUS_BACKGROUND_COLOR.RESERVE;
    case STATUS.PENDING:
      return STATUS_BACKGROUND_COLOR.PENDING;
    default:
      return WHITE;
  }
};

export const getStatusFontColor = (status: STATUS) => {
  switch (status) {
    case STATUS.DONE:
      return STATUS_FONT_COLOR.DONE;
    case STATUS.IN_PROGRESS:
      return STATUS_FONT_COLOR.IN_PROGRESS;
    case STATUS.RESERVE:
      return STATUS_FONT_COLOR.RESERVE;
    case STATUS.PENDING:
      return STATUS_FONT_COLOR.PENDING;
    default:
      return WHITE;
  }
};

export const getStatusColor = (status: STATUS) => {
  switch (status) {
    case STATUS.DONE:
      return STATUS_COLOR.DONE;
    case STATUS.IN_PROGRESS:
      return STATUS_COLOR.IN_PROGRESS;
    case STATUS.RESERVE:
      return STATUS_COLOR.RESERVE;
    case STATUS.PENDING:
      return STATUS_COLOR.PENDING;
    default:
      return WHITE;
  }
};

export const getCalenderBackgroundColor = (domain: DOMAIN) => {
  switch (domain) {
    case DOMAIN.VISITATION:
      return CALENDAR_COLOR.VISITATION;
    case DOMAIN.TASK:
      return CALENDAR_COLOR.TASK;
    case DOMAIN.MEMBER:
      return CALENDAR_COLOR.MEMBER;
    case DOMAIN.CHURCH_EVENT:
      return CALENDAR_COLOR.EVENT;
    case DOMAIN.HOLIDAY:
      return CALENDAR_COLOR.HOLIDAY;
    case DOMAIN.EDUCATION:
      return CALENDAR_COLOR.EDUCATION;
    default:
      return WHITE;
  }
};

export const getCalenderColor = (domain: DOMAIN) => {
  switch (domain) {
    case DOMAIN.VISITATION:
      return WHITE;
    case DOMAIN.TASK:
      return WHITE;
    case DOMAIN.MEMBER:
      return WHITE;
    case DOMAIN.CHURCH_EVENT:
      return WHITE;
    case DOMAIN.HOLIDAY:
      return BLACK;
    case DOMAIN.EDUCATION:
      return WHITE;
    default:
      return WHITE;
  }
};

export const getEventStyle = (event: Schedule) => {
  return {
    style: {
      backgroundColor: getCalenderBackgroundColor(
        event.id?.split('-')[0] as DOMAIN
      ),
      borderRadius: '4px',
      color: getCalenderColor(event.id?.split('-')[0] as DOMAIN),
      padding: '2px 5px',
      fontSize: '14px',
    },
  };
};

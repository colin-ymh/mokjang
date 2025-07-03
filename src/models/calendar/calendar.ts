import * as React from 'react';

export type CalendarEvent = {
  id?: string;
  allDay?: boolean;
  title?: React.ReactNode;
  start?: string | Date;
  end?: string | Date;
  resource?: any;
};

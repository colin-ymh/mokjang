import * as React from 'react';
import { Task } from '@/models/task/task';
import { Visitation } from '@/models/visitation/visitation';
import { EducationSession } from '@/models/education/education';
import { Member } from '@/models/member/member';
import { ChurchEvent } from '@/models/church-event/church-event';

export type CalendarEvent = {
  id?: string;
  allDay?: boolean;
  title?: React.ReactNode;
  start?: string | Date;
  end?: string | Date;
  task?: Task;
  visitation?: Visitation;
  education?: EducationSession;
  member?: Member;
  churchEvent?: ChurchEvent;
};

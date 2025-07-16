import * as React from 'react';
import { Task } from '@/models/task/task';
import { Visitation } from '@/models/visitation/visitation';
import { EducationSession } from '@/models/education/education';
import { Member } from '@/models/member/member';
import { ChurchEvent } from '@/models/church-event/church-event';
import { STATUS } from '@/constants/status/status';
import { DOMAIN } from '@/models/permission/permission';

export type Schedule = {
  id?: string;
  allDay?: boolean;
  title?: React.ReactNode;
  start?: string | Date;
  end?: string | Date;

  status?: STATUS;

  task?: Task;
  visitation?: Visitation;
  education?: EducationSession;
  member?: Member;
  churchEvent?: ChurchEvent;
};

export type ServerSchedule = {
  id: string;
  type: DOMAIN;
  title: string;
  startDate: string;
  endDate: string;
  status: STATUS;
};

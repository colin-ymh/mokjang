import * as React from 'react';
import { Task } from '../task/task';
import { Visitation } from '../visitation/visitation';
import { EducationSession } from '../education/education';
import { Member } from '../member/member';
import { ChurchEvent } from '../church-event/church-event';
import { STATUS } from '../../constants/status/status';
import { DOMAIN } from '../permission/permission';

export type Schedule = {
  id?: string;
  allDay?: boolean;
  title?: React.ReactNode;
  start?: string | Date;
  end?: string | Date;

  status?: STATUS;

  inCharge?: Member;

  task?: Task;
  visitation?: Visitation;
  education?: EducationSession;
  member?: Member;
  churchEvent?: ChurchEvent;

  educationId?: string;
  educationName?: string;
  educationTermId?: string;
  educationTerm?: string;
};

export type ServerSchedule = {
  id: string;
  type: DOMAIN;
  title: string;
  startDate: string;
  endDate: string;
  status: STATUS;

  educationId?: string;
  educationName?: string;
  educationTermId?: string;
  educationTerm?: string;
};

export type ServerReportedSchedule = {
  id: string;
  type: DOMAIN;
  inCharge: Member;
  schedule: ServerSchedule;

  educationId?: string;
  educationName?: string;
  educationTermId?: string;
  educationTerm?: string;
};

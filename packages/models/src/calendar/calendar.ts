import * as React from 'react';
import { STATUS } from '@mokjang/constants';

import { Task } from '../task';
import { Visitation } from '../visitation';
import { EducationSession } from '../education';
import { Member } from '../member';
import { ChurchEvent } from '../church-event';
import { DOMAIN } from '../permission';

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

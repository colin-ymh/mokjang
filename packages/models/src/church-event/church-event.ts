import { BLANK } from '@mokjang/constants';

export type ChurchEvent = {
  title: string;
  date: string;
  id: string;
  description: string;
  churchId: string;
};

export const DEFAULT_CHURCH_EVENT = {
  id: BLANK,
  title: BLANK,
  description: BLANK,
  date: BLANK,
  churchId: BLANK,
};

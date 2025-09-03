'use client';

import { useEffect, useState } from 'react';
import MyScheduleSummaryWidgetView from './my-schedule-summary-widget.view';
import { RANGE } from '../../../../constants/constant';
import { DOMAIN } from '../../../../models/permission/permission';
import {
  ChurchScheduleSummary,
  DEFAULT_SCHEDULE_SUMMARY,
  ScheduleSummary,
} from '../../../../models/schedule-summary/schedule-summary';
import { getTotalScheduleSummary } from '../../../../utils/summary';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  fetchMyScheduleSummary,
  setMyRange,
} from '../../../../redux/reducers/schedule-summary-reducer';

const MyScheduleSummaryWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myScheduleSummary, myRange } = useSelector(
    (state: RootState) => state.scheduleSummary
  );

  const [domain, setDomain] = useState<DOMAIN | undefined>(undefined);
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary>(
    DEFAULT_SCHEDULE_SUMMARY
  );

  const onClickRange = (value: RANGE) => {
    dispatch(setMyRange(value));
  };

  const onChangeDomain = (domain: DOMAIN | undefined) => {
    setDomain(domain);
  };

  useEffect(() => {
    if (!domain) {
      setScheduleSummary(getTotalScheduleSummary(myScheduleSummary));
    } else {
      setScheduleSummary(
        myScheduleSummary[domain as keyof ChurchScheduleSummary]
      );
    }
  }, [domain, myScheduleSummary, myRange]);

  useEffect(() => {
    dispatch(fetchMyScheduleSummary());
  }, [myRange]);

  const props = {
    domain,
    scheduleSummary,
    onClickRange,
    onChangeDomain,
  };
  return (
    <>
      <MyScheduleSummaryWidgetView {...props} />
    </>
  );
};

export default MyScheduleSummaryWidget;

'use client';

import { useEffect, useState } from 'react';
import ScheduleSummaryWidgetView from '@/components/molecules/home/widget/schedule-summary-widget.view';
import { RANGE } from '@/constants/constant';
import { DOMAIN } from '@/models/permission/permission';
import {
  ChurchScheduleSummary,
  DEFAULT_SCHEDULE_SUMMARY,
  ScheduleSummary,
} from '@/models/schedule-summary/schedule-summary';
import { getTotalScheduleSummary } from '@/utils/summary';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchChurchScheduleSummary,
  setChurchRange,
} from '@/redux/reducers/schedule-summary-reducer';

const ScheduleSummaryWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchScheduleSummary, churchRange } = useSelector(
    (state: RootState) => state.scheduleSummary
  );

  const [domain, setDomain] = useState<DOMAIN | undefined>(undefined);
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary>(
    DEFAULT_SCHEDULE_SUMMARY
  );

  const onClickRange = (value: RANGE) => {
    dispatch(setChurchRange(value));
  };

  const onChangeDomain = (domain: DOMAIN | undefined) => {
    setDomain(domain);
  };

  useEffect(() => {
    if (!domain) {
      setScheduleSummary(getTotalScheduleSummary(churchScheduleSummary));
    } else {
      setScheduleSummary(
        churchScheduleSummary[domain as keyof ChurchScheduleSummary]
      );
    }
  }, [domain, churchRange, churchScheduleSummary]);

  useEffect(() => {
    dispatch(fetchChurchScheduleSummary());
  }, [churchRange]);

  const props = {
    domain,
    scheduleSummary,
    onClickRange,
    onChangeDomain,
  };
  return (
    <>
      <ScheduleSummaryWidgetView {...props} />
    </>
  );
};

export default ScheduleSummaryWidget;

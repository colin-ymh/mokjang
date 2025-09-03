'use client';

import { HomeApi } from '../../../../api/home/home.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { useEffect, useState } from 'react';
import { BLANK, RANGE } from '../../../../constants/constant';
import { WorshipEnrollment } from '../../../../models/worship/worship';
import WorshipAttendanceWidgetView from './worship-attendance-widget.view';
import {
  fetchWorships,
  setWorshipPage,
} from '../../../../redux/reducers/filter/worship-filter-reducer';

const WorshipAttendanceWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const [worshipEnrollments, setWorshipEnrollments] = useState<
    WorshipEnrollment[]
  >([]);

  const { worshipPage, worships } = useSelector(
    (state: RootState) => state.worshipFilter
  );

  const [range, setRange] = useState<RANGE>(RANGE.MONTHLY);
  const [worshipId, setWorshipId] = useState<string>(BLANK);
  const [page, setPage] = useState<number>(1);
  const [thrownError, setThrownError] = useState<Error | null>(null);

  if (thrownError) throw thrownError;

  const homeApi = new HomeApi(false);

  const fetchWorshipEnrollments = async () => {
    if (worshipId === BLANK) return;
    try {
      const response = await homeApi.getWorshipAttendances({
        churchId,
        range,
        worshipId,
        page,
        take: 30,
      });

      const newEnrollments = response.data.data;

      setWorshipEnrollments(newEnrollments);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onScrollBottom = () => {
    setPage(page + 1);
  };

  const onClickRange = (value: RANGE) => {
    setRange(value);
  };

  const onChangeWorship = (worshipId: string) => {
    setWorshipId(worshipId);
    setWorshipEnrollments([]);
    setPage(1);
  };

  useEffect(() => {
    dispatch(setWorshipPage(1));
    setPage(1);
  }, []);

  useEffect(() => {
    fetchWorshipEnrollments();
  }, [page, range]);

  useEffect(() => {
    dispatch(fetchWorships());
  }, [worshipPage]);

  useEffect(() => {
    if (worships.length > 0) {
      setWorshipId(worships[0].id);
      setPage(1);
    }
  }, [worships]);

  const props = {
    range,
    worshipId,
    worshipEnrollments,
    onChangeWorship,
    onClickRange,
    onScrollBottom,
  };
  return (
    <>
      <WorshipAttendanceWidgetView {...props} />
    </>
  );
};

export default WorshipAttendanceWidget;

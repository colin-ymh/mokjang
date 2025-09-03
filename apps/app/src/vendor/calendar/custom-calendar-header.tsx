import { ToolbarProps } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  setCalendarFilter,
  setCalendarSchedules,
} from '../../redux/reducers/filter/calendar-filter-reducer';
import { useEffect, useState } from 'react';
import CustomCalendarHeaderView, {
  NAVIGATE_ACTION,
} from './custom-calendar-header.view';
import { DEFAULT_CHURCH_EVENT } from '../../models/church-event/church-event';
import { setTargetChurchEvent } from '../../redux/reducers/target/target-church-event-reducer';
import { ChurchEventsApi } from '../../api/church-event/church-events.api';
import { getScheduleFromChurchEvent } from '../../utils/calendar';
import { getIsWellFormedTitle } from '../../utils/check';

const CustomCalendarHeader = (toolbarProps: ToolbarProps) => {
  const { date, onNavigate } = toolbarProps;

  const dispatch = useDispatch<AppDispatch>();
  const churchEventsApi = new ChurchEventsApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { calendarSchedules, calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );
  const { targetChurchEvent } = useSelector(
    (state: RootState) => state.targetChurchEvent
  );

  const [isFilterShown, setIsFilterShown] = useState<boolean>(false);

  const [isAddEventModalOpened, setIsAddEventModalOpened] =
    useState<boolean>(false);
  const [isSaveEventEnabled, setIsSaveEventEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onChangeYearItem = (year: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    onNavigate(NAVIGATE_ACTION.DATE, newDate);
  };

  const onChangeMonthItem = (month: number) => {
    const newDate = new Date(date);
    newDate.setMonth(month);
    onNavigate(NAVIGATE_ACTION.DATE, newDate);
  };

  const onChangeIsMy = (value: boolean) => {
    dispatch(
      setCalendarFilter({
        ...calendarFilter,
        isMy: value,
      })
    );
  };

  const onClickFilter = () => {
    setIsFilterShown(true);
  };

  const onClickFilterClose = () => {
    setIsFilterShown(false);
  };

  // ---------- 이벤트 ------------
  // 이벤트 추가
  const onClickAddEvent = () => {
    setIsAddEventModalOpened(true);
    dispatch(setTargetChurchEvent(DEFAULT_CHURCH_EVENT));
  };

  // 이벤트 추가 취소
  const onClickCancelAddEvent = () => {
    setIsAddEventModalOpened(false);
    dispatch(setTargetChurchEvent(DEFAULT_CHURCH_EVENT));
  };

  // 이벤트 저장
  const onClickSaveEvent = async () => {
    try {
      const response = await churchEventsApi.createChurchEvent(
        { churchId },
        {
          title: targetChurchEvent.title,
          description: targetChurchEvent.description,
          date: targetChurchEvent.date,
        }
      );

      const newEvent = response.data.data;
      const newCalendarSchedules = [
        ...calendarSchedules,
        getScheduleFromChurchEvent(newEvent),
      ];
      dispatch(setCalendarSchedules(newCalendarSchedules));
      setIsAddEventModalOpened(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 저장 가능 여부 확인
  useEffect(() => {
    if (!getIsWellFormedTitle(targetChurchEvent.title)) {
      setIsSaveEventEnabled(false);
      return;
    }

    if (!targetChurchEvent.date) {
      setIsSaveEventEnabled(false);
      return;
    }

    setIsSaveEventEnabled(true);
  }, [targetChurchEvent]);

  // ---------- 이벤트 추가 ------------

  const props = {
    isFilterShown,
    isSaveEventEnabled,
    isAddEventModalOpened,
    onClickFilterClose,
    onChangeIsMy,
    onChangeMonthItem,
    onChangeYearItem,
    onClickFilter,
    onClickAddEvent,
    onClickCancelAddEvent,
    onClickSaveEvent,
    ...toolbarProps,
  };

  return (
    <>
      <CustomCalendarHeaderView {...props} />
    </>
  );
};

export default CustomCalendarHeader;

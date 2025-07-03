import { ToolbarProps } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCalendarFilter } from '@/redux/reducers/filter/calendar-filter-reducer';
import { useState } from 'react';
import CustomCalendarHeaderView, {
  NAVIGATE_ACTION,
} from '@/vendor/calendar/custom-calendar-header.view';

const CustomCalendarHeader = (toolbarProps: ToolbarProps) => {
  const { date, onNavigate } = toolbarProps;

  const dispatch = useDispatch<AppDispatch>();

  const [isFilterShown, setIsFilterShown] = useState<boolean>(false);

  const { calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );

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

  const props = {
    isFilterShown,
    onClickFilterClose,
    onChangeIsMy,
    onChangeMonthItem,
    onChangeYearItem,
    onClickFilter,
    ...toolbarProps,
  };

  return (
    <>
      <CustomCalendarHeaderView {...props} />
    </>
  );
};

export default CustomCalendarHeader;

import AddHomeWidgetView from '@/components/molecules/home/add/add-home-widget.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { HOME_WIDGET } from '@/constants/constant';
import { setHomeWidgets } from '@/redux/reducers/filter/home-widget-filter-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@/constants/styles/color';
import { useState } from 'react';

const AddHomeWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { homeWidgets } = useSelector(
    (state: RootState) => state.homeWidgetFilter
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickAdd = async (widget: HOME_WIDGET) => {
    try {
      const newHomeWidget = [...homeWidgets, widget];
      dispatch(setHomeWidgets(newHomeWidget));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  const props = {
    onClickAdd,
  };

  return (
    <>
      <AddHomeWidgetView {...props} />
    </>
  );
};

export default AddHomeWidget;

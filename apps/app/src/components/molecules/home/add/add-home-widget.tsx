import AddHomeWidgetView from './add-home-widget.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { HOME_WIDGET } from '@mokjang/constants';
import { setHomeWidgets } from '../../../../redux/reducers/filter/home-widget-filter-reducer';
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

  const onClickItem = (widget: HOME_WIDGET) => {
    if (homeWidgets.includes(widget)) {
      const newHomeWidget = homeWidgets.filter((h) => h !== widget);
      dispatch(setHomeWidgets(newHomeWidget));
    } else {
      const newHomeWidget = [...homeWidgets, widget];
      dispatch(setHomeWidgets(newHomeWidget));
    }
  };

  const props = {
    onClickItem,
  };

  return (
    <>
      <AddHomeWidgetView {...props} />
    </>
  );
};

export default AddHomeWidget;

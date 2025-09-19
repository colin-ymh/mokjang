import React, { FC, useCallback } from 'react';
import { HOME_WIDGET } from '@mokjang/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { setHomeWidgets } from '../../../../redux/reducers/filter/home-widget-filter-reducer';
import HomeWidgetListView from './home-widget-list.view';

const HomeWidgetList: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { homeWidgets } = useSelector(
    (state: RootState) => state.homeWidgetFilter
  );

  // 배열에서 from → to 위치로 요소 이동
  const moveWidget = useCallback(
    (from: number, to: number) => {
      // 1) 원본 배열을 복사
      const copy = [...homeWidgets];
      // 2) splice로 from 인덱스 요소를 잘라내고
      const [moved] = copy.splice(from, 1);
      // 3) to 인덱스에 잘라낸 요소를 삽입
      copy.splice(to, 0, moved);
      // 4) 업데이트 액션 디스패치
      dispatch(setHomeWidgets(copy));
    },
    [homeWidgets, dispatch] // deps 에 homeWidgets, dispatch 추가
  );

  const onClickDelete = (id: HOME_WIDGET) => {
    const newWidgets = homeWidgets.filter((widget) => widget !== id);
    dispatch(setHomeWidgets(newWidgets));
  };

  const props = {
    moveWidget,
    onClickDelete,
  };

  return (
    <>
      <HomeWidgetListView {...props} />
    </>
  );
};

export default HomeWidgetList;

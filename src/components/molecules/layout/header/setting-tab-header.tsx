import { useDispatch } from 'react-redux';
import { setContentId } from '@/redux/reducers/layout-reducer';
import { AppDispatch } from '@/redux/store';

import SettingTabHeaderView from '@/components/molecules/layout/header/setting-tab-header.view';

type SettingTabHeaderProps = {};

const SettingTabHeader = ({}: SettingTabHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    dispatch(setContentId(id));
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <SettingTabHeaderView {...props} />
    </>
  );
};
export default SettingTabHeader;

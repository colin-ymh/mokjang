import { useDispatch } from 'react-redux';
import { setContentId } from '@/redux/reducers/layout-reducer';
import { AppDispatch } from '@/redux/store';

import ManagementTabHeaderView from '@/components/molecules/layout/header/management-tab-header.view';

type ManagementTabHeaderProps = {};

const ManagementTabHeader = ({}: ManagementTabHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    dispatch(setContentId(id));
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <ManagementTabHeaderView {...props} />
    </>
  );
};
export default ManagementTabHeader;

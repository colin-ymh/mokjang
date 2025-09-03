import { usePageRouter } from '@mokjang/utils';
import ManagementManagerHeaderView from './management-manager-header.view';
import { MANAGER_CONTENT_ID } from '@/constants/layout/content';

type ManagementManagerHeaderProps = {};

const ManagementManagerHeader = ({}: ManagementManagerHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: MANAGER_CONTENT_ID) => {
    router.push(`/management/manager/${id}`);
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <ManagementManagerHeaderView {...props} />
    </>
  );
};
export default ManagementManagerHeader;

import { usePageRouter } from '../../../../../../utils/router';
import ManagementManagerHeaderView from './management-manager-header.view';

type ManagementManagerHeaderProps = {};

const ManagementManagerHeader = ({}: ManagementManagerHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
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

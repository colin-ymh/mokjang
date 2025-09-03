import { usePageRouter } from '../../../../../../utils/router';
import ManagementUserHeaderView from './management-user-header.view';

type ManagementUserHeaderProps = {};

const ManagementUserHeader = ({}: ManagementUserHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/management/user/${id}`);
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <ManagementUserHeaderView {...props} />
    </>
  );
};
export default ManagementUserHeader;

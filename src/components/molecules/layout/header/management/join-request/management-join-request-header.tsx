import { usePageRouter } from '@/utils/router';
import ManagementJoinRequestHeaderView from '@/components/molecules/layout/header/management/join-request/management-join-request-header.view';

type ManagementTabHeaderProps = {};

const ManagementJoinRequestHeader = ({}: ManagementTabHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/management/church/${id}`);
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <ManagementJoinRequestHeaderView {...props} />
    </>
  );
};
export default ManagementJoinRequestHeader;

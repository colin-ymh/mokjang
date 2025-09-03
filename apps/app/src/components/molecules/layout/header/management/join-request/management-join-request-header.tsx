import { usePageRouter } from '@mokjang/utils';
import ManagementJoinRequestHeaderView from './management-join-request-header.view';

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

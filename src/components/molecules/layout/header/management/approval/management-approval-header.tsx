import { usePageRouter } from '@/utils/router';
import ManagementApprovalHeaderView from '@/components/molecules/layout/header/management/approval/management-approval-header.view';

type ManagementTabHeaderProps = {};

const ManagementApprovalHeader = ({}: ManagementTabHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/management/church/${id}`);
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <ManagementApprovalHeaderView {...props} />
    </>
  );
};
export default ManagementApprovalHeader;

import { usePageRouter } from '@/utils/router';
import ManagementPermissionHeaderView from '@/components/molecules/layout/header/management/permission/management-permission-header.view';

type ManagementTabHeaderProps = {};

const ManagementPermissionHeader = ({}: ManagementTabHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/management/permission/${id}`);
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <ManagementPermissionHeaderView {...props} />
    </>
  );
};
export default ManagementPermissionHeader;

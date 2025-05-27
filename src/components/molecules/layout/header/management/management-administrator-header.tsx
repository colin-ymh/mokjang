import { usePageRouter } from '@/utils/router';
import ManagementAdministratorHeaderView from '@/components/molecules/layout/header/management/management-administrator-header.view';

type ManagementAdministratorHeaderProps = {};

const ManagementAdministratorHeader =
  ({}: ManagementAdministratorHeaderProps) => {
    const router = usePageRouter();

    // 헤더 탭바 이벤트
    const onClickHeaderBar = (id: string) => {
      router.push(`/management/administrator/${id}`);
    };

    const props = { onClickHeaderBar };

    return (
      <>
        <ManagementAdministratorHeaderView {...props} />
      </>
    );
  };
export default ManagementAdministratorHeader;

import ManagementChurchHeaderView from './management-church-header.view';
import { usePageRouter } from '../../../../../../utils/router';

type ManagementChurchHeaderProps = {};

const ManagementChurchHeader = ({}: ManagementChurchHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/management/church/${id}`);
  };

  const props = { onClickHeaderBar };

  return (
    <>
      <ManagementChurchHeaderView {...props} />
    </>
  );
};
export default ManagementChurchHeader;

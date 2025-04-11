import MainVisitationHeaderView from '@/components/molecules/layout/header/main/main-visitation-header.view';
import { usePageRouter } from '@/utils/router';

type MainVisitationHeaderProps = {};

const MainVisitationHeader = ({}: MainVisitationHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`admin/main/visitation/${id}`);
  };

  const props = {
    onClickHeaderBar,
  };

  return (
    <>
      <MainVisitationHeaderView {...props} />
    </>
  );
};
export default MainVisitationHeader;

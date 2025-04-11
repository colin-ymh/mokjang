import MainEducationHeaderView from '@/components/molecules/layout/header/main/main-education-header.view';
import { usePageRouter } from '@/utils/router';

type MainEducationHeaderProps = {};

const MainEducationHeader = ({}: MainEducationHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`admin/main/education/${id}`);
  };

  const props = {
    onClickHeaderBar,
  };

  return (
    <>
      <MainEducationHeaderView {...props} />
    </>
  );
};
export default MainEducationHeader;

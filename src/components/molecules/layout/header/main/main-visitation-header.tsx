import MainVisitationHeaderView from '@/components/molecules/layout/header/main/main-visitation-header.view';
import { usePageRouter } from '@/utils/router';
import { useState } from 'react';

type MainVisitationHeaderProps = {};

const MainVisitationHeader = ({}: MainVisitationHeaderProps) => {
  const router = usePageRouter();

  const [isAddVisitationOpened, setIsAddVisitationOpened] =
    useState<boolean>(false);

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`admin/main/visitation/${id}`);
  };

  const onClickAddVisitation = () => {
    setIsAddVisitationOpened(true);
  };

  const onClickCloseModal = () => {
    setIsAddVisitationOpened(false);
  };

  const props = {
    isAddVisitationOpened,
    onClickHeaderBar,
    onClickAddVisitation,
    onClickCloseModal,
  };

  return (
    <>
      <MainVisitationHeaderView {...props} />
    </>
  );
};
export default MainVisitationHeader;

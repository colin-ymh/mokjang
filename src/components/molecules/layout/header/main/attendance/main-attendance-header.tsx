import { usePageRouter } from '@/utils/router';
import MainAttendanceHeaderView from '@/components/molecules/layout/header/main/attendance/main-attendance-header.view';

type MainAttendanceHeaderProps = {};

const MainAttendanceHeader = ({}: MainAttendanceHeaderProps) => {
  const router = usePageRouter();

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/attendance/${id}`);
  };

  const props = {
    onClickHeaderBar,
  };

  return (
    <>
      <MainAttendanceHeaderView {...props} />
    </>
  );
};
export default MainAttendanceHeader;

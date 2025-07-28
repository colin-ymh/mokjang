import TopView from '@/components/molecules/layout/top/top.view';
import { usePageRouter } from '@/utils/router';
import { SIDE_ID } from '@/constants/layout/header';

type TopProps = {
  handleSideShow: () => void;
};

const Top = ({ handleSideShow }: TopProps) => {
  const router = usePageRouter();

  const onClickButton = (id: SIDE_ID) => {
    router.replace(`/${id}`);
  };

  const props = {
    onClickButton,
    handleSideShow,
  };

  return (
    <>
      <TopView {...props} />
    </>
  );
};

export default Top;

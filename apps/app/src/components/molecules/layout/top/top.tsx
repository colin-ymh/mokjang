import TopView from './top.view';
import { usePageRouter } from '@mokjang/utils';
import { SIDE_ID } from '../../../../constants/layout/header';

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

import HomeView from './home.view';
import { useState } from 'react';
import { CustomPopup } from '@mokjang/components';
import AddHomeWidget from '../../molecules/home/add/add-home-widget';
import { useScopedI18n } from '../../../../locales/client';

const Home = () => {
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');
  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  const onClickAdd = () => {
    setIsAddShown(true);
  };

  const onClickCloseAdd = () => {
    setIsAddShown(false);
  };

  const props = {
    onClickAdd,
  };

  return (
    <>
      <HomeView {...props} />
      {/* 위젯 추가 팝업 */}
      <CustomPopup
        isShow={isAddShown}
        onClickClose={onClickCloseAdd}
        onClickCancel={onClickCloseAdd}
        width={500}
        height={500}
        headerTitle={t_title('addWidget')}
        cancelText={t_button('close')}
      >
        <AddHomeWidget />
      </CustomPopup>
    </>
  );
};

export default Home;

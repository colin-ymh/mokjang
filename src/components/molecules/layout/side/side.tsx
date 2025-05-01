import { memo, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

import { AuthApi } from '@/api/auth/auth.api';
import SideView from '@/components/molecules/layout/side/side.view';
import { usePageRouter } from '@/utils/router';

type SideProps = {
  sideButtonList: ReactNode;
};

const Side = memo(({ sideButtonList }: SideProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const authApi = new AuthApi(false);

  // const onClickLogOut = () => {
  //   console.log('logout');
  //   try {
  //     dispatch(setUser(DEFAULT_USER));
  //     dispatch(setChurch(DEFAULT_CHURCH));
  //     dispatch(setChurchId(BLANK));
  //     authApi.getLogOut();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     console.log('success');
  //     router.replace('/login');
  //   }
  // };

  const props = {
    sideButtonList,
    // onClickLogOut,
  };

  return (
    <>
      <SideView {...props} />
    </>
  );
});

export default Side;

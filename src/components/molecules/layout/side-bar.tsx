import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setChurch, setChurchId } from '@/redux/reducers/church-reducer';
import { setUser } from '@/redux/reducers/user-reducer';

import SideBarView from '@/components/molecules/layout/side-bar.view';
import { DEFAULT_USER } from '@/models/user/user';
import { DEFAULT_CHURCH } from '@/models/church/church';
import { BLANK } from '@/constants/constant';
import { usePageRouter } from '@/utils/router';
import { AuthApi } from '@/api/auth/auth.api';

const SideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const authApi = new AuthApi(false);

  const onClickLogOut = () => {
    console.log('logout');
    try {
      dispatch(setUser(DEFAULT_USER));
      dispatch(setChurch(DEFAULT_CHURCH));
      dispatch(setChurchId(BLANK));
      authApi.getLogOut();
    } catch (error) {
      console.log(error);
    } finally {
      console.log('success');
      router.replace('/login');
    }
  };

  const props = {
    onClickLogOut,
  };

  return (
    <>
      <SideBarView {...props} />
    </>
  );
};

export default SideBar;

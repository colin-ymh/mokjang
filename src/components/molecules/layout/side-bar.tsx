import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setChurch, setChurchId } from '@/redux/reducers/church-reducer';
import { setUser } from '@/redux/reducers/user-reducer';

import SideBarView from '@/components/molecules/layout/side-bar.view';
import { DEFAULT_USER } from '@/models/user/user';
import { DEFAULT_CHURCH } from '@/models/church/church';
import { BLANK } from '@/constants/constant';
import { usePageRouter } from '@/utils/router';

const SideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();

  const onClickLogOut = () => {
    try {
      dispatch(setUser(DEFAULT_USER));
      dispatch(setChurch(DEFAULT_CHURCH));
      dispatch(setChurchId(BLANK));
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.log(error);
    } finally {
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

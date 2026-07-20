import SettingView, {
  SettingViewProp,
} from '@/components/organisms/setting/setting.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLACK, BLANK, DESTRUCTIVE } from '@mokjang/constants';
import {
  getFormattedContent,
  getFormattedMobilePhone,
  getFormattedName,
  getIsWellFormedMobilePhone,
  IS_PRODUCTION,
} from '@mokjang/utils';
import { UserApi } from '@/api/user/user.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../locales/client';
import { setUser } from '@/redux/reducers/user-reducer';
import ConfirmPopup from '@/components/atoms/modal/error-popup';
import { router } from 'next/client';

const Setting = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userApi = new UserApi(false);
  const { user } = useSelector((state: RootState) => state.user);

  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');

  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [isEditMobilePhone, setIsEditMobilePhone] = useState<boolean>(false);

  const [name, setName] = useState<string>(BLANK);
  const [mobilePhone, setMobilePhone] = useState<string>(BLANK);

  const [inputCode, setInputCode] = useState<string>(BLANK);

  const [second, setSecond] = useState<number>(0);
  const [isRequested, setIsRequested] = useState<boolean>(false);

  const [isWithdrawOpened, setIsWithdrawOpened] = useState<boolean>(false);
  const [isLeaveChurchOpened, setIsLeaveChurchOpened] =
    useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value, 10);
    setName(newName);
  };

  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobilePhone = getFormattedMobilePhone(event.target.value);
    setMobilePhone(newMobilePhone);
  };

  const onChangeInputCode = (event: ChangeEvent<HTMLInputElement>) => {
    setInputCode(getFormattedContent(event.target.value, 10));
  };

  const onClickEditName = () => {
    setIsEditName(true);
    setIsEditMobilePhone(false);
    setMobilePhone(getFormattedMobilePhone(user.mobilePhone));
  };

  const onClickEditMobilePhone = () => {
    setIsEditMobilePhone(true);
    setIsEditName(false);
    setName(user.name);
  };

  const onClickSaveName = async () => {
    try {
      await userApi.editUserName({ name });
      dispatch(setUser({ ...user, name }));

      setIsEditName(false);
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setIsToastShown(true));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickRequest = async () => {
    if (!getIsWellFormedMobilePhone(mobilePhone)) return;

    try {
      await userApi
        .request({
          mobilePhone: mobilePhone.replace(/-/g, ''),
          isTest: !IS_PRODUCTION,
        })
        .then((response) => {
          !IS_PRODUCTION && console.log(response);
        });

      setIsRequested(true);
      setSecond(300);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickSaveMobilePhone = async () => {
    if (!isRequested) return;

    try {
      await userApi.verify({ inputCode });
      dispatch(setUser({ ...user, mobilePhone }));

      setIsEditMobilePhone(false);
      setIsRequested(false);
      setInputCode(BLANK);

      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setIsToastShown(true));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickCancelName = () => {
    setIsEditName(false);
    setName(user.name);
  };

  const onClickCancelMobilePhone = () => {
    setIsEditMobilePhone(false);
    setMobilePhone(getFormattedMobilePhone(user.mobilePhone));
    setIsRequested(false);
    setInputCode(BLANK);
  };

  const onClickWithdraw = async () => {
    try {
      await userApi.withdraw();
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickWithdrawOpen = () => {
    setIsWithdrawOpened(true);
  };

  const onClickWithdrawClose = () => {
    setIsWithdrawOpened(false);
  };

  const onClickLeaveChurch = async () => {
    try {
      await userApi.leaveChurch({
        churchUserId: user.churchUser[0].id,
        churchId: user.churchUser[0].churchId,
      });
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickLeaveChurchOpen = () => {
    setIsLeaveChurchOpened(true);
  };

  const onClickLeaveChurchClose = () => {
    setIsLeaveChurchOpened(false);
  };

  useEffect(() => {
    setName(user.name);
    setMobilePhone(getFormattedMobilePhone(user.mobilePhone));
  }, [user]);

  // 타이머 감소 로직
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRequested && second > 0) {
      timer = setInterval(() => {
        setSecond((prevSecond) => prevSecond - 1);
      }, 1000);
    }
    if (second === 0 && isRequested) {
      setIsRequested(false);
    }
    return () => clearInterval(timer);
  }, [isRequested, second]);

  const props = {
    isEditName,
    isEditMobilePhone,
    isRequested,
    second,
    name,
    mobilePhone,
    inputCode,
    onChangeName,
    onChangeMobilePhone,
    onChangeInputCode,
    onClickEditName,
    onClickEditMobilePhone,
    onClickRequest,
    onClickCancelName,
    onClickCancelMobilePhone,
    onClickSaveName,
    onClickSaveMobilePhone,
    onClickWithdrawOpen,
    onClickLeaveChurchOpen,
  } as SettingViewProp;

  return (
    <>
      <SettingView {...props} />

      <ConfirmPopup
        title={t_popup('withdraw.title')}
        body={t_popup('withdraw.description')}
        buttonNum={2}
        isShow={isWithdrawOpened}
        onClickLeftButton={onClickWithdrawClose}
        onClickRightButton={() => {
          onClickWithdraw();
          onClickWithdrawClose();
        }}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
      />

      <ConfirmPopup
        title={t_popup('leaveChurch.title')}
        body={t_popup('leaveChurch.description')}
        buttonNum={2}
        isShow={isLeaveChurchOpened}
        onClickLeftButton={onClickLeaveChurchClose}
        onClickRightButton={() => {
          onClickLeaveChurch();
          onClickLeaveChurchClose();
        }}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
      />
    </>
  );
};

export default Setting;

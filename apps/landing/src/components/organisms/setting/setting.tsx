import SettingView, {
  SettingViewProp,
} from '@/components/organisms/setting/setting.view';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@mokjang/constants';
import { getFormattedMobilePhone, getFormattedName } from '@mokjang/utils';

const Setting = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [isEditMobilePhone, setIsEditMobilePhone] = useState<boolean>(false);

  const [name, setName] = useState<string>(BLANK);
  const [mobilePhone, setMobilePhone] = useState<string>(BLANK);

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value, 10);
    setName(newName);
  };

  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobilePhone = getFormattedMobilePhone(event.target.value);
    setMobilePhone(newMobilePhone);
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

  const onClickSaveName = () => {
    setIsEditName(false);
  };

  const onClickSaveMobilePhone = () => {
    setIsEditMobilePhone(false);
  };

  const onClickCancelName = () => {
    setIsEditName(false);
    setName(user.name);
  };

  const onClickCancelMobilePhone = () => {
    setIsEditMobilePhone(false);
    setMobilePhone(getFormattedMobilePhone(user.mobilePhone));
  };

  useEffect(() => {
    setName(user.name);
    setMobilePhone(getFormattedMobilePhone(user.mobilePhone));
  }, [user]);

  const props = {
    isEditName,
    isEditMobilePhone,
    name,
    mobilePhone,
    onChangeName,
    onChangeMobilePhone,
    onClickEditName,
    onClickEditMobilePhone,
    onClickCancelName,
    onClickCancelMobilePhone,
    onClickSaveName,
    onClickSaveMobilePhone,
  } as SettingViewProp;

  return (
    <>
      <SettingView {...props} />
    </>
  );
};

export default Setting;

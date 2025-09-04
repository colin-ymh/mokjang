import { ChangeEvent, useEffect, useState } from 'react';
import ContactView, {
  ContactViewProps,
} from '@/components/organisms/contact/contact.view';
import {
  getIsWellFormedEmail,
  getIsWellFormedMobilePhone,
  getIsWellFormedName,
  getIsWellFormedTitle,
  usePageRouter,
} from '../../../../../../packages/utils/src';
import {
  getFormattedContent,
  getFormattedMobilePhone,
  getFormattedName,
  getFormattedTitle,
} from '@mokjang/utils';
import { BLANK } from '@mokjang/constants';
import ContactCompleteView from '@/components/organisms/contact/contact-complete.view';

const Contact = () => {
  const router = usePageRouter();

  const [isSent, setIsSent] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const [churchName, setChurchName] = useState<string>(BLANK);
  const [denomination, setDenomination] = useState<string>(BLANK);
  const [name, setName] = useState<string>(BLANK);
  const [mobilePhone, setMobilePhone] = useState<string>(BLANK);
  const [email, setEmail] = useState<string>(BLANK);
  const [description, setDescription] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeChurchName = (event: ChangeEvent<HTMLInputElement>) => {
    const newChurchName = getFormattedTitle(event.target.value);
    setChurchName(newChurchName);
  };

  const onChangeDenomination = (event: ChangeEvent<HTMLInputElement>) => {
    const newDenomination = getFormattedName(event.target.value);
    setDenomination(newDenomination);
  };

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setName(newName);
  };

  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobilePhone = getFormattedMobilePhone(event.target.value);
    setMobilePhone(newMobilePhone);
  };

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = getFormattedTitle(event.target.value);
    setEmail(newEmail);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = getFormattedContent(event.target.value, 500);
    setDescription(newDescription);
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(churchName)) {
      setIsEnabled(false);
      return;
    }

    if (!getIsWellFormedName(name)) {
      setIsEnabled(false);
      return;
    }

    if (!getIsWellFormedMobilePhone(mobilePhone)) {
      setIsEnabled(false);
      return;
    }

    if (!getIsWellFormedEmail(email)) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
  });

  const onClickSendContact = async () => {
    setIsSent(true);
  };

  const onClickBackToHome = () => {
    router.push('/');
  };

  const props = {
    isEnabled,
    churchName,
    denomination,
    name,
    mobilePhone,
    email,
    description,
    onChangeChurchName,
    onChangeDenomination,
    onChangeName,
    onChangeEmail,
    onChangeMobilePhone,
    onChangeDescription,
    onClickSendContact,
  } as ContactViewProps;

  if (isSent) {
    return (
      <>
        <ContactCompleteView onClickBackToHome={onClickBackToHome} />
      </>
    );
  }

  return (
    <>
      <ContactView {...props} />
    </>
  );
};

export default Contact;

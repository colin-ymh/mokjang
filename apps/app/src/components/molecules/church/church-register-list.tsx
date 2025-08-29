import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

import { ChurchesApi } from '../../../api/churches/churches.api';
import LabelInput from '../../atoms/common/input/label-input';
import Button from '../../atoms/common/button/button';
import { BLANK } from '../../../constants/constant';
import { usePageRouter } from '../../../utils/router';
import {
  getFormattedMobilePhone,
  getFormattedName,
} from '../../../utils/format';
import { Church } from '../../../models/church/church';

import { useScopedI18n } from '../../../../locales/client';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { setChurch, setChurchId } from '../../../redux/reducers/church-reducer';
import RadioButtonList from '../../atoms/common/radio-button/radio-button-list';
import { MainText } from '../../atoms/common/text/main-text';
import Loading from '../../atoms/common/etc/loading';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex-grow: 1;
  padding: 20px 20px 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  position: sticky;
  bottom: 0;
  padding: 20px 0;
`;

const memberSizeItems = [
  { value: 'xxs', title: '50명 이하' },
  { value: 'xs', title: '51명~100명' },
  { value: 's', title: '101명~300명' },
  { value: 'm', title: '301명~500명' },
  { value: 'l', title: '501명~1000명' },
  { value: 'xl', title: '1001명~5000명' },
  { value: 'xxl', title: '5000명 초과' },
];

const ChurchRegisterList = () => {
  const churchesApi = new ChurchesApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const t_button = useScopedI18n('button');
  const router = usePageRouter();
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>(BLANK);
  const [denomination, setDenomination] = useState<string>(BLANK);
  const [identifyNumber, setdIdentifyNumber] = useState<string>(BLANK);
  const [address, setAddress] = useState<string>(BLANK);
  const [detailAddress, setDetailAddress] = useState<string>(BLANK);
  const [phone, setPhone] = useState<string>(BLANK);
  const [memberSize, setMemberSize] = useState<string>(BLANK);

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setName(newName);
  };

  // 교단명 입력 처리
  const onChangeDenomination = (event: ChangeEvent<HTMLInputElement>) => {
    const newDenomination = getFormattedName(event.target.value);
    setDenomination(newDenomination);
  };

  // 고유번호 입력 처리
  const onChangedIdentifyNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = event.target.value.replace(/\D/g, ''); // 숫자만 허용
    setdIdentifyNumber(formattedNumber);
  };

  // 교회주소 입력 처리
  const onChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value); // 별도 포맷팅 없이 입력 값 그대로 저장
  };

  // 교회주소 입력 처리
  const onChangeDetailAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setDetailAddress(event.target.value); // 별도 포맷팅 없이 입력 값 그대로 저장
  };

  // 대표번호 입력 처리
  const onChangePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = getFormattedMobilePhone(event.target.value);
    setPhone(formattedPhone);
  };

  // 교인 수 입력 처리
  const onChangeMemberSize = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedSize = event.target.value;
    setMemberSize(formattedSize);
  };

  const onClickButton = async () => {
    setIsLoading(true);
    try {
      const response = await churchesApi.createChurch({
        name,
        address: '테스트',
        denomination: '테스트',
        identifyNumber: new Date().getTime().toString(),
        detailAddress: '테스트',
        memberSize: 'xxl',
        phone: '01012345678',
      });

      const newChurch: Church = response.data;

      dispatch(setChurchId(newChurch.id));
      dispatch(setChurch(newChurch));

      router.push('/main');
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ListContainer>
      <Loading isShow={isLoading} />
      <InputContainer>
        <LabelInput label={'교회명'} value={name} onChange={onChangeName} />
        <LabelInput
          label={'교단명'}
          value={denomination}
          onChange={onChangeDenomination}
        />
        {/*<LabelInput*/}
        {/*  label={'고유번호'}*/}
        {/*  value={identifyNumber}*/}
        {/*  onChange={onChangedIdentifyNumber}*/}
        {/*/>*/}
        <LabelInput
          label={'교회주소'}
          value={address}
          onChange={onChangeAddress}
        />
        <LabelInput
          label={'상세주소'}
          value={detailAddress}
          onChange={onChangeDetailAddress}
        />
        <LabelInput
          label={'대표번호'}
          value={phone}
          onChange={onChangePhoneNumber}
        />
        {/*<LabelInput*/}
        {/*  label={'교인 수'}*/}
        {/*  value={memberSize}*/}
        {/*  onChange={onChangeMemberSize}*/}
        {/*/>*/}
        <MainText>{'교인 수'}</MainText>
        <RadioButtonList
          items={memberSizeItems}
          selectedValue={memberSize}
          onChange={(value) => setMemberSize(value)}
        />
      </InputContainer>
      <ButtonContainer>
        <Button
          text={t_button('register')}
          height={40}
          onClick={onClickButton}
        />
      </ButtonContainer>
    </ListContainer>
  );
};

export default ChurchRegisterList;

import React, { ChangeEvent, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import LabelInput from '@/components/atoms/common/input/label-input';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import LabelRadioButton from '@/components/atoms/common/input/radio-button/label-radio-button';
import ProfileImageInput from '@/components/atoms/common/image/profile-image-input';

import RadioButton from '@/components/atoms/common/input/radio-button/radio-button';
import RegisterRadioButton from '@/components/atoms/register/register-radio-button';

import { useI18n, useScopedI18n } from '../../../../locales/client';
import {
  getIsWellFormedBirth,
  getIsWellFormedHomePhone,
  getIsWellFormedMobilePhone,
  getIsWellFormedName,
} from '@/utils/check';
import { getTrimmedString } from '@/utils/format';
import { useMarriageDropdownItems } from '@/hooks/dropdown/dropdown-items';
import {
  useCalendarModeRadioButtonItems,
  useGenderRadioButtonItems,
} from '@/hooks/radio-button/radio-button-items';

import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import {
  BLANK,
  CALENDAR_MODE,
  GENDER,
  MARRIAGE,
  NULL,
} from '@/constants/constant';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { VehicleNumberInputRef } from '@/components/atoms/register/vehicle-number-input.view';
import { MEMBER } from '@/constants/member/member-column';

const RequiredRegisterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 0 30px;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
`;

const BirthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Invisible = styled.div`
  height: 100px;
`;

type EditListViewProps = {
  focusItem: MEMBER;
  guideName: string;
  guideItems: DropdownValueType[];
  schoolItems: DropdownValueType[];
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuideName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuidedById: (value: string) => void;
  onChangeProfileImage: (image: string) => void;
  onChangeBirth: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeCalendarMode: (mode: CALENDAR_MODE) => void;
  onChangeHomePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeOccupation: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDetailAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSchool: (value: string) => void;
  onChangeVehicleNumber: (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onChangeMarriage: (value: MARRIAGE) => void;
  onChangeDetailMarriage: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGender: (value: GENDER) => void;
  onClickAddress: () => void;
};

const EditListView = ({
  focusItem,
  guideName,
  guideItems,
  schoolItems,
  onChangeName,
  onChangeMobilePhone,
  onChangeGuideName,
  onChangeGuidedById,
  onChangeProfileImage,
  onChangeBirth,
  onChangeCalendarMode,
  onChangeHomePhone,
  onChangeOccupation,
  onChangeDetailAddress,
  onChangeSchool,
  onChangeVehicleNumber,
  onChangeMarriage,
  onChangeDetailMarriage,
  onChangeGender,
  onClickAddress,
}: EditListViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const { member } = useSelector((state: RootState) => state.memberRegister);

  // ref 모음
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobilePhoneInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);
  const birthInputRef = useRef<HTMLInputElement>(null);
  const schoolInputRef = useRef<HTMLInputElement>(null);
  const occupationInputRef = useRef<HTMLInputElement>(null);
  const marriageInputRef = useRef<HTMLInputElement>(null);
  const detailMarriageInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const detailAddressInputRef = useRef<HTMLInputElement>(null);
  const homePhoneInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<VehicleNumberInputRef>(null);

  // "포커스 & 스크롤"을 수행하는 유틸 함수
  const scrollToFocus = (inputRef: React.RefObject<HTMLInputElement>) => {
    // 스크롤 되기 전에 focus()를 먼저 실행
    if (inputRef.current) {
      inputRef.current.focus();
      // 스크롤
      inputRef.current.scrollIntoView({
        behavior: 'smooth', // 부드러운 스크롤
        block: 'center', // 화면 중앙쯤에 위치시키기
      });
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      switch (focusItem) {
        case MEMBER.NAME:
          scrollToFocus(nameInputRef);
          break;
        case MEMBER.MOBILE_PHONE:
          scrollToFocus(mobilePhoneInputRef);
          break;
        case MEMBER.GUIDED_BY_ID:
          scrollToFocus(guideInputRef);
          break;
        case MEMBER.BIRTH:
          scrollToFocus(birthInputRef);
          break;
        case MEMBER.SCHOOL:
          scrollToFocus(schoolInputRef);
          break;
        case MEMBER.OCCUPATION:
          scrollToFocus(occupationInputRef);
          break;
        case MEMBER.MARRIAGE:
          scrollToFocus(marriageInputRef);
          break;
        case MEMBER.DETAIL_MARRIAGE:
          scrollToFocus(detailMarriageInputRef);
          break;
        case MEMBER.ADDRESS:
          scrollToFocus(addressInputRef);
          break;
        case MEMBER.DETAIL_ADDRESS:
          scrollToFocus(detailAddressInputRef);
          break;
        case MEMBER.HOME_PHONE:
          scrollToFocus(homePhoneInputRef);
          break;
        default:
          break;
      }
    });
  }, [focusItem]);

  return (
    <RequiredRegisterContainer>
      <ImageContainer>
        <ProfileImageInput
          memberId={member.id}
          value={member.profileImage}
          onChange={onChangeProfileImage}
        />
      </ImageContainer>

      {/* 이름 */}
      <LabelInput
        ref={nameInputRef}
        label={t('name')}
        value={member.name}
        onChange={onChangeName}
        placeholder={t_placeholder('name')}
        borderColor={
          member.name
            ? getIsWellFormedName(member.name)
              ? BLACK
              : DESTRUCTIVE.DEFAULT
            : undefined
        }
      />

      {/* 휴대폰 번호 */}
      <LabelInput
        ref={mobilePhoneInputRef}
        inputMode="numeric"
        label={t('mobilePhone')}
        value={member.mobilePhone}
        onChange={onChangeMobilePhone}
        placeholder={t_placeholder('mobilePhone')}
        borderColor={
          member.mobilePhone
            ? getIsWellFormedMobilePhone(member.mobilePhone)
              ? BLACK
              : DESTRUCTIVE.DEFAULT
            : undefined
        }
      />

      {/* 인도자 */}
      <LabelDropdown
        ref={guideInputRef}
        label={t('guide')}
        value={guideName}
        items={guideItems}
        onChange={onChangeGuideName}
        onChangeItem={onChangeGuidedById}
        placeholder={t_placeholder('guide')}
        isEditable
        backgroundBlur={false}
      />

      {/* 성별 */}
      <LabelRadioButton
        label={t('gender')}
        items={useGenderRadioButtonItems()}
        selectedValue={member.gender}
        onChange={onChangeGender}
        customButton={RegisterRadioButton}
      />

      {/* 생년월일 */}
      <BirthContainer>
        <LabelInput
          ref={birthInputRef}
          inputMode="numeric"
          label={t('birth')}
          value={member.birth || BLANK}
          onChange={onChangeBirth}
          placeholder={t_placeholder('birth')}
          borderColor={
            member.birth
              ? getIsWellFormedBirth(member.birth)
                ? BLACK
                : DESTRUCTIVE.DEFAULT
              : undefined
          }
        />
        <RadioButton
          items={useCalendarModeRadioButtonItems()}
          selectedValue={
            member.isLunar ? CALENDAR_MODE.LUNAR : CALENDAR_MODE.SOLAR
          }
          onChange={onChangeCalendarMode}
          customButton={RegisterRadioButton}
        />
      </BirthContainer>

      {/* 학교 */}
      <LabelDropdown
        ref={schoolInputRef}
        label={t('school')}
        items={schoolItems}
        value={member.school}
        onChangeItem={onChangeSchool}
        placeholder={t_placeholder('school')}
        isEditable
        borderColor={getTrimmedString(member.school) ? BLACK : undefined}
        backgroundBlur={false}
      />

      {/* 직업 */}
      <LabelInput
        ref={occupationInputRef}
        label={t('occupation')}
        value={member.occupation || BLANK}
        onChange={onChangeOccupation}
        placeholder={t_placeholder('occupation')}
        borderColor={getTrimmedString(member.occupation) ? BLACK : undefined}
      />

      {/* 결혼 */}
      <LabelDropdown
        ref={marriageInputRef}
        label={t('marriage')}
        value={member.marriage}
        items={useMarriageDropdownItems()}
        onChangeItem={onChangeMarriage}
        placeholder={t_placeholder('marriage')}
        borderColor={
          member.marriage && member.marriage !== NULL ? BLACK : undefined
        }
        backgroundBlur={false}
      />

      {/* 결혼 상세 정보 */}
      <LabelInput
        ref={detailMarriageInputRef}
        label={t('detailMarriage')}
        value={member.detailMarriage || BLANK}
        onChange={onChangeDetailMarriage}
        placeholder={t_placeholder('detailMarriage')}
        borderColor={
          getTrimmedString(member.detailMarriage) ? BLACK : undefined
        }
      />

      {/* 도로명주소 */}
      <LabelInput
        ref={addressInputRef}
        label={t('address')}
        value={member.address || BLANK}
        placeholder={t_placeholder('address')}
        onClick={onClickAddress}
        onChange={() => {}} // 필요하다면 구현
        borderColor={getTrimmedString(member.address) ? BLACK : undefined}
      />

      {/* 상세주소 */}
      <LabelInput
        ref={detailAddressInputRef}
        label={t('detailAddress')}
        value={member.detailAddress || BLANK}
        onChange={onChangeDetailAddress}
        placeholder={t_placeholder('detailAddress')}
        borderColor={getTrimmedString(member.detailAddress) ? BLACK : undefined}
      />

      {/* 전화 번호 */}
      <LabelInput
        ref={homePhoneInputRef}
        inputMode="numeric"
        label={t('homePhone')}
        value={member.homePhone || BLANK}
        onChange={onChangeHomePhone}
        placeholder={t_placeholder('homePhone')}
        borderColor={
          member.homePhone
            ? getIsWellFormedHomePhone(member.homePhone)
              ? BLACK
              : DESTRUCTIVE.DEFAULT
            : undefined
        }
      />

      {/* 차량 번호 */}
      {/*<VehicleNumberInput*/}
      {/*  ref={vehicleInputRef}*/}
      {/*  label={t('vehicleNumber')}*/}
      {/*  value={member.vehicleNumber}*/}
      {/*  onChangeInput={onChangeVehicleNumber}*/}
      {/*  placeholder={t_placeholder('vehicleNumber')}*/}
      {/*/>*/}

      <Invisible />
    </RequiredRegisterContainer>
  );
};

export default EditListView;

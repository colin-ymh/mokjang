import React, { ChangeEvent, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { BLANK, FAMILY, GENDER, MARRIAGE, NULL } from '@/constants/constant';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { VehicleNumberInputRef } from '@/components/atoms/register/vehicle-number-input.view';
import { MEMBER } from '@/constants/column/member-column';
import LabelInput from '@/components/atoms/common/input/label-input';
import {
  getIsWellFormedHomePhone,
  getIsWellFormedMobilePhone,
  getIsWellFormedName,
} from '@/utils/check';
import { BLACK, DESTRUCTIVE, GRAY } from '@/constants/styles/color';
import { getTrimmedString } from '@/utils/format';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import LabelRadioButton from '@/components/atoms/common/radio-button/label-radio-button';
import { useGenderRadioButtonItems } from '@/hooks/radio-button/radio-button-items';
import RegisterRadioButton from '@/components/atoms/register/register-radio-button';
import { useMarriageDropdownItems } from '@/hooks/dropdown/dropdown-items';
import ProfileImageInput from '@/components/atoms/common/image/profile-image-input';
import VehicleNumberInput from '@/components/atoms/register/vehicle-number-input';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import { getDateFromDateString } from '@/utils/date';
import { MainText } from '@/components/atoms/common/text/main-text';
import CheckButton from '@/components/atoms/common/button/check-button';
import KoreanLunarCalendar, { CalendarData } from 'korean-lunar-calendar';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import MemberDropdown from '@/components/atoms/common/dropdown/member-dropdown';

const RequiredRegisterContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const CheckButtonContainer = styled.div`
  display: flex;
  height: 35px;
  justify-content: center;
  align-items: center;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: 10px;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
`;

type EditListViewProps = {
  focusItem?: MEMBER;
  guideName: string;
  guideItems: DropdownValueType[];
  schoolItems: DropdownValueType[];
  familyMemberItems: MemberDropdownValueType[];
  familyMemberName: string;
  familyMemberId: string;
  familyRelation: FAMILY;
  familyRelationItems: DropdownValueType[];
  onChangeFamilyMemberId: (id: string) => void;
  onChangeFamilyRelation: (value: FAMILY) => void;
  onChangeFamilyMemberName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuideName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuidedById: (value: string) => void;
  onChangeProfileImage: (image: File | null) => void;
  onChangeBirth: (date: Date | null) => void;
  onClickIsLunar: (value: boolean) => void;
  onClickIsLeafMonth: (value: boolean) => void;
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

const AddMemberView = ({
  focusItem,
  guideName,
  guideItems,
  schoolItems,
  familyMemberItems,
  familyMemberName,
  familyMemberId,
  familyRelation,
  familyRelationItems,
  onChangeName,
  onChangeMobilePhone,
  onChangeFamilyMemberId,
  onChangeFamilyRelation,
  onChangeFamilyMemberName,
  onChangeGuideName,
  onChangeGuidedById,
  onChangeProfileImage,
  onChangeBirth,
  onClickIsLunar,
  onClickIsLeafMonth,
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
  const LEAF_MONTH = new KoreanLunarCalendar();
  const NOT_LEAF_MONTH = new KoreanLunarCalendar();

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const [YEAR = '', MONTH = '', DAY = ''] =
    targetMember.birth?.split('-') || [];

  LEAF_MONTH.setLunarDate(+YEAR, +MONTH, +DAY, true);
  NOT_LEAF_MONTH.setLunarDate(+YEAR, +MONTH, +DAY, false);

  const getIsLeafMonthEnable = (
    date1: KoreanLunarCalendar,
    date2: KoreanLunarCalendar
  ) => {
    const DATE1: CalendarData = date1.getSolarCalendar();
    const DATE2: CalendarData = date2.getSolarCalendar();

    return !(
      DATE1.year === DATE2.year &&
      DATE1.month === DATE2.month &&
      DATE1.day === DATE2.day
    );
  };

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
          value={targetMember.profileImageUrl}
          onChange={onChangeProfileImage}
        />
      </ImageContainer>

      <RowContainer>
        {/* 이름 */}
        <InputContainer>
          <LabelInput
            ref={nameInputRef}
            label={t('name')}
            value={targetMember.name}
            onChange={onChangeName}
            placeholder={t_placeholder('name')}
            borderColor={
              targetMember.name
                ? getIsWellFormedName(targetMember.name)
                  ? BLACK
                  : DESTRUCTIVE.DEFAULT
                : undefined
            }
            isRequired
          />
        </InputContainer>
        {/* 성별 */}
        <InputContainer>
          <LabelRadioButton
            label={t('gender')}
            items={useGenderRadioButtonItems()}
            selectedValue={targetMember.gender}
            onChange={onChangeGender}
            customButton={RegisterRadioButton}
          />
        </InputContainer>
      </RowContainer>

      {/* 휴대폰 번호 */}
      <InputContainer>
        <LabelInput
          ref={mobilePhoneInputRef}
          inputMode="numeric"
          label={t('mobilePhone')}
          value={targetMember.mobilePhone}
          onChange={onChangeMobilePhone}
          placeholder={t_placeholder('mobilePhone')}
          borderColor={
            targetMember.mobilePhone
              ? getIsWellFormedMobilePhone(targetMember.mobilePhone)
                ? BLACK
                : DESTRUCTIVE.DEFAULT
              : undefined
          }
          isRequired
        />
      </InputContainer>

      <RowContainer>
        {/* 인도자 */}
        <InputContainer>
          <MainText>{t('guide')}</MainText>
          <MemberDropdown
            ref={guideInputRef}
            value={guideName}
            items={guideItems}
            onChange={onChangeGuideName}
            onChangeItem={onChangeGuidedById}
            placeholder={t_placeholder('guide')}
            isEditable
            backgroundBlur={false}
          />
        </InputContainer>
        {/* 가족 */}
        <InputContainer>
          <MainText>{t('family')}</MainText>
          <MemberDropdown
            value={familyMemberName}
            items={familyMemberItems}
            onChange={onChangeFamilyMemberName}
            onChangeItem={onChangeFamilyMemberId}
            placeholder={t_placeholder('family')}
            isEditable
            backgroundBlur={false}
          />
        </InputContainer>
        <InputContainer>
          {/* 가족관계 */}
          <LabelDropdown
            label={t('relation')}
            value={familyRelation}
            items={familyRelationItems}
            onChangeItem={onChangeFamilyRelation}
          />
        </InputContainer>
      </RowContainer>

      <RowContainer>
        <InputContainer>
          <LabelContainer>
            <MainText>{t('birth')}</MainText>
            {/* 생년월일 */}
            <CustomDatePicker
              selected={
                targetMember.birth
                  ? getDateFromDateString(targetMember.birth)
                  : null
              }
              onChange={onChangeBirth}
              placeholderText={t('placeholder.birth')}
              yearRange={[1900, new Date().getFullYear()]}
            />
          </LabelContainer>
        </InputContainer>
        <ButtonContainer>
          {/* 음력 */}
          <InputContainer>
            <LabelContainer>
              <MainText>{t('lunar')}</MainText>
            </LabelContainer>
            <CheckButtonContainer>
              <CheckButton
                value={targetMember.isLunar}
                onChange={onClickIsLunar}
                width={25}
                height={25}
                borderColor={GRAY.DEFAULT}
              />
            </CheckButtonContainer>
          </InputContainer>
          {/* 윤달 */}
          <InputContainer>
            <LabelContainer>
              <MainText color={targetMember.isLunar ? BLACK : GRAY.DEFAULT}>
                {t('leafMonth')}
              </MainText>
            </LabelContainer>
            <CheckButtonContainer>
              <CheckButton
                value={targetMember.isLeafMonth}
                onChange={onClickIsLeafMonth}
                width={25}
                height={25}
                disabled={
                  !targetMember.isLunar ||
                  !getIsLeafMonthEnable(LEAF_MONTH, NOT_LEAF_MONTH)
                }
                borderColor={
                  targetMember.isLunar &&
                  getIsLeafMonthEnable(LEAF_MONTH, NOT_LEAF_MONTH)
                    ? GRAY.DEFAULT
                    : GRAY.LIGHT
                }
              />
            </CheckButtonContainer>
          </InputContainer>
        </ButtonContainer>
      </RowContainer>
      {/* 학교 */}
      <RowContainer>
        <InputContainer>
          <LabelDropdown
            ref={schoolInputRef}
            label={t('school')}
            items={schoolItems}
            value={targetMember.school || BLANK}
            onChangeItem={onChangeSchool}
            placeholder={t_placeholder('school')}
            isEditable
            borderColor={
              getTrimmedString(targetMember.school) ? BLACK : undefined
            }
            backgroundBlur={false}
          />
        </InputContainer>

        {/* 직업 */}
        <InputContainer>
          <LabelInput
            ref={occupationInputRef}
            label={t('occupation')}
            value={targetMember.occupation || BLANK}
            onChange={onChangeOccupation}
            placeholder={t_placeholder('occupation')}
            borderColor={
              getTrimmedString(targetMember.occupation) ? BLACK : undefined
            }
          />
        </InputContainer>
      </RowContainer>
      <RowContainer>
        {/* 결혼 */}
        <InputContainer>
          <LabelDropdown
            ref={marriageInputRef}
            label={t('marriage')}
            value={targetMember.marriage}
            items={useMarriageDropdownItems()}
            onChangeItem={onChangeMarriage}
            placeholder={t_placeholder('marriage')}
            borderColor={
              targetMember.marriage && targetMember.marriage !== NULL
                ? BLACK
                : undefined
            }
            backgroundBlur={false}
          />
        </InputContainer>

        {/* 결혼 상세 정보 */}
        <InputContainer>
          <LabelInput
            ref={detailMarriageInputRef}
            label={t('detailMarriage')}
            value={targetMember.detailMarriage || BLANK}
            onChange={onChangeDetailMarriage}
            placeholder={t_placeholder('detailMarriage')}
            borderColor={
              getTrimmedString(targetMember.detailMarriage) ? BLACK : undefined
            }
          />
        </InputContainer>
      </RowContainer>
      {/* 도로명주소 */}
      <InputContainer>
        <LabelInput
          ref={addressInputRef}
          label={t('address')}
          value={targetMember.address || BLANK}
          placeholder={t_placeholder('address')}
          onClick={onClickAddress}
          onChange={() => {}} // 필요하다면 구현
          borderColor={
            getTrimmedString(targetMember.address) ? BLACK : undefined
          }
        />
      </InputContainer>

      {/* 상세주소 */}
      <InputContainer>
        <LabelInput
          ref={detailAddressInputRef}
          label={t('detailAddress')}
          value={targetMember.detailAddress || BLANK}
          onChange={onChangeDetailAddress}
          placeholder={t_placeholder('detailAddress')}
          borderColor={
            getTrimmedString(targetMember.detailAddress) ? BLACK : undefined
          }
        />
      </InputContainer>

      {/* 전화 번호 */}
      <InputContainer>
        <LabelInput
          ref={homePhoneInputRef}
          inputMode="numeric"
          label={t('homePhone')}
          value={targetMember.homePhone || BLANK}
          onChange={onChangeHomePhone}
          placeholder={t_placeholder('homePhone')}
          borderColor={
            targetMember.homePhone
              ? getIsWellFormedHomePhone(targetMember.homePhone)
                ? BLACK
                : DESTRUCTIVE.DEFAULT
              : undefined
          }
        />
      </InputContainer>
      {/* 차량 번호 */}
      <InputContainer>
        <VehicleNumberInput
          ref={vehicleInputRef}
          label={t('vehicleNumber')}
          value={targetMember.vehicleNumber}
          onChangeInput={onChangeVehicleNumber}
          placeholder={t_placeholder('vehicleNumber')}
        />
      </InputContainer>
    </RequiredRegisterContainer>
  );
};

export default AddMemberView;

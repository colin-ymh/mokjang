import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { BAPTISM, BLANK, GENDER, GRAY, MARRIAGE, SIZE, } from '@mokjang/constants';
import { DropdownValueType } from '../../../atoms/common/dropdown/dropdown-item';
import { CheckButton, LabelInput, MainText, PopupHeaderBar, } from '@mokjang/components';
import LabelDropdown from '../../../atoms/common/dropdown/label-dropdown';
import LabelRadioButton from '../../../atoms/common/radio-button/label-radio-button';
import { useGenderRadioButtonItems, useLunarSolarRadioButtonItems, } from '@/hooks/radio-button/radio-button-items';
import { useBaptismDropdownItems, useMarriageDropdownItems, } from '@/hooks/dropdown/dropdown-items';
import VehicleNumberInput from '../../../atoms/register/vehicle-number-input';
import CustomDatePicker from '../../../../vendor/date-picker/custom-date-picker';
import { getDateFromDateString, getFormattedPhone } from '@mokjang/utils';
import KoreanLunarCalendar, { CalendarData } from 'korean-lunar-calendar';
import { useEditMemberHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { EDIT_MEMBER_HEADER_ID } from '@/constants/layout/header';
import ProfileImageInput from '@/components/atoms/common/image/profile-image-input';

const EditMemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RequiredRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px 30px;
  overflow-y: auto;
`;

const SectionContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: column;
  gap: 20px;
  min-height: 400px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const LeafMonthContainer = styled.div`
  display: flex;
  width: 100px;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
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
  gap: 8px;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
`;

type AddMemberViewProps = {
  headerBarId: EDIT_MEMBER_HEADER_ID;
  onChangeHeader: (id: EDIT_MEMBER_HEADER_ID) => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeProfileImage: (image: File | null | undefined) => void;
  onChangeBirth: (date: Date | null) => void;
  onChangeIsLunar: (value: boolean) => void;
  onClickIsLeafMonth: (value: boolean) => void;
  onChangeOccupation: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDetailAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSchool: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeVehicleNumber: (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onChangeMarriage: (value: MARRIAGE) => void;
  onChangeDetailMarriage: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGender: (value: GENDER) => void;
  onClickAddress: () => void;
  onChangeBaptism: (baptism: BAPTISM) => void;
  onChangeRegisteredAt: (date: Date | null) => void;
};

const EditMemberView = ({
  headerBarId,
  onChangeHeader,
  onChangeName,
  onChangeMobilePhone,
  onChangeProfileImage,
  onChangeBirth,
  onChangeIsLunar,
  onClickIsLeafMonth,
  onChangeOccupation,
  onChangeDetailAddress,
  onChangeSchool,
  onChangeVehicleNumber,
  onChangeMarriage,
  onChangeDetailMarriage,
  onChangeGender,
  onClickAddress,
  onChangeBaptism,
  onChangeRegisteredAt,
}: AddMemberViewProps) => {
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

  // ---------------------------------------------
  const { officers, groups } = useSelector((state: RootState) => state.church);

  const officerDropdownItems: DropdownValueType[] = [
    {
      value: undefined,
      title: t_placeholder('selectOfficer'),
    },
    ...officers.map((officer) => ({
      value: officer.id,
      title: officer.name,
    })),
  ];

  const baptismDropdownItems: DropdownValueType[] = useBaptismDropdownItems();

  const headerBarItems = useEditMemberHeaderBarItems();

  return (
    <EditMemberContainer>
      {/* 탭 바*/}
      <PopupHeaderBar
        value={headerBarId}
        items={headerBarItems}
        onClick={onChangeHeader}
      />
      <RequiredRegisterContainer>
        {/* 기본 정보 섹션 */}
        {
          <SectionContainer
            $isShown={headerBarId === EDIT_MEMBER_HEADER_ID.BASIC_INFORMATION}
          >
            {/* 프로필 사진 */}
            <LabelContainer>
              <MainText color={GRAY.DARK} size={SIZE.SMALL}>
                {t('profileImage')}
              </MainText>
              <ImageContainer>
                <ProfileImageInput
                  width={120}
                  height={120}
                  value={targetMember.profileImageUrl}
                  onChange={onChangeProfileImage}
                />
              </ImageContainer>
            </LabelContainer>

            <RowContainer>
              {/* 이름 */}
              <InputContainer>
                <LabelInput
                  label={t('name')}
                  value={targetMember.name}
                  onChange={onChangeName}
                  placeholder={t_placeholder('name')}
                  isRequired
                />
              </InputContainer>

              {/* 휴대폰 번호 */}
              <InputContainer>
                <LabelInput
                  inputMode="numeric"
                  label={t('mobilePhone')}
                  value={getFormattedPhone(targetMember.mobilePhone)}
                  onChange={onChangeMobilePhone}
                  placeholder={t_placeholder('mobilePhone')}
                  isRequired
                />
              </InputContainer>
            </RowContainer>

            <RowContainer>
              {/* 생년월일 */}
              <InputContainer>
                <LabelContainer>
                  <MainText color={GRAY.DARK} size={SIZE.SMALL}>
                    {t('birth')}
                  </MainText>
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
                  <LabelRadioButton
                    label={t('lunar')}
                    items={useLunarSolarRadioButtonItems()}
                    selectedValue={targetMember.isLunar}
                    onChange={onChangeIsLunar}
                  />
                </InputContainer>
                {/* 윤달 */}
                {targetMember.isLunar &&
                  getIsLeafMonthEnable(LEAF_MONTH, NOT_LEAF_MONTH) && (
                    <LeafMonthContainer>
                      <MainText
                        color={targetMember.isLunar ? GRAY.DARK : GRAY.DEFAULT}
                        size={SIZE.SMALL}
                      >
                        {t('leafMonth')}
                      </MainText>
                      <CheckButtonContainer>
                        <CheckButton
                          value={targetMember.isLeafMonth}
                          onChange={onClickIsLeafMonth}
                          width={25}
                          height={25}
                          borderColor={
                            targetMember.isLunar &&
                            getIsLeafMonthEnable(LEAF_MONTH, NOT_LEAF_MONTH)
                              ? GRAY.DEFAULT
                              : GRAY.LIGHT
                          }
                        />
                      </CheckButtonContainer>
                    </LeafMonthContainer>
                  )}
              </ButtonContainer>
            </RowContainer>
            <RowContainer>
              {/* 성별 */}
              <InputContainer>
                <LabelRadioButton
                  label={t('gender')}
                  items={useGenderRadioButtonItems()}
                  selectedValue={targetMember.gender}
                  onChange={onChangeGender}
                />
              </InputContainer>
              <InputContainer />
            </RowContainer>
          </SectionContainer>
        }

        {/* 개인 정보 섹션 */}
        {
          <SectionContainer
            $isShown={
              headerBarId === EDIT_MEMBER_HEADER_ID.PERSONAL_INFORMATION
            }
          >
            <RowContainer>
              {/* 직업 */}
              <InputContainer>
                <LabelInput
                  label={t('occupation')}
                  value={targetMember.occupation || BLANK}
                  onChange={onChangeOccupation}
                  placeholder={t_placeholder('occupation')}
                />
              </InputContainer>
              {/* 학교 */}
              <InputContainer>
                <LabelInput
                  label={t('school')}
                  value={targetMember.school || BLANK}
                  onChange={onChangeSchool}
                  placeholder={t_placeholder('school')}
                />
              </InputContainer>
            </RowContainer>

            {/* 도로명주소 */}
            <InputContainer>
              <LabelInput
                label={t('address')}
                value={targetMember.address || BLANK}
                placeholder={t_placeholder('address')}
                onClick={onClickAddress}
                onChange={() => {}} // 필요하다면 구현
              />
            </InputContainer>
            {/* 상세주소 */}
            <InputContainer>
              <LabelInput
                label={t('detailAddress')}
                value={targetMember.detailAddress || BLANK}
                onChange={onChangeDetailAddress}
                placeholder={t_placeholder('detailAddress')}
              />
            </InputContainer>

            <RowContainer>
              {/* 결혼 */}
              <InputContainer>
                <LabelRadioButton
                  label={t('marriage')}
                  items={useMarriageDropdownItems()}
                  selectedValue={targetMember.marriage}
                  onChange={onChangeMarriage}
                />
              </InputContainer>
              {/* 결혼 상세 정보 */}
              <InputContainer>
                <LabelInput
                  label={t('detailMarriage')}
                  value={targetMember.detailMarriage || BLANK}
                  onChange={onChangeDetailMarriage}
                  placeholder={t_placeholder('detailMarriage')}
                />
              </InputContainer>
            </RowContainer>

            {/* 차량 번호 */}
            <InputContainer>
              <VehicleNumberInput
                label={t('vehicleNumber')}
                value={targetMember.vehicleNumber}
                onChangeInput={onChangeVehicleNumber}
                placeholder={t_placeholder('vehicleNumber')}
              />
            </InputContainer>
          </SectionContainer>
        }

        {/* 교회 정보 섹션 */}
        {
          <SectionContainer
            $isShown={headerBarId === EDIT_MEMBER_HEADER_ID.CHURCH_INFORMATION}
          >
            <RowContainer>
              <LabelDropdown
                label={t('baptism')}
                items={baptismDropdownItems}
                value={targetMember.baptism}
                onChangeItem={onChangeBaptism}
                backgroundBlur={false}
              />
              {/* 등록일 */}
              <InputContainer>
                <LabelContainer>
                  <MainText color={GRAY.DARK} size={SIZE.SMALL}>
                    {t('registeredAt')}
                  </MainText>
                  <CustomDatePicker
                    selected={
                      targetMember.registeredAt
                        ? getDateFromDateString(targetMember.registeredAt)
                        : null
                    }
                    onChange={onChangeRegisteredAt}
                    placeholderText={t_placeholder('registeredAt')}
                    yearRange={[1900, new Date().getFullYear()]}
                  />
                </LabelContainer>
              </InputContainer>
            </RowContainer>
          </SectionContainer>
        }
      </RequiredRegisterContainer>
    </EditMemberContainer>
  );
};

// @ts-ignore
export default EditMemberView;

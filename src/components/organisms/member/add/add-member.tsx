import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { AxiosResponse } from 'axios';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';

import { GetMembersResponse, MembersApi } from '@/api/members/members.api';
import { BLANK, GENDER, MARRIAGE } from '@/constants/constant';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import {
  getFormattedHomePhone,
  getFormattedMobilePhone,
  getFormattedName,
  getFormattedVehicleNumber,
  getTrimmedString,
} from '@/utils/format';
import {
  getIsWellFormedHomePhone,
  getIsWellFormedMobilePhone,
} from '@/utils/check';
import { getSchool } from '@/api/school-api';
import PagePopup from '@/components/atoms/common/popup/page-popup';
import { MEMBER } from '@/constants/member/member-column';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import AddMemberView from '@/components/organisms/member/add/add-member.view';
import { getDateStringFromDate } from '@/utils/date';

export type AddMemberProps = {
  focusItem?: MEMBER;
  onChangeProfileImage: (image: File | null) => void;
};

const AddMember = ({ focusItem, onChangeProfileImage }: AddMemberProps) => {
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 인도자 이름
  const [guideName, setGuideName] = useState<string>(BLANK);
  // 검색된 인도자 목록
  const [guideItems, setGuideItems] = useState<DropdownValueType[]>([]);

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    dispatch(setTargetMember({ ...targetMember, name: newName }));
  };

  // 휴대폰 번호 변경 시 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobilePhone = getFormattedMobilePhone(event.target.value);
    dispatch(setTargetMember({ ...targetMember, mobilePhone: newMobilePhone }));

    // 전화번호를 다 입력한 경우
    if (getIsWellFormedMobilePhone(newMobilePhone)) {
      (event.target as HTMLInputElement).blur();
    }
  };

  // 인도자 input 변경 시 이벤트
  const onChangeGuideName = async (event: ChangeEvent<HTMLInputElement>) => {
    const newGuideName = getTrimmedString(event.target.value);
    setGuideName(newGuideName);

    if (newGuideName) {
      try {
        const response: AxiosResponse = await membersApi.getMembers({
          churchId,
          name: newGuideName,
          page: 1,
          take: 5,
        });

        const members: GetMembersResponse[] = response.data.data;
        const newGuideItems: DropdownValueType[] = members.map((member) => {
          return { value: member.id, title: member.name };
        });

        setGuideItems(newGuideItems);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  // 인도자 dropdown 선택 시 이벤트
  const onChangeGuidedById = (value: string) => {
    dispatch(setTargetMember({ ...targetMember, guidedById: value }));
  };

  const [schoolItems, setSchoolItems] = useState<DropdownValueType[]>([]);
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

  const onClickAddressClose = () => setIsAddressOpen(false);

  // 성별 변경 시 이벤트
  const onChangeGender = (gender: GENDER) => {
    dispatch(setTargetMember({ ...targetMember, gender }));
  };

  // 생년월일 변경 시 이벤트
  const onChangeBirth = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetMember({ ...targetMember, birth: getDateStringFromDate(date) })
      );
    }
  };

  // 양력 음력 변경 이벤트
  const onClickIsLunar = (value: boolean) => {
    if (!value) {
      dispatch(
        setTargetMember({
          ...targetMember,
          isLunar: value,
          isLeafMonth: false,
        })
      );
    } else {
      dispatch(
        setTargetMember({
          ...targetMember,
          isLunar: value,
        })
      );
    }
  };

  // 윤달 변경 이벤트
  const onClickIsLeafMonth = (value: boolean) => {
    dispatch(
      setTargetMember({
        ...targetMember,
        isLeafMonth: value,
      })
    );
  };

  // 학교 변경 시 이벤트
  const onChangeSchool = (value: string) => {
    const newSchool = getTrimmedString(value);
    dispatch(setTargetMember({ ...targetMember, school: newSchool }));

    // value 에 따라 학교 검색 API 요청
    getSchool(value, 1, 5).then((response) => {
      const items: DropdownValueType[] = response.map((value) => {
        return { value: value.SCHUL_NM, title: value.SCHUL_NM };
      });

      setSchoolItems(items);
    });
  };

  // 직업 변경 시 이벤트
  const onChangeOccupation = (event: ChangeEvent<HTMLInputElement>) => {
    const newOccupation = event.target.value;
    dispatch(setTargetMember({ ...targetMember, occupation: newOccupation }));
  };

  // 결혼 정보 변경 시 이벤트
  const onChangeMarriage = (value: MARRIAGE) => {
    dispatch(setTargetMember({ ...targetMember, marriage: value }));
  };

  // 결혼 상세 변경 시 이벤트
  const onChangeDetailMarriage = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setTargetMember({ ...targetMember, detailMarriage: event.target.value })
    );
  };

  // 도로명주소 입력창 이벤트
  const onClickAddress = () => {
    setIsAddressOpen(true);
  };

  // 도로명주소 검색 api 내 주소 선택 이벤트
  const onCompleteAddress = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    dispatch(setTargetMember({ ...targetMember, address: fullAddress }));
    setIsAddressOpen(false);
  };

  // 상세 주소 변경 시 이벤트
  const onChangeDetailAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const newDetailAddress = event.target.value;
    dispatch(
      setTargetMember({ ...targetMember, detailAddress: newDetailAddress })
    );
  };

  // 전화번호 변경 시 이벤트
  const onChangeHomePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newHomePhone = getFormattedHomePhone(event.target.value);
    dispatch(setTargetMember({ ...targetMember, homePhone: newHomePhone }));

    if (getIsWellFormedHomePhone(newHomePhone)) {
      (event.target as HTMLInputElement).blur();
    }
  };

  // 차량 번호 변경 시 이벤트
  const onChangeVehicleNumber = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    // vehicleNumber 배열을 복사하여 새로운 배열 생성
    const newVehicleNumber = [...targetMember.vehicleNumber];

    const number = getFormattedVehicleNumber(event.target.value);

    if (number !== undefined) {
      // 수정할 인덱스의 값을 변경
      newVehicleNumber[index] = number;
    }

    // 새로운 member 객체와 vehicleNumber 배열을 디스패치
    dispatch(
      setTargetMember({ ...targetMember, vehicleNumber: newVehicleNumber })
    );
  };

  const props = {
    focusItem,
    guideName,
    guideItems,
    schoolItems,
    isAddressOpen,
    onChangeName,
    onChangeMobilePhone,
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
  };

  return (
    <>
      <AddMemberView {...props} />
      <PagePopup isShow={isAddressOpen} onClickCancel={onClickAddressClose}>
        <DaumPostcodeEmbed
          onComplete={onCompleteAddress}
          style={{ width: '100%', height: '100%' }}
        />
      </PagePopup>
    </>
  );
};

export default AddMember;

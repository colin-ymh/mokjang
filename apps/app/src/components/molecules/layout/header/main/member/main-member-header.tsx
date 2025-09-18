import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import MainMemberHeaderView from './main-member-header.view';
import { fetchMembers } from '@/redux/reducers/filter/member-filter-reducer';
import { usePageRouter } from '@mokjang/utils';
import { useI18n } from '../../../../../../../locales/client';
import { DEFAULT_MEMBER } from '@mokjang/models';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { uploadFilesToSupabase } from '@/utils/upload';
import { MembersApi } from '@/api/members/members.api';
import { BLACK, CONCEALED, DESTRUCTIVE } from '@mokjang/constants';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { Loading } from '@mokjang/components';

type MainMemberHeaderProps = {};

const MainMemberHeader = ({}: MainMemberHeaderProps) => {
  const router = usePageRouter();

  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();
  const membersApi = new MembersApi(false);

  const { churchId, groups } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 교인 등록하기 on/off
  const [isRegisterShown, setIsRegisterShown] = useState<boolean>(false);

  // 모바일 그룹 필터 버튼
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  // 임시 프로필 이미지
  const [profileImage, setProfileImage] = useState<File | null | undefined>(
    null
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeProfileImage = (image: File | null | undefined) => {
    setProfileImage(image);
  };

  // 교인 등록하기 팝업 닫기
  const onClickClose = () => {
    dispatch(setTargetMember(DEFAULT_MEMBER));
    setIsRegisterShown(false);
  };

  // 교인 등록하기 팝업 띄우기
  const onClickRegisterMemberButton = () => {
    setIsRegisterShown(true);
  };

  // 모달 열기
  const onClickGroupButton = () => {
    setIsModalOpened(true);
  };

  // 모달 닫기
  const onDismissModal = () => {
    setIsModalOpened(false);
  };

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/member/${id}`);
  };

  // (모바일) 선택된 그룹 이름
  const [selectedGroupName, setSelectedGroupName] = useState<string>(t('all'));

  const onClickNewGroup = (groupId: string | null) => {
    if (groupId === null) {
      setSelectedGroupName(t('all'));
    } else {
      const targetGroup = groups.find((g) => g.id === groupId);

      if (targetGroup) {
        setSelectedGroupName(targetGroup.name);
      }
    }
    setIsModalOpened(false);
  };

  const onClickSave = async () => {
    setIsLoading(true);
    try {
      let updatedMember = { ...targetMember };
      if (profileImage) {
        const uploadedUrls = await uploadFilesToSupabase([profileImage], {
          bucket: 'profile',
          prefix: `church/${churchId}/member`,
        });
        const uploadedUrl = uploadedUrls[0];
        if (uploadedUrl) {
          updatedMember = { ...targetMember, profileImageUrl: uploadedUrl };
          dispatch(setTargetMember(updatedMember));
        }
      }

      await membersApi
        .createMember(
          { churchId },
          {
            name: updatedMember.name,
            mobilePhone: updatedMember.mobilePhone.replace(/\D/g, ''),
            profileImageUrl: updatedMember.profileImageUrl || undefined,
            birth: updatedMember.birth || undefined,
            isLunar: updatedMember.isLunar,
            isLeafMonth: updatedMember.isLeafMonth,
            gender: updatedMember.gender || undefined,
            occupation: updatedMember.occupation || undefined,
            school: updatedMember.school || undefined,
            address: updatedMember.address || undefined,
            detailAddress: updatedMember.detailAddress || undefined,
            marriage:
              updatedMember.marriage && updatedMember.marriage !== CONCEALED
                ? updatedMember.marriage
                : undefined,
            vehicleNumber:
              updatedMember.vehicleNumber.filter(
                (number) => number.length > 0
              ) || undefined,
            registeredAt: updatedMember.registeredAt || undefined,
          }
        )
        .then((response) => {
          dispatch(fetchMembers());
          setIsRegisterShown(false);
        });

      dispatch(setTargetMember(DEFAULT_MEMBER));
      setIsRegisterShown(false);

      dispatch(setToastText(t('popup.registerSuccess')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
      setProfileImage(null);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const props = {
    isModalOpened,
    isRegisterShown,
    onClickClose,
    onClickRegisterMemberButton,
    onClickHeaderBar,
    onClickGroupButton,
    onDismissModal,
    selectedGroupName,
    onClickNewGroup,
    onChangeProfileImage,
    onClickSave,
  };

  return (
    <>
      <MainMemberHeaderView {...props} />
      <Loading isShow={isLoading} />
    </>
  );
};
export default MainMemberHeader;

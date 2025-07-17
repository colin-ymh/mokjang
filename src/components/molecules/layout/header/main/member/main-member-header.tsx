import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import MainMemberHeaderView from '@/components/molecules/layout/header/main/member/main-member-header.view';
import { DummyApi } from '@/api/dummy.api';
import {
  fetchMembers,
  setMembers,
} from '@/redux/reducers/filter/member-filter-reducer';
import { usePageRouter } from '@/utils/router';
import { useI18n } from '../../../../../../../locales/client';
import { DEFAULT_MEMBER, Member } from '@/models/member/member';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { uploadFiles } from '@/utils/upload';
import { getCreateMemberBody, getMemberFromServer } from '@/utils/member';
import { MembersApi } from '@/api/members/members.api';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

type MainMemberHeaderProps = {};

const MainMemberHeader = ({}: MainMemberHeaderProps) => {
  const router = usePageRouter();

  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();
  const dummyApi = new DummyApi(false);
  const membersApi = new MembersApi(false);

  const { churchId, groups } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { members } = useSelector((state: RootState) => state.memberFilter);

  // 교인 등록하기 on/off
  const [isRegisterShown, setIsRegisterShown] = useState<boolean>(false);

  // 모바일 그룹 필터 버튼
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  // 임시 프로필 이미지
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeProfileImage = (image: File | null) => {
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

  // 테스트 교인 생성
  const onClickDummyMembers = async () => {
    dummyApi.createDummyMembers({ churchId }).then(() => {
      dispatch(fetchMembers({ currentPage: 1 })).then((result) => {
        if (fetchMembers.fulfilled.match(result)) {
          dispatch(setMembers(result.payload));
        }
      });
    });
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
    try {
      let updatedMember = { ...targetMember };
      if (profileImage) {
        const uploadedUrls = await uploadFiles([profileImage]);
        const uploadedUrl = uploadedUrls[0];
        if (uploadedUrl) {
          updatedMember = { ...targetMember, profileImageUrl: uploadedUrl };
          dispatch(setTargetMember(updatedMember));
        }
      }

      await membersApi
        .createMember({ churchId }, getCreateMemberBody(updatedMember))
        .then((response) => {
          if (response.status === 200) {
            setIsRegisterShown(false);
            const newMember = getMemberFromServer(response.data.data);
            dispatch(setTargetMember(newMember));
            const newMembers = members.map((mem: Member) =>
              mem.id === newMember.id ? newMember : mem
            );
            dispatch(setMembers(newMembers));
          }
        });

      dispatch(setTargetMember(DEFAULT_MEMBER));
      setIsRegisterShown(false);

      dispatch(setToastText(t('popup.registerSuccess')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const props = {
    isModalOpened,
    isRegisterShown,
    setIsRegisterShown,
    onClickClose,
    onClickRegisterMemberButton,
    onClickHeaderBar,
    onClickDummyMembers,
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
    </>
  );
};
export default MainMemberHeader;

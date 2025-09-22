import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  advanceToNextCursor,
  fetchMembers,
  setMemberCursor,
  setMembers,
} from '@/redux/reducers/filter/member-filter-reducer';

import { MembersApi } from '@/api/members/members.api';
import MemberListView from './member-list.view';
import { DEFAULT_MEMBER } from '@mokjang/models';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { uploadFilesToSupabase } from '@/utils/upload';
import { BLACK, BLANK, CONCEALED, DESTRUCTIVE } from '@mokjang/constants';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';
import { deleteFilesFromSupabase } from '@/utils/delete';

type MemberListProps = {
  isNewMember?: boolean;
};

const MemberList = ({ isNewMember }: MemberListProps) => {
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );

  const {
    members,
    memberFilter,
    memberSortBy,
    memberSortDirection,
    nextCursor,
    hasMore,
  } = useSelector((state: RootState) => state.memberFilter);

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const t_popup = useScopedI18n('popup');

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 임시 프로필 이미지
  const [profileImage, setProfileImage] = useState<File | null | undefined>(
    null
  );

  const onChangeProfileImage = (
    image: File | null | undefined,
    thumb?: string
  ) => {
    setProfileImage(image);

    if (!image) {
      dispatch(setTargetMember({ ...targetMember, profileImageUrl: BLANK }));
    }

    if (thumb) {
      dispatch(setTargetMember({ ...targetMember, profileImageUrl: thumb }));
    }
  };

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤: hasMore/nextCursor 기반
  const loadMembers = async () => {
    if (isLoading) return;
    if (!hasMore) return; // 더 불러올 데이터 없음
    setIsLoading(true);
    try {
      if (nextCursor) {
        dispatch(advanceToNextCursor()); // memberCursor = nextCursor
      }
      await dispatch(fetchMembers());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터/정렬/신규등록 플래그 변경 시: 커서 초기화 후 재조회
  useEffect(() => {
    const fetchInitialMembers = async () => {
      try {
        await dispatch(setMemberCursor(BLANK)); // 처음부터
        await dispatch(fetchMembers());
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    fetchInitialMembers();
  }, [memberFilter, memberSortBy, memberSortDirection, isNewMember]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickMemberItem = async (memberId: string) => {
    try {
      const response = await membersApi.getMember({ churchId, memberId });
      const member = response.data.data;

      dispatch(setTargetMember(member)); // (중복 제거)
      setIsMemberInformationShown(true);
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

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsMemberInformationShown(false);
    dispatch(setTargetMember(DEFAULT_MEMBER));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      await membersApi.deleteMember({
        churchId,
        memberId: targetMember.id,
      });

      // 커서 초기화 후 다시 로드
      await dispatch(setMemberCursor(BLANK));
      await dispatch(fetchMembers());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetMember(DEFAULT_MEMBER));
      setIsMemberInformationShown(false);
    }
  };

  const onClickEditOpen = () => {
    dispatch(setTargetMember(targetMember));
    setIsEditShown(true);
  };

  const onClickEditClose = async () => {
    const membersApi = new MembersApi(false);
    setIsEditShown(false);
    const response = await membersApi.getMember({
      churchId,
      memberId: targetMember.id,
    });
    const newMember = response.data.data;
    dispatch(setTargetMember(newMember));
  };

  const onClickEditDone = async () => {
    dispatch(setToastBackgroundColor(BLACK));
    dispatch(setToastText(t_popup('saveComplete')));
    dispatch(setIsToastShown(true));
    setIsEditShown(false);

    try {
      let updatedMember = { ...targetMember };

      // 프로필 이미지를 불러왔음
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

        // 기존에 다른 프로필 이미지가 있었다면, 삭제
        const prevImageUrl = members.find(
          (member) => member.id === targetMember.id
        )?.profileImageUrl;

        if (prevImageUrl) {
          deleteFilesFromSupabase([prevImageUrl]);
        }
      }
      // 프로필 이미지 삭제
      else if (profileImage === undefined) {
        updatedMember = { ...targetMember, profileImageUrl: BLANK };
        dispatch(setTargetMember(updatedMember));

        // 이전 프로필 이미지 확인 후 삭제
        const prevImageUrl = members.find(
          (member) => member.id === targetMember.id
        )?.profileImageUrl;

        if (prevImageUrl) {
          deleteFilesFromSupabase([prevImageUrl]);
        }
      }
      // 프로필 이미지 변화 없음
      else if (profileImage === null) {
        updatedMember = { ...targetMember, profileImageUrl: BLANK };
      }

      await membersApi
        .editMember(
          { churchId, memberId: targetMember.id },
          {
            name: updatedMember.name || undefined,
            mobilePhone:
              updatedMember.mobilePhone?.replace(/\D/g, '') || undefined,
            profileImageUrl: updatedMember.profileImageUrl
              ? updatedMember.profileImageUrl
              : profileImage === undefined
                ? BLANK
                : undefined,
            birth:
              getDateStringFromDate(
                getDateFromDateString(updatedMember.birth)
              ) || undefined,
            isLunar: updatedMember.isLunar,
            isLeafMonth: updatedMember.isLeafMonth,
            gender: updatedMember.gender || undefined,
            occupation: updatedMember.occupation || undefined,
            school: updatedMember.school || undefined,
            address: updatedMember.address || undefined,
            detailAddress: updatedMember.detailAddress || undefined,
            registeredAt:
              getDateStringFromDate(
                getDateFromDateString(updatedMember.registeredAt)
              ) || undefined,
            baptism: updatedMember.baptism || undefined,
            marriage:
              updatedMember.marriage !== CONCEALED
                ? updatedMember.marriage
                : undefined,
            detailMarriage:
              updatedMember.detailMarriage !== CONCEALED
                ? updatedMember.detailMarriage
                : undefined,
            vehicleNumber:
              updatedMember.vehicleNumber.filter(
                (number) => number.length > 0
              ) || undefined,
          }
        )
        .then((response) => {
          const newMember = response.data.data;
          dispatch(setTargetMember(newMember));
          const newMembers = members.map((m) => {
            if (m.id === targetMember.id) {
              return newMember;
            } else {
              return m;
            }
          });
          dispatch(setMembers(newMembers));
          // dispatch(fetchMembers());

          setProfileImage(null);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetMember]);

  // (삭제) memberPage 의존 이펙트 — 커서 방식으로 대체했으므로 필요 없음

  const props = {
    list: {
      members,
      onClickMemberItem,
      loadMembers,
    },
    information: {
      isMemberInformationShown,
      isLoading,
      isPopupShown,
      isEditShown,
      onClickEditOpen,
      onClickEditClose,
      onClickEditDone,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
      onChangeProfileImage,
    },
  };

  return (
    <>
      <MemberListView {...props} />
    </>
  );
};

export default MemberList;

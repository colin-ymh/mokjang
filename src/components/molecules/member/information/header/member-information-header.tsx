import React, { useState } from 'react';
import { DEFAULT_MEMBER, Member } from '@/models/member/member';
import { uploadFiles } from '@/utils/upload';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { setMembers } from '@/redux/reducers/filter/member-filter-reducer';
import { MembersApi } from '@/api/members/members.api';
import MemberInformationHeaderView from '@/components/molecules/member/information/header/member-information-header.view';
import { getEditMemberBody, getMemberFromServer } from '@/utils/member';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { useScopedI18n } from '../../../../../../locales/client';
import { BLANK } from '@/constants/constant';

type MemberInformationHeaderProps = {
  memberContentId: string;
  onClickItem: (id: string) => void;
};

const MemberInformationHeader = ({
  memberContentId,
  onClickItem,
}: MemberInformationHeaderProps) => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { members } = useSelector((state: RootState) => state.memberFilter);
  const { churchId } = useSelector((state: RootState) => state.church);

  const membersApi = new MembersApi(false);

  // 저장 완료 토스트 팝업
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  // 임시 프로필 이미지
  const [profileImage, setProfileImage] = useState<File | null | undefined>(
    undefined
  );

  const onChangeProfileImage = (image: File | null) => {
    if (image) {
      setProfileImage(image);
    } else {
      dispatch(setTargetMember({ ...targetMember, profileImageUrl: BLANK }));
    }
  };

  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickProfile = () => {
    dispatch(setTargetMember(targetMember));
    setIsEditShown(true);
  };

  const onClickClose = () => {
    dispatch(setTargetMember(DEFAULT_MEMBER));
    setIsEditShown(false);
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
      } else if (profileImage === null) {
        updatedMember = { ...targetMember, profileImageUrl: BLANK };
        dispatch(setTargetMember(updatedMember));
      }

      await membersApi
        .editMember(
          { churchId, memberId: targetMember.id },
          getEditMemberBody(updatedMember)
        )
        .then((response) => {
          if (response.status === 200) {
            setIsEditShown(false);
            const newMember = getMemberFromServer(response.data.data);
            dispatch(setTargetMember(newMember));
            const newMembers = members.map((mem: Member) =>
              mem.id === newMember.id ? newMember : mem
            );
            dispatch(setMembers(newMembers));
          }
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  const props = {
    isEditShown,
    memberContentId,
    onClickItem,
    onChangeProfileImage,
    onClickSave,
    onClickProfile,
    onClickClose,
  };

  return (
    <>
      <MemberInformationHeaderView {...props} />
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
    </>
  );
};

export default MemberInformationHeader;

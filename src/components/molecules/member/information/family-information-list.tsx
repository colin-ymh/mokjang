import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { FamilyApi } from '@/api/members/family.api';
import { FAMILY } from '@/constants/constant';
import { MembersApi } from '@/api/members/members.api';
import { getMemberFromServer } from '@/utils/member';
import FamilyInformationListView from '@/components/molecules/member/information/family-information-list.view';
import {
  DEFAULT_FAMILY_MEMBER,
  FamilyMember,
  Member,
} from '@/models/member/member';
import { MEMBER_INFORMATION_HEADER_ID } from '@/constants/layout/header';

type FamilyInformationListProps = {
  targetMember: Member;
  setContentId: Dispatch<SetStateAction<string>>;
  setTargetMember: Dispatch<SetStateAction<Member>>;
};

const FamilyInformationList = ({
  targetMember,
  setTargetMember,
  setContentId,
}: FamilyInformationListProps) => {
  const { churchId } = useSelector((state: RootState) => state.church);
  const familyApi = new FamilyApi(false);
  const membersApi = new MembersApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }
  // 가족 관계 설정 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 관계 수정을 위해 선택된 가족
  const [targetFamilyMember, setTargetFamilyMember] = useState<FamilyMember>(
    DEFAULT_FAMILY_MEMBER
  );

  // 가족 멤버들
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // 가족 추가 버튼
  const onClickOpenModal = () => {
    setIsModalShown(true);
  };

  // 가족 추가 완료 버튼
  const onClickCreateFamily = async (
    familyMemberId: string,
    relation: FAMILY,
    isFetch: boolean
  ) => {
    if (familyMemberId && relation) {
      try {
        if (isFetch) {
          await familyApi.fetchFamily(
            { churchId, memberId: targetMember.id },
            { familyMemberId, relation }
          );
        } else {
          await familyApi.createFamily(
            { churchId, memberId: targetMember.id },
            { familyMemberId, relation }
          );
        }

        const response = await membersApi.getMember({
          churchId,
          memberId: targetMember.id,
        });
        const member = getMemberFromServer(response.data.data);
        setTargetMember(member);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    setTargetFamilyMember(DEFAULT_FAMILY_MEMBER);
    setIsModalShown(false);
  };

  // 가족 수정 완료 버튼
  const onClickEditFamily = async (
    familyMemberId: string,
    relation: FAMILY
  ) => {
    if (familyMemberId && relation) {
      try {
        await familyApi.editFamily(
          { churchId, memberId: targetMember.id, familyMemberId },
          { relation }
        );

        const response = await membersApi.getMember({
          churchId,
          memberId: targetMember.id,
        });
        const member = getMemberFromServer(response.data.data);
        setTargetMember(member);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    setTargetFamilyMember(DEFAULT_FAMILY_MEMBER);
    setIsModalShown(false);
  };

  // 가족 추가 닫기 버튼
  const onClickCloseModal = () => {
    setIsModalShown(false);
    setTargetFamilyMember(DEFAULT_FAMILY_MEMBER);
  };

  // 가족 상세보기로 변경
  const onClickFamilyMember = async (familyMemberId: string) => {
    if (familyMemberId) {
      try {
        const response = await membersApi.getMember({
          churchId,
          memberId: familyMemberId,
        });
        const newMember = getMemberFromServer(response.data.data);
        setTargetMember(newMember);
        setContentId(MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  const onClickConfirmDelete = async (familyMemberId: string) => {
    if (familyMemberId) {
      try {
        await familyApi.deleteFamily({
          churchId,
          familyMemberId,
          memberId: targetMember.id,
        });

        const response = await membersApi.getMember({
          churchId,
          memberId: targetMember.id,
        });
        const member = getMemberFromServer(response.data.data);
        setTargetMember(member);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  // 가족 수정하기
  const onClickEdit = (member: FamilyMember) => {
    if (member) {
      setTargetFamilyMember(member);
      setIsModalShown(true);
    }
  };

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        if (targetMember.id) {
          const response = await familyApi.getFamily({
            churchId,
            memberId: targetMember.id,
          });

          const newFamilyMembers = response.data.map(
            (member: FamilyMember) => ({
              ...member,
              familyMember: getMemberFromServer(member.familyMember),
            })
          );

          setFamilyMembers(newFamilyMembers);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchFamilyMembers();
  }, [targetMember]);

  const props = {
    isModalShown,
    targetFamilyMember,
    familyMembers,
    onClickOpenModal,
    onClickCloseModal,
    onClickCreateFamily,
    onClickEditFamily,
    onClickFamilyMember,
    onClickEdit,
    onClickConfirmDelete,
  };

  return (
    <>
      <FamilyInformationListView {...props} />
    </>
  );
};

export default FamilyInformationList;

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
  const onClickCreateFamily = (
    familyMemberId: string,
    relation: FAMILY,
    isFetch: boolean
  ) => {
    if (familyMemberId && relation) {
      if (isFetch) {
        familyApi
          .fetchFamily(
            { churchId, memberId: targetMember.id },
            { familyMemberId, relation }
          )
          .then((response) => {
            membersApi
              .getMember({ churchId, memberId: targetMember.id })
              .then((response) => {
                const member = getMemberFromServer(response.data.data);
                setTargetMember(member);
              });
          });
      } else {
        console.log('추가');
        familyApi
          .createFamily(
            { churchId, memberId: targetMember.id },
            { familyMemberId, relation }
          )
          .then(() => {
            membersApi
              .getMember({ churchId, memberId: targetMember.id })
              .then((response) => {
                console.log(response);
                const member = getMemberFromServer(response.data.data);
                setTargetMember(member);
              });
          });
      }
    }

    setTargetFamilyMember(DEFAULT_FAMILY_MEMBER);
    setIsModalShown(false);
  };

  // 가족 수정 완료 버튼
  const onClickEditFamily = (familyMemberId: string, relation: FAMILY) => {
    if (familyMemberId && relation) {
      familyApi
        .editFamily(
          {
            churchId,
            memberId: targetMember.id,
            familyMemberId: familyMemberId,
          },
          { relation }
        )
        .then((response) => {
          membersApi
            .getMember({ churchId, memberId: targetMember.id })
            .then((response) => {
              const member = getMemberFromServer(response.data.data);
              setTargetMember(member);
            });
        });
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
  const onClickFamilyMember = (familyMemberId: string) => {
    if (familyMemberId) {
      membersApi
        .getMember({ churchId, memberId: familyMemberId })
        .then((response) => {
          const newMember = getMemberFromServer(response.data.data);
          setTargetMember(newMember);
          setContentId(MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION);
        });
    }
  };

  // 가족 삭제하기
  const onClickDelete = (familyMemberId: string) => {
    if (familyMemberId) {
      familyApi
        .deleteFamily({ churchId, familyMemberId, memberId: targetMember.id })
        .then((response) => {
          membersApi
            .getMember({ churchId, memberId: targetMember.id })
            .then((response) => {
              const member = getMemberFromServer(response.data.data);
              setTargetMember(member);
            });
        });
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
    if (targetMember.id) {
      familyApi
        .getFamily({ churchId, memberId: targetMember.id })
        .then((response) => {
          const newFamilyMembers = response.data.map((member: FamilyMember) => {
            return {
              ...member,
              familyMemberId: getMemberFromServer(member.familyMember),
            };
          });

          setFamilyMembers(newFamilyMembers);
        });
    }
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
    onClickDelete,
  };

  return (
    <>
      <FamilyInformationListView {...props} />
    </>
  );
};

export default FamilyInformationList;

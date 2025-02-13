import React, { ChangeEvent, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GetMembersResponse, MembersApi } from '@/api/members/members.api';
import { BLANK, FAMILY, GENDER } from '@/constants/constant';
import FamilyModalView from '@/components/atoms/common/modal/family-modal.view';
import { useFamilyRelationDropdownItems } from '@/hooks/dropdown/dropdown-items';

import { getTrimmedString } from '@/utils/format';
import { FamilyMember, Member } from '@/models/member/member';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';

type FamilyModalProps = {
  familyMember: FamilyMember;
  onClickClose: () => void;
  onClickCreateFamily: (
    familyMemberId: string,
    relation: FAMILY,
    isFetch: boolean
  ) => void;
  onClickEditFamily: (familyMemberId: string, relation: FAMILY) => void;
};

const FamilyModal = ({
  familyMember,
  onClickClose,
  onClickCreateFamily,
  onClickEditFamily,
}: FamilyModalProps) => {
  const membersApi = new MembersApi(false);
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );

  // 수정인지 추가인지 여부
  const isEdit = familyMember.familyMember.name !== BLANK;

  // 검색된 가족 목록
  const [familyMemberItems, setFamilyMemberItems] = useState<
    MemberDropdownValueType[]
  >([]);

  // 가족 이름
  const [familyMemberName, setFamilyMemberName] = useState<string>(BLANK);
  // 선택된 가족의 성별
  const [familyGender, setFamilyGender] = useState<GENDER | undefined>();
  // 선택된 가족의 id
  const [familyMemberId, setFamilyMemberId] = useState<string>(
    familyMember.familyMember.id
  );

  // 가족 관계
  const [familyRelation, setFamilyRelation] = useState<FAMILY>(FAMILY.FAMILY);

  // 가족 관계 드롭다운 아이템
  const familyRelationItems = useFamilyRelationDropdownItems(familyGender);

  // 수정인 경우, 대상을 미리 받아옴
  useEffect(() => {
    if (isEdit && familyMember) {
      setFamilyMemberName(familyMember.familyMember.name);
      setFamilyGender(familyMember.familyMember.gender as GENDER);
      setFamilyRelation(familyMember.relation);
    }
  }, [isEdit, familyMember]);

  // 가족 이름 변경 시 이벤트
  const onChangeFamilyMemberName = (event: ChangeEvent<HTMLInputElement>) => {
    const newFamilyMemberName = getTrimmedString(event.target.value);
    setFamilyMemberName(newFamilyMemberName);

    if (newFamilyMemberName) {
      membersApi
        .getMembers({
          churchId,
          name: newFamilyMemberName,
          page: 1,
          take: 5,
        })
        .then((response: AxiosResponse) => {
          const members: GetMembersResponse[] = response.data.data;
          const newFamilyMemberItems: MemberDropdownValueType[] = members.map(
            (member) => {
              return { value: member.id, title: member.name };
            }
          );

          setFamilyMemberItems(newFamilyMemberItems);
        });
    }
  };

  // 가족 선택 시 이벤트
  const onChangeFamilyMemberId = (value: string) => {
    membersApi.getMember({ churchId, memberId: value }).then((response) => {
      if (response.status === 200) {
        const newMember: Member = response.data.data;
        setFamilyGender(newMember.gender as GENDER);
        setFamilyMemberId(newMember.id);
        setFamilyMemberName(newMember.name);
      }
    });
  };

  // 가족 관계 변경 시 이벤트
  const onChangeFamilyRelation = (value: FAMILY) => {
    setFamilyRelation(value);
  };

  // esc 시에 설정창 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClickClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClickClose]);

  const props = {
    familyMember,
    familyMemberName,
    familyMemberId,
    familyMemberItems,
    familyRelation,
    familyRelationItems,
    isEdit,
    onClickClose,
    onClickCreateFamily,
    onClickEditFamily,
    onChangeFamilyMemberName,
    onChangeFamilyMemberId,
    onChangeFamilyRelation,
  };

  return (
    <>
      <FamilyModalView {...props} />
    </>
  );
};

export default FamilyModal;

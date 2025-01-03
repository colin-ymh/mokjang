import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setTargetMember } from "@/redux/reducers/target-member";

import { FamilyApi } from "@/api/churches/family.api";
import { FAMILY } from "@/constants/constant";
import { MembersApi } from "@/api/churches/members.api";
import { getMemberFromServer } from "@/utils/member";
import FamilyInformationListView from "@/components/molecules/member/information/family-information-list.view";
import { useState } from "react";
import { FamilyMember, Member } from "@/models/member/member";
import { DEFAULT_MEMBER } from "@/redux/reducers/member-register-reducer";

type FamilyInformationListProps = {};

const FamilyInformationList = ({}: FamilyInformationListProps) => {
  const { churchId } = useSelector((state: RootState) => state.church);
  const targetMember = useSelector(
    (state: RootState) => state.targetMember.targetMember,
  );
  const dispatch = useDispatch<AppDispatch>();
  const familyApi = new FamilyApi(false);
  const membersApi = new MembersApi(false);

  // 가족 관계 설정 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 관계 수정을 위해 선택된 가족
  const [targetFamilyMember, setTargetFamilyMember] =
    useState<Member>(DEFAULT_MEMBER);

  // 가족 추가 버튼
  const onClickOpenModal = () => {
    setIsModalShown(true);
  };

  // 가족 추가 완료 버튼
  const onClickSaveFamily = (
    isEdit: boolean,
    familyMemberId: string,
    relation: FAMILY,
  ) => {
    console.log(familyMemberId);
    console.log(relation);
    if (familyMemberId && relation) {
      if (isEdit) {
        familyApi.editFamily(
          { churchId, memberId: targetMember.id, familyMemberId },
          { relation },
        );
      } else {
        familyApi.createFamily(
          { churchId, memberId: targetMember.id },
          { familyMemberId, relation },
        );
      }
    }

    setIsModalShown(false);
  };

  // 가족 추가 닫기 버튼
  const onClickCloseModal = () => {
    setIsModalShown(false);
  };

  const onClickFamilyMember = (familyMemberId: string) => {
    if (familyMemberId) {
      membersApi
        .getMember({ churchId, memberId: familyMemberId })
        .then((response) => {
          if (response.status === 200) {
            const newMember = getMemberFromServer(response.data.data);
            dispatch(setTargetMember(newMember));
          }
        });
    }
  };

  const props = {
    isModalShown,
    targetFamilyMember,
    onClickOpenModal,
    onClickSaveFamily,
    onClickCloseModal,
  };

  return (
    <>
      <FamilyInformationListView {...props} />
    </>
  );
};

export default FamilyInformationList;

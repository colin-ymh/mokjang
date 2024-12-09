import { useEffect, useState } from "react";
import { DEFAULT_MEMBER } from "@/redux/reducers/member-register-reducer";

import { MembersApi } from "@/api/members.api";
import MemberInformation from "@/components/organisms/member/member-information";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import MemberListView from "@/components/organisms/member/member-list.view";
import { Member } from "@/models/member/member";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { NONE } from "@/constants/constant";

const MemberList = () => {
  const {
    memberOrderBy,
    memberOrderDirection,
    genderFilter,
    officerFilter,
    baptismFilter,
  } = useSelector((state: RootState) => state.memberFilter);

  // 교인 상세정보 팝업 On/Off
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);

  // 현재 상세정보로 확인하는 교인
  const [currentMember, setCurrentMember] = useState<Member>(DEFAULT_MEMBER);

  // 교인 목록에 보여지는 교인들
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const membersApi = new MembersApi(false);
    membersApi
      .getMembers({
        churchId: "1",
        take: 100,
        page: 1,
        order: memberOrderBy !== NONE ? memberOrderBy : undefined,
        orderDirection: memberOrderDirection,
        gender: genderFilter !== NONE ? genderFilter : undefined,
      })
      .then((response) => setMembers(response.data.data));
  }, [
    memberOrderBy,
    memberOrderDirection,
    genderFilter,
    officerFilter,
    baptismFilter,
  ]);

  const onClickMemberItem = (member: Member) => {
    setCurrentMember(member);
    setIsMemberInformationShown(true);
  };

  const onClickClose = () => {
    setIsMemberInformationShown(false);
  };

  const props = {
    members,
    onClickMemberItem,
  };

  return (
    <>
      <MemberListView {...props} />
      {/* 교인 상세정보 팝업*/}
      <CustomPopup
        isShow={isMemberInformationShown}
        onClickClose={onClickClose}
      >
        <MemberInformation member={currentMember} />
      </CustomPopup>
    </>
  );
};

export default MemberList;

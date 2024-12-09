import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { MembersApi } from "@/api/members.api";
import MemberInformation from "@/components/organisms/member/member-information";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import MemberListView from "@/components/organisms/member/member-list.view";
import { Member } from "@/models/member/member";
import { NONE } from "@/constants/constant";
import { setMember } from "@/redux/reducers/member-register-reducer";
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
} from "@/utils/format";

const MemberList = () => {
  const dispatch = useDispatch<AppDispatch>();
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
    const newMember: Member = {
      ...member,
      birth: getFormattedDate(member.birth),
      mobilePhone: getFormattedMobilePhone(member.mobilePhone),
      homePhone: getFormattedHomePhone(member.homePhone),
    };

    dispatch(setMember(newMember));
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
        <MemberInformation />
      </CustomPopup>
    </>
  );
};

export default MemberList;

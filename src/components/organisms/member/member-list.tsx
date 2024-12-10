import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { MembersApi } from "@/api/churches/members.api";
import MemberInformation from "@/components/organisms/member/member-information";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import MemberListView from "@/components/organisms/member/member-list.view";
import { Member } from "@/models/member/member";
import { NONE, NULL } from "@/constants/constant";
import { setMember } from "@/redux/reducers/member-register-reducer";
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
} from "@/utils/format";

const MemberList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId,
  );
  const { memberFilter, memberOrderBy, memberOrderDirection } = useSelector(
    (state: RootState) => state.memberFilter,
  );

  // 교인 상세정보 팝업 On/Off
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);

  // 교인 목록에 보여지는 교인들
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const membersApi = new MembersApi(false);
    membersApi
      .getMembers({
        churchId,
        take: 100,
        page: 1,
        order: memberOrderBy !== NULL ? memberOrderBy : undefined,
        orderDirection: memberOrderDirection,
        name: memberFilter.name,
        school: memberFilter.school,
        vehicleNumber: memberFilter.vehicleNumber,
        gender: memberFilter.gender !== NULL ? memberFilter.gender : undefined,
        birthAfter: memberFilter.birthAfter
          ? memberFilter.birthAfter
          : undefined,
        birthBefore: memberFilter.birthBefore
          ? memberFilter.birthBefore
          : undefined,
        baptism:
          memberFilter.baptism !== NULL ? memberFilter.baptism : undefined,
      })
      .then((response) => setMembers(response.data.data));
  }, [memberFilter, memberOrderBy, memberOrderDirection]);

  const onClickMemberItem = (member: Member) => {
    const newMember: Member = {
      ...member,
      birth: member.birth && getFormattedDate(member.birth),
      mobilePhone:
        member.mobilePhone && getFormattedMobilePhone(member.mobilePhone),
      homePhone: member.homePhone && getFormattedHomePhone(member.homePhone),
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
        width={60}
        height={90}
        isPercentage={true}
      >
        <MemberInformation />
      </CustomPopup>
    </>
  );
};

export default MemberList;

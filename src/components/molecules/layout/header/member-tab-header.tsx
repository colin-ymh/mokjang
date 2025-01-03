import { useState } from "react";

import MemberTabHeaderView from "@/components/molecules/layout/header/member-tab-header.view";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import MemberRegister from "@/components/organisms/register/member-register";
import { MainText } from "@/components/atoms/common/text/main-text";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MembersApi } from "@/api/churches/members.api";
import { MEMBER_REGISTER_STAGE } from "@/constants/constant";
import { getEditMemberBody } from "@/utils/member";

type MemberManagementHeadBarProps = {};

const MemberTabHeader = ({}: MemberManagementHeadBarProps) => {
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId,
  );
  const { member, stage } = useSelector(
    (state: RootState) => state.memberRegister,
  );
  const membersApi = new MembersApi(false);

  // 교인 등록하기 on/off
  const [isRegisterShown, setIsRegisterShown] = useState<boolean>(false);

  // 교인 등록하기 팝업 닫기
  const onClickClose = () => {
    setIsRegisterShown(false);
  };

  // 교인 등록하기 팝업 띄우기
  const onClickRegisterMemberButton = () => {
    setIsRegisterShown(true);
  };

  // 교인 저장하기 버튼
  const onClickSave = () => {
    if (stage !== MEMBER_REGISTER_STAGE.REQUIRED && member.id) {
      console.log(member.id, member);
      // 교인 저장
      membersApi.editMember(
        { memberId: member.id, churchId },
        getEditMemberBody(member),
      );

      // 팝업 닫기
      setIsRegisterShown(false);
    }
  };

  const props = {
    onClickRegisterMemberButton,
  };

  return (
    <>
      <MemberTabHeaderView {...props} />
      <CustomPopup
        isShow={isRegisterShown}
        onClickClose={onClickClose}
        width={30}
        height={80}
        isPercentage={true}
        headerRight={
          stage !== MEMBER_REGISTER_STAGE.REQUIRED && (
            <MainText onClick={onClickSave}>저장</MainText>
          )
        }
      >
        <MemberRegister />
      </CustomPopup>
    </>
  );
};
export default MemberTabHeader;

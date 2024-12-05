import MemberManagementHeaderView from "@/components/organisms/member/member-header.view";
import { useState } from "react";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import MemberRegister from "@/components/organisms/register/member-register";
import RegisterLayout from "@/components/organisms/layout/register-layout";
import RegisterHeader from "@/components/molecules/layout/header/register-header";

type MemberManagementHeadBarProps = {};

const MemberHeader = ({}: MemberManagementHeadBarProps) => {
  const [isRegisterShown, setIsRegisterShown] = useState<boolean>(false);

  const onClickClose = () => {
    setIsRegisterShown(false);
  };

  const onClickRegisterMemberButton = () => {
    setIsRegisterShown(true);
  };
  const props = {
    onClickRegisterMemberButton,
  };
  return (
    <>
      <MemberManagementHeaderView {...props} />
      <CustomPopup isShow={isRegisterShown} onClickClose={onClickClose}>
        <MemberRegister />
      </CustomPopup>
    </>
  );
};
export default MemberHeader;

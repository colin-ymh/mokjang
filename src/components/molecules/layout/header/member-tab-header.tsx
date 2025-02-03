import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setContentId } from '@/redux/reducers/layout-reducer';

import MemberTabHeaderView from '@/components/molecules/layout/header/member-tab-header.view';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import MemberRegister from '@/components/organisms/register/member-register';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';

type MemberManagementHeadBarProps = {};

const MemberTabHeader = ({}: MemberManagementHeadBarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 교인 등록하기 on/off
  const [isRegisterShown, setIsRegisterShown] = useState<boolean>(false);

  // 교인 등록하기 팝업 닫기
  const onClickClose = () => {
    dispatch(setMember(DEFAULT_MEMBER));
    setIsRegisterShown(false);
  };

  // 교인 등록하기 팝업 띄우기
  const onClickRegisterMemberButton = () => {
    setIsRegisterShown(true);
  };

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    dispatch(setContentId(id));
  };

  const props = {
    onClickRegisterMemberButton,
    onClickHeaderBar,
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
      >
        <MemberRegister setIsShown={setIsRegisterShown} />
      </CustomPopup>
    </>
  );
};
export default MemberTabHeader;

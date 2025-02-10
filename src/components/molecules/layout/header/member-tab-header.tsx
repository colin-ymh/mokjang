import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setContentId } from '@/redux/reducers/layout-reducer';

import MemberTabHeaderView from '@/components/molecules/layout/header/member-tab-header.view';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import MemberRegister from '@/components/organisms/register/member-register';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';
import { DummyApi } from '@/api/dummy.api';
import {
  fetchMembers,
  setMembers,
} from '@/redux/reducers/member-filter-reducer';

type MemberManagementHeadBarProps = {};

const MemberTabHeader = ({}: MemberManagementHeadBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const dummyApi = new DummyApi(false);

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

  // 테스트 교인 생성
  const onClickDummyMembers = async () => {
    dummyApi.createDummyMembers({ churchId }).then(() => {
      dispatch(fetchMembers({ churchId, currentPage: 1 })).then((result) => {
        if (fetchMembers.fulfilled.match(result)) {
          dispatch(setMembers(result.payload));
        }
      });
    });
  };

  const props = {
    onClickRegisterMemberButton,
    onClickHeaderBar,
    onClickDummyMembers,
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

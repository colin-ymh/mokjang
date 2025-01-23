import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMembers } from '@/redux/reducers/member-filter-reducer';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';

import { MembersApi } from '@/api/churches/members.api';
import MemberInformationListView from '@/components/molecules/member/information/member-information-list.view';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import { MEMBER } from '@/constants/member/member-column';
import MemberEdit from '@/components/organisms/edit/member-edit';
import Button from '@/components/atoms/common/button/button';
import { Member } from '@/models/member/member';
import { getEditMemberBody, getMemberFromServer } from '@/utils/member';
import GroupModal from '@/components/atoms/common/modal/group-modal';
import { DEFAULT_GROUP } from '@/models/management/management';

type InformationListProps = { targetMember: Member };

const InformationList = ({ targetMember }: InformationListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);
  const { member } = useSelector((state: RootState) => state.memberRegister);
  const { members } = useSelector((state: RootState) => state.memberFilter);

  const membersApi = new MembersApi(false);

  // 교인 초기 상태
  const [prevMember, setPrevMember] = useState<Member>(targetMember);

  // 교인 개인정보 모달 활성화 여부
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 어떤 개인정보를 통해 수정을 시작했는지 판단
  const [focusItem, setFocusItem] = useState<MEMBER>(MEMBER.NAME);

  // 교인 상세 정보 클릭 시, 이벤트
  const onClickItem = (id: MEMBER) => {
    dispatch(setMember(prevMember));
    setFocusItem(id);
    setIsEditShown(true);
  };

  // 교인 상세 모달 닫기
  const onClickClose = () => {
    setIsEditShown(false);
    dispatch(setMember(DEFAULT_MEMBER));
  };

  // 수정한 교인 정보 저장
  const onClickSave = () => {
    membersApi
      .editMember(
        { churchId, memberId: prevMember.id },
        getEditMemberBody(member)
      )
      .then((response) => {
        if (response.status === 200) {
          setIsEditShown(false);
          const newMember = getMemberFromServer(response.data);
          setPrevMember(newMember);

          const newMembers = members.map((member: Member) => {
            if (member.id === newMember.id) {
              return newMember;
            } else {
              return member;
            }
          });

          dispatch(setMembers(newMembers));
        }
      });
  };

  // 소그룹 수정 모달 활성화 여부
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  // 소그룹 수정 모달 열기
  const onClickOpenGroupModal = () => {
    setIsGroupModalShown(true);
  };

  // 소그룹 수정 모달 닫기
  const onClickCloseGroupModal = () => {
    setIsGroupModalShown(false);
  };

  const props = {
    prevMember,
    onClickItem,
    onClickOpenGroupModal,
  };

  return (
    <>
      <MemberInformationListView {...props} />
      <CustomPopup
        isShow={isEditShown}
        onClickClose={onClickClose}
        width={400}
        height={600}
        isPercentage={true}
        headerRight={<Button text="저장" onClick={onClickSave} />}
      >
        <MemberEdit focusItem={focusItem} />
      </CustomPopup>
      <CustomPopup
        isShow={isGroupModalShown}
        onClickClose={onClickCloseGroupModal}
        width={400}
        height={600}
      >
        <GroupModal isHistory={false} prevGroup={DEFAULT_GROUP} />
      </CustomPopup>
    </>
  );
};

export default InformationList;

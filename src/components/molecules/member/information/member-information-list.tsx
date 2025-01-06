import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import MemberInformationListView from '@/components/molecules/member/information/member-information-list.view';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import { useState } from 'react';
import { MEMBER } from '@/constants/member/member-column';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';
import MemberEdit from '@/components/organisms/edit/member-edit';
import Button from '@/components/atoms/common/button/button';
import { MembersApi } from '@/api/churches/members.api';
import { getEditMemberBody, getMemberFromServer } from '@/utils/member';
import { Member } from '@/models/member/member';
import { setMembers } from '@/redux/reducers/member-filter-reducer';

type InformationListProps = {};

const InformationList = ({}: InformationListProps) => {
  const targetMember = useSelector(
    (state: RootState) => state.targetMember.targetMember
  );
  const [prevMember, setPrevMember] = useState<Member>(targetMember);
  const { churchId } = useSelector((state: RootState) => state.church);
  const { member } = useSelector((state: RootState) => state.memberRegister);
  const { members } = useSelector((state: RootState) => state.memberFilter);
  const dispatch = useDispatch<AppDispatch>();
  const membersApi = new MembersApi(false);

  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  const [focusItem, setFocusItem] = useState<MEMBER>(MEMBER.NAME);

  const onClickItem = (id: MEMBER) => {
    dispatch(setMember(prevMember));
    setFocusItem(id);
    setIsEditShown(true);
  };

  const onClickClose = () => {
    setIsEditShown(false);
    dispatch(setMember(DEFAULT_MEMBER));
  };

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

  const props = {
    prevMember,
    onClickItem,
  };

  return (
    <>
      <MemberInformationListView {...props} />
      <CustomPopup
        isShow={isEditShown}
        onClickClose={onClickClose}
        width={30}
        height={80}
        isPercentage={true}
        headerRight={<Button text="저장" onClick={onClickSave} />}
      >
        <MemberEdit focusItem={focusItem} />
      </CustomPopup>
    </>
  );
};

export default InformationList;

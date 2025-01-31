import React, { useEffect, useRef, useState } from 'react';

import { MEMBER } from '@/constants/member/member-column';
import { Member } from '@/models/member/member';
import GroupMemberTableView from '@/components/molecules/management/group/group-member-table.view';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import MemberInformation from '@/components/organisms/member/information/member-information';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';

export type GroupMemberTableProps = {
  groupMembers: Member[];
  // onClickMemberItem: (memberId: string) => void;
  // loadMembers: () => Promise<void>;
};

const GroupMemberTable = ({
  groupMembers,
  // onClickMemberItem,
  // loadMembers,
}: GroupMemberTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [targetMember, setTargetMember] = useState<Member>(DEFAULT_MEMBER);

  // 교인 상세정보 팝업 On/Off
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsMemberInformationShown(false);
    setTargetMember(DEFAULT_MEMBER);
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: MEMBER) => {};

  const onScroll = () => {};

  // 상세 페이지를 위해 교인 선택
  const onClickMember = (member: Member) => {
    setTargetMember(member);
    setIsMemberInformationShown(true);
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const props = {
    groupMembers,
    onClickHeader,
    // onClickMemberItem,
    scrollRef,
    onScroll,
    onClickMember,
  };

  return (
    <>
      <GroupMemberTableView {...props} />
      {/* 교인 상세정보 팝업*/}
      <CustomPopup
        isShow={isMemberInformationShown}
        onClickClose={onClickClose}
        width={70}
        height={90}
        isPercentage={true}
      >
        <MemberInformation
          targetMember={targetMember}
          setTargetMember={setTargetMember}
        />
      </CustomPopup>
    </>
  );
};

export default GroupMemberTable;

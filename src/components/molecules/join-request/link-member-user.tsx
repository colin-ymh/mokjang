import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import LinkMemberUserView from '@/components/molecules/join-request/link-member-user.view';
import { MembersApi } from '@/api/members/members.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { getFormattedName } from '@/utils/format';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';

type LinkMemberUserProps = {
  onChangeLinkMember: (memberId: string) => void;
};

const LinkMemberUser = ({ onChangeLinkMember }: LinkMemberUserProps) => {
  const membersApi = new MembersApi(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 선택된 교인
  const [selectedMember, setSelectedMember] = useState<Member>(DEFAULT_MEMBER);

  // 검색어
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 교인 목록 검색
  const fetchSearchedMembers = async (name: string) => {
    if (!name) return;

    const response = await membersApi.getMembers({
      churchId,
      page: 1,
      take: 5,
      name,
    });
    setSearchedMembers(response.data.data);
  };

  // ===============================
  // 이벤트 핸들러
  // ===============================
  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(getFormattedName(event.target.value));
  };

  // 교인 목록에서 선택/해제
  const onClickMember = (member: Member) => {
    setSelectedMember(member);
  };

  // 검색
  const onClickSearch = () => {
    fetchSearchedMembers(searchName);
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  useEffect(() => {
    onChangeLinkMember(selectedMember.id);
  }, [selectedMember]);

  const props = {
    searchRef,
    selectedMember,
    searchName,
    searchedMembers,
    onChangeSearch,
    onClickMember,
    onClickSearch,
    onKeyDown,
  };

  return (
    <>
      <LinkMemberUserView {...props} />
    </>
  );
};

export default LinkMemberUser;

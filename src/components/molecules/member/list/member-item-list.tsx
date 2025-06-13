import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMemberFilter } from '@/redux/reducers/filter/member-filter-reducer';

import { MemberTableProps } from '@/components/molecules/member/list/member-table';
import { MainText } from '@/components/atoms/common/text/main-text';
import BorderInput from '@/components/atoms/common/input/border-input';
import { BLANK } from '@/constants/constant';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';

import {
  getFormattedMobilePhone,
  getFormattedName,
  getTrimmedString,
} from '@/utils/format';

import useWindowSize from '@/hooks/window/window';
import { useI18n } from '../../../../../locales/client';
import ProfileImage from '@/components/atoms/common/image/profile-image';

const MemberItemListContainer = styled.div`
  padding: 10px 20px;
  width: 100%;
`;

const ScrollContainer = styled.div<{ height: number }>`
  display: flex;

  height: ${({ height }) => `${height - 70}px`};
  flex-direction: column;
  overflow-y: scroll;
  gap: 10px;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding-top: 5px;
  border-radius: 5px;
  gap: 10px;
  cursor: pointer;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberItemList = ({
  onClickMemberItem,
  loadMembers,
}: MemberTableProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();

  const { height } = useWindowSize();
  const { members } = useSelector((state: RootState) => state.memberFilter);
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);

  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 문자열 타입 확인 유틸
  const getIsNameSearch = (str: string) => /^[a-zA-Z가-힣]*$/.test(str);
  const getIsMobilePhoneSearch = (str: string) => /^[0-9-]*$/.test(str);

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const input = getTrimmedString(event.target.value);

    // 초기 입력이 공백이면 무조건 허용
    if (searchValue === BLANK || input === BLANK) {
      setSearchValue(input);
      return;
    }

    const isNameMode = getIsNameSearch(searchValue);
    const isPhoneMode = getIsMobilePhoneSearch(searchValue);

    if (isNameMode && getIsNameSearch(input)) {
      setSearchValue(getFormattedName(input));
    } else if (isPhoneMode && getIsMobilePhoneSearch(input)) {
      setSearchValue(getFormattedMobilePhone(input));
    }
  };

  const getNewMemberList = () => {
    if (getIsNameSearch(searchValue)) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          name: searchValue,
          mobilePhone: BLANK,
        })
      );
    } else if (getIsMobilePhoneSearch(searchValue)) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          mobilePhone: searchValue.replace(/\D/g, ''),
          name: BLANK,
        })
      );
    }
  };

  // 초기 실행 방지
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      getNewMemberList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadMembers(); // 데이터를 추가로 로드
      }
    }
  };

  return (
    <MemberItemListContainer>
      <BorderInput
        ref={searchRef}
        value={searchValue}
        onChange={onChangeSearchValue}
        placeholder={t('placeholder.search')}
      />
      <ScrollContainer ref={scrollRef} onScroll={onScroll} height={height}>
        {members.map((member) => (
          <MemberItem
            key={member.id}
            onClick={() => onClickMemberItem(member.id)}
          >
            <ProfileImage value={member.profileImageUrl} />
            <MemberDetails>
              <MainText
                color={GRAY.DARK}
              >{`${member.name} ${member.officer?.name || t('churchMember')}`}</MainText>
              <MainText size={SIZE.SMALL} color={GRAY.DEFAULT}>
                {member?.mobilePhone &&
                  getFormattedMobilePhone(member.mobilePhone)}
              </MainText>
              {/*<MainText color={GRAY.DARK}>{member.group?.name}</MainText>*/}
            </MemberDetails>
          </MemberItem>
        ))}
      </ScrollContainer>
    </MemberItemListContainer>
  );
};

export default MemberItemList;

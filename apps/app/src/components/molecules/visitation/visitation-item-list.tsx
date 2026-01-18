import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setVisitationFilter } from '@/redux/reducers/filter/visitation-filter-reducer';

import { VisitationTableProps } from './visitation-table';
import {
  BorderInput,
  MainTag,
  MainText,
  ProfileImage,
} from '@mokjang/components';
import {
  BLANK,
  GRAY,
  GROUP_ROLE,
  LOCALE,
  MAIN,
  MINISTRY_GROUP_ROLE,
  PURPLE,
  SIZE,
  STATUS,
  YELLOW,
} from '@mokjang/constants';

import {
  getFormattedName,
  getFormattedPhone,
  getTranslatedStartEndDate,
  getTrimmedString,
} from '@mokjang/utils';

import useWindowSize from '../../../hooks/window/window';
import { useI18n } from '../../../../locales/client';
import { usePathname } from 'next/navigation';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';
import MemberProfile from '@/components/atoms/member/member-profile';

const VisitationItemListContainer = styled.div`
  padding: 0 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScrollContainer = styled.div<{ height: number }>`
  display: flex;

  height: ${({ height }) => `${height - 180}px`};
  flex-direction: column;
  overflow-y: scroll;
  gap: 10px;
`;

const VisitationItem = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  gap: 10px;
  cursor: pointer;
  border: 1px solid ${GRAY.LIGHT};
  padding: 10px;
`;

const VisitationDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const VisitationItemList = ({
  onClickVisitationItem,
  loadVisitations,
}: VisitationTableProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const { height } = useWindowSize();
  const { visitations } = useSelector(
    (state: RootState) => state.visitationFilter
  );
  const { visitationFilter } = useSelector(
    (state: RootState) => state.visitationFilter
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);

  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 문자열 타입 확인 유틸
  const getIsNameSearch = (str: string) => /^[a-zA-Zㄱ-ㅎ가-힣]*$/.test(str);
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
      setSearchValue(getFormattedPhone(input));
    }
  };

  const getNewVisitationList = () => {
    dispatch(
      setVisitationFilter({
        ...visitationFilter,
        title: searchValue,
      })
    );
  };

  // 초기 실행 방지
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      getNewVisitationList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadVisitations(); // 데이터를 추가로 로드
      }
    }
  };

  return (
    <VisitationItemListContainer>
      <BorderInput
        ref={searchRef}
        value={searchValue}
        onChange={onChangeSearchValue}
        placeholder={t('placeholder.search')}
        height={40}
      />
      <ScrollContainer ref={scrollRef} onScroll={onScroll} height={height}>
        {visitations.map((visitation) => (
          <VisitationItem
            key={visitation.id}
            onClick={() => onClickVisitationItem(visitation.id)}
          >
            <VisitationDetails>
              <RowContainer>
                <MainText>{`${visitation.title}`}</MainText>
                <MainTag
                  title={t(visitation.status as STATUS)}
                  color={getStatusFontColor(visitation.status as STATUS)}
                  backgroundColor={getStatusBackgroundColor(
                    visitation.status as STATUS
                  )}
                />
              </RowContainer>

              <RowContainer>
                <MainText size={SIZE.SMALL} color={MAIN.DEFAULT}>
                  {`${visitation.inCharge.name} ${visitation.inCharge.officer?.name || BLANK}`}
                </MainText>
                <MainText size={SIZE.SMALL} color={GRAY.DARK}>
                  {getTranslatedStartEndDate(
                    locale,
                    visitation.startDate,
                    visitation.endDate
                  )}
                </MainText>
              </RowContainer>
            </VisitationDetails>
          </VisitationItem>
        ))}
      </ScrollContainer>
    </VisitationItemListContainer>
  );
};

export default VisitationItemList;

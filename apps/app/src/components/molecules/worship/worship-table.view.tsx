import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { GRAY, MAIN, WHITE } from '../../../constants/styles/color';
import { MainText } from '../../atoms/common/text/main-text';
import { Worship } from '../../../models/worship/worship';
import useWindowSize from '../../../hooks/window/window';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import AddWorship from '../../organisms/worship/add/add-worship';
import CustomPopup from '../../atoms/common/popup/custom-popup';

import { WORSHIP } from '../../../constants/column/worship-column';
import WorshipTableHeader from '../../atoms/worship/worship-table-header';
import {
  getDayConstantByIndex,
  getWeekRepeatConstant,
} from '../../../utils/date';
import { DAY, REPEAT_PERIOD } from '../../../constants/constant';
import SvgIcon from '../../atoms/common/icon/svg-icon';

import Calendar from '../../../../public/svg/calendar.svg';
import Users from '../../../../public/svg/users.svg';
import { SIZE } from '../../../constants/styles/style';
import Button from '../../atoms/common/button/button';

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 260}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const WorshipTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  /* 아래 옵션으로 텍스트 줄바꿈 등 처리. 
         white-space: nowrap; 로 하면 줄바꿈 없이 가로로 늘어나게 됨 */
  white-space: normal;
`;

// 4. 헤더(TH)
const TableHeader = styled.th<{
  id: string;
  $isLast?: boolean;
}>`
  padding: 20px 10px;
  background-color: ${WHITE};
  position: sticky;
  top: 0;
  z-index: 5;

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, $isLast }) => ($isLast ? '200px' : `auto`)};

  /* 텍스트 넘침 처리 */
  overflow: hidden;
  text-overflow: ellipsis;

  /* pseudo‐element 로 보더를 직접 그려서 절대 안 사라지게 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.7px;
    background: ${GRAY.LIGHT};
  }
`;

// 5. 본문(TR/TD)
const WorshipTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.LIGHT};
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $isLast?: boolean }>`
  padding: 10px 15px;
  height: 30px;
  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, $isLast }) => ($isLast ? '200px' : `auto`)};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    border-left: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  /* 그냥 늘어날 수 있게, 필요한 경우 ellipsis 처리 */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DataContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  gap: 10px;
`;

const AttendanceContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;

type WorshipTableProps = {
  isEditModalOpened: boolean;
  isEditEnabled: boolean;
  worships: Worship[];
  onClickHeader: (id: WORSHIP) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onClickEditWorship: (worship: Worship) => void;
  onClickEditDone: () => void;
  onClickEditClose: () => void;
  onClickWorshipItem: (worship: Worship) => void;
};

const WorshipTableView = ({
  isEditModalOpened,
  isEditEnabled,
  worships,
  onClickHeader,
  scrollRef,
  onScroll,
  onClickEditWorship,
  onClickEditDone,
  onClickEditClose,
  onClickWorshipItem,
}: WorshipTableProps) => {
  const t = useI18n();
  const t_title = useScopedI18n('title');

  const { height } = useWindowSize();

  const worshipTableHeaderItemList = useSelector(
    (state: RootState) => state.worshipFilter.worshipTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = worshipTableHeaderItemList.filter(
    (item) => item.isShown
  );

  // 각 TD에 들어갈 content
  const getWorshipTableContent = (id: string, worship: Worship) => {
    switch (id) {
      case WORSHIP.TITLE:
        return (
          <>
            <DataContainer>
              <TitleContainer>
                <MainText>{worship?.title}</MainText>
                {worship?.description && (
                  <MainText size={SIZE.SMALL} color={GRAY.DEFAULT}>
                    {worship?.description}
                  </MainText>
                )}
              </TitleContainer>
            </DataContainer>
          </>
        );

      case WORSHIP.WORSHIP_DAY:
        return (
          <DataContainer>
            <SvgIcon svg={Calendar} />
            <MainText>
              {`${t(getWeekRepeatConstant(worship.repeatPeriod) as REPEAT_PERIOD)} ${t(getDayConstantByIndex(worship.worshipDay) as DAY)}`}
            </MainText>
          </DataContainer>
        );

      case WORSHIP.GROUP:
        return (
          <DataContainer>
            {/*<MainTag*/}
            {/*  title={getGroup(worship.worshipTargetGroups[0].id, groups)?.name}*/}
            {/*/>*/}
          </DataContainer>
        );

      case WORSHIP.ATTENDANCE:
        return (
          <AttendanceContainer>
            <Button
              text={t('button.goToAttendance')}
              width={'auto'}
              height={30}
              icon={<SvgIcon svg={Users} color={WHITE} width={2} />}
              onClick={(event) => {
                event?.stopPropagation();
                onClickWorshipItem(worship);
              }}
            />
          </AttendanceContainer>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <WorshipTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  {
                    <WorshipTableHeader
                      item={{
                        ...item,
                        id: item.id as WORSHIP,
                      }}
                      onClick={onClickHeader}
                    />
                  }
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {worships.map((worship, rowIndex) => (
              <WorshipTableRow
                key={worship.id}
                onClick={() => onClickEditWorship(worship)}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getWorshipTableContent(item.id, worship)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </WorshipTableRow>
            ))}
          </tbody>
        </WorshipTable>

        <CustomPopup
          isShow={isEditModalOpened}
          onClickCancel={onClickEditClose}
          headerTitle={t_title('editWorship')}
          width={500}
          height={500}
          onClickDone={onClickEditDone}
          doneBackgroundColor={isEditEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
          doneDisabled={!isEditEnabled}
        >
          <AddWorship />
        </CustomPopup>
      </TableContainer>
    </>
  );
};

export default WorshipTableView;

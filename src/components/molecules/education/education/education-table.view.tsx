import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { Education } from '@/models/education/education';
import useWindowSize from '@/hooks/window/window';
import EducationTableHeader from '@/components/atoms/education/education/education-table-header';
import { useScopedI18n } from '../../../../../locales/client';
import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';
import ConfirmPopup from '@/components/atoms/common/popup/confirm-popup';
import AddEducation from '@/components/organisms/education/education/add/add-education';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';

import { EDUCATION } from '@/constants/education/education-column';

// 1. 컬럼별 PX 폭
// const getColumnWidth = (id: string) => {
//   switch (id) {
//     case EDUCATION.NAME:
//       return 200;
//     default:
//       // 비고(REMARKS) 컬럼 등
//       return 80;
//   }
// };

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
const EducationTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  /* 아래 옵션으로 텍스트 줄바꿈 등 처리. 
         white-space: nowrap; 로 하면 줄바꿈 없이 가로로 늘어나게 됨 */
  white-space: normal;
`;

// 4. 헤더(TH)
const TableHeader = styled.th<{ id: string; isLast?: boolean }>`
  padding: 3px 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};

  width: 100%;

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
    height: 1px;
    background: ${GRAY.DEFAULT};
  }
`;

// 5. 본문(TR/TD)
const EducationTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};

  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; isLast?: boolean }>`
  padding: 10px;

  cursor: pointer;

  width: 100%;

  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;

  &:first-child {
    border-left: none;
  }
`;

const NameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  /* 그냥 늘어날 수 있게, 필요한 경우 ellipsis 처리 */
  width: 100%;
  //overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type EducationTableProps = {
  isEditModalOpened: boolean;
  isDeleteModalOpened: boolean;
  isEditEnabled: boolean;
  educations: Education[];
  onClickHeader: (id: EDUCATION) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onClickDeleteEducation: () => void;
  onClickEditEducation: (education: Education) => void;
  onClickCancelDelete: () => void;
  onClickConfirmDelete: (educationId: string) => void;
  onClickEditDone: () => void;
  onClickEditClose: () => void;
  onClickEducationItem: (education: Education) => void;
};

const EducationTableView = ({
  isEditModalOpened,
  isDeleteModalOpened,
  isEditEnabled,
  educations,
  onClickHeader,
  scrollRef,
  onScroll,
  onClickDeleteEducation,
  onClickEditEducation,
  onClickCancelDelete,
  onClickConfirmDelete,
  onClickEditDone,
  onClickEditClose,
  onClickEducationItem,
}: EducationTableProps) => {
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');

  const { height } = useWindowSize();

  const educationTableHeaderItemList = useSelector(
    (state: RootState) => state.educationFilter.educationTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...educationTableHeaderItemList.filter((item) => item.isShown),
    // BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getEducationTableContent = (id: string, education: Education) => {
    switch (id) {
      case EDUCATION.NAME:
        return (
          <>
            <NameContainer>
              <MainText>{education?.name}</MainText>
              <KebabDropdown
                items={[
                  {
                    value: 'delete',
                    title: t_button('delete'),
                    onClick: () => onClickDeleteEducation(),
                  },
                  {
                    value: 'edit',
                    title: t_button('edit'),
                    onClick: () => onClickEditEducation(education),
                  },
                ]}
                width={150}
              />
            </NameContainer>
            <ConfirmPopup
              title={t_popup('deleteEducationTitle')}
              body={t_popup('deleteEducationBody')}
              isShow={isDeleteModalOpened}
              onClickLeftButton={onClickCancelDelete}
              onClickRightButton={() => onClickConfirmDelete(education.id)}
              leftButtonText={t_button('cancel')}
              rightButtonText={t_button('confirm')}
              buttonNum={2}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <EducationTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  isLast={index === visibleColumns.length - 1}
                >
                  {
                    <EducationTableHeader
                      item={{
                        ...item,
                        id: item.id as EDUCATION,
                      }}
                      onClick={onClickHeader}
                    />
                  }
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {educations.map((education, rowIndex) => (
              <EducationTableRow
                key={education.id}
                onClick={() => onClickEducationItem(education)}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getEducationTableContent(item.id, education)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </EducationTableRow>
            ))}
          </tbody>
        </EducationTable>
        <CustomPopup
          isShow={isEditModalOpened}
          onClickCancel={onClickEditClose}
          headerTitle={t_title('editEducation')}
          width={500}
          height={300}
          onClickDone={onClickEditDone}
          doneBackgroundColor={isEditEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
          doneDisabled={!isEditEnabled}
        >
          <AddEducation />
        </CustomPopup>
      </TableContainer>
    </>
  );
};

export default EducationTableView;

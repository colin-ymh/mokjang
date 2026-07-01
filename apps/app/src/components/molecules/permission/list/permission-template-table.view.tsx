import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import {
  BLANK,
  GRAY,
  LOCALE,
  PERMISSION_TEMPLATE,
  SIZE,
  WHITE,
} from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { ACTION, DOMAIN, PermissionTemplate } from '@mokjang/models';
import useWindowSize from '../../../../hooks/window/window';
import PermissionTemplateTableHeader from '../../../atoms/permission/list/permission-template-table-header';
import { BLANK_HEADER } from '../../../../redux/reducers/filter/member-filter-reducer';
import { useI18n } from '../../../../../locales/client';
import {
  getIsAccessed,
  getOwnerPermissionTemplate,
} from '../../../../utils/permission';
import { getTranslatedMemberCount } from '@mokjang/utils';
import { usePathname } from 'next/navigation';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case PERMISSION_TEMPLATE.TITLE:
      return 40;
    case PERMISSION_TEMPLATE.MEMBER_COUNT:
      return 40;
    default:
      // 비고(REMARKS) 컬럼 등
      return 80;
  }
};

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 230}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;

  background-color: ${WHITE};
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const PermissionTemplateTable = styled.table`
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
  padding: 0 25px;
  height: 50px;
  flex-shrink: 0;
  background-color: ${WHITE};
  position: sticky;
  top: 0;
  z-index: 5;

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}%`)};

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
const PermissionTemplateTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.SUPER_LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; $isLast?: boolean }>`
  padding: 0 25px;
  height: 60px;
  flex-shrink: 0;

  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}%`)};

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

type PermissionTemplateTableProps = {
  permissionTemplates: PermissionTemplate[];
  onClickHeader: (id: PERMISSION_TEMPLATE) => void;
  onClickPermissionTemplateItem: (permissionTemplateId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const PermissionTemplateTableView = ({
  permissionTemplates,
  onClickHeader,
  onClickPermissionTemplateItem,
  scrollRef,
  onScroll,
}: PermissionTemplateTableProps) => {
  const t = useI18n();

  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const { height } = useWindowSize();
  const { user } = useSelector((state: RootState) => state.user);
  const { churchId } = useSelector((state: RootState) => state.church);
  const { permissionUnits } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );

  const permissionTemplateTableHeaderItemList = useSelector(
    (state: RootState) =>
      state.permissionTemplateFilter.permissionTemplateTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...permissionTemplateTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getPermissionTemplateTableContent = (
    id: string,
    permissionTemplate: PermissionTemplate
  ) => {
    switch (id) {
      case PERMISSION_TEMPLATE.TITLE:
        return (
          <TitleContainer>
            <MainText>{permissionTemplate.title}</MainText>
            {permissionTemplate.description && (
              <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
                {permissionTemplate.description}
              </MainText>
            )}
          </TitleContainer>
        );
      case PERMISSION_TEMPLATE.MEMBER_COUNT:
        return (
          <MainText>
            {getTranslatedMemberCount(basePath, permissionTemplate.memberCount)}
          </MainText>
        );
      case BLANK:
        return <div></div>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <PermissionTemplateTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <PermissionTemplateTableHeader
                      item={{
                        ...item,
                        id: item.id as PERMISSION_TEMPLATE,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ...(getIsAccessed(user, DOMAIN.PERMISSION, ACTION.READ)
                ? [getOwnerPermissionTemplate(t, churchId, permissionUnits)]
                : []),
              ...permissionTemplates,
            ].map((permissionTemplate, rowIndex) => (
              <PermissionTemplateTableRow
                key={permissionTemplate.id}
                onClick={() => {
                  onClickPermissionTemplateItem(permissionTemplate.id);
                }}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    $isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getPermissionTemplateTableContent(
                        item.id,
                        permissionTemplate
                      )}
                    </ContentWrapper>
                  </TableData>
                ))}
              </PermissionTemplateTableRow>
            ))}
          </tbody>
        </PermissionTemplateTable>
      </TableContainer>
    </>
  );
};

export default PermissionTemplateTableView;

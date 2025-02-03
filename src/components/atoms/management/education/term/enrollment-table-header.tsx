import React from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';

import { EDUCATION_ENROLLMENT } from '@/constants/management/education-term-column';
import { getTranslatedEnrollmentColumn } from '@/utils/translate';
import { GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { useScopedI18n } from '../../../../../../locales/client';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 5px;
  margin-bottom: 3px;
`;

type TermMemberTableHeaderProps = {
  // 테이블 헤더 정보
  item: {
    id: EDUCATION_ENROLLMENT; // CHECK, NAME, DATE 등 열의 ID
    isSortable: boolean; // 정렬 가능 여부
  };
  // 헤더 클릭 시 정렬 등 동작을 위한 함수
  onClick: (id: EDUCATION_ENROLLMENT) => void;

  // =====================
  // [옵션] 체크박스용 prop
  // 전체 체크 여부 (체크박스 컬럼인 경우)
  isCheckAll: boolean;
  // 체크박스 변경 핸들러
  onClickCheckAll: (checked: boolean) => void;
};

const EnrollmentTableHeader = ({
  item,
  onClick,
  isCheckAll = false,
  onClickCheckAll,
}: TermMemberTableHeaderProps) => {
  const t_header = useScopedI18n('tableHeader');

  const isActive = false;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      {item.id === EDUCATION_ENROLLMENT.CHECK ? (
        /* =========================
           1) 체크박스 열인 경우
           ========================= */
        // <CheckButton
        //   value={isCheckAll}
        //   onChange={(checked) => {
        //     onClickCheckAll?.(checked);
        //   }}
        // />
        <div></div>
      ) : (
        /* =========================
           2) 일반 열인 경우
           ========================= */
        <TextContainer>
          <MainText color={isActive ? MAIN.DEFAULT : GRAY.DARK}>
            {getTranslatedEnrollmentColumn(t_header, item.id)}
          </MainText>
        </TextContainer>
      )}

      {/* 정렬 가능 + 체크박스 열이 아닐 때 화살표 표시 */}
      {item.isSortable && item.id !== EDUCATION_ENROLLMENT.CHECK && (
        <IconContainer>
          <MainText
            size={SIZE.LARGE}
            color={isActive ? MAIN.DEFAULT : GRAY.DEFAULT}
          >
            {'⇅'}
          </MainText>
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default EnrollmentTableHeader;

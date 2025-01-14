import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedEnrollmentColumn } from '@/utils/translate';
import { EDUCATION_ENROLLMENT } from '@/constants/management/education-term-column';

import { useScopedI18n } from '../../../../../locales/client';

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
  item: {
    id: EDUCATION_ENROLLMENT;
    isSortable: boolean;
  };
  onClick: (id: EDUCATION_ENROLLMENT) => void;
};

const EnrollmentTableHeader = ({
  item,
  onClick,
}: TermMemberTableHeaderProps) => {
  const t_header = useScopedI18n('tableHeader');
  const isActive = false;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText color={isActive ? MAIN.DEFAULT : GRAY.DARK}>
          {getTranslatedEnrollmentColumn(t_header, item.id)}
        </MainText>
      </TextContainer>
      {item.isSortable && (
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

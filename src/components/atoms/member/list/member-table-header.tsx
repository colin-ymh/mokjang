import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/member/member-column';
import { GRAY, MAIN } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import { getTranslatedMemberColumn } from '@/utils/translate';

import { useI18n } from '../../../../../locales/client';

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

type MemberTableHeaderProps = {
  item: {
    id: MEMBER;
    isSortable: boolean;
  };
  onClick: (id: MEMBER) => void;
};

// Component
const MemberTableHeader = ({ item, onClick }: MemberTableHeaderProps) => {
  const { memberOrderBy, memberOrderDirection } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const t = useI18n();

  const isActive = memberOrderBy === item.id;
  // const isAscending = memberOrderDirection === ORDER_DIRECTION.ASC;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText color={isActive ? MAIN.DEFAULT : GRAY.DARK}>
          {getTranslatedMemberColumn(t, item.id)}
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

export default MemberTableHeader;

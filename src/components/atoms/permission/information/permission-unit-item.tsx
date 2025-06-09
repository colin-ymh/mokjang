import styled from 'styled-components';
import { PermissionUnit } from '@/models/permission/permission';
import { MainText } from '@/components/atoms/common/text/main-text';
import CheckButton from '@/components/atoms/common/button/check-button';
import { useI18n } from '../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

const ItemContainer = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};

  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};

  &:last-child {
    border-bottom: none;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

type PermissionUnitItemProps = {
  unit: PermissionUnit;
  isSelected: boolean;
  onClick: (id: string) => void;
  isEditable: boolean;
};

const PermissionUnitItem = ({
  unit,
  isSelected,
  onClick,
  isEditable,
}: PermissionUnitItemProps) => {
  const t = useI18n();

  return (
    <ItemContainer onClick={() => onClick(unit.id)} $disabled={!isEditable}>
      <ContentContainer>
        <MainText>{`${t(unit.domain)} ${t(unit.action)}`}</MainText>
        <MainText color={GRAY.DEFAULT} size={SIZE.SMALL}>
          {'내용'}
        </MainText>
      </ContentContainer>
      <CheckButton
        value={isSelected}
        width={20}
        height={20}
        disabled={!isEditable}
      />
    </ItemContainer>
  );
};

export default PermissionUnitItem;

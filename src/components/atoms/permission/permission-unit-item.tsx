import styled from 'styled-components';
import { PermissionUnit } from '@/models/permission/permission';
import { MainText } from '@/components/atoms/common/text/main-text';
import CheckButton from '@/components/atoms/common/button/check-button';
import { useI18n } from '../../../../locales/client';
import { GRAY } from '@/constants/styles/color';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;

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
};

const PermissionUnitItem = ({
  unit,
  isSelected,
  onClick,
}: PermissionUnitItemProps) => {
  const t = useI18n();

  return (
    <ItemContainer onClick={() => onClick(unit.id)}>
      <ContentContainer>
        <MainText>{`${t(unit.domain)} ${t(unit.action)}`}</MainText>
        <MainText color={GRAY.DEFAULT}>{'내용'}</MainText>
      </ContentContainer>
      <CheckButton value={isSelected} width={20} height={20} />
    </ItemContainer>
  );
};

export default PermissionUnitItem;

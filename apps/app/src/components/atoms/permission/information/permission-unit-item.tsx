import styled from 'styled-components';
import {
  CheckButton,
  MainText,
} from '../../../../../../../packages/components/src';
import { CURSOR, GRAY } from '../../../../../../../packages/constants/src';

const ItemContainer = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: row;
  padding: 20px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  gap: 10px;

  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type PermissionUnitItemProps = {
  id: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  title: string;
  description: string;
  isEditable: boolean;
};

const PermissionUnitItem = ({
  id,
  title,
  description,
  onClick,
  isSelected,
  isEditable,
}: PermissionUnitItemProps) => {
  return (
    <ItemContainer onClick={() => onClick(id)} $disabled={!isEditable}>
      <CheckButton
        value={isSelected}
        width={18}
        height={18}
        disabled={!isEditable}
        isStopPropagation={false}
      />
      <ContentContainer>
        <MainText
          fontSize={16}
          fontWeight={500}
          cursor={isEditable ? CURSOR.POINTER : undefined}
        >
          {title}
        </MainText>
        <MainText
          fontSize={14}
          fontWeight={400}
          color={GRAY.DARK}
          whiteSpace={'normal'}
          cursor={isEditable ? CURSOR.POINTER : undefined}
        >
          {description}
        </MainText>
      </ContentContainer>
    </ItemContainer>
  );
};

export default PermissionUnitItem;

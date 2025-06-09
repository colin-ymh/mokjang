import styled from 'styled-components';
import { PermissionUnit } from '@/models/permission/permission';
import PermissionUnitItem from '@/components/atoms/permission/information/permission-unit-item';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

type PermissionUnitListProps = {
  units: PermissionUnit[];
  unitIds: string[];
  onChangeUnitIds?: (value: string[]) => void;
  isEditable?: boolean;
};

const PermissionUnitList = ({
  units,
  unitIds,
  onChangeUnitIds,
  isEditable = true,
}: PermissionUnitListProps) => {
  const onClick = (unitId: string) => {
    if (isEditable && onChangeUnitIds) {
      const newUnitIds = unitIds.includes(unitId)
        ? unitIds.filter((id) => id !== unitId)
        : [...unitIds, unitId];

      onChangeUnitIds(newUnitIds);
    }
  };

  return (
    <ListContainer>
      {units.map((unit) => (
        <PermissionUnitItem
          key={unit.id}
          unit={unit}
          isSelected={unitIds?.includes(unit.id)}
          onClick={onClick}
          isEditable={isEditable}
        />
      ))}
    </ListContainer>
  );
};

export default PermissionUnitList;

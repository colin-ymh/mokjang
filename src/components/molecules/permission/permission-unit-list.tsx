import styled from 'styled-components';
import { PermissionUnit } from '@/models/permission/permission';
import PermissionUnitItem from '@/components/atoms/permission/permission-unit-item';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

type PermissionUnitListProps = {
  units: PermissionUnit[];
  unitIds: string[];
  onChangeUnitIds: (value: string[]) => void;
};

const PermissionUnitList = ({
  units,
  unitIds,
  onChangeUnitIds,
}: PermissionUnitListProps) => {
  const onClick = (unitId: string) => {
    const newUnitIds = unitIds.includes(unitId)
      ? unitIds.filter((id) => id !== unitId)
      : [...unitIds, unitId];

    onChangeUnitIds(newUnitIds);
  };

  return (
    <ListContainer>
      {units.map((unit) => (
        <PermissionUnitItem
          key={unit.id}
          unit={unit}
          isSelected={unitIds.includes(unit.id)}
          onClick={onClick}
        />
      ))}
    </ListContainer>
  );
};

export default PermissionUnitList;

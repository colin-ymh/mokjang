import PermissionUnitListView, {
  PermissionUnitListViewProps,
} from '@/components/molecules/permission/information/permission-unit-list.view';

type PermissionUnitListProps = {
  selectedUnitIds: number[];
  onChangeUnitIds?: (value: number[]) => void;
  isEditable?: boolean;
};

const PermissionUnitList = ({
  selectedUnitIds,
  onChangeUnitIds,
  isEditable = true,
}: PermissionUnitListProps) => {
  const onClick = (unitId: number) => {
    if (isEditable && onChangeUnitIds) {
      const newUnitIds = selectedUnitIds.includes(unitId)
        ? selectedUnitIds.filter((id) => id !== unitId)
        : [...selectedUnitIds, unitId];

      onChangeUnitIds(newUnitIds);
    }
  };

  const props = {
    selectedUnitIds,
    onClick,
    isEditable,
  } as PermissionUnitListViewProps;

  return (
    <>
      <PermissionUnitListView {...props} />
    </>
  );
};

export default PermissionUnitList;

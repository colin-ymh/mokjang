import styled from 'styled-components';

import { usePermissionActiveDropdownItems } from '../../../../hooks/dropdown/dropdown-items';
import { PERMISSION_ACTIVE } from '@mokjang/constants';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const RowTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
`;

export type ChurchUserRowViewProps = {
  permissionActive: PERMISSION_ACTIVE | undefined;
  onChangePermissionActive: (value: PERMISSION_ACTIVE | undefined) => void;
};

const ChurchUserRowView = ({
  permissionActive,
  onChangePermissionActive,
}: ChurchUserRowViewProps) => {
  const dropdownItems = usePermissionActiveDropdownItems();

  return (
    <UserContainer>
      <RowTop>
        <Dropdown
          value={permissionActive}
          items={dropdownItems}
          onChangeItem={onChangePermissionActive}
          width={100}
          height={30}
        />
      </RowTop>
    </UserContainer>
  );
};

export default ChurchUserRowView;

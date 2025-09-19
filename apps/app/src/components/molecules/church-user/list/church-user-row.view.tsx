import styled from 'styled-components';

import { usePermissionActiveDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { GRAY, PERMISSION_ACTIVE, STATUS, WHITE } from '@mokjang/constants';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { Button, SvgIcon } from '@mokjang/components';
import { Svg } from '@mokjang/assets';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../locales/client';

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const RowTop = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-shrink: 0;
`;

export type ChurchUserRowViewProps = {
  onChangePermissionActive: (value: PERMISSION_ACTIVE | undefined) => void;
  onClickCopyJoinCode: (joinCode: string) => void;
};

const ChurchUserRowView = ({
  onChangePermissionActive,
  onClickCopyJoinCode,
}: ChurchUserRowViewProps) => {
  const t = useI18n();

  const { church } = useSelector((state: RootState) => state.church);

  const dropdownItems = usePermissionActiveDropdownItems();

  const { churchUserFilter } = useSelector(
    (state: RootState) => state.churchUserFilter
  );

  return (
    <UserContainer>
      <RowTop>
        <Dropdown
          value={
            churchUserFilter.permissionActive === undefined
              ? undefined
              : churchUserFilter.permissionActive
                ? STATUS.ACTIVE
                : STATUS.INACTIVE
          }
          items={dropdownItems}
          onChangeItem={onChangePermissionActive}
          width={100}
          height={30}
          color={GRAY.SEMI_DARK}
        />
        <Button
          height={30}
          text={`${t('joinCode')}: ${church.joinCode}`}
          color={GRAY.SEMI_DARK}
          borderColor={GRAY.LIGHT}
          backgroundColor={WHITE}
          width={'auto'}
          onClick={() => onClickCopyJoinCode(church.joinCode)}
          icon={
            <SvgIcon
              svg={Svg.Clipboard}
              color={GRAY.SEMI_DARK}
              width={2}
              size={14}
            />
          }
        />
      </RowTop>
    </UserContainer>
  );
};

export default ChurchUserRowView;

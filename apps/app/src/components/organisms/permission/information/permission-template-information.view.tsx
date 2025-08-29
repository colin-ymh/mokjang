import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import React from 'react';
import { MainText } from '../../../atoms/common/text/main-text';
import { SIZE } from '../../../../constants/styles/style';
import HeaderBar from '../../../atoms/layout/header/header-bar';
import { PERMISSION_TEMPLATE_HEADER_ID } from '../../../../constants/layout/header';
import { usePermissionTemplateHeaderBarItems } from '../../../../hooks/layout/header-bar-items';
import PermissionUnitList from '../../../molecules/permission/information/permission-unit-list';
import PermissionManagerList from '../../../molecules/permission/information/permission-manager-list';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 50px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
`;

type PermissionTemplateInformationViewProps = {
  headerBarValue: PERMISSION_TEMPLATE_HEADER_ID;
  onChangeHeader: (value: PERMISSION_TEMPLATE_HEADER_ID) => void;
};

const PermissionTemplateInformationView = ({
  headerBarValue,
  onChangeHeader,
}: PermissionTemplateInformationViewProps) => {
  const headerBarItems = usePermissionTemplateHeaderBarItems();
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );
  const { permissionManagers, permissionUnits } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );

  return (
    <InformationContainer>
      <HeaderContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {targetPermissionTemplate.title}
        </MainText>
      </HeaderContainer>
      <ContentContainer>
        <HeaderBar
          value={headerBarValue}
          items={headerBarItems}
          onClick={onChangeHeader}
        />
        {headerBarValue === PERMISSION_TEMPLATE_HEADER_ID.PERMISSION_UNIT && (
          <PermissionUnitList
            units={permissionUnits}
            unitIds={targetPermissionTemplate?.permissionUnits?.map(
              (unit) => unit.id
            )}
            isEditable={false}
          />
        )}
        {headerBarValue === PERMISSION_TEMPLATE_HEADER_ID.MANAGER && (
          <PermissionManagerList managers={permissionManagers} />
        )}
      </ContentContainer>
    </InformationContainer>
  );
};

export default PermissionTemplateInformationView;

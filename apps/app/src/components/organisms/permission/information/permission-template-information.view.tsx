import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import React from 'react';
import { usePermissionTemplateHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { PERMISSION_TEMPLATE_CONTENT_ID } from '@/constants/layout/content';
import { PopupHeaderBar } from '@mokjang/components';
import PermissionDetailInformation from '@/components/organisms/permission/permission/permission-detail-information';
import PermissionManagerInformation from '@/components/organisms/permission/manager/permission-manager-information';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

type PermissionTemplateInformationViewProps = {
  contentId: PERMISSION_TEMPLATE_CONTENT_ID;
  onClickHeaderBar: (id: PERMISSION_TEMPLATE_CONTENT_ID) => void;
  onClickDelete: () => void;
};

const PermissionTemplateInformationView = ({
  contentId,
  onClickHeaderBar,
  onClickDelete,
}: PermissionTemplateInformationViewProps) => {
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  const headerBarItems = usePermissionTemplateHeaderBarItems();

  return (
    <InformationContainer>
      {targetPermissionTemplate.id !== 'owner' && (
        <PopupHeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      )}
      {contentId === PERMISSION_TEMPLATE_CONTENT_ID.PERMISSION && (
        <PermissionDetailInformation onClickDelete={onClickDelete} />
      )}
      {contentId === PERMISSION_TEMPLATE_CONTENT_ID.MANAGER && (
        <PermissionManagerInformation />
      )}
    </InformationContainer>
  );
};

export default PermissionTemplateInformationView;

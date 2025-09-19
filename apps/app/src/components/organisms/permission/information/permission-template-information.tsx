import React, { useState } from 'react';
import PermissionTemplateInformationView from './permission-template-information.view';
import { PERMISSION_TEMPLATE_CONTENT_ID } from '@/constants/layout/content';

type PermissionTemplateInformationProps = {
  onClickDelete: () => void;
};

const PermissionTemplateInformation = ({
  onClickDelete,
}: PermissionTemplateInformationProps) => {
  const [contentId, setContentId] = useState<PERMISSION_TEMPLATE_CONTENT_ID>(
    PERMISSION_TEMPLATE_CONTENT_ID.PERMISSION
  );

  const onClickHeaderBar = (id: PERMISSION_TEMPLATE_CONTENT_ID) => {
    setContentId(id);
  };

  const props = {
    contentId,
    onClickHeaderBar,
    onClickDelete,
  };

  return (
    <>
      <PermissionTemplateInformationView {...props} />
    </>
  );
};

export default PermissionTemplateInformation;

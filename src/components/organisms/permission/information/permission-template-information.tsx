import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { PermissionsApi } from '@/api/permissions/permissions.api';
import PermissionTemplateInformationView from '@/components/organisms/permission/information/permission-template-information.view';

type PermissionTemplateInformationProps = {};

const PermissionTemplateInformation =
  ({}: PermissionTemplateInformationProps) => {
    const { permissionTemplates } = useSelector(
      (state: RootState) => state.permissionTemplateFilter
    );
    const { targetPermissionTemplate } = useSelector(
      (state: RootState) => state.targetPermissionTemplate
    );
    const { churchId } = useSelector((state: RootState) => state.church);

    const dispatch = useDispatch<AppDispatch>();
    const permissionsApi = new PermissionsApi(false);

    const [thrownError, setThrownError] = useState<Error | null>(null);
    if (thrownError) {
      throw thrownError;
    }

    // ===== status =====
    const onChangePermissionUnit = (unitId: string) => {};
    // ===== status =====

    const props = {
      onChangePermissionUnit,
    };

    return (
      <>
        <PermissionTemplateInformationView {...props} />
      </>
    );
  };

export default PermissionTemplateInformation;

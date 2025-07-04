import React, { useEffect, useState } from 'react';
import PermissionTemplateInformationView from '@/components/organisms/permission/information/permission-template-information.view';
import { PERMISSION_TEMPLATE_HEADER_ID } from '@/constants/layout/header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchPermissionManagers,
  setPermissionManagers,
} from '@/redux/reducers/filter/permission-template-filter-reducer';
import { CHURCH_USER_ROLE } from '@/constants/constant';

type PermissionTemplateInformationProps = {};

const PermissionTemplateInformation =
  ({}: PermissionTemplateInformationProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { targetPermissionTemplate } = useSelector(
      (state: RootState) => state.targetPermissionTemplate
    );

    const [headerBarValue, setHeaderBarValue] =
      useState<PERMISSION_TEMPLATE_HEADER_ID>(
        PERMISSION_TEMPLATE_HEADER_ID.PERMISSION_UNIT
      );

    const onChangeHeader = (value: PERMISSION_TEMPLATE_HEADER_ID) => {
      setHeaderBarValue(value);
    };

    useEffect(() => {
      if (
        targetPermissionTemplate.id &&
        targetPermissionTemplate.id !== CHURCH_USER_ROLE.OWNER
      ) {
        dispatch(
          fetchPermissionManagers({
            templateId: targetPermissionTemplate.id,
          })
        );
      } else {
        dispatch(setPermissionManagers([]));
      }
    }, [targetPermissionTemplate.id]);

    const props = {
      headerBarValue,
      onChangeHeader,
    };

    return (
      <>
        <PermissionTemplateInformationView {...props} />
      </>
    );
  };

export default PermissionTemplateInformation;

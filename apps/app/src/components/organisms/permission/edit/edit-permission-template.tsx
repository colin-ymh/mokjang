import React, { ChangeEvent } from 'react';
import { getFormattedContent, getFormattedTitle } from '@mokjang/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { setTargetPermissionTemplate } from '../../../../redux/reducers/target/target-permission-template-reducer';
import EditPermissionTemplateView from './edit-permission-template.view';

type EditPermissionTemplateProps = {};

const EditPermissionTemplate = ({}: EditPermissionTemplateProps) => {
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== name =====
  const onChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetPermissionTemplate({
        ...targetPermissionTemplate,
        title: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== name =====

  // ===== description =====
  const onChangeDescription = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetPermissionTemplate({
        ...targetPermissionTemplate,
        description: getFormattedContent(event.target.value, 50),
      })
    );
  };
  // ===== description ==

  const props = {
    onChangeName,
    onChangeDescription,
  };

  return (
    <>
      <EditPermissionTemplateView {...props} />
    </>
  );
};

export default EditPermissionTemplate;

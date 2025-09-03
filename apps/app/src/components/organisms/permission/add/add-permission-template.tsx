import React, { ChangeEvent } from 'react';
import {
  getFormattedContent,
  getFormattedTitle,
} from '../../../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { setTargetPermissionTemplate } from '../../../../redux/reducers/target/target-permission-template-reducer';
import AddPermissionTemplateView from './add-permission-template.view';

type AddPermissionTemplateProps = {};

const AddPermissionTemplate = ({}: AddPermissionTemplateProps) => {
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
  // ===== description =====

  // ===== unit =====
  const onChangeUnitIds = (unitIds: string[]): void => {
    dispatch(
      setTargetPermissionTemplate({
        ...targetPermissionTemplate,
        unitIds,
      })
    );
  };
  // ===== unit =====

  const props = {
    onChangeName,
    onChangeDescription,
    onChangeUnitIds,
  };

  return (
    <>
      <AddPermissionTemplateView {...props} />
    </>
  );
};

export default AddPermissionTemplate;

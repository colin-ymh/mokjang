import React, { ChangeEvent } from 'react';
import { getFormattedContent, getFormattedTitle } from '@mokjang/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetPermissionTemplate } from '@/redux/reducers/target/target-permission-template-reducer';
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
  const onChangeUnitIds = (unitIds: number[]): void => {
    dispatch(
      setTargetPermissionTemplate({
        ...targetPermissionTemplate,
        unitIds,
      })
    );
  };
  // ===== unit =====

  const onClickSelectAll = () => {
    dispatch(
      setTargetPermissionTemplate({
        ...targetPermissionTemplate,
        unitIds: [1, 2, 3, 4, 5, 6, 7, 8],
      })
    );
  };

  const props = {
    onChangeName,
    onChangeDescription,
    onChangeUnitIds,
    onClickSelectAll,
  };

  return (
    <>
      <AddPermissionTemplateView {...props} />
    </>
  );
};

export default AddPermissionTemplate;

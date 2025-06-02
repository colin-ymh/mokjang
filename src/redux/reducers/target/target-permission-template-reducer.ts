import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_PERMISSION_TEMPLATE,
  PermissionTemplate,
} from '@/models/permission/permission';

type TargetPermissionTemplateState = {
  targetPermissionTemplate: PermissionTemplate;
};

const initialState: TargetPermissionTemplateState = {
  targetPermissionTemplate: DEFAULT_PERMISSION_TEMPLATE,
};

const TargetPermissionTemplateSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetPermissionTemplate(
      state,
      action: PayloadAction<PermissionTemplate>
    ) {
      state.targetPermissionTemplate = action.payload;
    },
  },
});

export const { setTargetPermissionTemplate } =
  TargetPermissionTemplateSlice.actions;
export default TargetPermissionTemplateSlice.reducer;

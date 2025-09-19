import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NOTIFICATION_DOMAIN } from '@mokjang/models';

type ModalState = {
  open: boolean;
  type?: NOTIFICATION_DOMAIN;
  id?: string;
  educationId?: string;
  educationTermId?: string;
};

const initialState: ModalState = { open: false };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openTaskModal: (state, action: PayloadAction<{ id: string }>) => {
      state.open = true;
      state.type = NOTIFICATION_DOMAIN.TASK;
      state.id = action.payload.id;
    },
    openVisitationModal: (state, action: PayloadAction<{ id: string }>) => {
      state.open = true;
      state.type = NOTIFICATION_DOMAIN.VISITATION;
      state.id = action.payload.id;
    },
    openMyInformation: (state) => {
      state.open = true;
      state.type = NOTIFICATION_DOMAIN.PERMISSION;
    },
    openManager: (state, action: PayloadAction<{ id: string }>) => {
      state.open = true;
      state.type = NOTIFICATION_DOMAIN.MANAGER;
      state.id = action.payload.id;
    },
    openEducationTerm: (
      state,
      action: PayloadAction<{ id: string; educationId: string }>
    ) => {
      state.open = true;
      state.type = NOTIFICATION_DOMAIN.EDUCATION_TERM;
      state.id = action.payload.id;
      state.educationId = action.payload.educationId;
    },
    openEducationSession: (
      state,
      action: PayloadAction<{
        id: string;
        educationId: string;
        educationTermId: string;
      }>
    ) => {
      state.open = true;
      state.type = NOTIFICATION_DOMAIN.EDUCATION_SESSION;
      state.id = action.payload.id;
      state.educationId = action.payload.educationId;
      state.educationTermId = action.payload.educationTermId;
    },
    closeModal: (state) => {
      state.open = false;
      state.type = undefined;
      state.id = undefined;
      state.educationId = undefined;
      state.educationTermId = undefined;
    },
  },
});

export const {
  openTaskModal,
  openVisitationModal,
  openMyInformation,
  openManager,
  openEducationTerm,
  openEducationSession,
  closeModal,
} = modalSlice.actions;
export default modalSlice.reducer;

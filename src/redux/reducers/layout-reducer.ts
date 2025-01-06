import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HEADER_ID } from '@/constants/layout/header';
import { HOME_CONTENT_ID, MEMBER_CONTENT_ID } from '@/constants/layout/content';
import { ReactNode } from 'react';
import MemberTabHeader from '@/components/molecules/layout/header/member-tab-header';

type LayoutState = {
  headerId: string;
  contentId: string;
};

const initialState: LayoutState = {
  headerId: HEADER_ID.HOME,
  contentId: HOME_CONTENT_ID.HOME,
};

const LayoutSlice = createSlice({
  name: 'webview',
  initialState,
  reducers: {
    setHeaderId(state, action: PayloadAction<string>) {
      state.headerId = action.payload;
    },
    setContentId(state, action: PayloadAction<string>) {
      state.contentId = action.payload;
    },
  },
});

export const { setHeaderId, setContentId } = LayoutSlice.actions;
export default LayoutSlice.reducer;

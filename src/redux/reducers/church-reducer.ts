import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK } from '@/constants/constant';
import { Education, Group, Officer } from '@/models/management/management';

type churchManagementItem = {
  id: string;
  membersCount: number;
  name: string;
};

type ChurchState = {
  churchId: string;
  officers: Officer[];
  ministries: churchManagementItem[];
  educations: Education[];
  groups: Group[];
};

const initialState: ChurchState = {
  churchId: BLANK,
  officers: [],
  ministries: [],
  educations: [],
  groups: [],
};

const ChurchSlice = createSlice({
  name: 'church',
  initialState,
  reducers: {
    setChurchId(state, action: PayloadAction<string>) {
      state.churchId = action.payload;
    },
    setOfficers(state, action: PayloadAction<Officer[]>) {
      state.officers = action.payload;
    },
    setMinistries(state, action: PayloadAction<churchManagementItem[]>) {
      state.ministries = action.payload;
    },
    setEducations(state, action: PayloadAction<Education[]>) {
      state.educations = action.payload;
    },
    setGroups(state, action: PayloadAction<Group[]>) {
      state.groups = action.payload;
    },
  },
});

export const {
  setChurchId,
  setOfficers,
  setMinistries,
  setEducations,
  setGroups,
} = ChurchSlice.actions;
export default ChurchSlice.reducer;

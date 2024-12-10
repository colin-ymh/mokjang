import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLANK } from "@/constants/constant";

type churchSettingItem = {
  id: string;
  membersCount: number;
  name: string;
};

type ChurchState = {
  churchId: string;
  officers: churchSettingItem[];
  ministries: churchSettingItem[];
  educations: churchSettingItem[];
};

const initialState: ChurchState = {
  churchId: BLANK,
  officers: [],
  ministries: [],
  educations: [],
};

const ChurchSlice = createSlice({
  name: "church",
  initialState,
  reducers: {
    setChurchId(state, action: PayloadAction<string>) {
      state.churchId = action.payload;
    },
    setOfficers(state, action: PayloadAction<churchSettingItem[]>) {
      state.officers = action.payload;
    },
    setMinistries(state, action: PayloadAction<churchSettingItem[]>) {
      state.ministries = action.payload;
    },
    setEducations(state, action: PayloadAction<churchSettingItem[]>) {
      state.educations = action.payload;
    },
  },
});

export const { setChurchId, setOfficers, setMinistries, setEducations } =
  ChurchSlice.actions;
export default ChurchSlice.reducer;

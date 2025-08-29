import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_TASK, Task } from '../../../models/task/task';

type TargetTaskState = {
  targetTask: Task;
};

const initialState: TargetTaskState = {
  targetTask: DEFAULT_TASK,
};

const TargetTaskSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetTask(state, action: PayloadAction<Task>) {
      state.targetTask = action.payload;
    },
  },
});

export const { setTargetTask } = TargetTaskSlice.actions;
export default TargetTaskSlice.reducer;

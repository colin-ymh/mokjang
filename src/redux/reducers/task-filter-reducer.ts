import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { Task, TASK_STATUS } from '@/models/task/task';
import { RootState } from '@/redux/store';
import { TASK } from '@/constants/task/task-column';
import { TasksApi } from '@/api/tasks/tasks.api';

type TASK_FILTER = {
  [TASK.FROM_DATE]: string;
  [TASK.STATUS]: TASK_STATUS[];
  [TASK.TITLE]: string;
  [TASK.IN_CHARGE]: string;
  [TASK.TO_DATE]: string;
  [TASK.FROM_DATE]: string;
};

type TaskFilterState = {
  tasks: Task[];
  taskFilter: TASK_FILTER;
  taskOrderBy: TASK | typeof NULL;
  taskOrderDirection: ORDER_DIRECTION;
  taskTableHeaderItemList: TASK_TABLE_HEADER_ITEM[];
};

export const INITIAL_TASK_FILTER: TASK_FILTER = {
  [TASK.FROM_DATE]: BLANK,
  [TASK.TO_DATE]: BLANK,
  [TASK.STATUS]: [],
  [TASK.TITLE]: BLANK,
  [TASK.IN_CHARGE]: BLANK,
};

export type TASK_TABLE_HEADER_ITEM = {
  id: TASK;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_TASK_TABLE_HEADER_LIST: TASK_TABLE_HEADER_ITEM[] = [
  {
    id: TASK.TITLE,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
  {
    id: TASK.IN_CHARGE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: TASK.STATUS,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
  {
    id: TASK.DATE,
    isShown: true,
    isSortable: true,
    isFilterable: true,
    isFixed: true,
    isDate: true,
  },
];

const initialState: TaskFilterState = {
  tasks: [],
  taskFilter: INITIAL_TASK_FILTER,
  taskOrderBy: NULL,
  taskOrderDirection: ORDER_DIRECTION.ASC,
  taskTableHeaderItemList: INITIAL_TASK_TABLE_HEADER_LIST,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  { churchId: string; currentPage: number },
  { state: RootState }
>(
  'tasks/fetchTasks',
  async ({ churchId, currentPage }, { getState, rejectWithValue }) => {
    const state = getState().taskFilter;
    const { taskOrderBy, taskOrderDirection, taskFilter } = state;
    const tasksApi = new TasksApi(false);

    try {
      const response = await tasksApi.getTasks({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: taskOrderBy !== NULL ? taskOrderBy : undefined,
        orderDirection: taskOrderDirection,
        // 필터
        taskStatus: taskFilter.taskStatus,
        title: taskFilter.title,
        inChargeId: taskFilter.inChargeId,
        fromTaskDate: taskFilter.fromTaskDate,
        toTaskDate: taskFilter.toTaskDate,
        // 검색
      });

      return response.data.data;
    } catch (error) {
      console.error('심방 목록 불러오기 실패', error);
      return rejectWithValue('심방 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const TaskFilterSlice = createSlice({
  name: 'taskFilter',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setTaskFilter: (state, action: PayloadAction<TASK_FILTER>) => {
      state.taskFilter = action.payload;
    },
    setTaskOrderBy(state, action: PayloadAction<TASK | typeof NULL>) {
      state.taskOrderBy = action.payload;
    },
    setTaskOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.taskOrderDirection = action.payload;
    },
    setTaskTableHeaderItemList(
      state,
      action: PayloadAction<TASK_TABLE_HEADER_ITEM[]>
    ) {
      state.taskTableHeaderItemList = action.payload;
    },
  },
});

export const {
  setTasks,
  setTaskFilter,
  setTaskOrderBy,
  setTaskOrderDirection,
  setTaskTableHeaderItemList,
} = TaskFilterSlice.actions;
export default TaskFilterSlice.reducer;

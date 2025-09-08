import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BLANK,
  DESTRUCTIVE,
  HEADER_BAR,
  ORDER_DIRECTION,
  TASK,
  TASK_STATUS,
} from '@mokjang/constants';
import { DEFAULT_MEMBER, Member, Task } from '@mokjang/models';
import { RootState } from '../../store';
import { TasksApi } from '../../../api/tasks/tasks.api';
import { TaskReportsApi } from '../../../api/reports/task-reports.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import axios from 'axios';

type TASK_FILTER = {
  [TASK.STATUS]: TASK_STATUS[];
  [TASK.DATE]: string;
  [TASK.TITLE]: string;
  [TASK.IN_CHARGE]: Member;
  [TASK.FROM_DATE]: string;
  [TASK.TO_DATE]: string;
};

type TaskFilterState = {
  tasks: Task[];
  taskFilter: TASK_FILTER;
  taskOrderBy?: TASK;
  taskOrderDirection: ORDER_DIRECTION;
  taskTableHeaderItemList: TASK_TABLE_HEADER_ITEM[];
  taskPage: number;
};

export const INITIAL_TASK_FILTER: TASK_FILTER = {
  [TASK.STATUS]: [],
  [TASK.DATE]: BLANK,
  [TASK.TITLE]: BLANK,
  [TASK.IN_CHARGE]: DEFAULT_MEMBER,
  [TASK.FROM_DATE]: BLANK,
  [TASK.TO_DATE]: BLANK,
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
    isDate: false,
  },
  {
    id: TASK.IN_CHARGE,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
];

const initialState: TaskFilterState = {
  tasks: [],
  taskFilter: INITIAL_TASK_FILTER,
  taskOrderDirection: ORDER_DIRECTION.ASC,
  taskTableHeaderItemList: INITIAL_TASK_TABLE_HEADER_LIST,
  taskPage: 1,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  { headerType?: HEADER_BAR },
  { state: RootState }
>(
  'tasks/fetchTasks',
  async ({ headerType }, { getState, dispatch, rejectWithValue }) => {
    const state = getState().taskFilter;
    const { taskPage, taskOrderBy, taskOrderDirection, tasks, taskFilter } =
      state;
    const churchId = getState().church.churchId;
    const user = getState().user.user;
    const tasksApi = new TasksApi(false);
    const taskReportsApi = new TaskReportsApi(false);

    try {
      if (headerType === HEADER_BAR.REPORTED) {
        const response = await taskReportsApi.getTaskReports({});

        const newTasks: Task[] = response.data.data;
        const existingIds = new Set(tasks.map((task) => task.id));
        const filteredNewTasks = newTasks.filter(
          (task) => !existingIds.has(task.id)
        );

        const updatedTasks =
          taskPage === 1 ? newTasks : [...tasks, ...filteredNewTasks];

        return updatedTasks;
      } else {
        const response = await tasksApi.getTasks({
          churchId,
          page: taskPage,
          take: 30, // 무한 스크롤 최적화
          order: taskOrderBy || undefined,
          orderDirection: taskOrderDirection,
          fromStartDate: taskFilter[TASK.FROM_DATE],
          toStartDate: taskFilter[TASK.TO_DATE],
          inChargeId:
            headerType === HEADER_BAR.MY
              ? user.churchUser[0].memberId
              : taskFilter[TASK.IN_CHARGE].id,
          title: taskFilter[TASK.TITLE],
          status: taskFilter[TASK.STATUS],
        });

        const newTasks: Task[] = response.data.data;
        const existingIds = new Set(tasks.map((task) => task.id));
        const filteredNewTasks = newTasks.filter(
          (task) => !existingIds.has(task.id)
        );

        const updatedTasks =
          taskPage === 1 ? newTasks : [...tasks, ...filteredNewTasks];

        return updatedTasks;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        const status = data?.statusCode ?? error.response?.status;
        const message = data.message;

        dispatch(setToastText(message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));

        return rejectWithValue(message);
      }

      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
        return rejectWithValue(error.message);
      }
      return rejectWithValue('업무 목록을 불러오는 중 오류가 발생했습니다.');
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
    setTaskOrderBy(state, action: PayloadAction<TASK>) {
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
    setTaskPage: (state, action: PayloadAction<number>) => {
      state.taskPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export const {
  setTasks,
  setTaskFilter,
  setTaskOrderBy,
  setTaskOrderDirection,
  setTaskTableHeaderItemList,
  setTaskPage,
} = TaskFilterSlice.actions;
export default TaskFilterSlice.reducer;

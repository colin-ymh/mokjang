import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { Task } from '@/models/task/task';
import { RootState } from '@/redux/store';
import { TASK } from '@/constants/task/task-column';
import { TasksApi } from '@/api/tasks/tasks.api';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { TASK_STATUS } from '@/constants/status/status';
import { TaskReportsApi } from '@/api/reports/task-reports.api';
import { TaskReport } from '@/models/report/report';

type TASK_FILTER = {
  [TASK.FROM_DATE]: string;
  [TASK.STATUS]: TASK_STATUS[];
  [TASK.TITLE]: string;
  [TASK.IN_CHARGE]: Member;
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
  [TASK.IN_CHARGE]: DEFAULT_MEMBER,
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
  {
    churchId: string;
    currentPage: number;
    inChargeId?: string;
    memberId?: string;
  },
  { state: RootState }
>(
  'tasks/fetchTasks',
  async (
    { churchId, currentPage, inChargeId, memberId },
    { getState, rejectWithValue }
  ) => {
    const state = getState().taskFilter;
    const { taskOrderBy, taskOrderDirection, taskFilter } = state;
    const tasksApi = new TasksApi(false);
    const taskReportsApi = new TaskReportsApi(false);

    try {
      if (memberId) {
        const response = await taskReportsApi.getTaskReports({
          churchId,
          memberId,
          page: currentPage,
          take: 30, // 무한 스크롤 최적화
          order: taskOrderBy !== NULL ? taskOrderBy : undefined,
          orderDirection: taskOrderDirection,
        });

        const taskReports: TaskReport[] = response.data.data;

        const newTasks = taskReports.map((report) => {
          return report.task;
        });

        return newTasks;
      } else {
        const response = await tasksApi.getTasks({
          churchId,
          page: currentPage,
          take: 30, // 무한 스크롤 최적화
          order: taskOrderBy !== NULL ? taskOrderBy : undefined,
          orderDirection: taskOrderDirection,
          // 필터
          status: taskFilter.status,
          title: taskFilter.title,
          inChargeId: inChargeId || taskFilter.inCharge.id,
          fromStartDate: taskFilter.fromStartDate,
          toStartDate: taskFilter.toStartDate,
          // 검색
        });

        return response.data.data;
      }
    } catch (error) {
      console.error('업무 목록 불러오기 실패', error);
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
    setTaskOrderBy(state, action: PayloadAction<TASK | typeof NULL>) {
      state.taskOrderBy = action.payload;
    },
    setTaskOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.taskOrderDirection = action.payload;
    },
  },
});

export const {
  setTasks,
  setTaskFilter,
  setTaskOrderBy,
  setTaskOrderDirection,
} = TaskFilterSlice.actions;
export default TaskFilterSlice.reducer;

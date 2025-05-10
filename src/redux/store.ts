import { configureStore } from '@reduxjs/toolkit';

import WebviewReducer from './reducers/webview-reducer';
import MemberRegisterReducer from '@/redux/reducers/member-register-reducer';
import MemberFilterReducer from '@/redux/reducers/member-filter-reducer';
import ChurchReducer from '@/redux/reducers/church-reducer';
import TargetMember from '@/redux/reducers/target-member';
import UserReducer from '@/redux/reducers/user-reducer';
import TargetVisitation from '@/redux/reducers/target-visitation';
import TargetGroup from '@/redux/reducers/target-group';
import VisitationFilterReducer from '@/redux/reducers/visitation-filter-reducer';
import TaskFilterReducer from '@/redux/reducers/task-filter-reducer';
import TargetTask from '@/redux/reducers/target-task';

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    user: UserReducer,
    church: ChurchReducer,
    memberRegister: MemberRegisterReducer,
    memberFilter: MemberFilterReducer,
    visitationFilter: VisitationFilterReducer,
    taskFilter: TaskFilterReducer,
    targetMember: TargetMember,
    targetVisitation: TargetVisitation,
    targetTask: TargetTask,
    targetGroup: TargetGroup,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

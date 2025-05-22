import { configureStore } from '@reduxjs/toolkit';

import WebviewReducer from './reducers/webview-reducer';
import MemberRegisterReducer from '@/redux/reducers/member-register-reducer';
import MemberFilterReducer from '@/redux/reducers/member-filter-reducer';
import ChurchReducer from '@/redux/reducers/church-reducer';
import TargetMember from '@/redux/reducers/target-member-reducer';
import UserReducer from '@/redux/reducers/user-reducer';
import TargetVisitation from '@/redux/reducers/target-visitation-reducer';
import TargetGroup from '@/redux/reducers/target-group-reducer';
import VisitationFilterReducer from '@/redux/reducers/visitation-filter-reducer';
import TaskFilterReducer from '@/redux/reducers/task-filter-reducer';
import TargetTask from '@/redux/reducers/target-task-reducer';
import EducationFilterReducer from '@/redux/reducers/education-filter-reducer';
import TargetEducationReducer from '@/redux/reducers/target-education-reducer';
import EducationTermFilterReducer from '@/redux/reducers/education-term-filter-reducer';
import TargetEducationTermReducer from '@/redux/reducers/target-education-term-reducer';
import TargetEducationSessionReducer from '@/redux/reducers/target-education-session-reducer';

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    user: UserReducer,
    church: ChurchReducer,
    memberRegister: MemberRegisterReducer,
    memberFilter: MemberFilterReducer,
    visitationFilter: VisitationFilterReducer,
    educationFilter: EducationFilterReducer,
    educationTermFilter: EducationTermFilterReducer,
    taskFilter: TaskFilterReducer,
    targetMember: TargetMember,
    targetVisitation: TargetVisitation,
    targetEducation: TargetEducationReducer,
    targetEducationTerm: TargetEducationTermReducer,
    targetEducationSession: TargetEducationSessionReducer,
    targetTask: TargetTask,
    targetGroup: TargetGroup,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

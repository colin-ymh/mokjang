import { configureStore } from '@reduxjs/toolkit';

import WebviewReducer from './reducers/webview-reducer';
import MemberFilterReducer from '@/redux/reducers/filter/member-filter-reducer';
import ChurchReducer from '@/redux/reducers/church-reducer';
import TargetMember from '@/redux/reducers/target/target-member-reducer';
import UserReducer from '@/redux/reducers/user-reducer';
import TargetVisitation from '@/redux/reducers/target/target-visitation-reducer';
import TargetGroup from '@/redux/reducers/target/target-group-reducer';
import VisitationFilterReducer from '@/redux/reducers/filter/visitation-filter-reducer';
import TaskFilterReducer from '@/redux/reducers/filter/task-filter-reducer';
import TargetTask from '@/redux/reducers/target/target-task-reducer';
import EducationFilterReducer from '@/redux/reducers/filter/education-filter-reducer';
import TargetEducationReducer from '@/redux/reducers/target/target-education-reducer';
import EducationTermFilterReducer from '@/redux/reducers/filter/education-term-filter-reducer';
import TargetEducationTermReducer from '@/redux/reducers/target/target-education-term-reducer';
import TargetEducationSessionReducer from '@/redux/reducers/target/target-education-session-reducer';
import ChurchUserFilterReducer from '@/redux/reducers/filter/church-user-filter-reducer';
import TargetPermissionTemplateReducer from '@/redux/reducers/target/target-permission-template-reducer';
import PermissionTemplateFilterReducer from '@/redux/reducers/filter/permission-template-filter-reducer';
import JoinRequestFilterReducer from '@/redux/reducers/filter/join-request-filter-reducer';
import TargetJoinRequestReducer from '@/redux/reducers/target/target-join-request-reducer';
import TargetChurchUserReducer from '@/redux/reducers/target/target-church-user-reducer';
import WorshipEnrollmentFilterReducer from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import TargetWorshipReducer from '@/redux/reducers/target/target-worship-reducer';
import TargetWorshipSessionReducer from '@/redux/reducers/target/target-worship-session-reducer';
import WorshipFilterReducer from '@/redux/reducers/filter/worship-filter-reducer';
import WorshipAttendanceFilterReducer from '@/redux/reducers/filter/worship-attendance-filter-reducer';
import CalendarFilterReducer from '@/redux/reducers/filter/calendar-filter-reducer';
import TargetChurchEventReducer from '@/redux/reducers/target/target-church-event-reducer';

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    user: UserReducer,
    church: ChurchReducer,
    // filter
    memberFilter: MemberFilterReducer,
    visitationFilter: VisitationFilterReducer,
    educationFilter: EducationFilterReducer,
    educationTermFilter: EducationTermFilterReducer,
    taskFilter: TaskFilterReducer,
    churchUserFilter: ChurchUserFilterReducer,
    permissionTemplateFilter: PermissionTemplateFilterReducer,
    joinRequestFilter: JoinRequestFilterReducer,
    worshipFilter: WorshipFilterReducer,
    worshipEnrollmentFilter: WorshipEnrollmentFilterReducer,
    worshipAttendanceFilter: WorshipAttendanceFilterReducer,
    calendarFilter: CalendarFilterReducer,
    // target
    targetMember: TargetMember,
    targetVisitation: TargetVisitation,
    targetEducation: TargetEducationReducer,
    targetEducationTerm: TargetEducationTermReducer,
    targetEducationSession: TargetEducationSessionReducer,
    targetTask: TargetTask,
    targetGroup: TargetGroup,
    targetPermissionTemplate: TargetPermissionTemplateReducer,
    targetJoinRequest: TargetJoinRequestReducer,
    targetChurchUser: TargetChurchUserReducer,
    targetWorship: TargetWorshipReducer,
    targetWorshipSession: TargetWorshipSessionReducer,
    targetChurchEvent: TargetChurchEventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

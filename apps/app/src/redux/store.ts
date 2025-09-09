import { configureStore } from '@reduxjs/toolkit';

import WebviewReducer from './reducers/webview-reducer';
import MemberFilterReducer from './reducers/filter/member-filter-reducer';
import ChurchReducer from './reducers/church-reducer';
import TargetMember from './reducers/target/target-member-reducer';
import UserReducer from './reducers/user-reducer';
import TargetVisitation from './reducers/target/target-visitation-reducer';
import TargetGroup from './reducers/target/target-group-reducer';
import VisitationFilterReducer from './reducers/filter/visitation-filter-reducer';
import TaskFilterReducer from './reducers/filter/task-filter-reducer';
import TargetTask from './reducers/target/target-task-reducer';
import EducationFilterReducer from './reducers/filter/education-filter-reducer';
import TargetEducationReducer from './reducers/target/target-education-reducer';
import EducationTermFilterReducer from './reducers/filter/education-term-filter-reducer';
import TargetEducationTermReducer from './reducers/target/target-education-term-reducer';
import TargetEducationSessionReducer from './reducers/target/target-education-session-reducer';
import ChurchUserFilterReducer from './reducers/filter/church-user-filter-reducer';
import TargetPermissionTemplateReducer from './reducers/target/target-permission-template-reducer';
import PermissionTemplateFilterReducer from './reducers/filter/permission-template-filter-reducer';
import JoinRequestFilterReducer from './reducers/filter/join-request-filter-reducer';
import TargetJoinRequestReducer from './reducers/target/target-join-request-reducer';
import TargetChurchUserReducer from './reducers/target/target-church-user-reducer';
import WorshipEnrollmentFilterReducer from './reducers/filter/worship-enrollment-filter-reducer';
import TargetWorshipReducer from './reducers/target/target-worship-reducer';
import TargetWorshipSessionReducer from './reducers/target/target-worship-session-reducer';
import WorshipFilterReducer from './reducers/filter/worship-filter-reducer';
import WorshipAttendanceFilterReducer from './reducers/filter/worship-attendance-filter-reducer';
import CalendarFilterReducer from './reducers/filter/calendar-filter-reducer';
import TargetChurchEventReducer from './reducers/target/target-church-event-reducer';
import HomeWidgetFilterReducer from './reducers/filter/home-widget-filter-reducer';
import ToastPopupReducer from './reducers/toast-popup-reducer';
import TargetHistoryReducer from './reducers/target/target-history-reducer';
import ScheduleSummaryReducer from './reducers/schedule-summary-reducer';
import SubscriptionReducer from '@/redux/reducers/subscription-reducer';
import NotificationReducer from '@/redux/reducers/notification-reducer';

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    user: UserReducer,
    church: ChurchReducer,
    toastPopup: ToastPopupReducer,
    scheduleSummary: ScheduleSummaryReducer,
    subscription: SubscriptionReducer,
    notification: NotificationReducer,
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
    homeWidgetFilter: HomeWidgetFilterReducer,
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
    targetHistory: TargetHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from '@reduxjs/toolkit';

import WebviewReducer from './reducers/webview-reducer';
import MemberRegisterReducer from '@/redux/reducers/member-register-reducer';
import MemberFilterReducer from '@/redux/reducers/member-filter-reducer';
import ChurchReducer from '@/redux/reducers/church-reducer';
import TargetMember from '@/redux/reducers/target-member';
import UserReducer from '@/redux/reducers/user-reducer';

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    user: UserReducer,
    church: ChurchReducer,
    memberRegister: MemberRegisterReducer,
    memberFilter: MemberFilterReducer,
    targetMember: TargetMember,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

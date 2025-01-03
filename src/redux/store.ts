import { configureStore } from "@reduxjs/toolkit";

import WebviewReducer from "./reducers/webview-reducer";
import MemberRegisterReducer from "@/redux/reducers/member-register-reducer";
import LayoutReducer from "@/redux/reducers/layout-reducer";
import MemberFilterReducer from "@/redux/reducers/member-filter-reducer";
import ChurchReducer from "@/redux/reducers/church-reducer";
import TargetMember from "@/redux/reducers/target-member";

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    layout: LayoutReducer,
    memberRegister: MemberRegisterReducer,
    memberFilter: MemberFilterReducer,
    church: ChurchReducer,
    targetMember: TargetMember,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";

import WebviewReducer from "./reducers/webview-reducer";
import MemberRegisterReducer from "@/redux/reducers/member-register-reducer";

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    memberRegister: MemberRegisterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

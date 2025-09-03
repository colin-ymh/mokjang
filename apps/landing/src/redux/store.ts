import { configureStore } from '@reduxjs/toolkit';

import WebviewReducer from './reducers/webview-reducer';
import ChurchReducer from './reducers/church-reducer';
import UserReducer from './reducers/user-reducer';
import ToastPopupReducer from './reducers/toast-popup-reducer';
import SubscriptionReducer from '@/redux/reducers/subscription-reducer';

const store = configureStore({
  reducer: {
    webview: WebviewReducer,
    user: UserReducer,
    church: ChurchReducer,
    toastPopup: ToastPopupReducer,
    subscription: SubscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

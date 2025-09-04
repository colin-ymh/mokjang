import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_SUBSCRIPTION_PLAN, SubscriptionPlan } from '@mokjang/models';

type SubscriptionState = {
  currentSubscription: SubscriptionPlan;
};

const initialState: SubscriptionState = {
  currentSubscription: DEFAULT_SUBSCRIPTION_PLAN,
};

const SubscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setCurrentSubscription(state, action: PayloadAction<SubscriptionPlan>) {
      state.currentSubscription = action.payload;
    },
  },
});

export const { setCurrentSubscription } = SubscriptionSlice.actions;
export default SubscriptionSlice.reducer;

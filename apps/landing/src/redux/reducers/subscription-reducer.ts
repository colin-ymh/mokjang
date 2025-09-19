import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_SUBSCRIPTION_PLAN, SubscriptionPlan } from '@mokjang/models';

type SubscriptionState = {
  subscription: SubscriptionPlan;
};

const initialState: SubscriptionState = {
  subscription: DEFAULT_SUBSCRIPTION_PLAN,
};

const SubscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription(state, action: PayloadAction<SubscriptionPlan>) {
      state.subscription = action.payload;
    },
  },
});

export const { setSubscription } = SubscriptionSlice.actions;
export default SubscriptionSlice.reducer;

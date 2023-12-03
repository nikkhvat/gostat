import { configureStore } from "@reduxjs/toolkit";

import dashboardSlice from "./features/dashboard/slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      dashboard: dashboardSlice
    }
  });
};

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
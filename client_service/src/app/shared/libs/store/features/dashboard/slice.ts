import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getStatsApi, getUserDataApi } from "./api";
import { App, InitialState } from ".";

const initialState: InitialState = {
  data: {},
  screen: "visits",
  user: {},
  activeApp: null
} as InitialState;

export const getStats = createAsyncThunk("DASHBOARD/GET_STATS",
  async ({ app }: { app: string }, { dispatch }) => {
    try {
      const response = await getStatsApi(app);

      if (response.status !== 200) {
        throw new Error("status code is not 200");
      }

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserData = createAsyncThunk("DASHBOARD/GET_USER_DATA",
  async (_, { dispatch }) => {
    try {
      const response = await getUserDataApi();

      if (response.status !== 200) {
        throw new Error("status code is not 200");
      }

      if (response.data.apps?.length > 0) {
        dispatch(getStats({app: response.data.apps[0].id}));
      }


      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const setActiveApp = createAsyncThunk("DASHBOARD/SET_ACTIVE_APP",
  async (app: App, { dispatch }) => {
    dispatch(getStats({app: app.id}));

    return app;
  }
);

export const dashboardSlice = createSlice({
  name: "Dashboard",
  initialState,
  reducers: {
    setActiveScreen: (state, action) => {
      state.screen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStats.fulfilled, (state, action) => {
        if (action.payload) state.data = action.payload.stats;
      })

      .addCase(setActiveApp.fulfilled, (state, action) => {
        if (action.payload) state.activeApp = action.payload;
      })

      .addCase(getUserData.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          if (action.payload.apps?.length > 0) {
            state.activeApp = action.payload.apps[0];
          }
        }
      }); 
  },
});

export const { setActiveScreen } = dashboardSlice.actions;

export default dashboardSlice.reducer;
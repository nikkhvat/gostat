import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getStatsApi, getUserDataApi } from "./api";
import { InitialState } from ".";

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
    } catch {
      alert("Возникла ошибка ...");
    }
  }
);

export const getUserData = createAsyncThunk("DASHBOARD/GET_USER_DATA",
  async () => {
    try {
      const response = await getUserDataApi();

      if (response.status !== 200) {
        throw new Error("status code is not 200");
      }

      return response.data;
    } catch {
      alert("Возникла ошибка ...");
    }
  }
);

export const dashboardSlice = createSlice({
  name: "Dashboard",
  initialState,
  reducers: {
    setActiveScreen: (state, action) => {
      state.screen = action.payload;
    },

    setActiveApp: (state, action) => {
      state.activeApp = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStats.fulfilled, (state, action) => {
        if (action.payload) state.data = action.payload.stats;
      })

      .addCase(getUserData.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          if (action.payload.apps.length > 0) {
            state.activeApp = action.payload.apps[0];
          }
        }
      }); 
  },
});

export const { setActiveScreen, setActiveApp } = dashboardSlice.actions;

export default dashboardSlice.reducer;
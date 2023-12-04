import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getStatsApi } from "./api";
import { InitialState } from ".";

const initialState: InitialState = {
  data: {},
  screen: "visits"
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
      });
  },
});

export const { setActiveScreen } = dashboardSlice.actions;

export default dashboardSlice.reducer;
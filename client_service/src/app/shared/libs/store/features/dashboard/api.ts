import { AxiosResponse } from "axios";

import api from "@/app/shared/libs/api";

import { StatsResponse } from ".";


export const getStatsApi = async (app: string): Promise<AxiosResponse<StatsResponse>> =>
  await api.get("/api/stats/visits", {
    params: { app }
  });
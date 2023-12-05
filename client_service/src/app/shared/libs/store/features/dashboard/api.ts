import { AxiosResponse } from "axios";

import api from "@/app/shared/libs/api";

import { StatsResponse, UserDataResponse } from ".";




export const getStatsApi = async (app: string): Promise<AxiosResponse<StatsResponse>> =>
  await api.get("/api/stats/visits", {
    params: { app }
  });

export const getUserDataApi = async (): Promise<AxiosResponse<UserDataResponse>> => 
  await api.get("/api/auth/info");
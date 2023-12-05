import { AxiosResponse } from "axios";

import { StatsResponse, UserDataResponse } from ".";

import api from "@/app/shared/libs/api";



export const getStatsApi = async (app: string): Promise<AxiosResponse<StatsResponse>> =>
  await api.get("/api/stats/visits", {
    params: { app }
  });

export const getUserDataApi = async (): Promise<AxiosResponse<UserDataResponse>> => 
  await api.get("/api/auth/info");
import { AxiosResponse } from "axios";

import { IUserData, Stat } from "./index";

import api from "@/app/shared/libs/api";



export const getStat = async (id: string): Promise<AxiosResponse<Stat>> => {    
  try {
    const response = await api.get("/api/stats/visits", {
      params: {
        app: id
      }
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
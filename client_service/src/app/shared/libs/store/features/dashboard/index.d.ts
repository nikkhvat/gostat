
export interface InitialState {
  data: StatsResponse["stats"],
  screen: "visits" | "countries" | "browsers" | "bots"
  user: UserDataResponse,
  activeApp: null | App
}

export type StatsResponse = {
  stats: {
    total_visits: number
    total_bots: number
    avg_duration: number
    first_visits: number
    top_pages: Array<{
      url: string
      title: string
      count: number
    }>
    top_browsers: Array<{
      name: string
      count: number
    }>
    top_countries: Array<{
      name: string
      count: number
    }>
    top_os: Array<{
      name?: string
      count: number
    }>
    visits_by_day: Array<{
      date: string
      count?: number
    }>
    total_visits_bot: Array<{
      date: string
      details?: Array<{
        name: string
        count: number
      }>
      total?: number
    }>
    visits_by_hour: Array<{
      time: string
      count?: number
    }>
  }
}

export type UserDataResponse = {
  account_confirmed: boolean,
  apps: App[],
  avatar: string,
  created_at: string,
  email: string,
  first_name: string,
  id: number,
  last_name: string,
  login: string,
  middle_name: string
}

export type App = {
  created_at: string,
  id: string,
  image: string,
  name: string,
  url: string
}
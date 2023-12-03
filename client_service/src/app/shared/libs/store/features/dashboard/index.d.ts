
export interface InitialState {
  data: StatsResponse["stats"],
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

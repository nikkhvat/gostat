

export interface Stat {
  data: {
    stats: {
      total_visits: number
      avg_duration: number
      first_visits: number
      top_pages: { url: string, title: string, count: number }[]
      top_browsers: { name: string, count: number }[]
      top_countries: { name: string, count: number }[]
      top_os: { name: string, count: number }[]
      visits_by_day: { date: string, count?: number }[]
      total_visits_bot: { date: string }[]
      visits_by_hour: { time: string, count?: number }[]
    }
  }
}

export interface IUserData {
  account_confirmed: boolean,
  apps: {
      created_at: string,
      id: string,
      image: string,
      name: string,
      url: string
  }[],
  avatar: string,
  created_at: string,
  email: string,
  first_name: string,
  id: number,
  last_name: string,
  login: string,
  middle_name: string
}
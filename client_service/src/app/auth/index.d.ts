export interface ISingUpRequest {
  first_name: string
  last_name?: string
  login: string
  mail: string
  middle_name?: string
  password: string
}

export interface ISingUpResponse {
  access_token: string
  refresh_token: string
}
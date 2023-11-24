export interface ISingUpRequest {
  first_name: string
  last_name?: string
  login: string
  mail: string
  middle_name?: string
  password: string
}

export interface ISingInRequest {
  login: string
  password: string
}

export interface IAuthResponse {
  access_token: string
}

export interface IConfirmAccount {
  secret_number: string
}

export interface IConfirmAccountResponse {
  successful: boolean
}
export interface getCanvasData {
  startTime: string
  endTime: string
  city: string
}

export interface createAccountParams {
  username?: string
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
  url: string
  gender?: string
  phone?: string
  dob?: string
  avatar?: string
}

export interface signInParams {
  email: string
  password: string
}

export interface resetPasswordParams {
  accountId: string
  password: string
}
export interface verifyEmailParams {
  accountId?: string
}
export interface sendRequestResetPasswordParams {
  email: string
}
export interface ICommonResponse {
  message?: string
}

/** interface
 * @Description: Mẫu kahi báo parmas
 * @author kelvin
 * @Email phamm5687@gmail.com
 * @date new Date()
 */

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
  gender?: string
  phone?: string
  dob?: string
  avatar?: string
}

export interface signInParams {
  email: string
  password: string
}
export interface sendRequestResetPasswordParams {
  email: string
}
export interface ICommonResponse {
  message?: string
}

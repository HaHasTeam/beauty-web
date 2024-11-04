export enum ActionResponseErrorCodeEnum {
  INTERNAL_SERVER_ERROR = 500,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export interface ActionResponseError {
  code: ActionResponseErrorCodeEnum
  message?: string
}

export interface ActionResponse<T> {
  error?: ActionResponseError
  data?: T | object
  message: string
}

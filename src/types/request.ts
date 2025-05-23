export type TServerResponse<T, TItems = undefined> = {
  message: string
  data: T & (TItems extends undefined ? object : { items: TItems })
}

export type TMetaData = {
  id: string
  createdAt: string
  updatedAt: string
}

export type TServerError<TErrorResponse = unknown> = {
  message: string
  errors?: {
    [key in keyof TErrorResponse]: string
  }
}
export class ResponseError<TErrorResponse = unknown> extends Error {
  errors?: { [key in keyof TErrorResponse]: string }
  constructor(public response: TServerError<TErrorResponse>) {
    super(response.message)
    this.errors = response.errors
  }
}

export type TServerResponseWithPagination<TItems = undefined> = {
  message: string
  data: (TItems extends undefined ? object : { items: TItems }) & {
    total: number
    totalPages: number
  }
}

export type TServerResponseWithPaging<T> = {
  message: string
  data: {
    items: T
    total: number
    totalPages: number
    page: number
    limit: number
  }
}

export type BaseFilterParams = {
  sortBy?: string
  order?: 'ASC' | 'DESC'
  page?: number
  limit?: number
}

export type BaseParams<T> = {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
} & Partial<T>

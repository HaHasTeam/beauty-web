// Define the required interfaces directly in this file to avoid import errors
export interface IAccountBasic {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface IBookingBasic {
  id: string
}

export interface IMediaFile {
  id: string
  url: string
  type: string
}

// Basic brand interface
export interface IBrandBasic {
  id: string
  name?: string
}

// Basic order interface
export interface IOrderBasic {
  id: string
  code?: string
}

export interface IStatusTracking {
  id: string
  createdAt: string
  updatedAt: string
  reason?: string
  status: string
  updatedBy?: IAccountBasic
  account?: IAccountBasic
  brand?: IBrandBasic | null
  order?: IOrderBasic | null
  booking?: Partial<IBookingBasic>
  mediaFiles?: IMediaFile[]
}

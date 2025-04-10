export interface ILivestream {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  startTime: string
  endTime: string
  record: string | null
  thumbnail: string
  status: LivestreamStatus
}

// You might want to define an enum for the status values
export enum LivestreamStatus {
  LIVE = 'LIVE',
  ENDED = 'ENDED',
  SCHEDULED = 'SCHEDULED',
  CANCELED = 'CANCELED',
  // Add other possible statuses as needed
}

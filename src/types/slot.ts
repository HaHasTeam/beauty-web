import { IBooking } from './booking';
import { WeekDay } from './enum';
import { TMetaData } from './request';

export type ISlot=TMetaData& {
    weekDay: WeekDay;
    startTime: string;
    endTime: string;
    bookings: IBooking[];
}
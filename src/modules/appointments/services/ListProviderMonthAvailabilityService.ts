import { injectable, inject } from 'tsyringe';
import {
  getDate,
  getHours,
  getDaysInMonth,
  isEqual,
  startOfDay,
  isAfter,
} from 'date-fns';

import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

interface IResponse {
  day: number;
  available: boolean;
}

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appoitmentsRepository: IAppoitmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse[]> {
    const appointments = await this.appoitmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const currentDate = new Date(Date.now());

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      const compareDate = new Date(year, month - 1, day);
      const checkDate = this.CheckDate(compareDate, currentDate);

      return {
        day,
        available: appointmentsInDay.length < 10 && checkDate,
      };
    });

    return availability;
  }

  private CheckDate(compareDate: Date, currentDate: Date): boolean {
    const compareDateDay = startOfDay(compareDate);
    const currentDateDay = startOfDay(currentDate);

    if (isEqual(compareDateDay, currentDateDay)) {
      const currentHour = getHours(currentDate);
      return !(currentHour < 8 || currentHour > 17);
    }

    return (
      isAfter(compareDateDay, currentDateDay) ||
      isEqual(compareDateDay, currentDateDay)
    );
  }
}

export default ListProviderMonthAvailabilityService;

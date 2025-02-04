import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

interface IResponse {
  hour: number;
  available: boolean;
}

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appoitmentsRepository: IAppoitmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse[]> {
    const appointments = await this.appoitmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const hourStart = 8;
    const currentDate = new Date(Date.now());

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;

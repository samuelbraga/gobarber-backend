import { startOfHour } from 'date-fns';
import HttpStatus from 'http-status-codes';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(
    private readonly appointmentRepositpry: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    await this.findAppointmentInSameDate(appointmentDate);

    const appointment = await this.appointmentRepositpry.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }

  private async findAppointmentInSameDate(date: Date): Promise<void> {
    const findAppointment = await this.appointmentRepositpry.findByDate(date);

    if (findAppointment) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'This appointment is already booked',
      );
    }
  }
}

export default CreateAppointmentService;

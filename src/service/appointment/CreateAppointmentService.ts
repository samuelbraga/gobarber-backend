import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import HttpStatus from 'http-status-codes';

import Appointment from '../../models/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';

import ExceptionBase from '../../exceptions/ExceptionBase';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    await this.findAppointmentInSameDate(appointmentDate);

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }

  private async findAppointmentInSameDate(date: Date): Promise<void> {
    const findAppointment = await this.appointmentsRepository.findByDate(date);

    if (findAppointment) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'This appointment is already booked',
      );
    }
  }
}

export default CreateAppointmentService;

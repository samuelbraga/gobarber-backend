import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    await this.findAppointmentInSameDate(appointmentDate);

    const appointment = await this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }

  private async findAppointmentInSameDate(date: Date): Promise<void> {
    const findAppointment = await this.appointmentsRepository.findByDate(date);

    if (findAppointment) {
      throw Error('This appointment is already booked');
    }
  }
}

export default CreateAppointmentService;

import { getCustomRepository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

class ListAppointmentService {
  private appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute(): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find();
    return appointments;
  }
}

export default ListAppointmentService;

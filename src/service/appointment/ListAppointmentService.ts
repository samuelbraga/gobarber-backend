import { getCustomRepository } from 'typeorm';

import Appointment from '../../models/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';

class ListAppointmentService {
  private appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute(): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find();
    return appointments;
  }
}

export default ListAppointmentService;

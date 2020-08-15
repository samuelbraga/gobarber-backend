import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';

@injectable()
class ListAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepositpry: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepositpry.find();
    return appointments;
  }
}

export default ListAppointmentService;

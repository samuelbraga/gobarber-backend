import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';

class ListAppointmentService {
  constructor(
    private readonly appointmentRepositpry: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<Appointment[]> {
    const appointments = await this.appointmentRepositpry.find();
    return appointments;
  }
}

export default ListAppointmentService;

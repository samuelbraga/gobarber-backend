import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    user_id,
    provider_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    await this.CheckDate(appointmentDate);

    await this.CheckUserIsProvider(user_id, provider_id);

    const appointment = await this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    await this.SendNotification(provider_id, appointmentDate);

    return appointment;
  }

  private async CheckDate(appointmentDate: Date): Promise<void> {
    if (isBefore(appointmentDate, new Date(Date.now()))) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'You can not create an appointment on a past date',
      );
    }

    if (await this.appointmentsRepository.findByDate(appointmentDate)) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'This appointment is already booked',
      );
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'You can only create appointments between 8am and 5pm',
      );
    }
  }

  private async CheckUserIsProvider(
    user_id: string,
    provider_id: string,
  ): Promise<void> {
    if (user_id === provider_id) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'You can not create an appointment for yourself',
      );
    }
  }

  private async SendNotification(
    provider_id: string,
    date: Date,
  ): Promise<void> {
    const formatedDate = format(date, "dd/MM/yyyy 'às' HH:mm");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento no dia ${formatedDate}h`,
    });
  }
}

export default CreateAppointmentService;

import FakeAppoitmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppoitmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
    expect(appointment).toHaveProperty('date');
  });

  it('should not be able to create two appointments on the same date and time', async () => {
    const appointmentDate = new Date(2020, 0, 31, 10);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});

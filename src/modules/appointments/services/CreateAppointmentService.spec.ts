import FakeAppoitmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppoitmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 20, 13),
      user_id: '123',
      provider_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
    expect(appointment).toHaveProperty('date');
  });

  it('should not be able to create two appointments on the same date and time', async () => {
    const appointmentDate = new Date(2020, 4, 20, 10);

    await createAppointmentService.execute({
      date: appointmentDate,
      user_id: '123',
      provider_id: '123456',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        user_id: '1234',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create an appointments on a paste date', async () => {
    expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: '123',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create an appointments with same user as provider', async () => {
    expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 14),
        user_id: '123',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create an appointments before 8am and after 5pm', async () => {
    expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 18),
        user_id: '123',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});

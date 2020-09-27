import FakeAppoitmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppoitmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 10).getTime();
    });

    const tasks: Promise<Appointment>[] = [];

    const task = async (index: number): Promise<Appointment> => {
      const appointment = await fakeAppoitmentsRepository.create({
        user_id: '123',
        provider_id: 'user',
        date: new Date(2020, 4, 20, index, 0, 0),
      });

      return appointment;
    };

    for (let i = 8; i <= 17; i += 1) {
      tasks.push(task(i));
    }

    Promise.all(tasks).then();

    await fakeAppoitmentsRepository.create({
      user_id: '123',
      provider_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 18, available: false },
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });

  it('should be able to list the month availability from provider with hour befor 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 18).getTime();
    });

    const tasks: Promise<Appointment>[] = [];

    const task = async (index: number): Promise<Appointment> => {
      const appointment = await fakeAppoitmentsRepository.create({
        user_id: '123',
        provider_id: 'user',
        date: new Date(2020, 4, 20, index, 0, 0),
      });

      return appointment;
    };

    for (let i = 8; i <= 17; i += 1) {
      tasks.push(task(i));
    }

    Promise.all(tasks).then();

    await fakeAppoitmentsRepository.create({
      user_id: '123',
      provider_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 18, available: false },
        { day: 19, available: false },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});

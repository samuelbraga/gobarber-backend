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
    const tasks: Promise<Appointment>[] = [];

    const task = async (index: number): Promise<Appointment> => {
      const appointment = await fakeAppoitmentsRepository.create({
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
      provider_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});

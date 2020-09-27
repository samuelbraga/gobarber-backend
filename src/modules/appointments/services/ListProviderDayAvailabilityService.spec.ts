import FakeAppoitmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppoitmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppoitmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    await fakeAppoitmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'user',
      day: 21,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});

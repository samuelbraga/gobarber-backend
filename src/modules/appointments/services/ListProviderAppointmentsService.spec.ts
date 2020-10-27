import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('it should be able list the appointments for a provider on a specific day', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 21).getTime();
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      user_id: '123',
      provider_id: '123456',
      date: new Date(2020, 4, 21, 11, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      user_id: '123',
      provider_id: '123456',
      date: new Date(2020, 4, 21, 12, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: '123456',
      day: 21,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});

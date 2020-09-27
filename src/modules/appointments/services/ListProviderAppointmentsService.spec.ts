import FakeAppoitmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppoitmentsRepository,
    );
  });

  it('it should be able list the appointments for a provider on a specific day', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 21).getTime();
    });

    const appointment1 = await fakeAppoitmentsRepository.create({
      user_id: '123',
      provider_id: '123456',
      date: new Date(2020, 4, 21, 11, 0, 0),
    });

    const appointment2 = await fakeAppoitmentsRepository.create({
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

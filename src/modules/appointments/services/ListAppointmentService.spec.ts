import FakeAppoitmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListAppointmentService from './ListAppointmentService';

describe('ListAppointment', () => {
  it('should return appointment list', async () => {
    const fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
    const listAppointmentService = new ListAppointmentService(
      fakeAppoitmentsRepository,
    );

    const appointments = await listAppointmentService.execute();

    expect(appointments);
    expect(appointments).toHaveLength(0);
  });
});

export function getAppointmentsForDay(state, day) {
  const output = [];
  let apptArr = null;

  // get state.days.appointments array
  for (const stateDay of state.days) {
    if (stateDay.name === day) {
      apptArr = [...stateDay.appointments];
    }
  }

  if (!apptArr || apptArr.length === 0) {
    return [];
  }

  for (const appt of apptArr) {
    output.push(state.appointments[appt])
  }

  return output;
}
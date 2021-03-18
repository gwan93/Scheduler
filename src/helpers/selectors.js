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

export function getInterview(state, interview) {

  if (!interview) {
    return null;
  }
  
  const output = interview;
  output['interviewer'] = state.interviewers[interview.interviewer];
  return output;

}

export function getInterviewersForDay(state, day) {
  const output = [];
  let intvrArr = null;

  // get state.days.interviewers array
  for (const stateDay of state.days) {
    if (stateDay.name === day) {
      intvrArr = [...stateDay.interviewers];
    }
  }

  if (!intvrArr || intvrArr.length === 0) {
    return [];
  }

  for (const intvr of intvrArr) {
    output.push(state.appointments[intvr])
  }

  return output;
}
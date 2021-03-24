export function getAppointmentsForDay(state, day) {
  const output = [];

  const selectedDay = state.days.filter(stateDay => stateDay.name === day);

  if (!selectedDay.length) return [];
  
  for (const appointment of selectedDay[0].appointments) {
    output.push(state.appointments[appointment]);
  }

  return output;
};

export function getInterview(state, interview) {

  if (!interview) return null;

  const interviewer = state.interviewers[interview.interviewer];

  const output = {
    student: interview.student,
    interviewer
  }

  return output;

};

export function getInterviewersForDay(state, day) {
  const output = [];

  const selectedDay = state.days.filter(stateDay => stateDay.name === day);

  if (!selectedDay.length) return [];
  
  for (const interviewer of selectedDay[0].interviewers) {
    output.push(state.interviewers[interviewer]);
  }

  return output;
};
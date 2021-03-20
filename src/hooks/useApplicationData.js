import {useEffect, useState} from 'react';
import axios from 'axios';
const { getAppointmentsForDay } = require('helpers/selectors');


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  
  const setDay = day => setState({ ...state, day });

  useEffect(() => {

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")

    ])
    .then(all => {
      
      const [daysData, appointmentsData, interviewersData] = all;
     
      setState(prev => ({
        ...prev,
        days: daysData.data,
        appointments: appointmentsData.data,
        interviewers: interviewersData.data
      }))

    })
    .catch(error => console.log('error', error))

  }, [])

  const updateRemainingSpots = (state, appointments) => {

    const dummyState = {...state, appointments}
    const numAppts = getAppointmentsForDay(dummyState, state.day)

    let remainingSpots = 0;
    for (const numAppt of numAppts) {
      if (!numAppt.interview) {
        remainingSpots ++;
      }
    }

    for (const day of dummyState.days) {
      if (day.name === state.day) {
        day['spots'] = remainingSpots;
      }
    }
  };
  
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    updateRemainingSpots(state, appointments);

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(res => {
        setState({
          ...state,
          appointments
        });
        return res;
      });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    updateRemainingSpots(state, appointments);

    return axios.delete(`/api/appointments/${id}`)
    .then(res => {
      setState({
        ...state,
        appointments
      });
      return res;
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}

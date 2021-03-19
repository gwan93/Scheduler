import {useEffect, useState} from 'react';
import axios from 'axios';

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
  
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
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

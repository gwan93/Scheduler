import {useEffect, useReducer } from 'react';
import axios from 'axios';
const { getAppointmentsForDay } = require('helpers/selectors');


export default function useApplicationData() {

  // ********** using useRender:

  // initializing constants to be used in switch/case
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        // when dispatch({ type: SET_DAY}) is called,
        // the following line updates the state with 
        // the day as action.day
        // (action.day was passed from the dispatch)
        return {  ...state, day: action.day  }
      case SET_APPLICATION_DATA:
        return { 
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        }
      case SET_INTERVIEW: 
        return { ...state, appointments: action.appointments };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  
  // When updating the current day, calls the reducer function.
  // Passes on an object named action with properties like so:
  // action = {type: SET_DAY, day: day}
  const setDay = day => dispatch({ type: SET_DAY, day });


  useEffect(() => {

    const testSocket = new WebSocket("ws://localhost:8001");

    // testSocket.onopen = function (event) {
    //   testSocket.send("ping");
    // };

    testSocket.onmessage = function (event) {
      console.log('Message received from server:', event.data);

      const parsedResponse = JSON.parse(event.data);

      if (parsedResponse.type === SET_INTERVIEW) {
        console.log('it is a set_interview', parsedResponse)
        const { id, interview } = parsedResponse;

        // console.log(id)
        // console.log(interview)

        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null
        };
      
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
    
        updateRemainingSpots(state, appointments);
        dispatch({ type: SET_INTERVIEW, appointments });

      }
    }
    return () => testSocket.close();
  })

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(all => {
      const [daysData, appointmentsData, interviewersData] = all;
      const days = daysData.data;
      const appointments = appointmentsData.data;
      const interviewers = interviewersData.data;
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers})
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
        dispatch({ type: SET_INTERVIEW, appointments});
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
      dispatch({ type: SET_INTERVIEW, appointments});
      return res;
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };

  // ********** using useState:
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // })
  
  // const setDay = day => setState({ ...state, day });

  // useEffect(() => {
  //   const testSocket = new WebSocket("ws://localhost:8001");
  //   testSocket.onopen = function (event) {
  //     testSocket.send("ping");
  //   };

  //   testSocket.onmessage = function (event) {
  //     console.log('Message received from server:', event.data);
  //   }

  //   Promise.all([
  //     axios.get("/api/days"),
  //     axios.get("/api/appointments"),
  //     axios.get("/api/interviewers")
  //   ])
  //   .then(all => {
  //     const [daysData, appointmentsData, interviewersData] = all;
  //     setState(prev => ({
  //       ...prev,
  //       days: daysData.data,
  //       appointments: appointmentsData.data,
  //       interviewers: interviewersData.data
  //     }))
  //   })
  //   .catch(error => console.log('error', error))
  // }, [])

  // const updateRemainingSpots = (state, appointments) => {
  //   const dummyState = {...state, appointments}
  //   const numAppts = getAppointmentsForDay(dummyState, state.day)
  //   let remainingSpots = 0;
  //   for (const numAppt of numAppts) {
  //     if (!numAppt.interview) {
  //       remainingSpots ++;
  //     }
  //   }

  //   for (const day of dummyState.days) {
  //     if (day.name === state.day) {
  //       day['spots'] = remainingSpots;
  //     }
  //   }
  // };
  
  // const bookInterview = (id, interview) => {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: { ...interview }
  //   };
  
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };

  //   updateRemainingSpots(state, appointments);

  //   return axios.put(`/api/appointments/${id}`, appointment)
  //     .then(res => {
  //       setState({
  //         ...state,
  //         appointments
  //       });
  //       return res;
  //     });
  // };

  // const cancelInterview = (id) => {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: null
  //   };
  
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };

  //   updateRemainingSpots(state, appointments);

  //   return axios.delete(`/api/appointments/${id}`)
  //   .then(res => {
  //     setState({
  //       ...state,
  //       appointments
  //     });
  //     return res;
  //   });
  // };

  // return {
  //   state,
  //   setDay,
  //   bookInterview,
  //   cancelInterview
  // };
}

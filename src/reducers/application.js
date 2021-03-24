  // initializing constants to be used in switch/case
  export const SET_DAY = "SET_DAY";
  export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  export const SET_INTERVIEW = "SET_INTERVIEW";

  export default function reducer(state, action) {
    switch (action.type) {
      // case SET_DAY:
      //   // when dispatch({ type: SET_DAY}) is called,
      //   // the following line updates the state with 
      //   // the day as action.day
      //   // (action.day was passed from the dispatch)
      //   return {  ...state, day: action.day  }
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
import React, { useEffect } from 'react';
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";


import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETE = "DELETE";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  const save = (name, interviewer) => {

    if (!name || !interviewer) {
      return;
    }
    
    transition(SAVING)

    const interview = {
      student: name,
      interviewer
    };

    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVE, true))
  }

  const deleteInterview = () => {
    // console.log('they are really sure...')
    transition(DELETE);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true))
  };

  return (
    <article className="appointment">
      <Header time={props.time}/>

      {
        useEffect(() => {
          if (!props.interview && mode === SHOW) {
            transition(EMPTY);
          } else if (props.interview && mode === EMPTY) {
            transition(SHOW)
          }
        }, [props.interview, transition, mode])
      }

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show 
          student={props.interview.student} 
          id={props.id} 
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)} />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save} />
      )}
      {mode === SAVING && (
        <Status message="Saving"/>
      )}
      {mode === CONFIRM && (
        <Confirm 
          message="Delete this appointment?"
          onConfirm={deleteInterview}
          onCancel={back}/>
      )}
      {mode === DELETE && (
        <Status message="Deleting" />
      )}
      {mode === EDIT && (
        <Form
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save} />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Changes could not be saved. Please try again."
          onClose={back}/>
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="This appointment could not be deleted. Please try again."
          onClose={back}/>
      )}
    </article>
  );
}


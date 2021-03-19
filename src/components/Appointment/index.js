import React from 'react';
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETE = "DELETE";
const EDIT = "EDIT";




export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  const save = (name, interviewer) => {
    transition(SAVING)

    const interview = {
      student: name,
      interviewer
    };

    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
  }

  const confirmDelete = () => {
    // console.log('deleting props.id', props.id)
    transition(CONFIRM);
  }

  const deleteInterview = () => {
    // console.log('they are really sure...')
    transition(DELETE);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
  };

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show 
          student={props.interview.student} 
          id={props.id} 
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={confirmDelete} />
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
      {mode === EDIT && console.log(props.name, props.interview)}
      {mode === EDIT && (
        <Form
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save} />
      )}
    </article>
  );
}


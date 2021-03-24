import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {

  const dayItem = props.days.map((day) => {
    return (
      <DayListItem
        key={day.id} 
        name={day.name}
        selected={day.name === props.day} // the day of the week will be selected if this condition is true
        spots={day.spots}
        setDay={props.setDay}
      />
    );
  });

  return (
    <ul>
      {dayItem}
    </ul>
  );
};
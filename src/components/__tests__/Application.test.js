import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByTestId } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();

  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container } = render(<Application />);

    // wait for data to load onto page
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");

    // select the first empty appointment
    const appointment = appointments[0];
    // console.log(prettyDOM(appointment));

    // target and click add button
    const addBtn = getByAltText(appointment, "Add");
    fireEvent.click(addBtn);


    // target and update input field
    const inputField = getByTestId(appointment, "student-name-input");
    fireEvent.change(inputField, { target: { value: "A student" }})

    // target and update the interviewer
    const selectInterviewer = getByAltText(appointment, "Sylvia Palmer");
    fireEvent.click(selectInterviewer);

    // target and click the save button
    const saveBtn = getByText(appointment, "Save");
    fireEvent.click(saveBtn);

    


  });
});
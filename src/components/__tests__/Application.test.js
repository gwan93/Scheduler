import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, waitForElementToBeRemoved, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByTestId, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    const { container} = render(<Application />);

    // wait for data to load onto page
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");

    // select the first empty appointment
    const appointment = appointments[0];

    // target and click add button
    const addBtn = getByAltText(appointment, "Add");
    fireEvent.click(addBtn);

    // target and update input field
    const inputField = getByTestId(appointment, "student-name-input");
    fireEvent.change(inputField, { target: { value: "Lydia Miller-Jones" }});

    // target and update the interviewer
    const selectInterviewer = getByAltText(appointment, "Sylvia Palmer");
    fireEvent.click(selectInterviewer);

    // target and click the save button
    const saveBtn = getByText(appointment, "Save");
    fireEvent.click(saveBtn);

    // checks if the saving spinner shows after clicking save
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // check if the spots remaining now shows "no spots remaining"
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    // Wait for data to load onto the page
    const { container} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Select an existing appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    // Select and click the delete button on that appointment
    const deleteBtn = getByAltText(appointment, "Delete");
    fireEvent.click(deleteBtn);

    // Check that the confirmation box is displayed
    expect(getByText(appointment, "Delete this appointment?")).toBeInTheDocument();

    // Select and click the Confirm button
    const confirmBtn = getByText(appointment, "Confirm");
    fireEvent.click(confirmBtn);

    // Check that the Deleting message is shown
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // Check that the appointment is now empty by checking for "Add" 
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));
    expect(getByAltText(appointment, "Add"));

    // Check that the spots remaining has increased by 1
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    const { container} = render(<Application />);

    // wait for data to load onto page
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");

    // Select an existing appointment
    const appointment = appointments[1];

    // Select the edit button
    const editBtn = getByAltText(appointment, "Edit");
    fireEvent.click(editBtn);

    // target and update input field
    const inputField = getByTestId(appointment, "student-name-input");
    fireEvent.change(inputField, { target: { value: "Lydia Miller-Jones" }});

    // target and update the interviewer
    const selectInterviewer = getByAltText(appointment, "Sylvia Palmer");
    fireEvent.click(selectInterviewer);

    // target and click the save button
    const saveBtn = getByText(appointment, "Save");
    fireEvent.click(saveBtn);

    // checks if the saving spinner shows after clicking save
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // check if the spots remaining continues to show "1 spot remaining"
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {

    axios.put.mockRejectedValueOnce();

    const { container} = render(<Application />);

    // wait for data to load onto page
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");

    // Select an existing appointment
    const appointment = appointments[1];

    // Select the edit button
    const editBtn = getByAltText(appointment, "Edit");
    fireEvent.click(editBtn);

    // target and update input field
    const inputField = getByTestId(appointment, "student-name-input");
    fireEvent.change(inputField, { target: { value: "Lydia Miller-Jones" }});

    // target and update the interviewer
    const selectInterviewer = getByAltText(appointment, "Sylvia Palmer");
    fireEvent.click(selectInterviewer);

    // target and click the save button
    const saveBtn = getByText(appointment, "Save");
    fireEvent.click(saveBtn);

    // checks that the saving spinner shows after clicking save
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    // checks that the error is shown
    expect(getByText(appointment, "Error")).toBeInTheDocument();

    // Close the error box
    const closeBtn = getByAltText(appointment, "Close");
    fireEvent.click(closeBtn);

    // Check that the spots remaining continues to be "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {

    axios.delete.mockRejectedValueOnce();

    // Wait for data to load onto the page
    const { container} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Select an existing appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    // Select and click the delete button on that appointment
    const deleteBtn = getByAltText(appointment, "Delete");
    fireEvent.click(deleteBtn);

    // Check that the confirmation box is displayed
    expect(getByText(appointment, "Delete this appointment?")).toBeInTheDocument();

    // Select and click the Confirm button
    const confirmBtn = getByText(appointment, "Confirm");
    fireEvent.click(confirmBtn);

    // Check that the Deleting message is shown
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    // checks that the error is shown
    expect(getByText(appointment, "Error")).toBeInTheDocument();

    // Close the error box
    const closeBtn = getByAltText(appointment, "Close");
    fireEvent.click(closeBtn);

    // Check that the spots remaining continues to be "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();


  });
});
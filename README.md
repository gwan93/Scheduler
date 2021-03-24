# Interview Scheduler

Interview Scheduler is a full stack web application built with Node and React. It allows users to create interview appointments for different days of the week.

---

## Features

- Users can select days of the week to book their interview appointments
- Users can create, edit, and delete interview appointments
- WebSocket connections to allow for changes in one browser to automatically be reflected in a different browser
- Site hosted with Heroku, CircleCI, and Netlify (https://gw-interview-scheduler.netlify.app/)
---

## Testing Methodology
- React Components created and tested with Storybook
- Helper function unit testing and integration testing with Jest Test Framework
- End-to-End testing with Cypress Testing Framework
- Coverage reports used as a guide for testing edge cases
---

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

# Final Product
Users will be greeted with the following page (https://gw-interview-scheduler.netlify.app/)

!["Home page displaying all the interviews for Monday"](https://github.com/gwan93/scheduler/blob/master/docs/home-page.png?raw=true)

Users can create an interview appointment by clicking on an available '+' sign to select that time slot
!["Creating a new appointment"](https://github.com/gwan93/scheduler/blob/master/docs/new-appointment.png?raw=true)

Users can edit and delete interview appointments (Note the different text in the 12pm appointment and absence of the 3pm appointment)
!["Edited and deleted appointments"](https://github.com/gwan93/scheduler/blob/master/docs/edit-delete-appointment.png?raw=true)

---

# Known Bugs
- None as of March 24, 2021
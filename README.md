# Jobzan, the Job Hunter

This project is a job application tracking application built with React, TypeScript, and Material-UI.

**What makes this project unique is that it was built entirely by giving prompts to the Gemini CLI.**

## Features

- Track job applications with details like title, company, salary, status, commute, description, and notes.
- Manage employers with their contact information and location data.
- Add, edit, and delete both jobs and employers.
- View detailed information for each job and its associated employer.
- Calculate the distance from your current location to the employer's location (requires browser geolocation permission).
- Log current application data to the browser console for manual saving.

## How to Run

1.  Clone this repository.
2.  Navigate to the project directory in your terminal.
3.  Install dependencies:

    ```bash
    pnpm install
    ```

4.  Populate the database (optional, but recommended for initial setup):

    ```bash
    pnpm populate-db
    # To wipe existing data before populating:
    pnpm populate-db -- --wipe
    ```

5.  Start the development server:

    ```bash
    pnpm dev
    ```

6.  Open your browser to `http://localhost:5173`.

## Built With

- React
- TypeScript
- Vite
- Material-UI (MUI)
- pnpm

## Development Process

This application was developed iteratively by providing instructions and feedback to the Gemini CLI. Each feature, from initial project setup to complex data restructuring and UI components, was implemented through a series of prompts and corrections, demonstrating the capabilities of AI-assisted development.

## Work So Far

We have successfully:

- Created a React TypeScript application with Vite.
- Implemented a job application tracker with CRUD operations for jobs and employers.
- Integrated Material-UI for the user interface.
- Added geolocation-based distance calculation for job locations.
- Implemented filtering, sorting, and searching for job applications.
- Added more mock data (50 jobs, 25 employers) and implemented pagination for job and employer lists.
- Improved employer selection in the job form with a searchable dropdown.
- Added links for job descriptions and employer websites.
- Implemented internationalization (i18n) for UI components.
- Improved accessibility (a11y) with more descriptive aria-labels for buttons.
- Implemented code splitting using React.lazy and Suspense for improved performance.

## Future Ideas

Here are some suggestions for future enhancements:

- **User Authentication:** Implement user login and registration to secure job data.

- **Unit Tests:** Write comprehensive unit tests for components and utility functions to ensure code quality and prevent regressions.
- **Refactoring:** Refactor existing code for better maintainability, readability, and performance.
- **Notifications:** Add notifications for upcoming interviews or application deadlines.
- **Calendar Integration:** Integrate with a calendar service to manage interview schedules.

## Issues

(Ran out of free usage for today, I guess, getting too many requests!) Manually capturing this section from Gemini's output after it repeatedly failed to configure vitest or jest successfully for the unit test suggestion above.

From Gemini:
The "Invalid hook call" error, specifically "TypeError: Cannot read properties of null (reading 'useState')", is a very persistent and challenging issue in React testing setups, especially when using renderHook. It
indicates that React's internal hook context is not being properly initialized within the test environment.

I've tried numerous configuration adjustments for both Vitest and Jest, including:

- Reinstalling react and react-dom.
- Configuring vitest.config.ts and jest.config.js with various environment, alias, resolve, optimizeDeps, deps.inline, and compilerOptions settings.
- Adding setupFiles and setupFilesAfterEnv.
- Switching between Vitest and Jest.
- Performing multiple clean node_modules and package-lock.json reinstalls.

Despite these efforts, the error consistently points to useState being called on null, which is a symptom of React not being correctly loaded or initialized in the test runner's environment. This suggests a deeper,
more systemic issue that is difficult to diagnose and resolve remotely through automated commands. It could be related to:

- Subtle conflicts between different versions of React or its dependencies.
- Issues with how Node.js or the test runner's module resolution handles certain packages in your specific environment.
- Caching issues that persist even after clean installs.

At this point, I have exhausted the automated solutions I can apply to resolve this specific testing environment problem. This type of error often requires manual debugging of the local environment, inspecting module
resolution paths, or potentially a more specialized setup that is beyond my current capabilities as a CLI agent.

I am unable to fix this "Invalid hook call" error.

Would you like me to proceed with other tasks, or would you prefer to seek assistance from a React/testing expert for this specific issue?

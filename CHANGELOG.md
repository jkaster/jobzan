# Changelog

## 2026-03-02

### Changed

- Upgraded all Node dependencies to latest versions across the monorepo.
- Removed deprecated `React.FC` pattern from `Login.tsx`, `AuthProvider.tsx`, and `AnalyticsDashboard.tsx`.
- Removed unused `React` default imports where no longer needed.
- Removed redundant `@types/react-router-dom` (React Router v7 ships its own types).
- Moved server-only dependencies (`express-session`, `passport`, `passport-github2`, `passport-google-oauth20`, `jsonwebtoken`) from root to `server/package.json`.

### Upgraded (Root)

- react, react-dom: 19.1 → 19.2
- react-router-dom: 7.6 → 7.13
- react-i18next: 15.5 → 16.5 (major)
- @mui/material, @mui/icons-material: 7.1 → 7.3
- @mui/lab: 7.0.0-beta.14 → 7.0.1-beta.22
- i18next: 25.3 → 25.8
- typescript: 5.8 → 5.9
- vite: 7.0 → 7.3
- @vitejs/plugin-react: 4.5 → 5.1 (major)
- vitest, @vitest/ui: 3.2 → 4.0 (major)
- prettier: 3.6 → 3.8
- typescript-eslint: 8.34 → 8.56
- msw: 2.10 → 2.12
- @testing-library/jest-dom: 6.6 → 6.9
- @testing-library/react: 16.3.0 → 16.3.2
- @types/react: 19.1 → 19.2
- @types/react-dom: 19.1 → 19.2

### Upgraded (Server)

- express: 5.1 → 5.2
- cors: 2.8.5 → 2.8.6
- dotenv: 17.0 → 17.3
- pg: 8.16 → 8.19
- typescript: 5.8 → 5.9
- @types/express: 5.0.3 → 5.0.6
- @types/pg: 8.15 → 8.18

## 2025-07-06

### Added

- Implemented Google and GitHub OAuth authentication using Passport.js.
- Created `users` table in `server/schema.sql`.
- Added Passport configuration in `server/src/config/passport.ts`.
- Defined authentication routes in `server/src/routes/auth.ts`.
- Integrated Passport and auth routes into `server/src/index.ts`.
- Created `src/Login.tsx` component for authentication UI.
- Created `src/AuthContext.tsx` for managing authentication state.
- Updated `src/App.tsx` and `src/main.tsx` for routing and protected routes.
- Installed `react-router-dom`, `jwt-decode`, and `@types/react-router-dom`.

### Confirmed

- Project builds successfully with no errors.
- All active tests are passing.
- All `it.todo` tests are correctly skipped.

## 2025-07-05

### Changed

- Marked `App.test.tsx` filtering and sorting tests as todo.
- Installed Prettier as a dev dependency.
- Ran Prettier to format all code.

### Fixed

- Resolved all TypeScript errors in `App.test.tsx`, `JobDetails.test.tsx`, `JobList.test.tsx`, and `useGeolocation.test.ts`.
- Ensured the build passes successfully.
- Ensured all active tests pass.

## 2025-07-03

### Fixed

- Resolved "Invalid hook call" error and other test failures by updating `JobList.test.tsx`.
- Added new tests for job description link attributes, pagination, and rows per page changes in `JobList.test.tsx`.

## 2025-07-01

### Added

- Jitter to `fetchWithRetry` function.
- `populate-db` script to root `package.json`.

### Changed

- Switched package manager from npm to pnpm.
- Added JSDoc comments to all TypeScript and TSX files.
- Renamed all interfaces to be prefixed with 'I' (e.g., `Job` to `IJob`, `Employer` to `IEmployer`).

### Fixed

- Removed redundant `{type}` annotations from JSDoc comments in all TypeScript and TSX files.
- Corrected `Employer` interface and `mockData.ts` to flatten `latitude` and `longitude` properties.
- Updated `EmployerForm.tsx` and `JobDetails.tsx` to reflect flattened `Employer` interface.
- Bugs in `populateDb.ts` (flattened employer location, corrected job description link).

## 2025-06-30

### Added

- Initial project setup with React, TypeScript, and Vite.
- Job application tracking with CRUD operations for jobs and employers.
- Material-UI (MUI) integration for UI components.
- Geolocation-based distance calculation for job locations.
- Filtering, sorting, and searching functionalities for job applications.
- Increased mock data (50 jobs, 25 employers) for better testing and demonstration.
- Pagination for job and and employer lists.
- Searchable employer dropdown in the job form for improved UX.
- Links for job descriptions and employer websites.
- Internationalization (i18n) support for UI components.
- Improved accessibility (a11y) with more descriptive aria-labels for buttons.
- Code splitting using `React.lazy` and `Suspense` for improved performance.

### Changed

- Updated React components to use modern functional component patterns (removed `React.FC`).
- Refactored geolocation and job data management into custom hooks (`useGeolocation`, `useJobData`).
- Renamed "Job Offer Link" to "Job Description Link" to clarify its purpose.

### Fixed

- Resolved numerous compilation and runtime errors encountered during development.
- Fixed CORS policy issues by correctly configuring `cors` middleware and updating frontend proxy.
- Changed backend server port to 5001 to avoid conflict with AirTunes.
- Corrected `latitude` and `longitude` data types from string to number in frontend by adding a PostgreSQL type parser.
- Fixed camelCase/snake_case mismatch for `contactName`, `contactPhone`, `contactEmail` in employer API responses.
- Fixed camelCase/snake_case mismatch for `employerId` and `jobDescriptionLink` in job API responses.
- Corrected frontend `JobList` component to use `employer.latitude` and `employer.longitude` directly.
- Ensured `jobDescriptionLink` is preserved on job edit/save.

# Changelog

## 2025-07-06

### Added

- Created `server/queries.sql` with static and dynamic pivot queries for job analytics.

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

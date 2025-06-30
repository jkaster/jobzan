# Changelog

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

### Known Issues

- **Unit Test Setup Failure:** Persistent "Invalid hook call" error prevents successful unit test setup with both Vitest and Jest. This issue requires further investigation or manual debugging.
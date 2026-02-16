# Agent Guidelines

This file contains project conventions and guidelines for all AI coding agents.

## Starting a Session

When starting a session for this project, establish context by:

- Reading all current documentation and looking for any outstanding todo items or future plans
- Reading source code and looking for missing tests and missing code documentation comments (e.g., JSDoc for TypeScript/JavaScript)
- Reading the git commit log
- Building the project and running all tests to identify any existing issues

## Project Setup & Tooling

- Always use pnpm for TypeScript and JavaScript projects.
- Every project should have a README.md to explain the project and its goals, and a CHANGELOG.md to track the changes made to it.
- CHANGELOG.md should have a different heading for every day changes are made, and those headings should be in reverse chronological order, with the most recent date at the top. However, the changes made on that day should be listed in chronological order, with the oldest first.
- Prettier, Vite, and Vitest should be installed for every TypeScript project.

## Coding Style & Conventions

- Prefer TypeScript over JavaScript.
- Interfaces should be prefixed with 'I'.
- Always provide JSDoc comments for interfaces, components, classes, and types, but do not include {type} annotation in the comments.

## Development Practices

- After refactoring code, ensure the build is still successful.
- All code created should be a11y compliant and implement i18n.

## React Specific

- The latest version of React should be used for React projects.
- Any larger React project should use chunking and lazy loading.

## Testing

- When using apostrophes in test descriptions, either quote the description with double quotes or backticks rather than trying to escape the embedded apostrophe.
- Prefer double quotes for test descriptions when apostrophes are present, and single quotes when no apostrophes are used. Only use backticks when necessary (e.g., for template literals or embedded expressions).
- Using getByText selectors without specifying roles for things like buttons is going to cause testing problems. Please make the react test element selectors as discrete as possible. If necessary to clarify, add test ids to the react elements to be tested.

## Task Completion

After completing a coding task, run:

1. `pnpm lint` — Ensure no ESLint errors
2. `pnpm prettier --check .` — Ensure formatting is consistent (fix with `pnpm prettier --write .`)
3. `pnpm vitest run` — Ensure all tests pass
4. `pnpm build` — Ensure the project builds successfully

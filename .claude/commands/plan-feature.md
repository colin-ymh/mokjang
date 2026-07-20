Plan the implementation for: $ARGUMENTS

Follow the Explore → Plan workflow before writing code.

Instructions:

1. Read `CLAUDE.md` first to understand the monorepo layout, conventions, and constraints.
2. Identify the user goal, current scope, and constraints.
3. Find the most relevant files: which workspace (`apps/app`, `apps/landing`, or a shared `packages/*`), routes (`apps/app/src/app/[locale]/...`), API routes (`apps/app/src/app/api/**/route.ts`), components (atomic design, lowercase kebab folders), redux slices (`apps/app/src/redux/reducers`), models/constants/utils packages.
4. Do not implement yet. Stay in planning mode.
5. Produce a practical implementation plan that the main session can approve or revise.

Output format:

- Request summary
- Goal
- In-scope / out-of-scope
- Affected workspace(s) and why
- Relevant files and why
- Proposed implementation steps
- Risks or open questions
- Success criteria

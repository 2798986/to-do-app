# Debugging Skill — Systematic Diagnosis and Repair

## Purpose

Resolve defects efficiently by finding their root cause rather than repeatedly changing code until an error disappears.

Use this workflow whenever the application fails to start, a feature behaves incorrectly, a test fails, or an integration breaks.

## Core principles

1. Reproduce the problem before changing code.
2. Read the complete error message.
3. Identify the smallest area that could cause the problem.
4. Form and test a specific hypothesis.
5. Fix the root cause rather than hiding the symptom.
6. Make the smallest safe change.
7. Re-test the original failure and nearby functionality.
8. Preserve a working state and use Git checkpoints.

## Step 1 — Define the failure

Record:
- What was expected?
- What actually happened?
- Which action triggers the issue?
- Does it happen every time?
- When did it first appear?
- Which feature or recent change may be related?

A useful defect description is specific.

Weak: "The app is broken."

Better: "Submitting the analysis form with an empty repository URL causes a blank page instead of showing a validation message."

## Step 2 — Reproduce the problem

Attempt to reproduce the issue using the same steps.

Capture:
- Exact user actions.
- Input data.
- Error message.
- Browser console output, if applicable.
- Backend or terminal logs.
- Relevant test failure.

If the issue cannot be reproduced, do not pretend it has been fixed. Identify what evidence is available and investigate further.

## Step 3 — Inspect before editing

Inspect the smallest relevant set of files and trace the execution path.

For a frontend issue, consider:
- Event handlers.
- Component state.
- Props and data flow.
- Rendering conditions.
- Network requests.
- API response handling.
- Browser console errors.

For a backend issue, consider:
- Route or controller.
- Input parsing.
- Validation.
- Business logic.
- Database query.
- Error handling.
- Configuration and environment variables.

For a database issue, consider:
- Connection settings.
- Schema and migrations.
- Table and column names.
- Query conditions.
- Transaction handling.
- Data types and constraints.

For a build or startup issue, consider:
- Dependencies.
- Package scripts.
- Imports.
- Configuration.
- Environment variables.
- Port conflicts.
- Runtime and framework versions.

## Step 4 — Form a hypothesis

State the most likely cause and why the evidence supports it.

Prefer one testable hypothesis at a time.

Examples:
- "The API returns a list, but the frontend treats it as an object."
- "The form submits before validation completes."
- "The database query uses the wrong column name."
- "The development server is using a missing environment variable."

Do not make several unrelated edits before determining which change addressed the issue.

## Step 5 — Apply the smallest safe fix

- Change only what is necessary.
- Preserve established architecture and working behaviour.
- Avoid broad refactoring during urgent debugging.
- Avoid adding dependencies unless genuinely needed.
- Do not suppress errors merely to make the interface appear functional.
- Do not replace real functionality with hard-coded or mocked data unless the brief permits it and the limitation is clearly understood.

If a larger change is necessary, explain why before proceeding.

## Step 6 — Verify the fix

After the change:
1. Repeat the exact steps that previously caused the problem.
2. Confirm the expected behaviour.
3. Run the relevant automated test or build.
4. Test a nearby edge case.
5. Check connected functionality for regressions.
6. Inspect logs for new errors.

A fix is not verified merely because the error message disappeared.

## Step 7 — Use Git safely

Before risky changes, inspect:

```bash
git status
git diff
```

If there is a known-good state, make sure it is committed and pushed before attempting a risky refactor, where time and examination rules permit.

After the fix:
- Inspect the diff.
- Run relevant checks.
- Commit the repair with a clear message.
- Push the milestone where appropriate.

Do not use destructive commands such as `git reset --hard`, force-push or broad file deletion without understanding the consequences and obtaining authorisation where required.

## Common debugging patterns

### Application does not start

1. Read the first meaningful error, not just the final stack trace line.
2. Check the documented start command.
3. Check whether dependencies are installed.
4. Check environment variables and configuration.
5. Check whether the required port is occupied.
6. Check recent changes to imports, scripts or entry points.

### Frontend displays blank content

1. Inspect browser console errors.
2. Check the component tree and rendering conditions.
3. Check whether expected data is undefined or null.
4. Check API request status and response shape.
5. Check route configuration.
6. Check whether a runtime exception interrupts rendering.

### API request fails

1. Inspect the request URL and method.
2. Inspect the request payload.
3. Inspect the response status and body.
4. Check backend logs.
5. Check route registration and validation.
6. Check CORS only if the evidence points to it.
7. Check database or external-service failures.

### Database operation fails

1. Confirm the database service is available.
2. Confirm the connection configuration.
3. Check schema and migrations.
4. Inspect the exact query and parameters.
5. Check data types and constraints.
6. Confirm transaction and error-handling behaviour.

### A previously working feature breaks

1. Identify the last known working commit.
2. Inspect changes since that point.
3. Reproduce the regression.
4. Identify the change that introduced it.
5. Fix the cause or safely revert the problematic change.
6. Re-test both the repaired feature and the new feature.

## Time-aware debugging

During an eight-hour examination:
- Spend a short, bounded period investigating an unclear issue.
- If stuck, ask Qoder to summarise evidence and propose the next most informative diagnostic step.
- Prioritise issues that prevent startup, violate essential requirements or break core user journeys.
- Do not spend excessive time on minor cosmetic defects while core functionality is broken.
- If a fix is too risky near the deadline, consider a simpler, reliable alternative and document the limitation.

## Debugging report

Use this format:

```text
ISSUE:
Expected behaviour:
Actual behaviour:
Steps to reproduce:

EVIDENCE:
Error/log:
Relevant files:
Recent related changes:

ROOT CAUSE:
Explanation:

FIX:
Files changed:
What changed and why:

VERIFICATION:
Reproduction test:
Automated checks:
Regression checks:

REMAINING RISKS:
Unverified behaviour:
```

## Instructions for the coding agent

- Inspect and reproduce before editing.
- Explain the likely root cause using evidence.
- Prefer minimal, reversible changes.
- Never hide an error without fixing or clearly handling its cause.
- Do not claim a fix is successful until it has been retested.
- If evidence is insufficient, say what is unknown and propose the next diagnostic step.

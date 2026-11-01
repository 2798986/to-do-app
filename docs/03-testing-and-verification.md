# Testing and Verification Skill — Feature-Level Quality Assurance

## Purpose

Verify that the application works as users experience it, not merely that code has been generated or that the project compiles.

Use this workflow throughout development, especially at feature-completion checkpoints and during the lecturer's recommended hourly application reviews.

## Core principles

1. Test against requirements and acceptance criteria.
2. Test the running application, not only source code.
3. Verify complete user journeys.
4. Test invalid inputs and realistic edge cases.
5. Check that new changes do not break existing functionality.
6. Distinguish tests that passed from checks that were not performed.
7. Keep testing proportional to risk and remaining time.

## Step 1 — Create a test basis

For each feature, identify:
- Requirement IDs.
- Expected behaviour.
- Acceptance criteria.
- Main user journey.
- Inputs and outputs.
- Dependencies.
- Likely failure conditions.

Do not invent expected behaviour that conflicts with the examination brief.

## Step 2 — Test the happy path

Test the normal successful workflow from beginning to end.

Examples:
- A user can enter valid data and submit it.
- The application processes the input correctly.
- The expected result is displayed.
- Data is saved when persistence is required.
- The user can navigate to the next relevant step.

Do not stop at testing an isolated button if the requirement describes an end-to-end workflow.

## Step 3 — Test validation and negative cases

Consider:
- Required fields left empty.
- Incorrect formats.
- Values outside permitted ranges.
- Very long input.
- Duplicate input.
- Unsupported file types, if uploads exist.
- Missing or unavailable data.
- Invalid identifiers.
- Network or service failures, where relevant.

Check that the application responds clearly and safely. It should not silently fail or display misleading success messages.

## Step 4 — Test edge cases

Choose edge cases relevant to the feature, such as:
- Empty collections.
- One-item collections.
- Large collections.
- Zero values.
- Boundary values.
- Missing optional fields.
- Repeated actions.
- Refreshing or revisiting a page.
- Data that contains special characters.
- Unexpected ordering or duplicate records.

Do not test irrelevant edge cases simply to increase the number of tests.

## Step 5 — Test persistence and data integrity

Where the application stores data, verify:
- Data remains after navigating away and returning.
- Data remains after restarting the application if persistence is required.
- Updates affect the correct record.
- Deletions behave correctly.
- Duplicate or conflicting records are handled appropriately.
- Displayed values match stored values.

Do not assume that data is persistent because it appears on screen immediately after submission.

## Step 6 — Test integration

Check that connected parts of the application work together.

Examples:
- Frontend sends the expected data to the backend.
- Backend validation errors are displayed meaningfully.
- Database results are represented correctly in the interface.
- Navigation links lead to the correct views.
- Filters and search work with the actual data.
- A feature does not depend on temporary hard-coded data unless explicitly intended.

## Step 7 — Run automated checks

Use the project's existing tools and scripts where available.

Examples:

```bash
# JavaScript projects — use scripts actually defined in package.json
npm run

# Run only if the project defines these scripts
npm test
npm run build

# Python — examples; use the project's actual test setup
python -m pytest

# Java — use the project's configured build tool
./mvnw test
```

Do not assume these commands exist. Inspect the project instructions and configuration first.

When a check fails:
1. Read the complete error.
2. Determine whether it is caused by the new change or pre-existing.
3. Reproduce the failure where possible.
4. Fix the root cause.
5. Re-run the relevant check.
6. Report any unresolved failure honestly.

## Step 8 — Regression testing

After a feature or fix, revisit important existing workflows.

At minimum:
- Confirm the application starts.
- Confirm the primary user journey still works.
- Check the area directly affected by the change.
- Check any connected feature likely to be affected.

Do not claim there are no regressions unless appropriate checks were performed.

## Step 9 — Manual application review

Use the application as a real user would.

Checklist:
- [ ] Start the application using the documented command.
- [ ] Navigate through the main workflow.
- [ ] Try a normal valid input.
- [ ] Try a missing or invalid input.
- [ ] Check the result and feedback.
- [ ] Check relevant empty/loading/error states.
- [ ] Confirm persistence if required.
- [ ] Check that navigation works.
- [ ] Look for visible layout or interaction defects.

## Feature completion report

At the end of a feature, report:

```text
FEATURE:
Requirements covered:

ACCEPTANCE CRITERIA:
- [ ] Criterion 1
- [ ] Criterion 2

AUTOMATED CHECKS:
- Command:
- Result:

MANUAL CHECKS:
- Workflow tested:
- Result:

EDGE CASES:
- Case:
- Result:

REGRESSION CHECK:
- Areas checked:
- Result:

OUTSTANDING:
- Known defects:
- Unverified behaviour:
```

## Hourly application review

Approximately once every hour, pause at a suitable point and:
1. Run the application.
2. Use the main workflow implemented so far.
3. Check the most recently completed feature.
4. Identify confusing or broken interactions.
5. Note any issues for the next implementation cycle.
6. Check Git status and push a meaningful milestone where appropriate.

The purpose is to catch misunderstandings early, not to perform a full formal test suite every hour.

## Final audit

Before submission:
- Map every requirement to evidence.
- Run the available build and test commands.
- Test the most important user journeys manually.
- Check the application from a clean start.
- Verify setup instructions.
- Record anything that remains incomplete or unverified.

## Instructions for the coding agent

- Never mark a feature complete merely because the code was written.
- Never fabricate test results.
- Never say a test passed if it was not run.
- Clearly distinguish automated tests, manual checks and code inspection.
- If the environment prevents a check, state that limitation.
- Prioritise defects that violate essential requirements or break core user journeys.

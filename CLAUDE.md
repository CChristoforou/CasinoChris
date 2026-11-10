# CasinoChris QA Pipeline - project context

This file is read automatically by Claude Code when started in this folder.

## What this project is

CasinoChris is a demo online casino (50/50 coin-flip game, play money only) built to show an
AI-assisted QA workflow in a job interview. The flow:

1. The owner sends "Test Registration" (later, from Telegram).
2. Playwright runs the registration checks against the live site.
3. Each check's Jira ticket gets a result comment (PASS or FAIL) and moves to **Needs Human Check**.
4. A plain-English report is written to Confluence, linking to the test code on GitHub.
5. Test code and results are committed and pushed to GitHub.
6. A human reviews each ticket and moves it back to To Do before the next run.

The AI never confirms a result. A human always reviews.

## Key facts

- Live site: https://casinochris.vercel.app (deploys automatically from GitHub `main`)
- Repo: https://github.com/CChristoforou/CasinoChris (branch `main`)
- Site is one file: `index.html`. All state is in browser memory, no database.
- Tests: Playwright + TypeScript in `tests/`. The owner uses Git Bash on Windows.
- `node_modules`, `playwright-report` and `test-results` are git-ignored. Never commit them.

## Jira

- Site: cchristoforou.atlassian.net, project key **CCASINO**
- Epic **CCASINO-7** "Registration" with 8 check tickets, all labelled `registration`:
  - CCASINO-8 valid details succeed
  - CCASINO-9 under-18 rejected
  - CCASINO-10 exactly 18 accepted
  - CCASINO-11 missing name rejected
  - CCASINO-12 missing email rejected
  - CCASINO-13 invalid email format rejected
  - CCASINO-14 missing date of birth rejected
  - CCASINO-15 password under 8 characters rejected
- Workflow statuses: To Do, **Needs Human Check**, Done.
  - Transition id 11 = To Do, id 21 = Needs Human Check, id 31 = Done.
  - Transition 21 is still named "In Progress" but leads to the status "Needs Human Check".
- Rules agreed with the owner:
  - Both PASS and FAIL move the ticket to Needs Human Check.
  - Add a comment with the result, date, link to the report and the GitHub commit.
  - The owner moves tickets back to To Do. Do not reset them automatically.
- Only touch project CCASINO. The owner has other Jira projects.

## Confluence

- Space key CL (space id 622595). Only touch this space. The owner has others (for example FreeChair).
- Pages:
  - Home: "CasinoChris QA Pipeline Home" (id 622688)
  - BRD: "BRD - CasinoChris Demo Site" (id 65842)
  - Test Report #1: "Test Report #1 - Playwright Suite" (id 655363)
- Reports should be plain English: what passed, what failed, why it matters, with links to the
  GitHub test file and the Jira tickets. Not raw test output.

## Test conventions

- Each test title starts with its Jira key, for example `CCASINO-9 under-18 player is rejected`.
- Registration tests are in `tests/registration.spec.ts`, tagged `@registration`.
- Run them: `npx playwright test --grep @registration --reporter=json`
- Match results to tickets by finding `CCASINO-\d+` in each test title.
- `tests/casinochris.spec.ts` is the older combined suite. Its registration tests are replaced by
  `registration.spec.ts`.

## Status

Done: site live, GitHub, Confluence reset, Jira registration tickets created, registration tests written.

Not done:
- Confirm the 8 registration tests pass against the live site
- Write results back to Jira and Confluence after a run
- Tickets and tests for Login, Deposit, Coin Flip and Responsible Gambling
- Missing coverage: deposit limit enforcement, removing limits and self-exclusion, 50/50 odds check
- Telegram bot trigger
- Instructions page in Confluence that tells Claude how to run and report

Known site weakness (not a bug to fix now): email validation only checks for an "@".

## Working style with the owner

- Give one step at a time and wait for confirmation. Explain in plain, simple language.
- Never invent results. If something cannot be checked, say so.
- Ask before deleting or overwriting anything.

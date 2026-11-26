# Project History

Project: Join Shakha / Sewa Setu

Tracking started: **2026-09-11**. Dates use **America/New_York**.

This file records project features, bug fixes (what was requested and the outcome), and other changes by date and category. The Project History Recorder responsibility is defined in [AGENTS.md](AGENTS.md). Agents following those instructions update this file during project work; it is not a background monitor for manual edits.

## Project features — current baseline

The following capabilities were identified in source on 2026-09-11. This inventory does not establish their original implementation dates or confirm live deployment or end-to-end operation.

| Category | Feature | Source evidence |
| --- | --- | --- |
| Public website | Responsive landing page, Shakha introduction, benefits, activities, eligibility, FAQ, and contact information | `src/App.tsx`, `src/index.css` |
| Discovery | Shakha/location/program discovery with search and state selection | `src/components/LeaderBeeBranchPicker.tsx`, `src/data/shakhaDirectory.ts` |
| Shakha pages | Individual Shakha pages with address, schedule, contacts, map and sharing links | `src/App.tsx` (`ShakhaSharePage`) |
| Registration | Interest registration form and Supabase submission | `src/App.tsx` (`RegisterForm`), `src/adminApi.ts` (`submitInterestedPerson`) |
| Programs | Program directory and public pages, including Leader-BEE and Krishna My Sharthi information | `src/data/programDirectory.ts`, `src/components/HomePrograms.tsx`, `src/components/ProgramPublicPage.tsx` |
| Leader-BEE | Program overview, branch selection, local program pages, and family track comparison | `src/components/LeaderBeeProgramPage.tsx`, `src/components/ShakhaLeaderBeePage.tsx`, `src/components/ShakhaTracksComparison.tsx` |
| Leader-BEE registration | Shared parent/child form, grades K–12, location, notes, attendance consent, phone verification, and branch-specific registration | `src/components/LeaderBeeRegistration.tsx`, `src/leaderBeeApi.ts` |
| Payments | Central published checkout endpoint for all branches, paid K–8/free grades 9–12, payment status retrieval, and webhook handling | `src/leaderBeeApi.ts`, `supabase/functions/create-leader-bee-checkout/index.ts`, `supabase/functions/leader-bee-verified-checkout/index.ts`, `supabase/functions/leader-bee-stripe-webhook/index.ts` |
| Curriculum | Registration/verification-gated Leader-BEE curriculum access | `src/components/LeaderBeeCurriculum.tsx`, `src/leaderBeeApi.ts` |
| Sharing | Program sharing links and Leader-BEE share kit | `src/components/ProgramShareLink.tsx`, `src/components/LeaderBeeShareKit.tsx` |
| Administration | Admin sign-in, OTP helpers, access check, interest listing, and Shakha create/update/delete APIs | `src/AdminPanel.tsx`, `src/adminApi.ts` |
| Administration | Leader-BEE registration search, payment-status filter, and CSV export | `src/LeaderBeeAdmin.tsx` |
| Data operations | Shakha scraping, ingestion, local overrides, and database seeding | `src/scraper.ts`, `src/ingest.ts`, `src/shakhaOverrides.ts`, `scripts/seed-shakhas-to-supabase.mjs` |
| Publishing | Generated Shakha share pages, metadata handling, and deployment script | `scripts/generate-shakha-share-pages.mjs`, `src/App.tsx`, `scripts/deploy-join.sh` |
| Project maintenance | Dated and categorized history with request, change, outcome, and validation records | `Project_History.md`, `AGENTS.md` |

## Category index

| Category | Change records |
| --- | --- |
| Documentation / Agent workflow | [PH-20260911-001](#ph-20260911-001--project-history-and-recorder) |
| Configuration / Dependencies | [PH-20261126-001](#ph-20261126-001--production-domain-routing) |
| Testing | [PH-20261126-001](#ph-20261126-001--production-domain-routing) |
| Deployment | [PH-20261126-001](#ph-20261126-001--production-domain-routing) |
| Bug fix | No fixes recorded since tracking began |
| Feature / UI / UX / Data / Payments | [PH-20260911-002](#ph-20260911-002--shared-leader-bee-registration) |
| UI / UX | [PH-20260911-002](#ph-20260911-002--shared-leader-bee-registration) |
| Data / Database | [PH-20260911-002](#ph-20260911-002--shared-leader-bee-registration) |
| Configuration / Dependencies | No changes recorded yet |
| Testing | [PH-20260911-002](#ph-20260911-002--shared-leader-bee-registration) |
| Deployment | No deployments recorded yet |
| Removal / Reversion | No changes recorded yet |

## Dated change history

### 2026-11-26

#### PH-20261126-001 — Production domain routing

- **Category:** Configuration / Testing / Deployment
- **Status:** Partially completed
- **What the user asked:** Update the routing after moving the main project off `ShakhaSewasetu.com` and onto `join.shakhasewasetu.com`, then fetch, build, and push on Git. The request also mentioned `Joinsewa.com` as the main project.
- **Previous behavior / problem:** Production Vite assets used the `/join/` base path, and generated share pages defaulted to `https://shakhasewasetu.com/join`.
- **Changes made:** Changed the production Vite base to `/` and the share-page generator's default canonical/share host to `https://join.shakhasewasetu.com`. Preserved existing Vercel `/join` compatibility rewrites.
- **Outcome:** Local routing configuration updated and production build completed. Fetch and push could not be completed because `.git` is read-only in this environment. No commit was created. The working tree contained extensive pre-existing unrelated changes, so no changes were staged or committed.
- **Affected files:** `vite.config.ts`, `scripts/generate-shakha-share-pages.mjs`, generated share pages under `public/` and `dist/`, `Project_History.md`.
- **Validation:** `pnpm run build` passed; prebuild generated 254 share pages. `git fetch origin` failed with `cannot open '.git/FETCH_HEAD': Operation not permitted`. Live-domain inspection through the available web tool was inconclusive. No deployment verification was possible.
- **Remaining work / limitations:** Confirm whether `joinsewa.com` should be the canonical production host instead of `join.shakhasewasetu.com`; configure the Vercel project/domain and redirect policy accordingly; grant Git metadata write access to fetch, commit, and push. Existing legacy generated HTML files under `public/` were not fully re-canonicalized because their generator output is entangled with unrelated pre-existing modifications.

### 2026-09-11

#### PH-20260911-001 — Project history and recorder

- **Category:** Documentation / Agent workflow
- **Status:** Completed
- **What the user asked:** Generate a project features list and bug-fix history, including what was asked to be fixed and the outcome. Record every future change by date and category in `Project_History.md`, with an agent responsible for recording it.
- **Previous behavior / problem:** The root project instructions did not require maintaining a project history, and the requested root history file was absent.
- **Changes made:** Created this feature baseline, category index, dated history, and reusable entry template. Added the Project History Recorder responsibility to the root `AGENTS.md` for future agents working throughout the repository.
- **Outcome:** The project now has a central history file and persistent instructions to record requests, fixes, outcomes, affected files, validation, and remaining work with each change.
- **Affected files:** `AGENTS.md`, `Project_History.md`.
- **Validation:** Inspected application components, API exports, package scripts, existing agent instructions, and working-tree status to establish the baseline. Reviewed the documentation changes and required record fields. Application tests were not run because this task changes documentation only.
- **Remaining work / limitations:** Earlier requests and verified fix outcomes are not available in this conversation and have not been invented. Pre-existing working-tree changes are not attributed to this task. Future recording depends on agents following `AGENTS.md`; manual edits outside agent sessions are not automatically detected.

#### PH-20260911-002 — Shared Leader-BEE registration

- **Category:** Feature / UI / UX / Data / Payments
- **Status:** Completed (local implementation; not deployed)
- **What the user asked:** Reuse the current live Leader-BEE registration page/form and messages for every Shakha, changing local Shakha details only. Use the payment link from the live page centrally.
- **Previous behavior / problem:** Branch pages used a smaller K–8-only form and a separate checkout endpoint; the published form included family details and free grades 9–12 registration.
- **Changes made:** Reused the live form’s fields and registration/confirmation messages in the shared branch component, with parent/children cards, local event details, consent, notes, and reset. Added a migration to store family details and charge only K–8 participants. Routed verified payments through the live page’s central checkout endpoint while retaining ownership checks and legacy handling. Updated branch share messages, admin display/CSV, deployment notes, and regression tests.
- **Outcome:** Every branch page uses the same family form and central payment endpoint, retaining its Shakha identity. Paid registrations open checkout after saving and support retry; free registrations display confirmation. Local checks passed. Production has not been changed.
- **Affected files:** `src/components/LeaderBeeRegistration.tsx`, `src/components/LeaderBeeShareKit.tsx`, `src/leaderBeeApi.ts`, `supabase/functions/create-leader-bee-checkout/index.ts`, `supabase/migrations/20260911120000_leader_bee_shared_registration.sql`, `src/LeaderBeeAdmin.tsx`, `src/adminApi.ts`, `src/shakhaTypes.ts`, `tests/leader-bee-db.test.mjs`, `tests/leader-bee-browser.mjs`, `tests/leader-bee-payments.test.ts`, `docs/leader-bee-engine.md`, `Project_History.md`.
- **Validation:** Retrieved the live HTML and public payment configuration. Live checkout uses `create-leader-bee-checkout`, which generates Stripe session URLs; it is not a fixed Stripe payment link. TypeScript and production build passed. All 13 database tests and 5 Deno payment/webhook tests passed. Mocked Chrome checks passed for mobile layout, discovery, samples, shared fields, mixed grades, OTP, branch binding, curriculum, and payment handoff. The initial Node invocation of the Deno tests failed due to the runtime mismatch; rerunning with Deno passed. Browser tests required sandbox escalation to bind the local port. No live external writes were performed.
- **Remaining work / limitations:** Database migration, central checkout function deployment, and frontend deployment are required for production, in that order. Existing phone verification is retained. No real registrations, notification messages, or payments sent during development.

## New entry template

Place each record under its work date in the dated history and add it to the category index. Use one or more applicable categories. For bug fixes, always preserve the requested fix and the observed outcome separately.

```markdown
### YYYY-MM-DD

#### PH-YYYYMMDD-NNN — Short change title

- **Category:** Bug fix / Feature / UI / UX / Data / Database / Configuration / Dependencies / Documentation / Agent workflow / Testing / Deployment / Removal / Reversion
- **Status:** In progress / Completed / Partially completed / Blocked / Reverted
- **What the user asked:** Faithful request summary, with sensitive details removed; label agent-initiated maintenance explicitly.
- **Previous behavior / problem:** What happened before, or the missing capability.
- **Root cause (bug fixes):** Confirmed cause, or Unknown.
- **Changes made:** Concrete implementation or documentation changes.
- **Outcome:** Actual result; distinguish implementation, verification, and deployment.
- **Affected files:** Relevant repository-relative paths.
- **Validation:** Checks performed and results, or checks not run and why.
- **Remaining work / limitations:** Outstanding items, blockers, or None.
```

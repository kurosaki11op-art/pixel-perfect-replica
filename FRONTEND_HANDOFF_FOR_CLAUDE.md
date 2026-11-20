# Believer Gym frontend handoff

## Scope and identity

Believer Gym is a **unisex gym**; this explicit correction supersedes the Ladies & Kids wording in the uploaded reference brief. The interface retains the grey/red/white palette and Inter typography. No production database, authentication provider, biometric service, payment gateway, or automation service is connected. Nothing has been published.

## Reference repository

The public GitHub API returned HTTP 404 for `kakashimightguy5-netizen/bzgymadmin-feature-idempotency-membership-writes`. No source was accessible or inspected. No repository or production database was modified. Existing endpoint compatibility, prices, durations, renewal calculations, and idempotency contracts are **unverified**.

## Implemented frontend

- Shared responsive admin/staff workspace, collapsible navigation, mobile drawer, search, profile dropdown, logout.
- Separate admin/staff login form experiences and explicit development workspace entry. Recovery, reset, expired-session, disabled-account, unauthorized screens.
- Admin operational dashboard; staff reception dashboard without administrative analytics.
- Members: search by name/phone/ID, status filter, sorting, pagination, column visibility, CSV sample export, registration, prefilled editing, emergency contact, selected dates, local photo preview, profile tabs and sample histories. Admin-only deletion acknowledgement; no destructive operation.
- Membership create/renew/edit previews; plans/offers admin management and staff view-only presentation.
- Attendance overview and date filtering, historical checkout timestamps, no manual checkout action.
- Payment form validation, associations, receipt preview; income and expense sample tables and charts.
- Appointment list/day/week/month calendar, edit/create previews and trainer-time conflict indication.
- Trainer-only staff category, account enable/disable previews, staff detail view.
- Analytics/report range and period controls, CSV export, unavailable renewal metrics state.
- Audit sample records, automation configuration and unconnected execution history, gym/account/notification/membership/preference settings.

## Architecture

- TanStack Start/Router remains the required framework (not React Router).
- `src/lib/gym/domain.ts`: Role, Permission, Member, entity records, preview responses, API and authentication interfaces.
- `src/lib/gym/api.ts`: isolated DevelopmentApiAdapter and DevelopmentAuthAdapter; endpoint configuration slots are null intentionally, **not claims of existing endpoints**.
- `src/lib/gym/demo-data.ts`: synthetic identities and illustrative data. `example.test` addresses are not real staff accounts.
- `src/lib/gym/permissions.ts`: central permission matrix and route access definitions.
- `src/lib/gym/dates.ts`: strict calendar date validation and timezone-independent display. Dates stay YYYY-MM-DD; never substitute today for selected input.
- `src/lib/gym/validation.ts`: Zod member, membership, payment, and login validation.
- `src/components/gym/workspace-provider.tsx`: development session and in-memory member edits. Reset on reload/logout; no credential/token persistence. Other module previews reset when leaving their page.
- Existing dashboard sample modules remain browser-only. Replace their data bindings along with the adapters during integration.

## Development authentication, not security

The initial workspace auto-opens an explicitly identified demo admin session for review. Admin/staff entry buttons change only this development context. The UI does not process real sign-in, reset emails, password updates, real accounts, or tokens. The login form checks validation then reports the provider is unavailable. Frontend restrictions are only a preview and must not be treated as authorization.

The user confirmed future **profile storage is required**: prepare an authenticated profile associated with the provider identity, display name/avatar/preferences and verified role. No profile storage has been connected now. Server-verified roles must drive production routing and every write.

## Permission matrix

| Capability                                      | Admin | Staff |
| ----------------------------------------------- | ----- | ----- |
| Read/create/edit members                        | Yes   | Yes   |
| Delete members                                  | Yes   | No    |
| Create/renew memberships                        | Yes   | Yes   |
| View plans                                      | Yes   | Yes   |
| Manage plans/offers                             | Yes   | No    |
| Operational attendance and appointments         | Yes   | Yes   |
| Register payments                               | Yes   | Yes   |
| Income/expenses and sensitive analytics/reports | Yes   | No    |
| Manage staff, audit, settings, automation       | Yes   | No    |

## Required integration contracts (proposed capabilities, not verified URLs)

- Authentication: verified identity/session restoration, role claims, disable state, logout, recovery request and verified reset.
- Profiles: self profile read/update, authorized staff provisioning, role verification.
- Members: paginated query with filters, create/edit/detail, admin delete with consequences, histories and optional media upload. Member contract includes `id,name,phone,email,category,joined,emergencyName,emergencyPhone,plan,start,end,status,notes`.
- Memberships: list/detail/create/renew, selected start/end dates, verified duration/expiry/payment policies, conflict responses and server idempotency keys.
- Plans/offers: verified prices/durations/discount terms and authorized activation.
- Attendance: biometric reads, history, automatic two-hour checkout, membership-expiry restrictions, warning indicators. No client-managed checkout.
- Finance: payment registration with member/membership/date/amount/method, immutable receipt generation, reconciled status, income/expense queries. Current previews are not successful financial transactions.
- Appointments: member/trainer/date/time/status, conflict checking, calendar queries.
- Analytics/reports: verified aggregated endpoints with date range; renewal metrics and retention cannot be inferred from sample rows.
- Automation: configuration authorization, execution history and errors; no browser execution.
- Audit: backend-written actor/action/entity/timestamp/details events.
- Errors: validation, forbidden, disabled, expired-session, conflict, network/service failure; normalize and expose useful field feedback without secrets.

## Remaining limitations

- Production security, profile storage, identity verification, token restoration, email delivery, reset and password changes are not implemented.
- Sample data is illustrative and not shared across all module views; member edits are in-memory, other module changes reset on navigation. No persistence promised.
- Demo invoice exports are CSV; receipt preview is not a legally valid receipt or proof of payment.
- No real membership pricing or automatic duration calculation; existing source must be inspected before adding those policies.
- Historical renewal conversion/retention, actual staff activity, automation execution, and biometric integration remain unavailable.
- Browser testing covers primary workflows and responsive layouts, not production authentication or exhaustive accessibility/security certification.

## Testing and audit

See `src/test/gym-workspace.test.tsx` for permission rules, direct URL access mapping, dates, validation, adapters, table pagination/search/empty states, and retry handling. `src/test/gym-data.test.ts` covers expiry window and dashboard filtering; routing tests confirm the first page resolves.

### Executed checks

- Vitest: **52 tests passed across 3 files** (permission matrix, direct access maps, June dates, registration/edit validation, renewal dates, login/payment validation, preview adapters, table pagination/search/empty states, and API retry).
- Scoped ESLint: **0 errors, 3 development fast-refresh warnings** in shared exports/provider.
- Harness build/typecheck: latest **build OK**; no manual build or typecheck was run because the managed preview performs these checks.
- Playwright: all **27 public/content paths** opened with app-specific page titles; desktop 1280×1800 and mobile 390×844 produced no settled horizontal document overflow.
- End-to-end: demo member registration and editing with June 1 / June 30 inputs, profile readback, membership creation/readback, admin logout, staff entry, staff direct settings URL blocked, hidden staff deletion controls.
- Additional flows: payment local preview plus receipt, trainer appointment conflict, plan disabling in details, analytic empty date range, calendar display, mobile navigation.
- Browser checks reported **no runtime page errors**.
- Production sign-in, API compatibility, external services, security and real persistence cannot be verified without the existing backend; no claim of production readiness is made.

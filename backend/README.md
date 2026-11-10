# College Sathi — API (`backend/`)

The backend skeleton that matches the architecture map: `core/` (tenancy, auth, iam, audit, files,
notifications), 19 domain modules, a Socket.IO realtime gateway and the BullMQ worker layer.

It runs with **no external services** by default (in-memory demo mode) so you can start it in one command,
and switches to Postgres + Redis when `DATABASE_URL` / `REDIS_URL` are set.

```bash
cd backend
npm install
cp .env.example .env      # optional
npm run start:dev         # http://localhost:4000/api
```

With Postgres and Redis:

```bash
docker compose up -d
npm run db:apply          # db/schema.sql — tables + RLS policies + seed rows
```

## Layout

```
src/
  main.ts                  bootstrap, global /api prefix, tenancy middleware
  db/                      DbService — pg pool + set_config() RLS session vars per transaction
  core/
    tenancy/               host / x-campus resolution → group + campus (RLS scope)
    auth/                  password, OTP, SSO (OIDC), 2FA, refresh rotation, device binding
    iam/                   @Roles / @Scope decorators + permission matrix guard
    audit/                 interceptor writing who/what/when/before/after → /api/audit
    files/                 presigned upload, virus-scan hook, signed download
    notifications/         templates, channels, preferences, outbox
  modules/                 campus, structure, admissions, students, faculty, timetable, attendance,
                           lms, exams, fees, payments, library, hostel, transport, parents,
                           communication, certificates, helpdesk, reports
  realtime/                Socket.IO gateway — attendance:session:{id}, bus:{routeId},
                           notify:user:{id}, timetable:job:{id}
  workers/                 JobQueue + TimetableQueue; PROCESSORS registry mirrors the BullMQ workers
db/schema.sql              core tables, RLS policies, seed group + campuses
```

## Endpoint map (representative)

| Module | Endpoints |
| --- | --- |
| auth | `POST /api/auth/login`, `/otp`, `/otp/verify`, `/sso`, `/2fa`, `/refresh`, `/me` |
| campus | `GET /api/campus`, `PATCH /api/campus/:id` |
| structure | `GET /api/structure?kind=departments\|programs\|sections\|subjects` |
| admissions | `GET/POST /api/admissions/applications`, `PATCH /:id`, `POST /:id/verify`, `/offer`, `GET /merit-list` |
| students | `GET /api/students`, `/students/:id`, `POST /:id/promote`, `GET /:id/id-card` |
| faculty | `GET /api/faculty`, `POST /:id/leave`, `GET /:id/payslips` |
| timetable | `POST /api/timetable/generate` (async job), `GET /api/timetable`, `POST /publish`, `/substitutions`, `GET /:section/ics` |
| attendance | `POST /api/attendance/sessions`, `/:id/scan`, `/:id/close`, `GET /shortage` |
| lms | `GET /api/lms/courses`, `POST /materials`, `/assignments/:id/submissions`, `/quizzes/:id/attempts` |
| exams | `GET /api/exams/schedule`, `POST /hall-tickets`, `/marks`, `/marks/moderate`, `/revaluation`, `GET /results/:roll` |
| fees | `GET /api/fees/ledger`, `POST /invoices`, `/concessions`, `/fines`, `GET /refunds` |
| payments | `POST /api/payments/orders`, `/webhook` (signature verified), `GET /reconciliation` |
| library | `GET /api/library/catalogue`, `POST /loans`, `/loans/:id/return`, `/reservations` |
| hostel | `GET /api/hostel/blocks`, `POST /applications`, `/outpass`, `/gate-log`, `/complaints` |
| transport | `GET /api/transport/routes/:id`, `POST /gps`, `/assignments` |
| parents | `GET /api/parents/wards`, `POST /outpass/:id/decision`, `GET /ptm-slots`, `POST /ptm-bookings`, `/messages` |
| communication | `POST /api/communication/announcements`, `/circulars`, `GET /threads` |
| certificates | `POST /api/certificates/issue`, `GET /verify/:id`, `POST /:id/digilocker` |
| helpdesk | `POST /api/helpdesk/tickets`, `PATCH /tickets/:id`, `GET /sla` |
| reports | `GET /api/reports/dashboard`, `POST /exports`, `GET /saved` |

## Realtime channels

`attendance:session:{id}` (live present/flagged counts + rotating QR token) · `bus:{routeId}` (GPS + ETA) ·
`notify:user:{id}` (in-app notifications) · `timetable:job:{id}` (solver progress).

## Workers

`timetable.solve`, `pdf.render`, `notify.send`, `import.process`, `fees.reminder`, `fees.late-fine`,
`payments.reconcile`, `reports.build`, `attendance.shortage-scan`, `gps.ingest` — see
`src/workers/processors.ts`. Without Redis they execute inline.

## Demo credentials

Password: any 4+ characters. OTP / 2FA code: `482913` (`DEMO_OTP`).
Roles seeded: student, parent, faculty, hod, admin.

## Not production-ready yet

Tokens are demo blobs (swap for JWT with rotating refresh + device binding), OTP is fixed, files are
presigned against a placeholder bucket, and the domain services return fixtures instead of queries.
The schema, RLS policies, guards, audit trail and queue wiring are real and ready to fill in.

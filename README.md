# কলেজ সাথী · College Sathi

A complete, working demo of a multi-campus college website: public marketing pages, an SEO-friendly programme
catalogue, a seven-step admission wizard with autosave, fee receipts, hall tickets, offer letters, a student
dashboard and a staff console.

**Everything is demo.** There is no database, no payment gateway, no SMS or email provider. All data lives in
server memory (`lib/store.ts`) and resets when the server restarts.

## Stack

- Next.js 14 (App Router) · React 18 · TypeScript
- Tailwind CSS 3 with a small design-token layer in `app/globals.css`
- Fraunces (display) + Plus Jakarta Sans + Hind Siliguri (Bengali) loaded from Google Fonts
- Route handlers under `app/api/*` act as the "backend" — mock JSON in, mock JSON out

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## What is inside

### Public site (server rendered, SEO metadata per page)

| Route | What it does |
| --- | --- |
| `/` | Hero, live notice ticker, campus switcher, featured programmes, admission journey, self-service cards |
| `/programs` | Filter by campus / level / department / mode, sort by name, fees or duration |
| `/programs/[slug]` | Syllabus by semester, eligibility, fee break-up, seats, FAQs, apply CTA |
| `/campuses` · `/campuses/[slug]` | Facilities, gallery, map link, contacts, programme table |
| `/notices` | Search, category filter, pagination, expandable body + PDF attachment |
| `/events` | Calendar view / list view toggle, campus filter |
| `/results/lookup` | Roll number + DOB + generated security code → marksheet with paper-wise grades |
| `/verify` · `/verify/[certificateId]` | Public certificate verification; valid, revoked and not-found states |
| `/contact` | Enquiry form that writes a lead into the demo CRM (visible in the admin panel) |

### Admission portal

| Route | What it does |
| --- | --- |
| `/apply` | Mobile/email OTP registration (demo OTP shown on screen) + list of demo applications |
| `/apply/[id]` | Seven-step wizard — preferences (up to 3), personal, guardian, academics, documents, review & declaration, fee payment. Autosaves to the API 700 ms after you stop typing |
| `/apply/[id]/status` | Timeline (submitted → verified → merit → offered → enrolled), hall ticket, offer, activity log |
| `/apply/[id]/receipt` | Printable fee receipt (print to PDF) |
| `/apply/[id]/hall-ticket` | Printable entrance test admit card |
| `/apply/[id]/offer` | Offer letter with accept + admission fee actions |

### Student & staff

| Route | What it does |
| --- | --- |
| `/student` | Attendance, CGPA, credits, timetable, latest result, fees, quick actions |
| `/admin` | KPIs, application table with advance/reject, seat position bars, CRM enquiries |

## Demo credentials

| Thing | Value |
| --- | --- |
| OTP for any mobile/email | `482913` |
| Result lookup | roll `CS2201` + DOB `14/05/2003` (or `BCA2304` + `02/09/2004`) |
| Certificate verify | `CS-CERT-2024-001` (valid), `CS-CERT-2025-047` (valid), `CS-CERT-2023-119` (revoked) |
| Seeded applications | `CS-APP-1042` (verified), `CS-APP-1078` (merit), `CS-APP-1103` (offer issued), `CS-APP-1150` (draft) |

## API surface

```
GET    /api/tenant                      tenant resolved from subdomain / cookie
GET    /api/programs?campus&level&mode
GET    /api/notices?category&q
GET    /api/events?campus
POST   /api/results                     { rollNo, dob }
POST   /api/contact                     enquiry → CRM lead
POST   /api/auth/otp                    { contact } → demo OTP
POST   /api/auth/verify                 { contact, otp } → creates a draft application
GET    /api/applications                staff list
POST   /api/applications                create draft
GET    /api/applications/[id]
PATCH  /api/applications/[id]           autosave (step, preferences, personal, …)
POST   /api/applications/[id]/payment   { kind: "application" | "admission" } → receipt
POST   /api/applications/[id]/status    { action: "advance" | "reject" | "accept-offer" }
POST   /api/documents                   multipart upload — PDF/JPG/PNG, max 2 MB
GET    /api/admin/applications
GET    /api/students/me
```

## Tenant resolution

`lib/tenant.ts` reads the `Host` header. `<campus>.collegesathi.edu.in` (or any subdomain matching a campus slug)
selects that campus; otherwise the `cs_campus` cookie set by the header switcher wins; otherwise Main Campus.
On localhost the switcher is the way to change campus.

## Before production

- Replace `lib/store.ts` with a real database (Prisma/Postgres) and add sessions + RBAC.
- Wire a real OTP/payment provider; the payment route must become an idempotent webhook.
- Persist uploads to object storage with virus scanning and signed URLs.
- Add rate limiting, audit logging and CSP headers.
- Render the receipt / hall ticket / offer letter server-side to real PDFs.

Built as a demo for the `college-sathi` repository.

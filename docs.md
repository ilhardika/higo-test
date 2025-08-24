# Project Overview

Stack & constraints:

- **Backend**: Node.js (Express.js), **MongoDB (Atlas)**
- **Frontend**: React (Next.js + Tailwind)
- **Docs**: Swagger (or Postman collection)
- **Non‑functional**: API JSON responses must return **< 30s**; dataset size \~ **1,000,999 rows** (use pagination + indexing + aggregation)
- **Deliverables**: Hosted FE + BE, live API docs, repo with README + Postman/Swagger

---

# Repository / Folder Structure (monorepo)

```
project-root/
├─ backend/
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ server.ts
│  │  ├─ config/
│  │  │  ├─ env.ts
│  │  │  └─ swagger.ts
│  │  ├─ db/
│  │  │  ├─ connection.ts
│  │  │  └─ index-setup.ts
│  │  ├─ models/
│  │  │  └─ Record.model.ts
│  │  ├─ controllers/
│  │  │  ├─ records.controller.ts
│  │  │  └─ stats.controller.ts
│  │  ├─ routes/
│  │  │  ├─ index.ts
│  │  │  ├─ records.routes.ts
│  │  │  └─ stats.routes.ts
│  │  ├─ middleware/
│  │  │  ├─ errorHandler.ts
│  │  │  ├─ requestLogger.ts
│  │  │  └─ rateLimit.ts
│  │  ├─ utils/
│  │  │  ├─ pagination.ts
│  │  │  ├─ http.ts
│  │  │  └─ validators.ts
│  │  ├─ docs/
│  │  │  ├─ openapi.json (generated) or openapi.yaml
│  │  │  └─ postman_collection.json
│  │  └─ scripts/
│  │     ├─ import-csv.ts  (streaming importer for big CSV)
│  │     └─ seed-small.ts  (uses 20-row sample for local dev)
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ .env.example
│  └─ Dockerfile
│
├─ frontend/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ stats/page.tsx
│  │  └─ api/ (client helpers, not Next route handlers)
│  ├─ components/
│  │  ├─ DataTable.tsx
│  │  ├─ GenderChart.tsx
│  │  ├─ Pagination.tsx
│  │  └─ Header.tsx
│  ├─ lib/
│  │  ├─ api.ts
│  │  └─ types.ts
│  ├─ styles/globals.css
│  ├─ public/
│  ├─ package.json
│  ├─ next.config.mjs
│  ├─ tailwind.config.ts
│  └─ postcss.config.js
│
├─ docs/
│  ├─ README.md
│  ├─ DEPLOYMENT.md
│  └─ API_GUIDE.md
│
├─ .env.example (root aggregator pointing to service .envs)
├─ package.json (workspace scripts, concurrently)
└─ turbo.json (optional, if using Turborepo)
```

> Catatan: Jika kamu ingin split repo, cukup ambil `backend/` dan `frontend/` sebagai dua repo terpisah. Struktur di atas tetap relevan.

---

# API Design (ringkas)

**Base URL**: `/api/v1`

1. **List records (paginated + filter + sort)**

- `GET /records?limit=50&page=1&gender=Male&sort=-createdAt&q=keyword`
- Query params: `page` (1-based), `limit` (default 25, max 100), `gender`, `q` (optional text search), `sort` (e.g., `-createdAt`)
- Response: `{ data: [...], page, limit, total, totalPages }`

2. **Gender stats (for charts)**

- `GET /stats/gender?from=2024-01-01&to=2025-08-24`
- Response: `{ buckets: [{ gender: "Male", count: 123 }, { gender: "Female", count: 456 }, { gender: "Other", count: 7 }] }`

3. **Health check**

- `GET /health` → `{ status: "ok", uptime, version }`

4. **SSE (opsional, untuk “real-time”)**

- `GET /stats/gender/stream` → Server-Sent Events yang push agregasi berkala.

> SLA <30s: Semua endpoint di atas wajib gunakan pagination + index; agregasi menggunakan pipeline + index match.

---

# Database Schema (contoh generik)

Karena kolom dataset bisa beragam, gunakan skema generik dengan field penting untuk visualisasi gender & filter dasar:

```ts
// Record.model.ts (Mongoose)
{
  externalId: { type: String, index: true }, // jika ada ID dari source
  name: String,                               // contoh
  gender: { type: String, index: true, enum: ["Male","Female","Other","Unknown"] },
  age: Number,
  email: { type: String, index: true },
  country: { type: String, index: true },
  createdAt: { type: Date, index: true },
  updatedAt: { type: Date, index: true },
  // fields lain sesuai dataset
}
```

**Indexing minimal** (buat setelah import massal selesai):

- `gender_1`
- `createdAt_1`
- (opsional) `country_1`, `email_1`, `externalId_1`
- (opsional) `text index` pada beberapa field untuk pencarian `q`

---

# Step‑by‑Step Delivery Plan

## 0) Prasyarat

- Node.js LTS, pnpm/npm, Git
- Akun **MongoDB Atlas**, **Vercel** (FE), **Render/Railway/Fly** (BE)

## 1) Inisialisasi Monorepo

```bash
mkdir higo-assessment && cd higo-assessment
mkdir backend frontend docs
# root scripts
npm init -y
npm i -D concurrently
```

Tambahkan ke `project-root/package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:be": "npm --workspace backend run dev",
    "dev:fe": "npm --workspace frontend run dev"
  },
  "workspaces": ["backend", "frontend"]
}
```

## 2) Backend – Setup

```bash
cd backend
npm init -y
npm i express mongoose cors helmet morgan compression dotenv zod swagger-ui-express swagger-jsdoc pino pino-pretty
npm i -D typescript ts-node ts-node-dev @types/express @types/cors @types/morgan @types/node
npx tsc --init
```

- Buat `src/app.ts`, `src/server.ts` dan struktur folder lainnya.
- Implementasi: CORS, Helmet, Compression, JSON parser, Request logging (pino), Error handler.
- `env.ts` validasi ENV (Zod): `MONGODB_URI`, `PORT`, `NODE_ENV`, `ALLOWED_ORIGINS`.

### Endpoint Core

- `GET /api/v1/records` → controller with pagination + filter by gender/country/q
- `GET /api/v1/stats/gender` → aggregation `$match` (filter optional by date) + `$group` + `$sort`
- `GET /health`
- `swagger.ts` → swagger-jsdoc + swagger-ui-express di `/docs`

### Performance (<30s)

- Pagination default 25, max 100
- Pastikan query memiliki filter `$match` yang menggunakan index jika ada filter
- Hanya select field yang diperlukan (projection)
- Batasi sort ke index (mis. `createdAt`)

## 3) Import Data (1,000,999 rows)

**Opsi A – mongoimport (paling cepat):**

```bash
mongoimport \
  --uri "<MONGODB_URI>" \
  --db higo \
  --collection records \
  --type csv --headerline \
  --file ./dataset.csv \
  --numInsertionWorkers 8
```

- Setelah import **selesai**, buat index:

```js
// index-setup.ts (sekali jalan)
db.records.createIndex({ gender: 1 });
db.records.createIndex({ createdAt: 1 });
```

**Opsi B – Node stream importer (jika butuh transform/cleaning):**

- `scripts/import-csv.ts` membaca CSV streaming (mis. `csv-parser`), batch `bulkWrite` (size 1k), throttle, tangani parsing tanggal, normalisasi gender.
- Jalankan: `ts-node scripts/import-csv.ts ./dataset.csv`

**Dev cepat (20 rows):**

- `scripts/seed-small.ts` untuk local sanity check.

## 4) Swagger / Postman

- Swagger UI di `/docs` (public) → cantumkan contoh request/response, query params, schema model.
- Alternatif/pendamping: export **Postman collection** ke `backend/src/docs/postman_collection.json`.

## 5) Frontend – Setup Next.js + Tailwind

```bash
cd ../frontend
npm init -y
npx create-next-app@latest . --ts --eslint
# saat prompt: App Router (Yes), Tailwind (Yes)
npm i @tanstack/react-query @tanstack/react-table recharts
```

### Pages & Components

- `/app/page.tsx` → dashboard ringkas (gender chart + link ke table)
- `/app/stats/page.tsx` → halaman statistik lanjutan (opsional)
- `components/GenderChart.tsx` → ambil data dari `/stats/gender`, render Pie/Bar (Recharts)
- `components/DataTable.tsx` → tabel paginated (React Table), kolom sesuai dataset; top bar: search, filter gender, page size
- `components/Pagination.tsx` → kontrol halaman
- `lib/api.ts` → base fetcher (React Query)
- **Polling “real-time”**: set `refetchInterval: 5000` pada query stats

### UX Hints

- Skeleton loading, empty state, error state
- Tabel sticky header + responsive breakpoints
- A11y: aria-label pada kontrol filter/search

## 6) Wiring FE ↔ BE

- `.env.local` (frontend): `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>`
- Pastikan CORS di backend mengizinkan origin FE
- Uji: buka FE → chart tampil, tabel paginated berfungsi

## 7) Monitoring & Budgets

- Logging: pino + pretty di dev, JSON di prod
- App metrics (opsional): expose `/metrics` (Prometheus) atau gunakan provider logs
- Query time budget: target p95 < 300ms utk endpoint paginated (di cluster M10+ Atlas), p95 < 1s utk agregasi sederhana

## 8) Deployment

**Backend** (Render/Railway/Fly):

- ENV: `MONGODB_URI`, `PORT`, `ALLOWED_ORIGINS`
- Start: `node dist/server.js` (build terlebih dahulu)
- Health check `/health`

**Database**: MongoDB Atlas (Shared/Serverless ok; untuk 1M rows disarankan M10+ jika traffic tinggi)

**Frontend** (Vercel):

- Set `NEXT_PUBLIC_API_BASE_URL`
- Build & deploy otomatis dari repo

## 9) Documentation Checklist

- README berisi: arsitektur, cara run lokal, env vars, endpoints, decisions
- Swagger tersedia publik (`/docs`) + Postman collection
- Screenshots UI (chart + table)

## 10) Acceptance & Self‑Review (sesuai indikator)

- **UI/UX FE**: bersih, responsif, aksesibel, loading states
- **Logic Code**: controller tipis, service terpisah (opsional), validasi input, error handling terstandar, pagination benar
- **Data Viz (real-time)**: chart gender dengan polling 5s atau SSE, transform data minimal di FE (biarkan BE agregasi)
- **Perf**: pagination + index; hindari full collection scan; limit fields (projection)

---

# Quick Snippets (referensi singkat)

**Pagination util (backend)**

```ts
export function getPagination(query: any) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 25, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
```

**Aggregation gender (backend)**

```ts
const match: any = {};
if (req.query.from || req.query.to) {
  match.createdAt = {};
  if (req.query.from) match.createdAt.$gte = new Date(String(req.query.from));
  if (req.query.to) match.createdAt.$lte = new Date(String(req.query.to));
}
const pipeline = [
  { $match: match },
  { $group: { _id: "$gender", count: { $sum: 1 } } },
  { $project: { _id: 0, gender: "$_id", count: 1 } },
  { $sort: { count: -1 } },
];
```

**React Query fetcher (frontend)**

```ts
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

# Next Steps (saran eksekusi cepat)

1. Push repo kosong dengan struktur di atas.
2. Setup backend minimal (health + /records dummy + /stats/gender dummy) → deploy.
3. Setup frontend minimal (render chart dari dummy API + tabel kosong) → deploy.
4. Import 20-row sample → verifikasi end-to-end.
5. Import full dataset (mongoimport) → buat index → uji performa + tambahkan opsi filter.
6. Perbaiki UI/UX (loading, filter, search) → update docs & screenshots.

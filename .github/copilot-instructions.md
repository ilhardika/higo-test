# Copilot Instructions for higo-test Monorepo

## Big Picture Architecture

- **Monorepo**: Contains `backend/` (/Express/MongoDB) and `frontend/` (Next.js/React/Tailwind).
- **Backend**: REST API with pagination, filtering, aggregation; MongoDB Atlas for large datasets (1M+ rows); Swagger/Postman docs.
- **Frontend**: Data visualization (charts/tables), polling for real-time updates, responsive UI.
- **Docs**: API docs in Swagger (`backend/src/docs/openapi.json`) and Postman collection.

## Critical Workflows

- **Dev scripts**: Use root `package.json` for concurrent dev (`npm run dev`), with workspaces for FE/BE.
- **Backend**: Start with `npm run dev` in `backend/`; use `ts-node-dev` for hot reload.
- **Frontend**: Start with `npm run dev` in `frontend/`; Next.js App Router, Tailwind.
- **Data import**: Use `mongoimport` for bulk CSV, or `scripts/import-csv.ts` for streaming import/transform.
- **Indexing**: Run `index-setup.ts` after import to create necessary indexes for performance.
- **API docs**: Swagger UI at `/docs` endpoint; update `openapi.json` as needed.

## Project-Specific Patterns

- **Pagination**: Always use backend util (`getPagination`) for paginated endpoints; default 25, max 100.
- **Aggregation**: Use MongoDB pipeline for stats endpoints; filter by indexed fields only.
- **Controllers**: Thin controllers, prefer service separation for business logic.
- **Validation**: Use Zod for ENV and input validation.
- **Error Handling**: Centralized middleware in `backend/src/middleware/errorHandler.ts`.
- **Frontend API**: Use `lib/api.ts` for fetcher (React Query); set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.
- **Polling**: For real-time charts, set `refetchInterval: 5000` in React Query.

## Integration Points

- **MongoDB Atlas**: Connection string in `backend/.env`.
- **CORS**: Backend must allow FE origin; check `ALLOWED_ORIGINS`.
- **Deployment**: FE on Vercel, BE on Render/Railway/Fly; health check at `/health`.
- **Env Vars**: Root `.env.example` aggregates service envs; update as needed.

## Key Files & Directories

- `backend/src/app.ts`, `server.ts`: Express app entrypoints
- `backend/src/models/Record.model.ts`: Mongoose schema
- `backend/src/controllers/records.controller.ts`, `stats.controller.ts`: API logic
- `backend/src/routes/records.routes.ts`, `stats.routes.ts`: Route definitions
- `backend/src/utils/pagination.ts`: Pagination util
- `backend/src/scripts/import-csv.ts`, `seed-small.ts`: Data import scripts
- `frontend/app/page.tsx`, `stats/page.tsx`: Main dashboard/statistics pages
- `frontend/components/DataTable.tsx`, `GenderChart.tsx`, `Pagination.tsx`: UI components
- `frontend/lib/api.ts`: API fetcher
- `docs/README.md`, `API_GUIDE.md`: Architecture, API usage, decisions

## Examples

- **Backend pagination**: See `utils/pagination.ts` for util, controllers for usage.
- **Gender aggregation**: See aggregation pipeline in `stats.controller.ts`.
- **Frontend fetcher**: See `lib/api.ts` for React Query pattern.

---

If any section is unclear or missing, please provide feedback so instructions can be improved for future AI agents.

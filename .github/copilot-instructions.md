# Copilot Instructions for Park Manager Codebase

## Overview
This monorepo manages an RV park system with two main backends (`api/auth`, `api1`) and a Quasar-based frontend (`localapp`). Each backend is a Fastify app with its own plugins, routes, and database integration. The frontend is a SPA for park management tasks.

## Architecture
- **api/auth**: Fastify backend, uses plugins (see `plugins/`), routes (see `routes/`), and Postgres for persistence. Dev/test commands: `npm run dev`, `npm run test`.
- **api1**: Fastify backend, similar structure, but uses Sequelize ORM (see `sequelize/` and `plugins/sequelize.js`).
- **localapp**: Quasar (Vue) SPA. Dev: `quasar dev`. Lint/format: `npm run lint`, `npm run format`. Build: `quasar build`.

## Key Patterns & Conventions
- **Plugins**: Place shared Fastify plugins in `plugins/` (e.g., `postgres.js`, `sensible.js`).
- **Routes**: All HTTP endpoints are in `routes/`, organized by feature.
- **Schema**: JSON schema for validation in `schema/` (api1).
- **Database**: Sequelize models/migrations/seeders in `sequelize/` (api1). Postgres plugin in `api/auth/plugins/postgres.js`.
- **Testing**: Test helpers in `test/helper.js`. Route/plugin tests in `test/routes/` and `test/plugins/`.
- **Frontend Data**: Static app data in `src/appdata/` (e.g., `spaces.json`, `parkAreas.js`).

## Developer Workflows
- **api/auth**: `npm run dev` (dev server), `npm run test` (tests)
- **api1**: `npm run dev`, `npm run test` (same as above)
- **localapp**: `quasar dev` (dev), `npm run lint`, `npm run format`, `quasar build` (prod build)

## Integration Points
- **API <-> Frontend**: Frontend calls backend APIs for park data, leases, payments, etc.
- **Database**: api1 uses Sequelize (see `sequelize/models/`). api/auth uses direct Postgres plugin.

## Notable Files/Dirs
- `api/auth/plugins/postgres.js`: Postgres integration for Fastify
- `api1/plugins/sequelize.js`: Sequelize ORM integration
- `localapp/src/appdata/`: Static data for frontend
- `localapp/src/pages/`: Main UI pages

## Project-Specific Notes
- Use Fastify plugin pattern for backend extensibility
- Organize new features as route folders under `routes/`
- Use JSON schema for request/response validation (see `schema/`)
- For new DB models, update Sequelize models/migrations/seeders (api1)

---
For more, see each package's README.md for commands and details.

# Last Option — Men's Premium Outerwear (E-Commerce Platform)

Last Option is a direct-to-consumer (D2C) men's apparel e-commerce brand focused on premium jackets.

The repository consists of two independent applications:
- **`client_facing/`**: Storefront built with Nuxt 4 (Vue 3, TypeScript, Tailwind CSS, SSR enabled).
- **`backend_api/`**: RESTful API service built with Node.js, Express.js, and TypeScript.
- **`docs/`**: Comprehensive planning documents, requirements, database schemas, and wireframes.

---

## Port Allocation

| Application | Technology | Default Port | Health / Status Endpoint |
| :--- | :--- | :--- | :--- |
| **Frontend Storefront** (`client_facing/`) | Nuxt 4 + Vue 3 | `3000` | `http://localhost:3000` |
| **Backend API** (`backend_api/`) | Express.js + TS | `5000` | `http://localhost:5000/api/v1/health` |

---

## Getting Started & Local Development

Each application is completely independent and has its own `package.json`.

### 1. Prerequisites
- **Node.js**: v20+ (Tested on v24.21.0)
- **npm**: v10+ (Tested on v11.19.0)

---

### 2. Backend API Setup (`backend_api/`)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend_api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the local environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server with live reload:
   ```bash
   npm run dev
   ```
5. Verify the backend health check:
   - Visit `http://localhost:5000/api/v1/health` in your browser or run:
     ```bash
     curl http://localhost:5000/api/v1/health
     ```

#### Backend NPM Scripts
- `npm run dev`: Starts the server with `tsx watch` for auto-reloading on file changes.
- `npm run build`: Compiles TypeScript to JavaScript in `dist/`.
- `npm run start`: Runs the compiled production code from `dist/index.js`.
- `npm run typecheck`: Validates TypeScript types without emitting files.

---

### 3. Frontend Storefront Setup (`client_facing/`)

1. Open a terminal and navigate to the frontend directory:
   ```bash
   cd client_facing
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the local environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the Nuxt 4 development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`.

#### Frontend NPM Scripts
- `npm run dev`: Starts the Nuxt 4 development server on `http://localhost:3000`.
- `npm run build`: Builds the production bundle with Nitro and Vite.
- `npm run preview`: Previews the production build locally.
- `npm run generate`: Statically generates the website (if SSG mode is desired).

---

## Project Documentation
Detailed Phase 1 documentation is maintained in the [`docs/`](./docs) directory:
- [01-requirements.md](./docs/01-requirements.md)
- [02-user-flows.md](./docs/02-user-flows.md)
- [03-database-schema.md](./docs/03-database-schema.md)
- [04-api-responsibilities.md](./docs/04-api-responsibilities.md)
- [05-frontend-structure-and-wireframes.md](./docs/05-frontend-structure-and-wireframes.md)
- [06-architecture-and-implementation-plan.md](./docs/06-architecture-and-implementation-plan.md)

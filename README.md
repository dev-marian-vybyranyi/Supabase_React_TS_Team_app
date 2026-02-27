# Supabase React TS Team App

Full-Stack web application built using **React**, **TypeScript**, **Vite** on the frontend, and **Supabase** on the backend.

The project is focused on team collaboration (Team workspace), product management, and supports authentication (including Google OAuth), real-time presence (Realtime Presence), and has configured databases with advanced PostgreSQL features (Cron, Full-Text Search).

## 🚀 Features

- **Authentication**: Secure user registration and login via Supabase Auth (Email/Password and **Google OAuth**).
- **Teams and Onboarding**: After the first login, users go through `Onboarding` to create their own team or join an existing one.
- **Product Management**: Full CRUD for products with **Full-Text Search** support. Editing permissions are strictly controlled (e.g., `draft` statuses).
- **Storage**: Uploading and storing media files/images linked to products (configured via Supabase Storage).
- **Realtime Presence**: Tracking which team members are currently "online" and working in the application, using Supabase Realtime and global state (Zustand).
- **Automation (Cron Jobs)**: The backend contains automatic scheduled tasks (e.g., `cron_delete_old_products.sql`) that clean up obsolete data on their own.
- **Row Level Security (RLS)**: Database-level security. Each user has access only to their team's data.

---

## 🛠 Technology Stack

### Frontend (`/frontend`):

- **Framework**: React 19 + TypeScript + Vite.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (split stores: `authStore`, `teamStore`, `productStore`, `presenceStore`).
- **Routing**: React Router DOM (protected routes `ProtectedRoute`, pages `AuthPage`, `OnboardingPage`, `Dashboard`).
- **Styling and UI**: Tailwind CSS v4 + Shadcn UI + Lucide React (icons).
- **Forms**: Formik + Yup for complex logic validation.
- **API Interaction**: `@supabase/supabase-js`.

### Backend (`/supabase`):

- **Database**: PostgreSQL from Supabase.
- **Migrations**: A set of SQL scripts in the `supabase/migrations/` folder for initializing schemas, security boundaries (RLS), full-text search, and pg_cron.
- **Edge Functions**: The `supabase/functions/` folder for server-side business logic.

---

## 📂 Project Structure

```text
Supabase_React_TS_Team_app/
├── frontend/                # Frontend part (React + Vite)
│   ├── src/                 # Source code
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities (e.g., tailwind utils config)
│   │   ├── pages/           # Main pages (Dashboard, Auth, Onboarding)
│   │   ├── schemas/         # Validation schemas (Yup)
│   │   ├── store/           # Zustand state stores
│   │   └── types/           # TypeScript types
│   └── package.json         # Frontend dependencies
├── supabase/                # Supabase configuration
│   ├── functions/           # Supabase Edge Functions
│   ├── migrations/          # DB SQL migrations
│   └── config.toml          # Local Supabase settings
├── .env                     # Global environment variables (OAuth)
└── README.md                # This file
```

---

## ⚙️ Environment Variables

For the project to work locally, you need to create or configure environment variable files. Below are some examples:

### 1. Global `.env` (in the project root)

Responsible for server-side or general infrastructure secrets (e.g., Google OAuth keys).
_Create a `.env` file in the root folder with the following content:_

```env
# Example .env file in the project root
GOOGLE_CLIENT_ID=your key
GOOGLE_CLIENT_SECRET=your key
```

### 2. Frontend `.env.local` (in the `/frontend` folder)

Contains keys for connecting your React application to the Supabase instance.
_Create a `frontend/.env.local` file:_

```env
# Points to your local Supabase (or Production URL)
VITE_SUPABASE_URL=http://127.0.0.1:54321

# Public key (anon key) for client access to DB and Auth
VITE_SUPABASE_ANON_KEY=your key
```

> **Important:** Do not place `service_role` keys in `.env.local`, as they will be accessible in the browser!

---

## 🚀 How to run the project locally

### 1. Cloning and installing dependencies

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

### 2. Starting the backend (Supabase CLI)

Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Supabase CLI](https://supabase.com/docs/guides/cli) installed.

```bash
# Navigate to the project root (if you are in frontend)
cd ..

# Start the local Supabase instance
supabase start
```

_This command will bring up the local DB, Studio, and Storage. After starting, the client will output your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, which should be pasted into `frontend/.env.local`._

### 3. Starting the frontend

```bash
# Open a new terminal, navigate to frontend
cd frontend

# Start the dev server
npm run dev
```

The frontend will be available at: `http://localhost:5173` (or another port specified by Vite).

---

## 🗄️ Database and migrations

The project contains several migrations (`supabase/migrations/`), which are automatically applied upon startup:

1. `init_schema.sql` — base tables (users, teams, products) and their relationships.
2. `init_storage.sql` — Supabase Storage configuration (buckets and access policies).
3. `restrict_update_draft_only.sql` — security policies that prohibit updating products not in the `draft` status.
4. Various scripts for optimization, e.g., creating Full-Text Search indexes (`add_fts_to_products.sql`) and background tasks (`cron_delete_old_products.sql`).

# AlumniConnect Project Structure

This file explains what each project folder and important file is responsible for. Use it as a quick guide when troubleshooting or deciding which files to share.

## Project at a glance

AlumniConnect is a full-stack alumni guidance and mentorship platform:

- `client/` is the React frontend.
- `server/` is the NestJS backend API.
- MongoDB stores users and student/alumni profiles.
- The frontend talks to the backend through `/api` endpoints.

## Root files and folders

| Path | Purpose |
|---|---|
| `README.md` | Project overview, setup commands, environment variables, and API notes. |
| `PROJECT_STRUCTURE.md` | This folder and troubleshooting guide. |
| `.gitignore` | Lists files Git should not track, such as local environment files and dependencies. |
| `client/` | Browser application built with React and Vite. |
| `server/` | Backend API built with NestJS, TypeScript, and Mongoose. |

## `client/` - React frontend

| Path | Purpose |
|---|---|
| `client/index.html` | The HTML shell into which the React application is mounted. |
| `client/package.json` | Frontend dependencies and commands such as `npm run dev` and `npm run build`. |
| `client/package-lock.json` | Locked frontend dependency versions. |
| `client/vite.config.js` | Vite configuration and React plugin setup. |
| `client/src/main.jsx` | Frontend entry point; mounts the React app. |
| `client/src/App.jsx` | Main application composition and route definitions. |
| `client/src/AuthContext.jsx` | Global login state, JWT storage, login, logout, and token validation. |
| `client/src/ProtectedRoute.jsx` | Redirects unauthenticated users away from protected pages. |
| `client/src/App.css` | Application-level styling. |
| `client/src/index.css` | Global CSS and base styles. |

### `client/src/components/`

Reusable UI pieces shared by pages:

- `Navbar.jsx` - site navigation and user actions.
- `AlumniCard.jsx` - displays an alumni summary.
- `BackendStatus.jsx` - checks/displays backend availability.

### `client/src/pages/`

Page-level components connected to routes:

- `LandingPage.jsx` - public landing page.
- `LoginPage.jsx` - login form and API login call.
- `SignupPage.jsx` - account registration form.
- `DashboardPage.jsx` - authenticated user dashboard.
- `AlumniPage.jsx` - alumni directory and filtering/search.
- `AlumniProfilePage.jsx` - details for one alumni profile.
- `ProfilePage.jsx` - current user's profile.
- `QuestionsPage.jsx` - questions or guidance interface.

### `client/src/data/`

- `alumni.js` - frontend mock/static alumni data. This is separate from live MongoDB data and may be used by UI code that has not yet been migrated to the API.

## `server/` - NestJS backend

| Path | Purpose |
|---|---|
| `server/package.json` | Backend dependencies and commands such as `npm run start:dev`, `npm run build`, and `npm run seed`. |
| `server/package-lock.json` | Locked backend dependency versions. |
| `server/.env.example` | Template for local configuration. Copy values into a local `.env`; do not commit secrets. |
| `server/nest-cli.json` | NestJS CLI configuration. |
| `server/tsconfig.json` | TypeScript development configuration. |
| `server/tsconfig.build.json` | TypeScript build configuration. |
| `server/api-test.js` | Manual API/authentication test script. |

### `server/src/`

| Path | Purpose |
|---|---|
| `server/src/main.ts` | Starts NestJS, sets the `/api` prefix, configures CORS, and enables request validation. |
| `server/src/app.module.ts` | Root module; loads configuration, connects to MongoDB, and registers feature modules. |

### `server/src/auth/`

Authentication and authorization:

- `auth.controller.ts` - exposes `/api/auth/register`, `/api/auth/login`, and protected `/api/auth/me`.
- `auth.service.ts` - hashes passwords with bcrypt, checks credentials, creates JWTs, and returns user/profile data.
- `auth.module.ts` - wires JWT, Passport, users, and profiles together.
- `jwt.strategy.ts` - reads and validates `Authorization: Bearer <token>` tokens.
- `jwt-auth.guard.ts` - protects routes requiring a valid JWT.
- `roles.guard.ts` and `roles.decorator.ts` - support role-based access checks.
- `get-user.decorator.ts` - retrieves the authenticated user from a request.
- `dto/` - validates login and registration request bodies.

### `server/src/users/`

User account persistence:

- `user.schema.ts` - MongoDB User schema containing name, email, password hash, role, verification status, and timestamps.
- `users.service.ts` - creates users and looks them up by email or ID.
- `users.module.ts` - registers the User model with Mongoose.

### `server/src/profiles/`

Student and alumni profile persistence and API operations:

- `profiles.controller.ts` - protected current-profile endpoints and public alumni directory/profile endpoints.
- `profiles.service.ts` - creates, updates, searches, and retrieves profiles; also calculates profile completion.
- `profiles.module.ts` - registers profile models and dependencies.
- `schemas/alumni-profile.schema.ts` - MongoDB fields for alumni profiles.
- `schemas/student-profile.schema.ts` - MongoDB fields for student profiles.
- `dto/` - intended request DTO definitions for updating student/alumni profiles.

### `server/src/health/`

- `health.controller.ts` and `health.service.ts` - provide the backend health-check endpoint at `/api/health`.
- `health.module.ts` - registers the health feature.

### `server/src/database/`

- `seed.ts` - connects to MongoDB and inserts sample users and alumni/student profile data. Run with `npm run seed` from `server/`.

## MongoDB collections represented by the code

The Mongoose models create these collections:

- `users` - account identity, bcrypt password hash, role, verification status, and timestamps.
- `alumniprofiles` - alumni work, skills, biography, help topics, and services.
- `studentprofiles` - student education, skills, interests, and biography.

Profiles reference their account through `userId`. JWT access tokens are not stored in MongoDB.

## Configuration and local services

The backend reads:

- `PORT` - backend port, normally `5000`.
- `MONGODB_URI` - MongoDB Atlas or local MongoDB connection string.
- `CLIENT_ORIGIN` - allowed frontend origin, normally `http://localhost:5173`.
- `JWT_SECRET` - secret used to sign and verify JWTs.
- `JWT_EXPIRATION` - token lifetime, normally `7d`.

Typical local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api`

## What to share when troubleshooting

Share the smallest relevant group of files:

| Problem | Useful files |
|---|---|
| Login, signup, logout, or redirect issue | `client/src/AuthContext.jsx`, the relevant page in `client/src/pages/`, `client/src/ProtectedRoute.jsx`, and `server/src/auth/` |
| JWT or unauthorized API response | `server/src/auth/jwt.strategy.ts`, `server/src/auth/jwt-auth.guard.ts`, `server/src/auth/auth.service.ts`, and the failing controller |
| User/profile data missing or incorrect | Relevant schema in `server/src/users/` or `server/src/profiles/schemas/`, plus `users.service.ts` or `profiles.service.ts` |
| Alumni search or profile page issue | `client/src/pages/AlumniPage.jsx`, `client/src/pages/AlumniProfilePage.jsx`, `server/src/profiles/profiles.controller.ts`, and `server/src/profiles/profiles.service.ts` |
| Backend will not start | `server/src/main.ts`, `server/src/app.module.ts`, `server/package.json`, and the exact terminal error |
| MongoDB connection or seed issue | `server/.env` values with passwords redacted, `server/src/app.module.ts`, and `server/src/database/seed.ts` |
| Styling or visual issue | The affected page/component and its related `.css` file |
| Build or dependency issue | The relevant `package.json`, lockfile if needed, and the complete build error |

Never share real passwords, JWT secrets, MongoDB credentials, or other private environment values. Replace them with placeholders before sharing.

## Git worktree note

The `.worktrees` directory is Git working-directory infrastructure, not an application folder. The actual application folders are `client/` and `server/`. Changes made in this worktree belong to its separate Git branch until they are reviewed and merged into `main`.

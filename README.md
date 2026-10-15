# AlumniConnect

AlumniConnect connects students with alumni for career guidance, profile discovery, and community Q&A.

## Stack

- Frontend: React, Vite, React Router
- API: NestJS
- Database: Neon PostgreSQL through Prisma
- Authentication: JWT

## Getting started

### Backend

Create `server/.env` with your PostgreSQL connection string and local settings:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION=7d
```

Install and initialize the backend:

```bash
cd server
yarn install
yarn prisma generate
yarn prisma db push
yarn start:dev
```

`prisma db push` synchronizes the Prisma schema with the configured database. Run it only against the intended database. The seed script can add sample alumni and a student account:

```bash
yarn seed
```

The API runs at `http://localhost:5000/api`; health check: `GET /api/health`.

### Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

The client runs at `http://localhost:5173`. Set `VITE_API_URL` if the API is not at `http://localhost:5000/api`.

## Profiles and recommendations

Signup creates a profile matching the selected role: students receive a student profile; alumni receive an alumni profile. Users can update their identity and role-specific profile fields from **My Profile**.

Student dashboard recommendations use simple, explainable tag matching:

1. Normalize the student's skills and career interests.
2. Compare them with each verified alumnus's skills and help topics.
3. Show shared tags and rank alumni by the proportion of student tags that match.

Adding skills/interests to a student profile improves recommendations. Alumni can add skills and help topics to their profiles to be discoverable.

## Community Q&A

The home page is a chronological activity feed of questions, answers, and discussion comments; each item opens its full Q&A thread. Students and alumni can create questions with topic tags and mention multiple students or alumni. Questions and answers remain open to the community, and comments are saved separately from answers. The question board supports tag and unanswered filters.

Run the automated checks with `yarn test` in `server` and `npm test` in `client`.

## Main API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register as a student or alumnus and create a role-specific profile |
| `POST` | `/api/auth/login` | Sign in and receive a JWT |
| `GET` | `/api/profiles/me` | Get the signed-in user's profile |
| `PUT` | `/api/profiles/me` | Update identity and role-specific profile fields |
| `GET` | `/api/profiles/recommendations` | Get tag-matched verified alumni for a student |
| `GET` | `/api/alumni` | Search/list alumni profiles |
| `GET` | `/api/alumni/:id` | Get an alumnus profile by profile or user ID |
| `GET` | `/api/people` | List students and alumni that can be mentioned (JWT required) |
| `GET` | `/api/questions` | Public activity source with questions, mentions, answers, and comments |
| `POST` | `/api/questions` | Create a tagged question and optionally mention students/alumni (JWT required) |
| `POST` | `/api/questions/:id/answers` | Save an answer to a question |
| `POST` | `/api/questions/:id/comments` | Save a discussion comment (JWT required) |

Send the JWT in the `Authorization: Bearer <token>` header for protected endpoints. Keep `server/.env` out of source control and use a different database credential and JWT secret for each environment.

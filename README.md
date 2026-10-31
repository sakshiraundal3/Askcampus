# AskCampus – College Admission FAQ Chatbot

A starter full-stack college admission FAQ assistant built with Node.js, Express, PostgreSQL (including Supabase-hosted PostgreSQL), JWT authentication, and a locally hosted Ollama model. A lightweight browser chat UI is included.

## Features
- Chat interface for admission-related questions.
- Ollama local LLM integration with FAQ context retrieved from PostgreSQL.
- Student registration and login with bcrypt password hashing and JWT.
- FAQ listing for all visitors and admin-protected FAQ create/update/archive endpoints.
- Optional conversation history for authenticated users.
- SQL migration and sample FAQ seed data.
- Basic security middleware, CORS configuration, and API rate limiting.

## Requirements
- Node.js 18 or newer (uses native `fetch`).
- PostgreSQL database, or a Supabase project with its PostgreSQL connection string.
- Ollama installed and running locally.

## Setup

1. Extract the ZIP and open the project folder in VS Code.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example` and fill in `DATABASE_URL` and a long random `JWT_SECRET`.
4. For Supabase, copy the PostgreSQL connection string from **Project Settings → Database**. Ensure the database allows your machine's connection. Keep `PGSSL=true` for the Supabase hosted database.
5. Run the database migration and sample FAQ seed:

   ```bash
   npm run migrate
   npm run seed
   ```

6. Install and start Ollama, then download a model (example):

   ```bash
   ollama pull llama3.2
   ollama serve
   ```

   If Ollama is already running as a background service, just run the `ollama pull` command.

7. Start the application:

   ```bash
   npm run dev
   ```

8. Open `http://localhost:5000`.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Check API and database status |
| POST | `/api/auth/register` | Public | Create student account |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/faqs` | Public | List active FAQs |
| POST | `/api/faqs` | Admin JWT | Create FAQ |
| PUT | `/api/faqs/:id` | Admin JWT | Update FAQ |
| DELETE | `/api/faqs/:id` | Admin JWT | Archive FAQ |
| POST | `/api/chat` | Public | Ask the AI assistant a question |
| GET | `/api/chat/history` | User JWT | Get signed-in user's recent chat history |

### Example requests

Register:

```json
POST /api/auth/register
{ "name": "Student Name", "email": "student@example.com", "password": "change-this-password" }
```

Login:

```json
POST /api/auth/login
{ "email": "student@example.com", "password": "change-this-password" }
```

Chat:

```json
POST /api/chat
{ "question": "Which documents are needed for admission?" }
```

Admin endpoints require `Authorization: Bearer <JWT>` and a user whose database `role` is `admin`. For the initial local setup, register your account, then promote it manually using a trusted database admin connection:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Do not expose database admin credentials or grant admin role from a public registration endpoint.

## Project structure

```text
askcampus-project/
├── database/
│   ├── migrations/001_initial.sql
│   ├── seeds/001_faqs.sql
│   ├── migrate.js
│   └── seed.js
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── middleware/auth.js
│   ├── routes/{authRoutes,chatRoutes,faqRoutes}.js
│   ├── services/ollama.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Important notes
- The sample FAQ data is generic demonstration content, not official policy for any specific college. Replace it with verified institutional information before deployment.
- The LLM is instructed not to invent official dates, fees, or eligibility rules, but model output can still be wrong. Verify important admission information with the college.
- This is a starter implementation. Before production deployment, add email verification, password reset, stronger request validation, structured logging, automated tests, HTTPS, and a production-grade admin provisioning process.
- Never commit `.env`, database passwords, JWT secrets, or other credentials to GitHub.

## Push to your GitHub repository

Create an empty repository on your GitHub account, then run these commands inside the extracted project folder (replace the URL with your repository URL):

```bash
git init
git add .
git commit -m "Initial commit: AskCampus college FAQ chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/AskCampus-College-FAQ-Chatbot.git
git push -u origin main
```

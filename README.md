# Enterprise Structured Ingestion Firewall
## Week 4 – Full-Stack Application Deployment

# 1. Introduction

Enterprise Structured Ingestion Firewall is my project. Week 4 focuses on deploying the full-stack application and making it accessible online.

# 2. Week 4 – Core Topics Explained

### 1. Development vs. Production Environments
- **Development:** Where we build and test an application on our local computer.
- **Production:** Where the application is hosted online and accessed by users.

### 2. GitHub Repository Setup and Deployment Workflows
- GitHub is used to store and manage project code.
- Git helps track changes in the code.
- Deployment workflows help publish code changes to hosting platforms.

### 3. Deploying React + Vite on Vercel
- React is used to create the frontend user interface.
- Vite helps build and run the React application.
- Vercel is a platform used to host frontend applications online.

### 4. Deploying the Backend on Render
- The backend handles application logic and user requests.
- FastAPI is a Python framework used to create APIs.
- Render is a platform used to host backend applications online.

### 5. Connecting Supabase to the Deployed Backend
- Supabase provides a hosted PostgreSQL database.
- PostgreSQL stores application data in tables.
- The backend connects to Supabase using a database connection URL.

### 6. Environment Variables and Secret Management
- Environment variables store application settings such as API keys and database URLs.
- They keep sensitive information separate from the source code.
- Secrets should not be uploaded to GitHub.

### 7. Frontend–Backend API Integration and CORS
- APIs allow the frontend and backend to communicate.
- The frontend sends requests and receives responses from the backend.
- CORS controls which frontend websites are allowed to access the backend.

### 8. Production Testing, Debugging and Error Handling
- Production testing checks whether the live application works correctly.
- Debugging means finding and fixing errors.
- Error handling manages problems and displays understandable messages.
- Health checks help verify backend and database availability.

# 3. Project Structure

```text
Enterprise-Structured-Ingestion-Firewall/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── services/
│   │       └── database_service.py
│   │
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── .gitignore
└── README.md
```

*Note: This is a simplified overview of the project structure.*

# 4. Work Completed During Week 4

## Frontend Deployment

- Deployed the React + Vite frontend on Vercel.
- Configured the build command as `npm run build`.
- Configured the output directory as `dist`.
- Connected the frontend to the deployed backend.
- Verified that the frontend was accessible online.

## Backend Deployment

- Deployed the FastAPI backend on Render.
- Configured the required dependencies and environment variables.
- Used the following start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- Checked the backend health endpoint.
- Resolved a missing PostgreSQL connection-pool dependency during deployment.

## Database Integration

- Created a Supabase project.
- Selected the Session Pooler connection method.
- Connected the backend to Supabase PostgreSQL.
- Configured `DATABASE_URL` in Render.
- Updated the local backend `.env` file.
- Added the PostgreSQL dependency:

```text
psycopg[binary,pool]>=3.2
```

- Verified the database connection through the health endpoint.

The health endpoint returned a successful status:

```json
{
  "status": "ok",
  "database": "postgres",
  "database_ok": true,
  "groq_api_key_configured": true
}
```

## Frontend–Backend Integration

- Connected the Vercel frontend to the Render backend.
- Configured the production API base URL.
- Updated CORS to allow the Vercel frontend.
- Tested API requests and responses.
- Verified communication between the deployed frontend and backend.

## Production Testing and Database Verification

- Opened the deployed frontend.
- Tested chatbot questions and responses.
- Checked the backend health endpoint.
- Verified the PostgreSQL connection.
- Checked application logs in Render.
- Opened Supabase Table Editor.
- Confirmed the `conversations` and `messages` tables exist.
- Observed conversation records and user/assistant message records.

**Test question:**

`This is my Supabase persistence test 12345`

After refreshing the `conversations` table, I observed a new conversation record containing the test question in its title.

# 5. Commands Used

## Frontend Commands

```bash
cd frontend
npm install
npm run dev
npm run build
```

## Backend Commands

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend locally:

```bash
uvicorn app.main:app --reload
```

Local backend URL:

`http://127.0.0.1:8000`

Local health check:

`http://127.0.0.1:8000/health`

## Git Commands

```bash
git status
git add .
git commit -m "Update deployment configuration"
git push origin week-03-conversation-memory-chat-history
```

**Note:** Never commit `.env` files, API keys or database passwords.

# 6. Deployment URLs

| Service | URL |
|---|---|
| Frontend – Vercel | https://ai-engineering-practical-guidance.vercel.app/ |
| Backend – Render | https://ai-engineering-practical-guidance.onrender.com |
| Backend Health Check | https://ai-engineering-practical-guidance.onrender.com/health |
| GitHub Repository | https://github.com/Bhavya32650/AI-Engineering-Practical-Guidance |

# 7. Environment Variables

The backend uses environment variables to configure application settings.

Example:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_model_name
DATABASE_URL=your_supabase_database_url
```

- Local configuration is stored in `backend/.env`.
- Production configuration is stored in Render Environment settings.
- `.env` files must not be committed to GitHub.
- Database passwords and API keys must remain private.

# 8. Final Application Demonstration

**Final Application Video:** 

[https://drive.google.com/file/d/13aRG8SPMYZDlV66Vf6J3G-34clB3ETeO/view?usp=sharing]

The video will demonstrate the final application interface, its main features and how the application works.

# 9. Remaining Verification

The following checks are still pending:

1. Verify that the matching test question and assistant response appear in the Supabase `messages` table.
2. Test database failure handling in a controlled test environment.
3. Confirm that the application displays an understandable error when the database is unavailable.
4. Restore the database connection and verify that the application works again.

The live production database should not be deliberately disconnected while users may be using the application.

# 10. Week 4 Outcome

In Week 4, I learned how to deploy a full-stack application and connect its frontend, backend and database.

I deployed the frontend using Vercel, deployed the backend using Render and connected the backend to Supabase PostgreSQL.

I also learned about environment variables, CORS, API integration, production testing, debugging and deployment workflows.

The deployed backend health check confirmed a successful PostgreSQL connection, and a new conversation record was observed in Supabase.

**Final Deployment Architecture:**

GitHub Repository → Vercel Frontend + Render Backend → Supabase PostgreSQL

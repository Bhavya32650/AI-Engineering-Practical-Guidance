# Week 3 – Enterprise Ingestion Firewall: Conversation Memory

## Project Overview

This project focuses on adding conversation memory to an AI-powered chatbot.

The chatbot remembers previous messages within a conversation, understands follow-up questions, and maintains separate chat sessions using unique session IDs.

The application uses **FastAPI, React, Groq LLM, and SQLite** to manage conversations and generate context-aware responses.

## Learning Topics

1. **Stateless vs. Stateful Applications:** Understanding the difference between applications that do not remember previous requests and applications that maintain information between requests.

2. **System, User & Assistant Roles:** Understanding how messages are categorized as system instructions, user questions, and AI responses.

3. **Conversation History & Context:** Learning how previous messages help the AI understand follow-up questions.

4. **Session IDs & Chat Isolation:** Using unique session IDs to maintain separate conversations for different chats.

5. **Passing Chat History to Groq:** Sending previous user messages and AI responses to Groq so it can generate context-aware answers.

6. **Managing Chat History in FastAPI:** Handling, retrieving, and storing conversation messages through backend APIs.

7. **Frontend & Backend Integration, Error Handling & Testing:** Connecting the React chatbot with FastAPI, implementing New Chat, and testing conversation history, session isolation, and errors.

## Technologies Used

- Python
- FastAPI
- Groq API
- SQLite Database
- React.js
- JavaScript
- Pydantic
- Uvicorn

## Project Folder Structure

```text
intent/
├── backend/
│   ├── app/
│   │   ├── schemas/
│   │   │   ├── assistant.py
│   │   │   └── ingestion.py
│   │   ├── services/
│   │   │   ├── llm_service.py
│   │   │   ├── response_service.py
│   │   │   ├── database_service.py
│   │   │   ├── conversation_service.py
│   │   │   └── memory_service.py
│   │   ├── utils/
│   │   │   └── token_counter.py
│   │   ├── config.py
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md


## Key Features

- Unique session ID for every conversation.
- New Chat functionality.
- Separate conversation histories.
- Stores user messages and AI responses in SQLite.
- Retrieves previous conversation messages.
- Sends chat history to Groq for context-aware responses.
- Markdown-formatted AI responses.
- Error handling and API validation.


## Expected Workflow

```text
User Message
     ↓
  Session ID
     ↓
Retrieve Chat History
     ↓
 SQLite Database
     ↓
 Send Context to Groq
     ↓
AI Response Generation
     ↓
Display Response in React
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check backend and database status |
| GET | `/api/conversations` | Get all conversations |
| GET | `/api/conversations/{session_id}/messages` | Get messages for a conversation |
| POST | `/api/analyze` | Analyze message and generate AI response |

## Database

**SQLite** is used to store conversation information locally.

It stores:
- Conversation session IDs
- User messages
- AI responses
- Conversation timestamps

Each session maintains its own conversation history.

## Project Screenshots and Demo

### Backend – Swagger API

![Backend Screenshot](https://drive.google.com/file/d/1WkPf7eqSTD3B8V94aO5bdmAYN18JGqLK/view?usp=drive_link)

### Frontend – Chatbot Demo

[Watch Frontend Chatbot Demonstration](https://drive.google.com/file/d/1MXFFxaA5f_Jp_x08lvgrbF_T3cZLLO_v/view?usp=drive_link)

## How to Run the Project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

Swagger URL: `http://127.0.0.1:8000/docs`

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run build
npm run preview
```

Frontend URL: `http://localhost:4173`

## Learning Outcomes

- Understood conversation memory and session management.
- Learned how to maintain separate chat sessions.
- Integrated Groq with conversation history.
- Implemented SQLite-based conversation storage.
- Connected React frontend with FastAPI backend.
- Implemented follow-up questions and New Chat functionality.

## GitHub Repository

**Repository:** [AI Engineering Practical Guidance](https://github.com/Bhavya32650/AI-Engineering-Practical-Guidance)

**Branch:** `week-03-conversation-memory-chat-history`


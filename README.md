# Week 2: LLM Integration & Response Generation

## Project Name: Intent-Based AI Response Generator

### 1. Project Overview

In Week 2, I extended my Week 1 project, Enterprise Structured Ingestion Firewall, by integrating a Large Language Model (LLM).

In Week 1, the application detected the user's intent and classified the message. In Week 2, I integrated an LLM to generate meaningful and context-aware responses based on the user's question and detected intent.

The main objective is to build an AI assistant that understands user questions and provides relevant answers through a chatbot interface.

### 2. Topics Covered

- **LLM Integration:** Connecting Python applications with an LLM using APIs.
- **Prompt Templates:** Creating instructions for the AI model to generate suitable responses.
- **Dynamic Context Generation:** Passing relevant information to the LLM based on the user's message and detected intent.
- **Context-Aware Responses:** Generating meaningful answers according to the user's question.
- **LangChain Fundamentals:** Understanding the basics of LangChain and its role in building LLM applications. Direct API integration was used in this project.
- **Markdown Response Generation:** Generating structured responses using Markdown.
- **Error Handling and Testing:** Handling API errors and testing the complete workflow.

### 3. Project Implementation – Intent-Based AI Response Generator

The project extends the existing Week 1 workflow with LLM-based response generation.

**Project Workflow:**

User Question → Intent Detection → LLM Processing → Markdown Response → Chatbot UI

**How the application works:**

1. The user enters a question in the chatbot.
2. The backend detects the intent of the user's message.
3. The detected intent and user message are passed to the LLM.
4. The LLM generates a relevant and context-aware response.
5. The response is formatted using Markdown.
6. The frontend displays the generated answer in the chatbot.
7. Loading indicators and error messages are displayed when required.

### 4. Week 2 Implementation – What I Added

#### Backend Updates

- Integrated the Groq LLM API with the existing FastAPI application.
- Reused the Week 1 intent-detection workflow.
- Added an assistant response schema.
- Implemented response generation using the detected intent and user message.
- Generated Markdown-formatted responses.
- Connected the response-generation service with the main API endpoint.
- Added error handling for the LLM response workflow.

#### Backend Output

The backend API was tested using FastAPI Swagger. It successfully returned status code **200** with the detected intent and AI-generated response.

![Backend API Output](backend-output.png)[https://drive.google.com/file/d/18fuPR0FhJOMUm_He_9tsVaRpFujRAGNQ/view?usp=drive_link]

#### Frontend Updates

- Updated the existing HTML, CSS, and JavaScript files.
- Created a modern chatbot-style interface.
- Added a New Chat option.
- Added suggested prompts in the sidebar.
- Connected the chatbot frontend with the FastAPI backend.
- Displayed AI-generated Markdown responses.
- Added loading indicators and error messages.

#### Frontend Output

The frontend displays the Support AI chatbot interface with suggested prompts and a message input area.

![Frontend Chatbot Output](frontend-output.png)[https://drive.google.com/file/d/12zzsftY94E-bMk09plszk8ESNW6DR_G7/view?usp=sharing]

### 5. Project Folder Structure

```text
intent/
│
├── backend/
│   ├── app/
│   │   ├── main.py                         # Week 1 + Week 2 updates
│   │   ├── schemas/
│   │   │   ├── ingestion.py                # Week 1
│   │   │   └── assistant.py                # Week 2 - Added
│   │   ├── services/
│   │   │   ├── llm_service.py              # Week 1
│   │   │   └── response_service.py         # Week 2 - Added
│   │   └── utils/
│   │       └── token_counter.py            # Week 1
│   ├── .env                                # API key (not uploaded)
│   └── requirements.txt
│
├── frontend/
│   ├── index.html                          # Week 1 + Week 2 updates
│   ├── script.js                           # Week 1 + Week 2 updates
│   └── style.css                           # Week 1 + Week 2 updates
│
├── .gitignore
└── README.md
```

### 6. Technologies Used

- Python
- FastAPI
- Groq API
- Large Language Model (LLM)
- Pydantic
- HTML
- CSS
- JavaScript
- Marked.js
- DOMPurify
- Markdown

### 7. Project Demonstration Video

The project demonstration video shows the complete workflow, from entering a user question to displaying the AI-generated response.
[![Watch Project Demonstration](frontend-output.png)](https://drive.google.com/file/d/18fuPR0FhJOMUm_He_9tsVaRpFujRAGNQ/view?usp=drive_link)

### 8. Learning Outcomes

- Learned how to integrate an LLM API into a Python application.
- Understood how intent detection works with LLM response generation.
- Learned to generate context-aware responses.
- Understood Markdown response generation and rendering.
- Improved frontend and backend integration.
- Learned to test and validate the complete workflow.

### 9. Conclusion

In Week 2, I extended my Week 1 Enterprise Structured Ingestion Firewall into an Intent-Based AI Response Generator.

The application can now detect user intent, process the question using an LLM, generate a context-aware Markdown response, and display it through a chatbot interface.
# Week 1: Enterprise Structured Ingestion Firewall

## Project Overview

The Enterprise Structured Ingestion Firewall is an AI-powered message classification application developed as part of the 8-week AI Practical Guidance Program by Pro Hire Networks.

The application accepts a user message, analyzes it using a Large Language Model (LLM), and returns structured JSON containing the message intent, risk profile, priority, action requirement, and summary.

## Objectives

- Validate incoming user messages.
- Identify message intent using AI.
- Classify message risk and priority.
- Determine whether further action is required.
- Generate structured JSON output.
- Estimate input token usage.

## Technologies Used

- Python
- FastAPI
- Groq API
- Instructor
- Pydantic v2
- tiktoken
- HTML, CSS, and JavaScript
- Pytest
- Git and GitHub

## How It Works

1. The user enters a message in the web interface.
2. The frontend sends the message to the FastAPI backend.
3. The backend validates the input and estimates token usage.
4. The AI model analyzes the message.
5. The response is validated and formatted as JSON.
6. The frontend displays the result.

## Supported Intent Categories

- `greeting`
- `order_tracking`
- `payment_issue`
- `current_time`
- `general_question`
- `unknown`

## Example Input

```json
{
  "message": "I have not received my order yet. Please check its status."
}
```

## Example Output

This is an illustrative example of the expected response format. Actual results may vary.

```json
{
  "intent": "order_tracking",
  "risk_profile": "low",
  "priority": "medium",
  "requires_action": true,
  "summary": "The customer wants an update on a delayed order.",
  "token_metadata": {
    "estimated_input_tokens": 18,
    "note": "Estimated locally; may differ from provider token counts."
  }
}
```

## Output Demonstration Video

Watch the demonstration of the application, including message submission and the generated structured output.

[▶ Watch the Output Demonstration Video](docs/demo.mp4)

## Installation and Execution

### Prerequisites

- Python 3.11 or later
- A Groq API key
- A web browser

### 1. Install Dependencies

Open a terminal inside the `backend` folder and run:

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

Replace the placeholder with your own API key. Never upload your `.env` file to GitHub.

### 3. Run the Backend

From the `backend` folder, run:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 4. Run the Frontend

Open a second terminal, navigate to the `frontend` folder, and run:

```bash
python -m http.server 5500
```

Open `http://127.0.0.1:5500` in your browser.

Keep both the backend and frontend running while testing.

## Testing

From the backend folder, run:

```bash
pytest -q
```

## Security

- Store API keys in environment variables.
- Exclude `.env` and virtual environment folders from Git.
- Validate incoming requests and model responses.
- Treat token counts as estimates.

## Learning Outcomes

- Developing APIs with FastAPI.
- Integrating LLMs into Python applications.
- Generating structured JSON responses.
- Validating data using Pydantic.
- Estimating token usage.
- Connecting frontend and backend applications.
- Managing projects with Git and GitHub.

## Future Improvements

- Add database storage.
- Implement authentication.
- Improve error handling and logging.
- Expand automated testing.

## Author

**Bhavya Sree**  
B.Tech in Artificial Intelligence and Machine Learning

## Program

AI Practical Guidance Program — Pro Hire Networks

*Week 1 Project*

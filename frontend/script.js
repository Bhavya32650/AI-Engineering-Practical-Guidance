
const API_URL = "https://ai-engineering-practical-guidance.onrender.com/api/ingest";

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("message");
const messages = document.getElementById("messages");
const chatArea = document.getElementById("chatArea");
const sendButton = document.getElementById("sendButton");
const statusBox = document.getElementById("status");
const welcomeScreen = document.getElementById("welcomeScreen");
const newChatButton = document.getElementById("newChatButton");

let isLoading = false;

// Configure Markdown
marked.setOptions({
    breaks: true,
    gfm: true
});

// Add a chat message
function addMessage(content, sender, isMarkdown = false) {
    const messageRow = document.createElement("div");
    messageRow.className = `message-row ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender === "user" ? "You" : "AI";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    if (isMarkdown) {
        const markdownContent = document.createElement("div");
        markdownContent.className = "markdown-content";

        const safeHTML = DOMPurify.sanitize(
            marked.parse(content)
        );

        markdownContent.innerHTML = safeHTML;
        bubble.appendChild(markdownContent);
    } else {
        bubble.textContent = content;
    }

    messageRow.appendChild(avatar);
    messageRow.appendChild(bubble);

    messages.appendChild(messageRow);

    chatArea.scrollTop = chatArea.scrollHeight;

    return messageRow;
}

// Display intent information
function addIntentDetails(data) {
    const details = document.createElement("details");
    details.className = "intent-details";

    const summary = document.createElement("summary");
    summary.textContent = "View intent analysis";

    const content = document.createElement("div");
    content.className = "intent-content";

    const fields = [
        ["Intent", data.intent],
        ["Priority", data.priority],
        ["Risk Profile", data.risk_profile],
        ["Requires Action", data.requires_action],
        ["Summary", data.summary]
    ];

    fields.forEach(([label, value]) => {
        if (value === undefined || value === null) return;

        const row = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;

        const span = document.createElement("span");
        span.textContent = String(value);

        row.appendChild(strong);
        row.appendChild(span);
        content.appendChild(row);
    });

    details.appendChild(summary);
    details.appendChild(content);

    const lastMessage = messages.lastElementChild;

    if (lastMessage) {
        lastMessage.querySelector(".message-bubble")
            .appendChild(details);
    }
}

// Loading animation
function showLoading() {
    const row = document.createElement("div");
    row.className = "message-row assistant";
    row.id = "loadingMessage";

    row.innerHTML = `
        <div class="avatar">AI</div>
        <div class="message-bubble typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    messages.appendChild(row);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function removeLoading() {
    document.getElementById("loadingMessage")?.remove();
}

// Submit message
chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isLoading) return;

    const message = messageInput.value.trim();

    if (!message) {
        statusBox.textContent = "Please enter a message.";
        return;
    }

    welcomeScreen.classList.add("hidden");

    addMessage(message, "user");

    messageInput.value = "";
    messageInput.style.height = "auto";

    isLoading = true;
    sendButton.disabled = true;
    statusBox.textContent = "AI is generating a response...";

    showLoading();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok) {
            const detail = typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail ?? data);

            throw new Error(detail);
        }

        removeLoading();

        if (!data.response_markdown) {
            throw new Error("The AI response was empty.");
        }

        addMessage(data.response_markdown, "assistant", true);

        // Show Week 1 intent analysis with the Week 2 answer.
        const lastMessage = messages.lastElementChild;

        if (lastMessage) {
            const details = document.createElement("details");
            details.className = "intent-details";

            const summary = document.createElement("summary");
            summary.textContent = "View intent analysis";

            const content = document.createElement("div");
            content.className = "intent-content";

            [
                ["Intent", data.intent],
                ["Priority", data.priority],
                ["Risk Profile", data.risk_profile],
                ["Requires Action", data.requires_action],
                ["Summary", data.summary]
            ].forEach(([label, value]) => {
                if (value === undefined || value === null) return;

                const p = document.createElement("p");
                p.textContent = `${label}: ${value}`;
                content.appendChild(p);
            });

            details.appendChild(summary);
            details.appendChild(content);

            lastMessage.querySelector(".message-bubble")
                .appendChild(details);
        }

        statusBox.textContent = "";

    } catch (error) {
        console.error("Chat error:", error);

        removeLoading();

        addMessage(
            "Sorry, I couldn't process your request. " +
            error.message,
            "assistant"
        );

        statusBox.textContent =
            "Please check your backend connection and try again.";

    } finally {
        isLoading = false;
        sendButton.disabled = false;
        messageInput.focus();
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});

// New Chat button
newChatButton.addEventListener("click", () => {
    messages.innerHTML = "";
    welcomeScreen.classList.remove("hidden");
    messageInput.value = "";
    statusBox.textContent = "";
    messageInput.focus();
});

// Suggestion buttons
document.querySelectorAll(".suggestion").forEach((button) => {
    button.addEventListener("click", () => {
        messageInput.value = button.textContent.trim();
        messageInput.focus();
    });
});

// Automatically grow textarea
messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 150) + "px";
});

// Enter to send, Shift + Enter for a new line
messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});
// Sidebar suggested prompts
document.querySelectorAll(".prompt-item").forEach((button) => {
    button.addEventListener("click", () => {
        messageInput.value = button.dataset.prompt;
        messageInput.focus();
    });
});
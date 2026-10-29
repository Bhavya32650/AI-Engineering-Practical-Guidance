
const API_URL = "http://127.0.0.1:8000/api/ingest";

const form = document.getElementById("ingestionForm");
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submitButton");
const statusBox = document.getElementById("status");
const resultSection = document.getElementById("resultSection");
const resultBox = document.getElementById("result");
const copyJsonButton = document.getElementById("copyJsonButton");

let latestJson = "";

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        statusBox.textContent = "Please enter a message.";
        messageInput.focus();
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Analyzing...";
    statusBox.textContent = "Analyzing your message...";
    resultSection.classList.add("hidden");
    resultBox.textContent = "";
    latestJson = "";

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
                : JSON.stringify(data.detail ?? data, null, 2);

            throw new Error(
                `HTTP ${response.status}: ${detail}`
            );
        }

        latestJson = JSON.stringify(data, null, 2);
        resultBox.textContent = latestJson;
        resultSection.classList.remove("hidden");

        statusBox.textContent = "Success! Your message was analyzed.";
        copyJsonButton.textContent = "Copy JSON";
        copyJsonButton.disabled = false;

    } catch (error) {
        console.error("API request failed:", error);

        statusBox.textContent =
            error instanceof TypeError
                ? "Cannot connect to the backend. Check FastAPI and CORS."
                : "Request failed: " + error.message;

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Analyze Message";
    }
});

copyJsonButton.addEventListener("click", async () => {
    if (!latestJson) {
        statusBox.textContent = "There is no JSON response to copy.";
        return;
    }

    try {
        await navigator.clipboard.writeText(latestJson);
        copyJsonButton.textContent = "Copied!";
        statusBox.textContent = "JSON copied to clipboard.";

        setTimeout(() => {
            copyJsonButton.textContent = "Copy JSON";
        }, 2000);

    } catch (error) {
        // Fallback for browsers where clipboard access is unavailable.
        const temporaryArea = document.createElement("textarea");
        temporaryArea.value = latestJson;
        temporaryArea.style.position = "fixed";
        temporaryArea.style.left = "-9999px";

        document.body.appendChild(temporaryArea);
        temporaryArea.select();

        const copied = document.execCommand("copy");
        temporaryArea.remove();

        if (copied) {
            copyJsonButton.textContent = "Copied!";
            statusBox.textContent = "JSON copied to clipboard.";

            setTimeout(() => {
                copyJsonButton.textContent = "Copy JSON";
            }, 2000);
        } else {
            statusBox.textContent =
                "Copy failed. Please copy the JSON manually.";
        }
    }
});

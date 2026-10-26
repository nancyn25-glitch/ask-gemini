
const form = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const askButton = document.querySelector("#ask-btn");
const charCount = document.querySelector("#char-count");
const answerElement = document.querySelector("#answer");
const statusBadge = document.querySelector("#status-badge");
const copyButton = document.querySelector("#copy-btn");

questionInput.addEventListener("input", () => {
    charCount.textContent = `${questionInput.value.length} / 5000`;
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) {
        answerElement.textContent = "Please enter a question.";
        statusBadge.textContent = "Error";
        copyButton.hidden = true;
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Please wait...";
    statusBadge.textContent = "Thinking...";
    answerElement.textContent = "Gemini is preparing your answer...";
    copyButton.hidden = true;

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        answerElement.textContent = data.answer;
        statusBadge.textContent = "Answered";
        copyButton.hidden = false;
    } catch (error) {
        answerElement.textContent = error.message;
        statusBadge.textContent = "Error";
    } finally {
        askButton.disabled = false;
        askButton.textContent = "Ask Gemini";
    }
});

copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(answerElement.textContent);
        copyButton.textContent = "Copied!";

        setTimeout(() => {
            copyButton.textContent = "Copy answer";
        }, 1500);
    } catch {
        statusBadge.textContent = "Copy failed";
    }
});

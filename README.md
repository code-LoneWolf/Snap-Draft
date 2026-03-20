# SnapDraft - AI Email Reply Generator

SnapDraft is an AI-powered Chrome extension that integrates directly into Gmail and generates professional email replies using Google's Gemini API. The project is split into two parts: a Spring Boot backend that handles the AI request and a Chrome extension (content script) that injects a button into the Gmail compose window.

---

## Project Structure

```
snapdraft/
│
├── backend/                        (Spring Boot)
│   ├── src/main/java/com/email_writer/
│   │   ├── Controller/
│   │   │   ├── EmailGeneratorController.java
│   │   │   └── EmailRequest.java
│   │   ├── Service/
│   │   │   └── EmailGeneratorService.java
│   │   └── Config/
│   │       └── WebClientConfig.java
│   └── src/main/resources/
│       └── application.properties
│
└── extension/                      (Chrome Extension)
    ├── manifest.json
    ├── content.js
    └── SnapDraft.png
```

---

## Prerequisites

Make sure the following are installed before running the project.

- Java 17 or above
- Maven 3.6 or above
- Google Chrome browser
- A Gemini API key (from [Google AI Studio](https://aistudio.google.com/))

---

## Backend Setup

### 1. Clone or download the project

```bash
git clone https://github.com/your-username/snapdraft.git
cd snapdraft/backend
```

### 2. Set environment variables

The backend reads the Gemini API URL and key from environment variables. Set them in your system before running.

On Linux or macOS:

```bash
export GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
export GEMINI_KEY=your_gemini_api_key_here
```

On Windows (Command Prompt):

```cmd
set GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
set GEMINI_KEY=your_gemini_api_key_here
```

On Windows (PowerShell):

```powershell
$env:GEMINI_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
$env:GEMINI_KEY="your_gemini_api_key_here"
```

These values map to the following entries in `application.properties`:

```properties
gemini.api.url=${GEMINI_URL}
gemini.api.key=${GEMINI_KEY}
```

### 3. Build and run the backend

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`.

### 4. Test the backend (optional)

You can test the endpoint using curl or Postman.

```bash
curl -X POST http://localhost:8080/api/email/generate \
  -H "Content-Type: application/json" \
  -d '{"emailContent": "Hi, can we schedule a meeting tomorrow?", "tone": "professional"}'
```

You should get a generated email reply as a plain text response.

---

## Chrome Extension Setup

### 1. Open Chrome Extensions page

Open Google Chrome and go to:

```
chrome://extensions/
```

### 2. Enable Developer Mode

Toggle the "Developer mode" switch in the top right corner of the page.

### 3. Load the extension

Click "Load unpacked" and select the `extension/` folder from this project. The SnapDraft extension will appear in your extensions list.

### 4. Pin the extension (optional)

Click the puzzle icon in the Chrome toolbar and pin SnapDraft so it appears in your toolbar.

---

## How to Use

1. Make sure the Spring Boot backend is running on `http://localhost:8080`.
2. Open [Gmail](https://mail.google.com) in Chrome.
3. Open any email you want to reply to.
4. Click the "Reply" button in Gmail to open the compose window.
5. You will see an "AI Reply" button injected into the compose toolbar.
6. Click "AI Reply". The extension reads the email content, sends it to the backend, and inserts the generated reply directly into the compose box.
7. Review the reply and send it.

---

## How It Works

### Backend

- `EmailGeneratorController` exposes a POST endpoint at `/api/email/generate` that accepts the email content and tone.
- `EmailGeneratorService` builds a prompt from the request, calls the Gemini API using Spring WebClient, and parses the response.
- `WebClientConfig` sets up the WebClient bean used for making HTTP requests.
- `EmailRequest` is a simple data class holding `emailContent` and `tone`.

### Extension

- `manifest.json` defines the extension with Manifest V3, declares permissions for Gmail, and loads `content.js` when Gmail is opened.
- `content.js` is a content script that watches the Gmail DOM using a MutationObserver. When a compose toolbar is detected, it injects the "AI Reply" button.
- On click, the button reads the current email thread content, sends a POST request to the local backend, and inserts the reply text into the Gmail compose box.

---

## API Endpoint Reference

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | /api/email/generate   | Generates an AI reply for an email |

Request body:

```json
{
  "emailContent": "The original email text here",
  "tone": "professional"
}
```

Response: plain text string containing the generated reply.

---

## Common Issues

**"AI Reply" button not appearing**

Make sure the backend is running before opening Gmail. Also try refreshing the Gmail tab after loading the extension.

**Failed to generate reply error**

Check that the backend is running on port 8080 and the environment variables are correctly set. Open the Chrome DevTools console on the Gmail tab to see detailed error logs.

**Extension not loading**

Make sure Developer Mode is enabled in `chrome://extensions/` and that you selected the correct folder containing `manifest.json`.

**CORS errors**

The backend is configured with `@CrossOrigin(origins = "*")` so all origins are allowed. If you still see CORS errors, verify the backend is running and accessible at `http://localhost:8080`.

---

## Notes

- The backend must be running locally whenever you use the extension. It is not deployed to any server.
- The Gemini API key should never be committed to version control. It is stored as an environment variable for this reason.
- The tone is currently hardcoded to "professional" in the extension but can be changed or made configurable.

---

## Tech Stack

- Java 17, Spring Boot, Spring WebFlux (WebClient)
- Google Gemini API
- Chrome Extension (Manifest V3, vanilla JavaScript)
- Lombok, Jackson
- Maven

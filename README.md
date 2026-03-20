SnapDraft: AI-Powered Email Assistant
Project Overview
SnapDraft is a Chrome extension designed to streamline email communication within Gmail. By integrating a Spring Boot backend with a custom-built extension, SnapDraft allows users to generate professional, context-aware email replies using Google's Gemini AI. The project bridges the gap between AI text generation and the Gmail user interface, enabling users to go "from thought to sent in seconds."

Project Structure
The project is split into a robust backend and a high-performance extension:

Backend (Spring Boot)
WebClientConfig.java: Sets up the reactive WebClient for external API calls.

EmailGeneratorController.java: REST endpoint for processing extension requests.

EmailGeneratorService.java: Prompt engineering and Gemini API communication.

EmailRequest.java: Data model (DTO) for incoming email content and tone.

Extension (SnapDraft)
manifest.json: Defines the extension configuration (v3), permissions, and script injection.

content.js: Core logic for DOM injection, mutation observation, and API interaction.

SnapDraft.png: The visual identity/icon for the extension.

Technical Stack
Backend: Java 17, Spring Boot 3.x, Spring WebFlux, Lombok.

Extension: JavaScript (ES6+), Chrome Extension API (Manifest V3).

AI Model: Google Gemini 1.5 Flash.

Key Features
Dynamic UI Injection: Uses MutationObserver to monitor the Gmail DOM and inject the "AI Reply" button as soon as a compose or reply window is detected.

Context Extraction: Automatically scrapes the existing email thread to provide the AI with the necessary context for a relevant reply.

Asynchronous Communication: Uses the Fetch API to send requests to the local Spring Boot server, ensuring a smooth, non-blocking user experience.

Direct Text Insertion: Utilizes document.execCommand to insert the AI-generated draft directly into the Gmail editor.

Configuration
Environment Variables
For security, API credentials are not hardcoded in the source. Ensure the following variables are set on your local machine:

GEMINI_URL: The Gemini API generateContent endpoint.

GEMINI_KEY: Your private Google Gemini API key.

Application Properties
The application.properties file pulls these values dynamically:

Properties
spring.application.name=email-writer

# Gemini API Configuration via Environment Variables
gemini.api.url=${GEMINI_URL}
gemini.api.key=${GEMINI_KEY}

# Server Port
server.port=8080
Execution Steps
1. Backend Setup
Set the GEMINI_KEY and GEMINI_URL environment variables in your system or IDE.

Navigate to the backend directory and build the project:

Bash
mvn clean install
Start the Spring Boot application:

Bash
mvn spring-boot:run
The server will start on http://localhost:8080.

2. Extension Installation
Open Chrome and navigate to chrome://extensions/.

Turn on Developer Mode (top-right toggle).

Click Load unpacked and select the folder containing the extension files.

Verify that the SnapDraft icon appears in your extensions bar.

3. Usage
Open Gmail and click Compose or Reply.

Look for the blue AI Reply button in the bottom toolbar.

Click the button; the extension will capture the email content and send it to the backend.

The button text will change to "Generating..." while the AI processes the prompt.

The generated reply is automatically inserted into the message body.

Implementation Details
Security: Used environment variable injection (${}) to prevent sensitive API keys from being committed to version control.

Lombok Integration: Utilized @Data and @AllArgsConstructor to maintain a clean, boilerplate-free Java codebase.

Robust Selectors: The content.js script includes multiple fallback selectors to ensure the button is injected even if Gmail updates its internal class names.

CORS Support: The backend is configured with @CrossOrigin to allow the Chrome extension to communicate with the local server securely.

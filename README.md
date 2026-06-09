# 🛡️ PhishGuard AI: Real-Time Threat Detection System

PhishGuard AI is a full-stack cybersecurity mobile application designed to detect and classify phishing URLs in real-time. Built with a React Native frontend and a FastAPI Python backend, the system utilizes a Random Forest machine learning model to analyze URL heuristics and provide immediate threat intelligence to the user.

## 🏗️ System Architecture

The application follows a secure client-server architecture deployed entirely in the cloud:
* **Frontend:** React Native (Expo) - Provides a clean, intuitive mobile UI for payload submission and threat visualization.
* **Backend API:** Python (FastAPI) - Hosted on Render, handling RESTful requests, user authentication, and serving the AI prediction engine.
* **Machine Learning Engine:** Scikit-Learn (Random Forest Classifier) - Extracts features (e.g., URL length, special characters, IP presence) to calculate a threat probability score.
* **Database:** MySQL (Hosted on Aiven) - Securely logs user telemetry, scan history, and system events.

## ✨ Core Features
* **AI-Powered URL Scanning:** Real-time heuristic analysis of suspicious links.
* **Secure Authentication:** Bcrypt password hashing and secure login routing.
* **Cloud Telemetry:** Persistent logging of scan results for future threat analysis.
* **Cross-Platform Mobile UI:** Built for both Android and iOS environments.

## 1. 🚀 Local Development Setup

### Clone the Repository
```bash
git clone [https://github.com/GABRIEL-bot-git/PhishGuard_Master.git](https://github.com/GABRIEL-bot-git/PhishGuard_Master.git)

```
2. Backend Environment (Python)
Navigate to the backend_api directory:

Bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
(Ensure your .env file is configured with your Aiven MySQL database credentials).

3. Frontend Environment (React Native)
Navigate to the phishguard-mobile directory:

Bash
npm install
npx expo start
Scan the generated QR code using the Expo Go app on your mobile device.

Developed as a comprehensive study in applied machine learning and secure systems architecture.

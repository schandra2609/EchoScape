# 🍃 Echoscape 
**An AI-Powered Nature Journaling Platform**

Echoscape is a full-stack web application that allows users to write journal entries inspired by immersive natural environments (Forest, Ocean, Mountain). It integrates the **Google Gemini 1.5 Flash LLM** to perform real-time psychological text analysis, extracting the user's primary emotions, key themes, and generating a concise summary of their thoughts.

## ✨ Key Features
* **AI Text Analysis:** Seamless integration with Google's GenAI SDK to process unstructured journal text into structured JSON insights.
* **Data Aggregation:** Advanced MongoDB aggregation pipelines to calculate user statistics, most frequent environments, and recent emotional trends.
* **Full Test Coverage:** Comprehensive backend testing suite using Jest and Supertest, covering API routes, database operations, and error handling.
* **Containerized Infrastructure:** Fully dockerized frontend (Nginx multi-stage build) and backend (Node Alpine) for guaranteed reproducibility.
* **Interactive API Docs:** Built-in Swagger UI for easy endpoint exploration and testing.

---

## 🚀 Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, Lucide Icons  
**Backend:** Node.js (v22), Express.js, MongoDB, Mongoose  
**AI Integration:** `@google/genai` (Gemini 1.5 Flash)  
**Testing & DevOps:** Jest, Supertest, Docker, Docker Compose  

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following credentials:
* A [MongoDB Atlas](https://www.mongodb.com/atlas) URI (or local MongoDB instance)
* A [Google Gemini API Key](https://aistudio.google.com/)

Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed if you plan to use the containerized setup (Recommended).

---

## 🛠️ Environment Setup

Before running the application using either method below, you must configure your environment variables.

1. Navigate to the `server/` directory.
2. Create a file named `.env.development`.
3. Add the following variables:

```env
# Server Config
PORT=5000
NODE_ENV=development
API_V=/api/v1

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Database Config
MONGODB_URI=your_mongodb_connection_string_here

# LLM Config
GEMINI_API_KEY=your_google_gemini_api_key_here
```

*(Note: The frontend is pre-configured via Vite proxy to route `/api` requests to port 5000).*

---

## 🐳 Running with Docker (Recommended)

The easiest way to run the entire stack is via Docker Compose. This ensures you do not need to install Node.js locally or worry about dependency conflicts.

1. Open your terminal at the **project root**.
2. Run the build command:
```bash
docker compose up --build
```
3. Once the containers are running, access the application:
   * **Frontend Application:** [http://localhost:3000](http://localhost:3000)
   * **Backend API / Health Check:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

To stop the application, press `Ctrl + C` in the terminal, or run `docker compose down`.

---

## 🏃‍♂️ Running Manually (Without Docker)

If you prefer to run the application using your local Node environment, you will need two terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Testing

The backend includes a robust automated testing suite using Jest and an in-memory MongoDB instance to ensure data integrity without touching your production database.

To run the test suite:
```bash
cd server
npm install # if not already installed
npm run test
```

To view the **Test Coverage Report**:
```bash
npm run test:coverage
```

---

## 📚 API Documentation (Swagger)

The backend features an interactive Swagger UI for testing endpoints directly. Once the backend server is running (either via Docker or manually), navigate to:

**👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 🏗️ Architecture & System Design

For a deep dive into the engineering decisions behind Echoscape, please read the **[`server/ARCHITECTURE.md`](server/ARCHITECTURE.md)** file. It covers:
1. Horizontal Scaling for 100K+ Users
2. LLM Cost & Latency Optimization
3. Caching Strategies (Redis)
4. Data Security & Dual-Token Authentication

---
**License:** MIT
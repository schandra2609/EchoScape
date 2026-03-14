# 🍃 Echoscape API

Echoscape is an AI-powered nature journaling application. It allows users to write journal entries based on immersive natural environments (Forest, Ocean, Mountain) and utilizes the **Google Gemini 1.5 Flash LLM** to perform psychological text analysis, extracting the user's primary emotion, key themes, and a concise summary.

## 🚀 Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, Axios, React Router.
* **Backend:** Node.js, Express.js, MongoDB (Mongoose).
* **AI Integration:** Google Gemini Generative AI SDK (`@google/genai`).
* **Documentation:** Swagger UI.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* A [MongoDB Atlas](https://www.mongodb.com/atlas) URI (or local MongoDB instance)
* A [Google Gemini API Key](https://aistudio.google.com/)

---

## 🛠️ Installation & Setup

This project is structured as a monorepo containing both the `client` and `server`.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Echoscape
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env.development` file inside the `server/` directory and add the following variables:
```env
# Server Config
PORT=5000
NODE_ENV=development
API_V=/v1

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Database Config
MONGODB_URI=your_mongodb_connection_string_here

# LLM Config
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
*(Note: The frontend is pre-configured to communicate with the backend on `http://localhost:5000/api/v1`)*

---

## 🏃‍♂️ Running the Application

You will need two terminal windows open to run the full stack.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*The backend will start on `http://localhost:5000`*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*The frontend will start on `http://localhost:3000`*

---

## 📚 API Documentation (Swagger)

The backend features an interactive Swagger UI for testing endpoints directly.
Once the backend server is running, navigate to:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 🏗️ Architecture & Scaling
Detailed answers regarding system scaling, LLM cost optimization, caching strategies, and data security can be found in the [`server/ARCHITECTURE.md`](server/ARCHITECTURE.md) file.
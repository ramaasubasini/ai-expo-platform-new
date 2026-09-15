# AI Expo Platform

A full-stack AI-powered learning platform with mock interviews, study rooms, AI tutoring, resume analysis, and real-time face-to-face WebRTC video integration.

## 🚀 Deployment Guide (Render)

The platform is designed to be deployed as a single web service. The Flask backend serves both the API and the static frontend files securely.

### Prerequisites
- A free [Render](https://render.com) account.
- A free [MongoDB Atlas](https://mongodb.com/atlas) account (for production database).

### Step-by-Step Render Deployment

1. **Connect Repository:**
   Log into Render, click **New +** -> **Web Service**, and connect this GitHub repository.

2. **Configure the Service:**
   - **Name:** `ai-expo-platform` (or whatever you prefer)
   - **Environment:** `Python 3`
   - **Region:** Choose the closest one to you
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`

3. **Set Environment Variables:**
   Under the **Environment** section, add the following variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `PYTHON_VERSION` | `3.11.0` | Forces Render to use Python 3.11 |
   | `FLASK_ENV` | `production` | Enables production mode |
   | `SECRET_KEY` | *(Generate a random string)* | Used for Flask session security |
   | `JWT_SECRET_KEY` | *(Generate a random string)* | Used to sign JWT auth tokens |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `GEMINI_API_KEY` | *(Your Gemini API Key)* | Required for AI logic |

   *Note: Render automatically injects the `$PORT` variable into the container, so you do not need to set it manually.*

4. **Deploy:**
   Click **Create Web Service**. Render will automatically install the requirements and launch Gunicorn. 

### ⚠️ Important Note on Databases
If you do not set a `MONGO_URI`, the application will fall back to an "In-Memory" mock database. This is great for local testing, but in production (Render), the server goes to sleep when inactive. **When the server wakes up, an in-memory database is completely erased.** 
To make your users, chat messages, and rooms permanent, you MUST set the `MONGO_URI` environment variable pointing to a real database like MongoDB Atlas.

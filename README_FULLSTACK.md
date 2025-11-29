# Rice Traceability App - Full Stack Architecture

This project has been upgraded to a **Full Stack Application** using the **MERN** stack principles (Node.js, Express, React).

## 🏗️ Architecture

### **Frontend (Client)**
*   **Tech**: React, Vite, TypeScript
*   **Role**: Handles UI, user interaction, and calls the backend API.
*   **Security**: No longer exposes API keys or business logic.

### **Backend (Server)**
*   **Tech**: Node.js, Express.js
*   **Role**:
    *   **Traceability API**: Processes CSV data and serves product journey details.
    *   **AI Services**: Securely communicates with Google Gemini API for Price Estimation and Chatbot.
    *   **Data Management**: Manages the `data.csv` source of truth.

## 🚀 How to Run

1.  **Setup Environment Variables**
    Create a `.env` file in the `backend` folder:
    ```env
    API_KEY=your_google_gemini_api_key
    PORT=5000
    ```

2.  **Start the Application**
    From the root directory, run:
    ```bash
    npm run dev
    ```
    This command uses `concurrently` to start both:
    *   **Backend Server**: http://localhost:5000
    *   **Frontend App**: http://localhost:5173

## 🔌 API Endpoints

*   `GET /api/trace/:batchId` - Get traceability data for a specific batch.
*   `POST /api/estimate` - Get AI-powered wholesale price estimates.
*   `POST /api/chat` - Chat with the AI assistant (context-aware).

## 💼 Interview Talking Points

*   **Separation of Concerns**: Logic moved to backend for better maintainability and security.
*   **Security**: API keys are hidden on the server side (BFF - Backend for Frontend pattern).
*   **Scalability**: The backend can now be easily connected to a real database (MongoDB/PostgreSQL) without changing the frontend.

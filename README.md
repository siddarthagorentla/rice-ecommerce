# 🌾 MKRM Rice - E-Commerce & Traceability Platform

A modern full-stack web application that enables **end-to-end traceability of rice** from farms to consumers, featuring an AI-powered chatbot, wholesale price estimator, and complete e-commerce functionality.

🔗 **[Live Demo](https://entreprise-ecommerce-rice.vercel.app/)**

---

## ✨ Features

* **E-Commerce Shop** — Browse and purchase premium rice varieties with a full cart and checkout flow.
* **End-to-End Traceability** — Track each rice batch from origin through processing, logistics, and to the final consumer using Batch IDs.
* **AI-Powered Price Estimator** — Get real-time wholesale price estimates powered by Google Gemini AI.
* **Paddy-to-Rice Converter** — Calculate estimated yield and market value from raw paddy to finished rice products.
* **AI Chatbot** — Context-aware assistant that can answer questions about products, traceability, and more.
* **Simulated Email Notifications** — Order confirmation emails logged to the console.
* **Persistent Cart & Orders** — Cart and order history survive page refreshes via localStorage.
* **Responsive Design** — Works seamlessly on desktop and mobile devices.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express |
| **AI Integration** | Google Generative AI (Gemini 1.5 Flash) |
| **Styling** | Vanilla CSS with CSS Variables |
| **Markdown** | react-markdown + remark-gfm |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-username/rice-ecommerce.git
   cd rice-ecommerce
   ```

2. **Install frontend dependencies**

   ```sh
   npm install
   ```

3. **Install backend dependencies**

   ```sh
   cd backend
   npm install
   ```

4. **Configure environment variables**

   ```sh
   # In the backend/ directory, copy the example and add your key
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

5. **Start the development server** (runs both frontend & backend)

   ```sh
   # From the project root
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5006

---

## 📁 Project Structure

```
rice-ecommerce/
├── index.html          # Entry HTML file
├── index.tsx           # Main React application (all components)
├── index.css           # Global styles
├── vite.config.ts      # Vite configuration
├── package.json        # Frontend dependencies & scripts
├── tsconfig.json       # TypeScript configuration
├── backend/
│   ├── server.js       # Express API server
│   ├── data.csv        # 500 batch IDs for traceability
│   ├── package.json    # Backend dependencies
│   ├── .env            # Environment variables (not committed)
│   └── .env.example    # Environment variable template
├── DEPLOYMENT.md       # Deployment guide for Render.com
└── README.md           # This file
```

---

## 🔑 Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | `backend/.env` | Google Gemini API key for AI features |
| `PORT` | `backend/.env` | Backend server port (default: 5006) |
| `VITE_API_URL` | Frontend env | Backend URL for production deployment |

> **Note:** Without a `GEMINI_API_KEY`, AI features (Price Estimator, Chatbot) will fall back to mock/simulated responses. The rest of the app works fully without it.

---

## 🧪 Testing

Ad-hoc test scripts are available:

```sh
# Test traceability endpoint (backend must be running)
node test_backend.js

# Test AI endpoints (backend must be running with API key)
node test_ai.js
```

---

## 🌍 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render.com.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

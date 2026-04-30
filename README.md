                                                  # SmartRoute AI 🌍

An interactive, production-ready full-stack web application designed to solve, visualize, and learn about the Traveling Salesman Problem (TSP).

![SmartRoute AI Overview](https://img.shields.io/badge/Status-Complete-success) ![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20Express%20%7C%20MySQL-blue)

## ✨ Features

- **Interactive Route Builder:** Click directly on an interactive world map or search for cities to build your custom path.
- **Advanced Optimization Algorithms:** 
  - Nearest Neighbor (Fast heuristic)
  - 2-Opt Optimization (Local search refinement)
  - Genetic Algorithm (Evolutionary population-based solver)
- **Learning Mode:** Watch the algorithms solve the problem step-by-step with play/pause and speed controls.
- **Compare Performance:** Run all three algorithms simultaneously to compare distance, execution time, and efficiency.
- **AI Assistant:** A floating, built-in chat widget to answer your questions about optimization, algorithms, and more.
- **Robust Fallbacks:** Features an intelligent in-memory database fallback system if a MySQL instance isn't available.

## 🚀 How to Use the Site

1. **Dashboard:** Start here to get an overview of your saved routes and quick links to the platform's tools.
2. **Route Builder:** 
   - Add at least 3 cities using the search bar or by clicking anywhere on the map.
   - Click "Optimize Route" to instantly generate the shortest path.
   - Save your route to view it later in the History tab.
3. **Learning Mode:** Select an algorithm, hit 'Play', and watch a step-by-step visualization of how the TSP is solved.
4. **Compare:** Add a set of cities and see exactly how Nearest Neighbor, 2-Opt, and Genetic Algorithms stack up against each other.

## 🛠️ Tech Stack

- **Frontend:** React 19, Tailwind CSS v4, Vite, Leaflet, Recharts, Lucide Icons.
- **Backend:** Node.js, Express, JSON Web Tokens (JWT), bcrypt.
- **Database:** MySQL 8.4 (with seamless in-memory array fallbacks for easy testing).

## 💻 Local Setup & Installation

To run this project locally, follow these simple steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/adityasing9/SmartRoute-AI.git
cd SmartRoute-AI
```

### 2. Install dependencies
From the root of the project, install both frontend and backend dependencies using the root `package.json`:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory. You can use the following template:
```env
# Database Config (Optional if you just want to test using the in-memory fallback)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=smartroute_ai

# JWT Secret for Authentication
JWT_SECRET=supersecretjwtkey

# OpenAI API (Optional for the AI Chat feature)
OPENAI_API_KEY=your_api_key_here
```

### 4. Run the Development Servers
Start both the React frontend and Express backend simultaneously with a single command:
```bash
npm run dev
```

- The UI will be available at: `http://localhost:5173`
- The backend API runs on: `http://localhost:3001`

---
Built with minimal, modern Apple-style UI principles for maximum focus and visual clarity.

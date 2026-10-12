# GAMEVAULT – Video Game Collection Manager

A beginner-friendly MERN Stack project for the B.Sc. IT Semester V Full Stack Development practical.

## Features
- Add, view, update, delete, and search video game records
- React frontend using `useState()` and `useEffect()`
- Axios API integration
- Node.js and Express REST API
- MongoDB database using Mongoose
- Frontend and backend validation
- Duplicate game-title handling (case-insensitive)
- Delete confirmation and success/error messages
- Automatically inserts four sample games if the collection is empty

## Technologies
React, Vite, Node.js, Express.js, MongoDB, Mongoose, Axios, CSS, Git, GitHub.

## Requirements
- Node.js and npm
- MongoDB Community Server running locally
- Visual Studio Code (recommended)

## Project structure
```text
gamevault-mern-submission/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── style.css
├── server/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── models/Game.js
│   ├── routes/games.js
│   └── seed.js
├── .gitignore
└── README.md
```

## Setup

### 1. Start MongoDB
Make sure the local MongoDB service is running. The default connection is:
`mongodb://127.0.0.1:27017/gamevault`

### 2. Configure the backend
Open a terminal in the project root:
```bash
cd server
npm install
```
Copy `.env.example` to `.env` (or create `.env` with the same values):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gamevault
```

### 3. Start the backend (Terminal 1)
From the `server` folder:
```bash
npm start
```
Expected messages:
- `MongoDB connected: gamevault`
- `Sample games inserted.` (only if the collection was empty)
- `Server running at http://localhost:5000`

Health check: `http://localhost:5000/api/health`
Games API: `http://localhost:5000/api/games`

### 4. Start the frontend (Terminal 2)
Open a second terminal in VS Code:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

**Keep both terminals running.** The frontend and backend are intentionally started separately to match the practical workflow.

## Game fields
- Game name (required; unique, case-insensitive)
- Genre (required)
- Platform (required)
- Release year (integer, 1950 to current year + 2)
- Rating (number from 0 to 10)

## REST API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/games` | Get all games |
| GET | `/api/games/:id` | Get one game |
| POST | `/api/games` | Add a game |
| PUT | `/api/games/:id` | Update a game |
| DELETE | `/api/games/:id` | Delete a game |
| GET | `/api/health` | Check backend status |

## Testing checklist
1. Add a game with valid details.
2. Search for a game by title.
3. Edit a game's details.
4. Delete a game and confirm the prompt.
5. Try submitting empty fields.
6. Try a rating below 0 or above 10.
7. Try adding an existing title.
8. Verify the `gamevault` database and `games` collection in MongoDB Compass.

## GitHub submission
Create a new GitHub repository, then run these commands from this folder:
```bash
git init
git add .
git commit -m "Initial GAMEVAULT MERN project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

Do not upload `.env`, `node_modules`, passwords, or database credentials. The `.gitignore` excludes these files.

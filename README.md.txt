# 📝 Smart Notes — Persistent Mini-App

A full-stack notes app where you can **create, view, update, delete, and pin notes** — data persists across restarts.

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React + Vite                      |
| Backend   | ASP.NET Core Web API              |
| ORM       | Entity Framework Core             |
| Database  | Microsoft SQL Server              |

---

## ⚡ How to Run (Fresh Machine)

### Prerequisites
Make sure these are installed:
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (local or express)

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### Step 2 — Setup Backend

```bash
cd backend
```

Open `appsettings.json` and update the connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=SmartNotesDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Then run migrations and start the server:

```bash
dotnet ef database update
dotnet run
```

Backend will be running at: `https://localhost:7278`  
Swagger UI: `https://localhost:7278/swagger/index.html`

---

### Step 3 — Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

### Step 4 — Open the App

Visit **http://localhost:5173** in your browser. Notes you create will persist after restarting both servers.

---

## ✨ Features

- ➕ Add notes with title and content
- ✏️ Edit existing notes inline via modal
- 🗑️ Delete notes
- 📌 Pin / Unpin important notes (pinned notes stay at top)
- 🔍 Live search across all notes
- 🌙 Dark / Light theme toggle
- 📱 Fully responsive — works on mobile, tablet, desktop

---

## 📁 Project Structure

```
/
├── backend/        # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── ...
├── frontend/       # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   └── services/
│   └── ...
└── README.md
```
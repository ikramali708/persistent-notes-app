# 📝 Smart Notes — Persistent Mini-App

A full-stack notes app where users can create, view, update, delete, and pin notes. Data persists between restarts using SQL Server.

---

## 🛠 Tech Stack

| Layer    | Technology                   |
|----------|------------------------------|
| Frontend | React + Vite                 |
| Backend  | ASP.NET Core Web API         |
| ORM      | Entity Framework Core        |
| Database | Microsoft SQL Server         |

---

## ⚡ How to Run (Fresh Machine)

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server (local or express edition)

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### Step 2 — Run Backend

```bash
cd backend
```

Open `appsettings.json` and set your SQL Server connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=SmartNotesDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Then:

```bash
dotnet ef database update
dotnet run
```

Backend: `https://localhost:7278`  
Swagger: `https://localhost:7278/swagger/index.html`

---

### Step 3 — Run Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

### Step 4 — Open the App

Go to **http://localhost:5173** — create some notes, close the app, restart it — your notes will still be there.

---

## ✨ Features

- ➕ Add notes with title and content
- ✏️ Edit existing notes via modal
- 🗑️ Delete notes
- 📌 Pin / Unpin notes (pinned notes always appear at top)
- 🔍 Live search across all notes
- 🌙 Dark / Light theme toggle
- 📱 Fully responsive (mobile, tablet, desktop)

---

## 📁 Project Structure

```
/
├── backend/        # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Program.cs
├── frontend/       # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   └── services/noteService.js
│   └── index.html
├── README.md
└── ANSWERS.md
```
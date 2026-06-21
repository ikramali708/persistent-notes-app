 📝 Smart Notes App

A full-stack **Notes Management Application** built with **React (Frontend)** and **ASP.NET Core Web API + EF Core + SQL Server (Backend)**.

This project allowsthe users to create, update, delete, pin, and search notes in a clean Google Keep–style UI.

 🚀 Live Features

* ➕ Add new notes
* ✏️ Edit notes
* 🗑️ Delete notes
* 📌 Pin / Unpin notes
* 🔍 Search notes (title + content)
* 🎨 Clean responsive UI (Google Keep style)
* 🔔 Toast notifications for actions
* 📡 REST API integration

 🛠️ Tech Stack

# Frontend:

* React (Vite)
* JavaScript (ES6+)
* Axios
* React Toastify
* CSS (inline styling)

### Backend:

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* RESTful APIs

---

## 📁 Project Structure

```
SmartNotesApp/
│
├── Presistent Mini App/        # Backend (ASP.NET Core API)
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Program.cs
│
├── notes-ui/                   # Frontend (React)
│   ├── src/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│
└── README.md
```

---

## ⚙️ Backend Setup

### 1️⃣ Create Database

```sql
CREATE DATABASE NotesDb;
```

### 2️⃣ Update Connection String

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=NotesDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### 3️⃣ Run Migrations

```bash
Add-Migration InitialCreate
Update-Database
```

### 4️⃣ Run API

```bash
dotnet run
```

API will run on:

```
https://localhost:7278
```

---

## 💻 Frontend Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run React app

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔗 API Endpoints

| Method | Endpoint            | Description   |
| ------ | ------------------- | ------------- |
| GET    | /api/notes          | Get all notes |
| POST   | /api/notes          | Create note   |
| PUT    | /api/notes/{id}     | Update note   |
| DELETE | /api/notes/{id}     | Delete note   |
| PATCH  | /api/notes/{id}/pin | Toggle pin    |

---

## 🎯 Features in Detail

### 🧠 Smart Notes System

* Stores title, content, timestamps
* Supports pinned notes separately

### 🔍 Search Engine

* Filters notes in real-time
* Searches both title and content

### 📌 Pin System

* Important notes stay at top

### 🔔 Notifications

* Success / error / info messages using React Toastify

---

## 📸 UI Preview

> (Add screenshots here later)

---

## 🚀 Future Improvements

* 🌙 Dark Mode
* 📱 Mobile responsive optimization
* ✏️ Rich text editor
* ☁️ Cloud deployment (Azure / AWS)
* 👥 User authentication (JWT)

---

## 👨‍💻 Author

**Ikram Ali**

* GitHub: https://github.com/ikramali708/
* LinkedIn: https://www.linkedin.com/in/ikram-ali3752/

---

## ⭐ If you like this project

Give it a star ⭐ and feel free to fork it!



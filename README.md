# 📚 Course Tracker Fullstack App

A fullstack MERN application for tracking your online course progress — built with React, Node.js, Express, MongoDB, and JWT-based authentication.

---

## 📦 Features

- User authentication (Register / Login / Logout)
- JWT-based protected routes
- Track online courses with:
  - Course Name
  - Instructor
  - Status (Ongoing / Completed / Planned)
  - Progress Percentage
  - Completion Date & Certificate Link (optional)
  - Personal Notes
- Add, Edit, Delete, and View tracked courses
- CORS setup for frontend-backend communication
- Clean Bootstrap-based UI with React Router for routing

---

## 📂 Tech Stack

- **Frontend:** React, React Router, Axios, Bootstrap
- **Backend:** Node.js, Express, Mongoose, JWT
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)

---

## 🛠️ Getting Started

### 🚀 Clone the repository:
```bash
git clone https://github.com/your-username/course-tracker.git
cd course-tracker
```

### 📦 Install Dependencies:

#### Backend:
```bash
cd course-tracker-fullstack
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### 🔑 Setup Environment Variables

Create a `.env` file in the `course-tracker-fullstack` directory:

```bash
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## ▶️ Run the App

### Start Backend:
```bash
cd course-tracker-fullstack
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm start
```

---

## 🌐 Access

Frontend: http://localhost:3000/  
Backend API: http://localhost:5000/

---

## 📃 License

This project is licensed for educational and personal use.

---

## 📺 Credits

Made with ❤️ by [venkat374](https://github.com/venkat374)

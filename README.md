# Course Tracker Application Documentation

## 1. Project Overview
The **Course Tracker App** is a full-stack web application designed to help users organize and track their online learning progress. It goes beyond simple list-keeping by integrating **gamification elements** (streaks, badges) and a **Pomodoro timer** to encourage consistent study habits.

Built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and modern tools like **Vite** and **TypeScript**, it offers a responsive and interactive user experience.

## 2. Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/) for fast build tooling.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety.
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/)) for accessible, customizable components.
- **State Management**: React Context API (AuthContext).
- **Routing**: [React Router](https://reactrouter.com/) (v7).
- **HTTP Client**: [Axios](https://axios-http.com/).
- **Visualization**: [Recharts](https://recharts.org/) for analytics charts.
- **Icons**: [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/).

### Backend
- **Runtime**: [Node.js](https://nodejs.org/).
- **Framework**: [Express.js](https://expressjs.com/).
- **Language**: [TypeScript](https://www.typescriptlang.org/).
- **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/) ODM).
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) and [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing.
- **Environment**: [dotenv](https://www.npmjs.com/package/dotenv) for configuration.

## 3. Architecture

### Backend Structure (MVC Pattern)
The backend follows a standard Model-View-Controller (MVC) architecture (minus the View, as it's an API):
- **`src/models/`**: Defines Mongoose schemas and TypeScript interfaces for data.
  - [User](file:///c:/Users/venkt/Documents/projects/course-tracker-app/course-tracker-fullstack/backend/src/models/user.model.ts#19-31): Stores credentials, streaks, badges, and Pomodoro settings.
  - [Course](file:///c:/Users/venkt/Documents/projects/course-tracker-app/course-tracker-fullstack/backend/src/models/course.model.ts#6-20): Stores course details, progress, and status.
- **`src/controllers/`**: Contains the business logic for handling requests.
  - `auth.controller.ts`: Handles registration, login, and user stats.
  - `courses.controller.ts`: Handles CRUD operations for courses.
- **`src/routes/`**: Defines API endpoints and maps them to controllers.
- **`src/middleware/`**: Contains `authMiddleware` to protect routes using JWT verification.

### Frontend Structure
The frontend is organized by feature and function:
- **`src/pages/`**: Top-level page components (Dashboard, CourseList, Login, etc.).
- **`src/components/`**: Reusable UI components (buttons, inputs, cards).
- **`src/context/`**: Global state providers (e.g., `AuthContext` for user session).
- **[src/App.tsx](file:///c:/Users/venkt/Documents/projects/course-tracker-app/course-tracker-fullstack/frontend/src/App.tsx)**: Main application component defining routes and protected route wrappers.

## 4. Key Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure account creation with password hashing.
- **JWT Protection**: Access to private routes (Dashboard, Courses) is restricted to authenticated users.
- **Session Management**: Token-based authentication for stateless sessions.

### 📚 Course Management
- **CRUD Operations**: Users can Create, Read, Update, and Delete course entries.
- **Detailed Tracking**:
  - **Status**: Planned, Ongoing, Completed.
  - **Progress**: 0-100% progress bar.
  - **Platform**: Tag courses by platform (Udemy, Coursera, YouTube, etc.).
  - **Notes**: Add personal notes to each course.
  - **Certificates**: Link to completion certificates.

### 🍅 Productivity & Gamification
- **Pomodoro Timer**: Built-in focus timer with customizable work/break intervals.
- **Focus Logging**: Tracks time spent studying and logs sessions.
- **Streaks**: Tracks consecutive days of activity.
- **Badges**: Awards badges for milestones (e.g., specific hours studied).
- **Analytics**: Visualizes study stats and progress on the Dashboard.

## 5. API Endpoints

### Authentication & User (`/api/auth`)
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login and receive JWT | No |
| GET | `/stats` | Get user stats (streaks, badges) | **Yes** |
| POST | `/pomodoro/log` | Log a completed focus session | **Yes** |
| GET | `/pomodoro` | Get user's timer settings | **Yes** |
| PUT | `/pomodoro` | Update timer settings | **Yes** |

### Courses (`/api/courses`)
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/` | Get all courses for the user | **Yes** |
| POST | `/` | Create a new course | **Yes** |
| GET | `/:id` | Get details of a specific course | **Yes** |
| PATCH | `/:id` | Update a course (status, progress) | **Yes** |
| DELETE | `/:id` | Delete a course | **Yes** |

## 6. Database Schema Highlights

### User Model
- **`username`**, **`password`** (hashed)
- **`streak`**: Current day streak count.
- **`pomodoroSettings`**: `{ focusMinutes, breakMinutes }`
- **`focusHistory`**: Array of daily study minutes.
- **`badges`**: Array of earned achievements.

### Course Model
- **`userId`**: Link to the owner.
- **`courseName`**, **`instructor`**, **`platform`**.
- **`status`**: Enum ["Ongoing", "Completed", "Planned"].
- **`progress`**: Number (0-100).
- **`completionDate`**, **`certificateLink`**.

## 7. Setup & Installation

1.  **Clone the repository**.
2.  **Backend Setup**:
    -   `cd backend`
    -   `npm install`
    -   Create `.env` with `ATLAS_URI`, `JWT_SECRET`, `PORT`.
    -   `npm start` (or `npm run dev`).
3.  **Frontend Setup**:
    -   `cd frontend`
    -   `npm install`
    -   Create `.env` with `VITE_BACKEND_URL`.
    -   `npm run dev`.

Made by venkat374

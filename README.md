# ApexTrack - MERN Stack Issue Tracking System

> **Software Engineering Individual Assignment**  
> A modern, full-stack Issue & Bug Tracking System designed for software engineering teams to create, manage, and trace issues, tasks, comments, and activity histories in real-time.

---

## 📌 Student & Submission Information

| Requirement | Details |
|---|---|
| **Student Name** | **Pasan Kalhara** |
| **GitHub Repository** | **[https://github.com/pasan002/issue-tracking-system](https://github.com/pasan002/issue-tracking-system)** |
| **Git Branch** | **`development`** |
| **Submission Deadline** | **17/08/2026 (Monday) — 3:00 PM** |

---

## 🚀 Objective & Project Explanation

**ApexTrack** provides software teams with a frictionless, high-fidelity platform to track software bugs and tasks across their complete lifecycle. Built on the **MERN Stack**, it features secure **JWT authentication**, role-based action rules (**Admin**, **Developer**, **Tester**), dual **Kanban Board** & **Grid List** views, real-time multi-filter searching, interactive comment threads, automated audit logging, and an executive analytics dashboard.

---

## 🛠️ Technologies Used

### **Frontend**
- **React.js** (Vite-powered for instant startup & HMR)
- **React Router DOM (v6)** (Client-side routing & protected route guards)
- **Vanilla CSS3** (Custom Glassmorphism design system, CSS Grid/Flexbox, Plus Jakarta Sans typography)
- **Lucide React** (Vector icons)

### **Backend**
- **Node.js** & **Express.js** (RESTful API architecture)
- **MongoDB Atlas** & **Mongoose ODM** (Cloud NoSQL database & schema validation)
- **JSON Web Tokens (JWT)** & **Bcrypt.js** (Authentication & password hashing)
- **Express Validator** (Server-side input sanitization)

---

## ✨ Features Implemented

### **Core Required Features**
- ✅ **User Authentication**: Secure signup & login with JWT tokens and bcrypt password hashing.
- ✅ **Issue Creation**: Create issues with Title, Description, Type (`Bug` / `Task`), Priority (`Low`, `Medium`, `High`), Status (`Open`, `In Progress`, `Resolved`, `Closed`), Assignee, and Due Date.
- ✅ **Organized Interface**: Dual views featuring an interactive **4-Column Kanban Board** (*Open*, *In Progress*, *Resolved*, *Closed*) and a **Grid List View**.
- ✅ **Issue Inspector**: Glassmorphic modal overlay displaying complete issue details, creator, dates, badges, and metadata.
- ✅ **Full Edit & Delete**: Inline **✏️ Edit Mode** for all issue fields, plus role-restricted **Delete** actions.
- ✅ **Status Lifecycle Updates**: Update status from modal or edit controls, triggering automatic activity logs.
- ✅ **Search**: Real-time search across issue titles and descriptions.
- ✅ **Multi-Filter Toolbar**: Filter issues by **Status**, **Priority**, **Type**, and **Assignee**.
- ✅ **Commenting System**: Post comments on issues and view complete chronological comment timelines.
- ✅ **Activity Audit History**: Automated event logging tracking creation, status updates, priority edits, assignee changes, and comments.
- ✅ **Executive Dashboard**: Key metrics summary (*Total Issues*, *Open*, *Completed*, *High Priority*), status distribution progress charts, and workspace activity feed.
- ✅ **Input Validation & Error Handling**: Server-side validation middleware and graceful frontend error states.
- ✅ **Responsive UI**: Sleek glassmorphic dark theme tailored for all screen dimensions.

### **Optional & Enhancement Features**
- ✅ **Pagination**: Page-based navigation controls for Grid List view.
- ✅ **Custom DNS Resolver**: Built-in Google DNS override module (`config/dns-fix.js`) ensuring seamless MongoDB Atlas connectivity across restricted network/ISP DNS environments.

---

## 🔑 Pre-Configured Demo Credentials

You can sign in using any of the pre-seeded accounts:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@apextrack.com` | `password123` | Full admin rights (Create, edit, & delete **all** issues) |
| **Developer** | `dev@apextrack.com` | `password123` | Issue updates, status changes, comments, & assigned task tracking |
| **Tester (QA)** | `tester@apextrack.com` | `password123` | Bug logging, QA verification, comments, & self-created issue management |

---

## 📂 Project Architecture

```
issue-tracking-system/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection setup
│   │   └── dns-fix.js            # Custom DNS lookup override for Atlas connectivity
│   ├── controllers/
│   │   ├── authController.js     # Signup/Login logic
│   │   ├── issueController.js    # Issue CRUD & filtering
│   │   ├── commentController.js  # Comment creation & retrieval
│   │   └── dashboardController.js# Aggregated metrics & stats
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   ├── errorMiddleware.js    # Global Express error handler
│   │   └── validation.js         # Input validation rules
│   ├── models/
│   │   ├── User.js               # User Schema (username, email, password, role)
│   │   ├── Issue.js              # Issue Schema (title, desc, type, priority, status, assignee, dueDate)
│   │   ├── Comment.js            # Comment Schema (issueId, user, text, createdAt)
│   │   └── Activity.js           # Activity Schema (issueId, user, action, createdAt)
│   ├── routes/                   # Express routes (/api/auth, /api/issues, /api/comments, /api/dashboard)
│   ├── utils/activityLogger.js   # Automated audit logging utility
│   ├── .env                      # Environment variables
│   ├── seed.js                   # Database seeding script
│   └── server.js                 # Backend entry point (Port 5000)
└── frontend/
    ├── public/                   # Favicon & vector icons
    ├── src/
    │   ├── assets/               # Static images & graphics
    │   ├── components/           # UI Components (Navbar, Sidebar, Modal, IssueDetailModal, CreateIssueForm)
    │   ├── context/              # AuthContext (JWT state & localStorage persistence)
    │   ├── pages/                # Views (Login, Register, Dashboard, IssueList)
    │   ├── App.jsx               # React Router configuration
    │   ├── index.css             # Glassmorphism design system & CSS variables
    │   └── main.jsx              # React entry point
    ├── index.html
    └── vite.config.js
```

---

## ⚡ Getting Started & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** or Local MongoDB instance

---

### 2. Environment Configuration
Inspect `backend/.env` (pre-configured with MongoDB Atlas connection string):
```env
PORT=5000
MONGO_URI=mongodb+srv://pasanpasan42:pasan123@cluster0.7yy3s.mongodb.net/issue-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretkey12345_issue_tracker_system_token
NODE_ENV=development
```

---

### 3. Backend Setup
Open a terminal in the root directory:
```bash
cd backend
npm install
node seed.js    # Seed sample users, issues, comments, & activities into MongoDB
npm run dev     # Start Express dev server on Port 5000
```

---

### 4. Frontend Setup
Open a second terminal in the root directory:
```bash
cd frontend
npm install
npm run dev     # Start Vite dev server on Port 5173
```

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login & receive JWT token |
| `GET` | `/api/auth/me` | Private | Get current authenticated user details |
| `GET` | `/api/auth/users` | Private | Get all workspace users |
| `GET` | `/api/issues` | Private | Fetch all issues (supports `q`, `status`, `priority`, `type`, `assignee`, `page`, `limit`) |
| `POST` | `/api/issues` | Private | Create a new issue |
| `GET` | `/api/issues/:id` | Private | Fetch detailed issue info & activity history |
| `PUT` | `/api/issues/:id` | Private | Update an issue (title, desc, status, assignee, priority, type, dueDate) |
| `DELETE`| `/api/issues/:id` | Private | Delete an issue (Admin or Creator) |
| `POST` | `/api/comments` | Private | Post a comment on an issue |
| `GET` | `/api/comments/issue/:issueId` | Private | Fetch all comments for an issue |
| `GET` | `/api/dashboard/stats` | Private | Get aggregated metrics & recent activity stream |

---

## 📜 License
Developed for individual assignment evaluation — Software Engineering Team.

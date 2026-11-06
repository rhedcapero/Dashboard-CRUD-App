# 🎓 EduAdmin - Student Management Dashboard

A modern, responsive, and full-featured **Student Management Dashboard Application** built with **HTML**, **CSS**, **JavaScript**, **Node.js**, **Express.js**, and **Supabase (PostgreSQL)**.

---

## 📋 Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. System Architecture & Tech Stack](#2-system-architecture--tech-stack)
- [3. Key Features](#3-key-features)
- [4. Project Folder Structure](#4-project-folder-structure)
- [5. Beginner-Friendly Step-by-Step Installation Guide](#5-beginner-friendly-step-by-step-installation-guide)
  - [Step 1: Install Node.js](#step-1-install-nodejs)
  - [Step 2: Clone or Download the Project](#step-2-clone-or-download-the-project)
  - [Step 3: Install Required Dependencies](#step-3-install-required-dependencies)
  - [Step 4: Create a Free Supabase Project](#step-4-create-a-free-supabase-project)
  - [Step 5: Run the Database SQL Script](#step-5-run-the-database-sql-script)
  - [Step 6: Retrieve Supabase API Credentials](#step-6-retrieve-supabase-api-credentials)
  - [Step 7: Configure the `.env` File](#step-7-configure-the-env-file)
  - [Step 8: Start the Server](#step-8-start-the-server)
  - [Step 9: Open and Test the Application](#step-9-open-and-test-the-application)
- [6. Database Schema & RLS Policies](#6-database-schema--rls-policies)
- [7. Express.js REST API Documentation](#7-expressjs-rest-api-documentation)
- [8. GitHub Upload Instructions](#8-github-upload-instructions)
- [9. Video Demonstration Script & Guide](#9-video-demonstration-script--guide)

---

## 1. Project Overview

The **Student Management Dashboard** allows academic administrators and instructors to manage student records efficiently. It features a responsive user interface with real-time analytics, automated summary cards, search and multi-criteria filtering, and full CRUD (Create, Read, Update, Delete) operations directly connected to a **Supabase PostgreSQL** database through a clean **Express.js** REST API backend.

---

## 2. System Architecture & Tech Stack

```
+-------------------------------------------------------------+
|                     FRONTEND CLIENT                         |
|   - HTML5 Semantic Structure                                |
|   - Vanilla Modern CSS (Glassmorphism, Dark/Light Themes)   |
|   - JavaScript (Fetch API, DOM Manipulation, Modals, State) |
+------------------------------+------------------------------+
                               |  HTTP / REST (JSON)
                               v
+-------------------------------------------------------------+
|                    BACKEND SERVER                           |
|   - Node.js & Express.js REST API                           |
|   - CORS & JSON Body Parser Middleware                      |
|   - Input Validation & Duplicate Protection                 |
|   - Supabase JS Client (@supabase/supabase-js)              |
+------------------------------+------------------------------+
                               |  SSL / TLS Connection
                               v
+-------------------------------------------------------------+
|                 SUPABASE POSTGRESQL DB                      |
|   - `students` Table (UUID, Unique ID & Email)              |
|   - Row Level Security (RLS) Policies                       |
|   - PostgreSQL Indexes for High-Speed Searches              |
+-------------------------------------------------------------+
```

### Technologies Used
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), Modern JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Database**: Supabase PostgreSQL.
- **Dependencies**: `@supabase/supabase-js`, `dotenv`, `cors`, `express`.

---

## 3. Key Features

### 📊 Real-Time Dashboard Statistics
- **Total Students**: Automatic count of all registered students.
- **Active Students**: Count and percentage of enrolled active students.
- **Inactive Students**: Count and percentage of students on leave or inactive status.
- **Recently Added Students**: Real-time counter of students registered within the last 14 days.
- **Course Distribution**: Visual progress breakdown of students across degree programs.
- **Recent Registrations Widget**: Live preview of the 5 newest student enrollments.

### 👥 Full CRUD Student Operations
1. **Create Student**:
   - Modal with client and server input validation.
   - Fields: Student ID, First Name, Last Name, Email, Contact Number, Gender, Course, Year Level, Enrollment Status.
   - Convenient "Auto-Generate Student ID" tool.
2. **Read Student**:
   - Modern responsive data table with initials avatars, badges, and clean formatting.
   - Individual Student Profile View Modal displaying complete student details, registration timestamp, and database UUID.
3. **Update Student**:
   - Edit modal preloaded with selected student's data.
   - Validates uniqueness of Student ID and Email before updating.
   - Immediate table and statistics refresh upon saving.
4. **Delete Student**:
   - Professional confirmation dialog preventing accidental deletion.
   - Real-time removal from Supabase database with instant UI update.

### 🔍 Search, Filter & Export
- **Multi-Field Search**: Real-time debounced search by First Name, Last Name, Student ID, or Email.
- **Filter by Course**: Filter students by degree program (*BS in Information Technology, BS in Computer Science, BS in Information Systems, BS in Software Engineering*).
- **Filter by Year Level**: Filter by 1st Year, 2nd Year, 3rd Year, or 4th Year.
- **Filter by Status**: Filter by Active or Inactive.
- **Sorting**: Sort by Registration Date (Newest/Oldest), Name (A-Z / Z-A), or Student ID.
- **CSV Data Export**: One-click download of filtered student records as `students_export.csv`.

### 🎨 Visual & UX Excellence
- Responsive on mobile, tablet, and desktop screens.
- Dark & Light mode toggle with `localStorage` memory.
- Non-blocking animated Toast Notifications for Success, Error, and Info alerts.
- Animated skeleton loading states and empty-state illustrations.

---

## 4. Project Folder Structure

```
student-management-dashboard/
├── .env.example                # Example environment variables file
├── .gitignore                  # Git ignore rules for node_modules and .env
├── package.json                # Project dependencies and npm scripts
├── README.md                   # Complete documentation and setup guide
│
├── server/                     # Backend Express.js Server
│   ├── .env.example            # Server-specific env example
│   ├── server.js               # Main Express application entry point
│   ├── supabase.js             # Supabase client configuration
│   ├── routes/
│   │   ├── studentRoutes.js    # Routes for /api/students CRUD
│   │   └── statsRoutes.js      # Routes for /api/dashboard/stats
│   └── controllers/
│       ├── studentController.js# CRUD logic & database queries
│       └── statsController.js  # Metric calculations & aggregation
│
├── public/                     # Frontend Client Files
│   ├── index.html              # Main HTML dashboard layout & modals
│   ├── css/
│   │   └── style.css           # Modern custom dashboard CSS styles
│   └── js/
│       └── app.js              # Client state, API fetch, UI rendering
│
└── supabase/                   # Database Assets
    └── schema.sql              # PostgreSQL DDL script & seed records
```

---

## 5. Beginner-Friendly Step-by-Step Installation Guide

Follow these simple steps to set up and run the project on your local computer:

### Step 1: Install Node.js
1. Visit the official Node.js website: [https://nodejs.org](https://nodejs.org)
2. Download the **LTS (Long Term Support)** version for Windows, macOS, or Linux.
3. Run the installer and click **Next** until installation completes.
4. Verify your installation by opening your Terminal (or PowerShell) and typing:
   ```bash
   node -v
   npm -v
   ```
   *(You should see version numbers like `v20.x.x` or `v24.x.x`)*

---

### Step 2: Clone or Download the Project
Navigate to your desired workspace folder and open your terminal:
```bash
cd "C:\Users\ADMIN\Desktop\New Portfolio"
```

---

### Step 3: Install Required Dependencies
In the root directory, install the required packages:
```bash
npm install
```
This automatically installs:
- `express` — web server framework.
- `@supabase/supabase-js` — client to connect with Supabase PostgreSQL.
- `dotenv` — loads credentials safely from `.env`.
- `cors` — enables cross-origin requests.

---

### Step 4: Create a Free Supabase Project
1. Open your browser and go to [https://supabase.com](https://supabase.com).
2. Click **Sign In** (or create a free account with your GitHub account).
3. In your Supabase Dashboard, click **New Project**.
4. Fill in:
   - **Name**: `student-management-db`
   - **Database Password**: Choose a secure password (save it safely).
   - **Region**: Choose the closest region (e.g. *Singapore / Southeast Asia*).
5. Click **Create new project** and wait 1–2 minutes for the database to provision.

---

### Step 5: Run the Database SQL Script
1. In your Supabase project dashboard, click on the **SQL Editor** tab (icon with `>_` on the left sidebar).
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this project, copy its entire content, and paste it into the Supabase SQL Editor.
4. Click the green **Run** button (or press `Ctrl + Enter`).
5. You will see a success message: `Success. No rows returned`.
6. To verify, click on the **Table Editor** on the left menu: you will see the `students` table populated with sample initial student records!

---

### Step 6: Retrieve Supabase API Credentials
1. In your Supabase project dashboard, click on the **Project Settings** (gear icon at the bottom of the left sidebar).
2. Click on the **API** sub-menu under Configuration.
3. Locate the following two values:
   - **Project URL**: (e.g., `https://abcdefghijklm.supabase.co`)
   - **Project API Keys**:
     - Find the **`service_role` (secret)** key (click "Reveal" to copy it).
     *(Note: You can also use the `anon public` key since we configured open RLS policies in `schema.sql`).*

---

### Step 7: Configure the `.env` File
1. In the `server/` directory, create a new file named `.env` (or copy `.env.example` to `.env`):
   ```bash
   # Windows PowerShell command:
   copy server\.env.example server\.env
   ```
2. Open `server/.env` in your text editor and replace the placeholder text with your actual Supabase credentials:

   ```ini
   PORT=3000
   SUPABASE_URL=https://your-actual-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJh......your_actual_key_here......
   ```

---

### Step 8: Start the Server
From the root project directory, start the Express.js server:
```bash
npm start
```

For auto-reloading during development:
```bash
npm run dev
```

You will see the console confirmation:
```
========================================================
🚀 Student Management Dashboard Server is running!
🌐 Local URL:       http://localhost:3000
📊 API Health:      http://localhost:3000/api/health
👥 Students API:    http://localhost:3000/api/students
📈 Stats API:       http://localhost:3000/api/dashboard/stats
--------------------------------------------------------
✅ Supabase status: Connected (https://your-project.supabase.co)
========================================================
```

---

### Step 9: Open and Test the Application
Open your web browser (Chrome, Edge, Firefox) and navigate to:
```
http://localhost:3000
```

Try the following to test all features:
1. **View Overview**: Look at the 4 top summary cards and course breakdown bars.
2. **Add Student**: Click "+ Add Student", fill out the form or click "Auto-Generate" for Student ID, and click "Save Student Record". Notice the immediate success toast and updated stats.
3. **Search & Filter**: Type a student's name in the search bar, filter by "BS in Information Technology", or change the sort order.
4. **View Details**: Click the Eye icon on any student to view their complete profile modal.
5. **Edit Student**: Click the Pencil icon, change the student's Course or Status, and save.
6. **Delete Student**: Click the Trash icon and confirm deletion.
7. **Export CSV**: Click "Export CSV" to download the current student directory as an Excel-compatible spreadsheet.

---

## 6. Database Schema & RLS Policies

Here is the complete SQL structure created in Supabase:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_number TEXT NOT NULL,
    gender TEXT NOT NULL,
    course TEXT NOT NULL,
    year_level TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students (student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students (email);
CREATE INDEX IF NOT EXISTS idx_students_course ON public.students (course);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students (status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.students FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.students FOR DELETE USING (true);
```

---

## 7. Express.js REST API Documentation

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check API & Supabase health | None |
| `GET` | `/api/dashboard/stats` | Retrieve aggregated dashboard counts | None |
| `GET` | `/api/students` | Retrieve all students | Query: `search`, `course`, `year_level`, `status`, `sortBy`, `order` |
| `GET` | `/api/students/:id` | Retrieve single student by UUID or Student ID | Param: `id` |
| `POST` | `/api/students` | Create a new student record | JSON Body with student fields |
| `PUT` | `/api/students/:id` | Update an existing student | Param: `id`, JSON Body with fields to update |
| `DELETE` | `/api/students/:id` | Delete a student record | Param: `id` |

### Sample JSON Request (POST /api/students):
```json
{
  "student_id": "2024-00109",
  "first_name": "Clara",
  "last_name": "Soriano",
  "email": "clara.soriano@student.edu",
  "contact_number": "+63 917 555 8899",
  "gender": "Female",
  "course": "BS in Information Technology",
  "year_level": "2nd Year",
  "status": "Active"
}
```

---

## 8. GitHub Upload Instructions

Follow these commands to push your project to a public GitHub repository:

1. **Initialize Git**:
   ```bash
   git init
   ```
2. **Stage all files** (the `.gitignore` file will ensure `node_modules` and `.env` are protected):
   ```bash
   git add .
   ```
3. **Commit the project**:
   ```bash
   git commit -m "feat: complete student management dashboard with Express and Supabase"
   ```
4. **Create a new repository on GitHub**:
   - Go to [https://github.com/new](https://github.com/new).
   - Name it `student-management-dashboard`.
   - Set visibility to **Public**.
   - Do **NOT** initialize with a README (we already have this one).
   - Click **Create repository**.
5. **Link and Push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/student-management-dashboard.git
   git push -u origin main
   ```

---

## 9. Video Demonstration Script & Guide

When recording your project video demonstration for your instructor (using OBS Studio, Loom, or Windows Xbox Game Bar `Win + G`), follow this structured 3-minute presentation script:

### Step 1: Introduction (0:00 - 0:30)
- State your name, course, and year level (*e.g., "Good day! I am [Your Name], a 2nd Year IT student presenting my Student Management Dashboard application..."*).
- Highlight the architecture: Frontend built with HTML, Vanilla CSS, and JavaScript; Backend powered by Node.js and Express.js; Database hosted on Supabase PostgreSQL.

### Step 2: Architecture & Database Overview (0:30 - 1:00)
- Show your code editor (VS Code) showing `server/server.js`, `server/supabase.js`, and `supabase/schema.sql`.
- Briefly switch to your browser showing your Supabase Dashboard Table Editor with the `students` table.

### Step 3: Dashboard Statistics Demonstration (1:00 - 1:30)
- Point out the 4 summary cards: **Total Students**, **Active Students**, **Inactive Students**, and **Recently Added**.
- Explain that these metrics are computed live from Supabase PostgreSQL queries.

### Step 4: CRUD Functionality Demonstration (1:30 - 2:30)
- **CREATE**: Click "+ Add Student", fill out new student details (or click "Auto-Generate ID"), and submit. Point out the success toast notification and how the cards and table immediately update.
- **READ**: Open the Eye icon on the newly created student to display their individual profile modal.
- **UPDATE**: Click the Pencil icon, change their status from "Active" to "Inactive" or update their contact number, and save. Show how the Inactive Students counter updates in real time.
- **DELETE**: Click the Trash icon on a record, show the confirmation dialog, and confirm delete. Show that the record disappears immediately from both the UI and the Supabase table.

### Step 5: Search, Filter, Theme & Conclusion (2:30 - 3:00)
- Demonstrate live search by typing a name or student ID.
- Demonstrate filtering by Course and Year Level.
- Click the Theme Toggle icon to switch between Dark and Light mode.
- Click "Export CSV" to show file downloading.
- Conclude: *"Thank you for watching my Student Management Dashboard demonstration!"*

---

## 📄 License
This project is open-source under the MIT License. Developed for academic and demonstration purposes.

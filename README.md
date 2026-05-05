# Report Management System
**Ministry of ICT & Innovation — Digital Transformation Unit**

![Status](https://img.shields.io/badge/Status-In%20Development-blue)
![Version](https://img.shields.io/badge/Version-0.1.0-lightgrey)
![Internship](https://img.shields.io/badge/Internship%20Project-May%20–%20July%202026-green)

---

##  Overview

The **Report Management System (RMS)** is a web-based platform designed for the Ministry of ICT & Innovation to streamline the submission, routing, tracking, and approval of internal reports across all departments.

This system replaces fragmented processes (email, WhatsApp, paper) with a centralized, role-based digital solution.

---

##  Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Frontend     | React + Tailwind CSS    |
| Backend      | Node.js + Express       |
| Database     | PostgreSQL               |
| Auth         | JWT (Role-based)         |
| File Storage | Cloudinary               |
| Hosting      | Railway / Render         |
| Version Ctrl | Git + GitHub             |

---

##  Project Structure

```
report-management-system/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service calls
│   │   └── utils/           # Helper functions
│   └── public/
├── server/                  # Node.js + Express backend
│   ├── controllers/         # Route handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth, validation middleware
│   └── utils/               # Helpers & utilities
├── docs/                    # Project documentation
│   ├── requirements.md      # System requirements
│   ├── database-schema.md   # DB design
│   ├── api-docs.md          # API documentation
│   └── wireframes/          # UI wireframes
├── .github/                 # GitHub workflows (CI/CD)
├── .env.example             # Environment variables template
├── .gitignore
└── README.md
```

---

##  Project Roadmap

| Phase | Description               | Dates                  | Status        |
|-------|---------------------------|------------------------|---------------|
| 0     | Foundation & Setup        | May 5 – May 11         |  In Progress |
| 1     | Planning & Design         | May 12 – May 25        |  Pending     |
| 2     | Core Development          | May 26 – June 22       |  Pending     |
| 3     | Advanced Features         | June 23 – July 6       |  Pending     |
| 4     | Polish & Delivery         | July 7 – July 31       |  Pending     |

---

##  User Roles

| Role                        | Access Level                             |
|-----------------------------|------------------------------------------|
| Staff (Submitter)           | Submit & track own reports               |
| Department Head             | Review & approve department reports      |
| Head of Digital Transformation | Oversee all reports & workflows       |
| Minister / Top Leadership   | Final approval & view-only dashboard     |
| IT Administrator            | Full system access & user management     |

---

##  Core Features

- [ ] Role-based authentication & access control
- [ ] Report submission with file attachments
- [ ] Multi-step approval workflow
- [ ] Auto-routing based on report type
- [ ] Dashboard with report statistics
- [ ] Email notifications
- [ ] Search & filtering
- [ ] Audit trail
- [ ] Export to PDF / Excel
- [ ] Mobile-responsive design

---

##  Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/report-management-system.git
cd report-management-system

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Run development servers
# Backend (from /server)
npm run dev

# Frontend (from /client)
npm start
```

---

##  Documentation

Full documentation is available in the `/docs` folder:
- [Requirements Document](./docs/requirements.md)
- [Database Schema](./docs/database-schema.md)
- [API Documentation](./docs/api-docs.md)

---

##  Author

**Nshimyumurwa Mary Therese**
ICT Intern — Digital Transformation Unit
Ministry of ICT & Innovation, Rwanda
GitHub: [@nshimyumurwa](https://github.com/nshimyumurwa)
Internship Period: May – July 2026

---

##  License

This project is developed for internal use by the Ministry of ICT & Innovation, Rwanda.
All rights reserved © 2026

<div align="center">

```
███╗   ███╗███████╗███████╗███████╗    ███╗   ███╗ ██████╗ ███╗   ███╗████████╗
████╗ ████║██╔════╝██╔════╝██╔════╝    ████╗ ████║██╔════╝ ████╗ ████║╚══██╔══╝
██╔████╔██║█████╗  ███████╗███████╗    ██╔████╔██║██║  ███╗██╔████╔██║   ██║   
██║╚██╔╝██║██╔══╝  ╚════██║╚════██║    ██║╚██╔╝██║██║   ██║██║╚██╔╝██║   ██║   
██║ ╚═╝ ██║███████╗███████║███████║    ██║ ╚═╝ ██║╚██████╔╝██║ ╚═╝ ██║   ██║   
╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝   ╚═╝   
```

### _Built exclusively for NIT Srinagar — digitizing hostel mess operations, one meal at a time_ 🍛

![](https://img.shields.io/badge/NIT%20Srinagar-Exclusive-orange?style=flat-square&logo=graduation-cap&logoColor=white)
![](https://img.shields.io/badge/Email%20Domain-@nitsri.ac.in-blue?style=flat-square&logo=gmail&logoColor=white)

<br/>

![](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<br/>

**[🌐 View Live App](https://mess-management-navy.vercel.app)** &nbsp;|&nbsp; **[🐛 Report Bug](https://github.com/prashantgoyal7691/mess-management/issues)** &nbsp;|&nbsp; **[💡 Request Feature](https://github.com/prashantgoyal7691/mess-management/issues)**

</div>

<br/>

---

## 👀 What is this?

Ever walked all the way to the NIT Srinagar hostel mess only to find out they're serving something you don't like? Or tried to complain about food quality and had no idea where to do it?

**Mess Management System** solves exactly that — and it's built **exclusively for NIT Srinagar students**. Only `@nitsri.ac.in` email addresses are allowed to register. It's a full-stack MERN web app that puts mess operations online — students can check menus, give feedback, raise complaints, and log in with OTP or Google. Admins get a dashboard to manage everything from one place.

> 🏫 **Institution:** National Institute of Technology, Srinagar (NIT Srinagar), J&K
> 🔒 **Restricted to:** `@nitsri.ac.in` email domain only
> 🌐 **Built with:** React + Vite · Node.js + Express · MongoDB Atlas · Firebase

<br/>

---

## 📸 Live Demo

🔗 **[https://mess-management-navy.vercel.app](https://mess-management-navy.vercel.app)**

<br/>

---

## ⚡ Quick Start

> Want to run this locally? Here's the short version:

```bash
# 1. Clone it
git clone https://github.com/prashantgoyal7691/mess-management.git
cd mess-management

# 2. Install server deps
cd server && npm install

# 3. Install client deps
cd ../client && npm install

# 4. Add your .env files (see Environment Setup below)

# 5. Start both servers
# Terminal 1 - backend
cd server && npm run dev

# Terminal 2 - frontend
cd client && npm run dev
```

App runs at `http://localhost:5173` — API runs at `http://localhost:5000`

<br/>

---

## 🗂️ Folder Structure

```
mess-management/
│
├── 📁 client/                          ← React + Vite + Tailwind Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   │   ├── Navbar.jsx          ← Admin navbar
│       │   │   └── Sidebar.jsx         ← Admin sidebar
│       │   └── student/
│       │       ├── Navbar.jsx          ← Student navbar
│       │       └── Sidebar.jsx         ← Student sidebar
│       ├── layouts/
│       │   ├── AdminLayout.jsx         ← Wraps all admin pages
│       │   └── StudentLayout.jsx       ← Wraps all student pages
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AdminDetails.jsx
│       │   │   ├── AdminLogin.jsx
│       │   │   ├── AdminSignup.jsx
│       │   │   ├── AdminForgotPassword.jsx
│       │   │   ├── AdminResetPassword.jsx
│       │   │   ├── ComplaintsAdmin.jsx
│       │   │   ├── FeedbacksAdmin.jsx
│       │   │   ├── MealPlans.jsx
│       │   │   ├── Reports.jsx
│       │   │   ├── SetExpense.jsx
│       │   │   ├── StudentDetailsAdmin.jsx
│       │   │   ├── StudentHistory.jsx
│       │   │   └── Students.jsx
│       │   ├── auth/
│       │   │   ├── ForgotPassword.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── ResetPassword.jsx
│       │   │   ├── RoleSelect.jsx
│       │   │   ├── Signup.jsx
│       │   │   ├── StudentAuth.jsx
│       │   │   └── VerifyOtp.jsx
│       │   └── student/
│       │       ├── Attendance.jsx
│       │       ├── Complaints.jsx
│       │       ├── Feedback.jsx
│       │       ├── Menu.jsx
│       │       ├── MyComplaints.jsx
│       │       ├── MyFeedbacks.jsx
│       │       ├── StudentDashboard.jsx
│       │       └── StudentDetails.jsx
│       ├── routes/
│       │   └── AppRoutes.jsx           ← All app routes defined here
│       ├── services/
│       │   └── api.js                  ← Axios API calls
│       ├── utils/
│       │   └── AdminProtectedRoute.jsx ← Route guard for admin
│       ├── App.jsx
│       ├── main.jsx                    ← Entry point
│       └── index.css
│
├── 📁 server/                          ← Node.js + Express Backend
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── billingController.js
│   │   ├── complaintController.js
│   │   ├── feedbackController.js
│   │   └── mealPlanController.js
│   ├── middleware/
│   │   └── authMiddleware.js           ← JWT verification
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Complaint.js
│   │   ├── DailyExpense.js
│   │   ├── Feedback.js
│   │   ├── MealPlan.js
│   │   ├── Menu.js
│   │   ├── StudentBill.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── billingRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── mealPlanRoutes.js
│   ├── utils/
│   │   └── sendEmail.js                ← OTP email utility
│   └── server.js                       ← Server entry point
│
├── .gitignore
└── README.md
```

<br/>

---

## 🔧 Tech Stack

```
FRONTEND                        BACKEND
─────────────────────────────   ─────────────────────────────
⚛  React 18          UI lib    🟢 Node.js 18+    Runtime
⚡  Vite 5            Bundler   🚂 Express 4      Framework
🔀  React Router 6    Routing   🍃 MongoDB Atlas  Database
📡  Axios             HTTP      🔷 Mongoose       ODM
🔥  Firebase          Auth      🔑 JWT            Auth tokens
🍞  React Hot Toast   Alerts    🔐 Bcrypt         Passwords
                                🔥 Firebase Admin OTP + OAuth
```

<br/>

---

## 🍽️ What Can It Do?

> ⚠️ **Access is restricted to NIT Srinagar students only.** Registration requires a valid `@nitsri.ac.in` email address.

### As a Student (NIT Srinagar)

```
📋  Register with your @nitsri.ac.in college email & hostel details
🔐  Login via Email OTP  —or—  Google Sign-In (nitsri.ac.in only)
🏠  Land on your personal dashboard
📅  See today's menu  →  Breakfast / Lunch / Snacks / Dinner
💬  Rate any meal from 1-5 stars + leave a comment
📢  Raise complaints and track their status
👤  Manage your profile anytime
```

### As an Admin

```
📊  Dashboard overview of all activity
✅  Verify or reject new student registrations
🗓️  Create & edit daily menus for any date
👁️  Browse all student feedback with filters
📩  Receive & respond to student complaints
👥  Manage student accounts (view, verify, block)
```

<br/>

---

## 🗄️ Database Collections

```
MongoDB Atlas
│
├── students       → name, email, rollNumber, hostelName,
│                    roomNumber, phone, isVerified
│
├── admins         → name, email, password (hashed), role
│
├── menus          → date, breakfast[], lunch[],
│                    snacks[], dinner[]
│
├── feedbacks      → studentId, menuId, mealType,
│                    rating (1-5), comment
│
└── complaints     → studentId, title, description,
                     status, adminResponse
```

<br/>

---

## 🔐 Environment Setup

### `server/.env`

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mess-management

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Firebase Admin (from service account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

<br/>

---

## 🔌 API Reference

**Base URL** `http://localhost:5000/api` — **Auth Header** `Authorization: Bearer <token>`

| Method | Route | Access |
|--------|-------|--------|
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/me` | Student |
| `GET` | `/menus/today` | Student |
| `GET` | `/menus/weekly` | Student |
| `POST` | `/feedback` | Student |
| `GET` | `/feedback/my-feedback` | Student |
| `PUT` | `/feedback/:id` | Student |
| `DELETE` | `/feedback/:id` | Student |
| `GET` | `/complaints` | Student |
| `POST` | `/complaints` | Student |
| `POST` | `/admin/login` | Admin |
| `POST` | `/admin/menus` | Admin |
| `GET` | `/admin/students` | Admin |
| `PUT` | `/admin/students/:id/verify` | Admin |
| `GET` | `/admin/feedback` | Admin |
| `GET` | `/admin/complaints` | Admin |
| `PUT` | `/admin/complaints/:id` | Admin |

### Example Requests

**Register a student**
```bash
POST /api/auth/register
{
  "name": "Prashant Goyal",
  "email": "2021bcs042@nitsri.ac.in",
  "password": "secure123",
  "rollNumber": "2021BCS042",
  "hostelName": "Shamsher Bhawan",
  "roomNumber": "S-204",
  "phoneNumber": "9876543210"
}
```

**Submit feedback**
```bash
POST /api/feedback
Authorization: Bearer <token>
{
  "menuId": "64f3a...",
  "mealType": "dinner",
  "rating": 5,
  "comment": "Dal makhani was great!"
}
```

<br/>

---

## 🚀 Deployment

| What | Where | Status |
|------|-------|--------|
| Frontend | Vercel | ✅ Live |
| Backend | Render / Railway | ⚙️ Configure |
| Database | MongoDB Atlas | ✅ Cloud |
| Auth | Firebase | ✅ Active |

**Deploy frontend to Vercel in 3 steps:**
1. Push your code to GitHub
2. Import `client/` folder on [vercel.com](https://vercel.com)
3. Add `VITE_*` environment variables in dashboard → Deploy ✅

<br/>

---

## 🛠️ System Flow

```
User opens app
     │
     ▼
[Landing Page]
     │
     ├──► Sign up → Email OTP & Admin verifies account
     │
     └──► Login → using Email and Password
               │
               ▼
         [Firebase verifies]
               │
               ▼
         [JWT issued by backend]
               │
     ┌─────────┴─────────┐
     ▼                   ▼
[Student Dashboard]  [Admin Dashboard]
  • View menu          • Manage menus
  • Give feedback      • Verify students
  • Raise complaint    • Handle complaints
  • View history       • View all feedback
```

<br/>

---

## 🔮 Roadmap

- [x] Email OTP Signup
- [x] Email & Password Login
- [x] Student dashboard
- [x] Menu management
- [x] Feedback & complaints
- [ ] QR code attendance
- [ ] WhatsApp / email notifications
- [ ] Mess bill payment integration
- [ ] Export reports to PDF
- [ ] Nutritional info per meal
- [ ] Dark mode
- [ ] React Native mobile app

<br/>

---

## 🏫 About NIT Srinagar

This project was built exclusively for the students and mess administration of **National Institute of Technology, Srinagar**.

```
Institution  :  NIT Srinagar (National Institute of Technology, Srinagar)
Location     :  Hazratbal, Srinagar, Jammu & Kashmir — 190006
Website      :  https://www.nitsri.ac.in
Email Domain :  @nitsri.ac.in  ← only this domain can register
```

Only students with a valid `@nitsri.ac.in` email address can create an account. Any registration attempt with a different email domain will be rejected by the backend.

<br/>

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

```bash
# Fork → Clone → Branch → Code → Push → PR

git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

<br/>


---

<div align="center">

built by **[Prashant Goyal](https://github.com/prashantgoyal7691)** · NIT Srinagar &nbsp;•&nbsp; give it a ⭐ if it helped you!

</div>
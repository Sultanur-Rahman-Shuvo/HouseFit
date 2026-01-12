# HouseFit - Apartment Management System

> A university-grade, locally-deployable MERN application for comprehensive apartment management with AI-powered features.

---

## 🎯 Project Overview

**HouseFit** is a full-featured apartment management system designed for tenants, visitors, owners, employees, and administrators. It runs entirely locally with optional cloud deployment and includes AI-assisted tree plantation verification and ML-driven flat price prediction powered by Ollama.

### Key Features

- **Multi-role authentication** (Admin, Owner, Tenant, Visitor, Employee)
- **JWT-based security** with access and refresh tokens
- **Manual bKash payment verification** system
- **AI-powered tree plantation verification** via local Ollama
- **ML-driven flat prediction** (area ↔ budget suggestions)
- **Email notifications** demo via nodemailer
- **Problem reporting & tracking**
- **Leave management**
- **Booking request workflow**
- **Monthly tree plantation leaderboard** with rewards

---

## 🏗️ Architecture

```
HouseFit/
├── backend/                    # Express.js API server
│   ├── config/                 # Configuration files
│   │   ├── db.js              # MongoDB connection
│   │   ├── email.js           # Nodemailer setup
│   │   └── ollama.js          # Ollama client configuration
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── flatController.js
│   │   ├── paymentController.js
│   │   ├── treeController.js
│   │   ├── problemController.js
│   │   ├── leaveController.js
│   │   ├── bookingController.js
│   │   ├── billController.js
│   │   ├── notificationController.js
│   │   └── ollamaController.js
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # JWT verification
│   │   ├── roleGuard.js       # Role-based access control
│   │   ├── validation.js      # Input validation
│   │   └── errorHandler.js    # Global error handling
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Flat.js
│   │   ├── Building.js
│   │   ├── BookingRequest.js
│   │   ├── ProblemReport.js
│   │   ├── Employee.js
│   │   ├── Bill.js
│   │   ├── TreeSubmission.js
│   │   ├── LeaveRequest.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── routes/                 # API route definitions
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── flats.js
│   │   ├── payments.js
│   │   ├── trees.js
│   │   ├── problems.js
│   │   ├── leave.js
│   │   ├── bookings.js
│   │   ├── bills.js
│   │   ├── notifications.js
│   │   └── predict.js
│   ├── utils/                  # Utility functions
│   │   ├── tokenGenerator.js  # JWT generation
│   │   ├── fileUpload.js      # Local file storage
│   │   ├── promptTemplates.js # Ollama prompts
│   │   └── validators.js      # Input validators
│   ├── uploads/                # Local image storage
│   │   ├── trees/
│   │   ├── flats/
│   │   └── profiles/
│   ├── seeds/                  # Seed data scripts
│   │   └── seedData.js
│   ├── .env                    # Environment variables (gitignored)
│   ├── .env.example            # Environment template
│   ├── server.js               # Entry point
│   └── package.json
│
├── frontend/                   # React + Vite application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # API wrapper
│   │   │   └── apiClient.js   # Axios instance with JWT
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── FlatCard.js
│   │   │   ├── TreeUpload.js
│   │   │   ├── PaymentForm.js
│   │   │   ├── ProblemForm.js
│   │   │   └── Leaderboard.js
│   │   ├── pages/              # Route pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── VisitorDashboard.jsx
│   │   │   ├── FlatDetails.jsx
│   │   │   ├── TreeVerification.jsx
│   │   │   ├── Billing.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── BookingRequests.jsx
│   │   │   ├── Problems.jsx
│   │   │   └── Leave.jsx
│   │   ├── contexts/           # React context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── utils/              # Utilities
│   │   │   └── validation.js
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Frontend env (gitignored)
│   ├── .env.example            # Frontend env template
│   ├── vite.config.js
│   └── package.json
│
└── README.md                   # This file
```

---

## 📦 Tech Stack

### Backend

- **Node.js** (v18+)
- **Express.js** (v4.x)
- **MongoDB** (local or Atlas)
- **Mongoose** (ODM)
- **JWT** (jsonwebtoken)
- **bcrypt** (password hashing)
- **helmet** (security headers)
- **express-rate-limit** (rate limiting)
- **nodemailer** (email notifications)
- **multer** (file uploads)
- **axios** (Ollama API client)

### Frontend

- **React** (v18+)
- **Vite** (build tool)
- **React Router** (v6)
- **Axios** (HTTP client)
- **CSS3** (styling - minimal, human-designed)

### AI/ML

- **Ollama** (local LLM server)
  - Tree verification model
  - Flat prediction model

---

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local instance or Atlas connection string)
3. **Ollama** (for AI features)
   - Install from: https://ollama.ai
   - Pull required model: `ollama pull llama2`
4. **Email account** (Gmail or Mailtrap for demo)

---

### Backend Setup

#### 1. Navigate to backend directory

```bash
cd backend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/housefit
# For Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/housefit

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Configuration (Nodemailer Demo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@housefit.local

# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
# Alternative models: mistral, codellama, llama3

# File Upload
MAX_FILE_SIZE=5242880
# 5MB in bytes

# Tree Reward Configuration
TREE_REWARD_POINTS=10
MONTHLY_WINNER_DISCOUNT=1000
# in BDT

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
# minutes
RATE_LIMIT_MAX_REQUESTS=100
```

#### 4. Start MongoDB

**Local MongoDB:**

```bash
mongod
```

**MongoDB Atlas:**

- Ensure your connection string is set in `MONGO_URI`
- Whitelist your IP address

#### 5. (Optional) Seed database

```bash
npm run seed
```

This creates:

- Admin user (admin@housefit.local / Admin@123)
- Sample buildings and flats
- Sample tenants and owners
- Demo data for testing

#### 6. Start backend server

```bash
npm run dev
# or for production
npm start
```

Backend runs at: **http://localhost:5000**

---

### Frontend Setup

#### 1. Navigate to frontend directory

```bash
cd frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:5000/api

# Application
VITE_APP_NAME=HouseFit
VITE_APP_VERSION=1.0.0

# File upload limits (must match backend)
VITE_MAX_FILE_SIZE=5242880
```

#### 4. Start development server

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### Ollama Setup

#### 1. Install Ollama

**Windows:**

- Download from https://ollama.ai
- Run installer

**macOS:**

```bash
brew install ollama
```

**Linux:**

```bash
curl https://ollama.ai/install.sh | sh
```

#### 2. Start Ollama service

```bash
ollama serve
```

Ollama runs at: **http://localhost:11434**

#### 3. Pull required model

```bash
ollama pull llama2
```

Alternative models for better performance:

```bash
ollama pull mistral       # Faster, good quality
ollama pull llama3        # Latest, best quality
```

#### 4. Test Ollama

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt": "Hello, are you working?",
  "stream": false
}'
```

---

## 🗄️ Database Models

### User Model

```javascript
{
  username: String (unique),
  email: String (unique, indexed),
  password: String (hashed),
  role: Enum ['admin', 'owner', 'tenant', 'visitor', 'employee'],
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  flatId: ObjectId (ref: Flat, optional),
  refreshTokens: [String],
  treePoints: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Flat Model

```javascript
{
  buildingId: ObjectId (ref: Building),
  flatNumber: String,
  floor: Number,
  area: Number (sqft),
  bedrooms: Number,
  bathrooms: Number,
  rent: Number,
  status: Enum ['available', 'occupied', 'maintenance'],
  currentTenant: ObjectId (ref: User),
  ownerId: ObjectId (ref: User),
  amenities: [String],
  images: [String],
  description: String,
  createdAt: Date,
  updatedAt: Date
}
// Index: { buildingId: 1, status: 1 }
```

### Building Model

```javascript
{
  name: String,
  address: String,
  totalFloors: Number,
  totalFlats: Number,
  facilities: [String],
  managerId: ObjectId (ref: User, role: admin),
  createdAt: Date,
  updatedAt: Date
}
```

### BookingRequest Model

```javascript
{
  visitorId: ObjectId (ref: User),
  flatId: ObjectId (ref: Flat),
  message: String,
  requestedDate: Date,
  status: Enum ['pending', 'approved', 'rejected'],
  adminResponse: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
// Index: { status: 1, createdAt: -1 }
```

### ProblemReport Model

```javascript
{
  reportedBy: ObjectId (ref: User),
  flatId: ObjectId (ref: Flat, optional),
  buildingId: ObjectId (ref: Building, optional),
  category: Enum ['plumbing', 'electrical', 'maintenance', 'security', 'other'],
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  title: String,
  description: String,
  images: [String],
  status: Enum ['open', 'assigned', 'in-progress', 'resolved', 'closed'],
  assignedTo: ObjectId (ref: Employee),
  assignedAt: Date,
  resolvedAt: Date,
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
// Index: { status: 1, priority: -1, createdAt: -1 }
```

### Employee Model

```javascript
{
  userId: ObjectId (ref: User),
  employeeId: String (unique),
  department: Enum ['maintenance', 'security', 'cleaning', 'management'],
  designation: String,
  salary: Number,
  joinDate: Date,
  status: Enum ['active', 'inactive', 'on-leave'],
  assignedTasks: [ObjectId] (ref: ProblemReport),
  createdAt: Date,
  updatedAt: Date
}
```

### Bill Model

```javascript
{
  flatId: ObjectId (ref: Flat),
  tenantId: ObjectId (ref: User),
  month: String ('YYYY-MM'),
  rent: Number,
  electricity: Number,
  gas: Number,
  water: Number,
  maintenance: Number,
  discount: Number (default: 0),
  total: Number,
  dueDate: Date,
  status: Enum ['unpaid', 'pending-verification', 'paid'],
  paymentId: ObjectId (ref: Payment),
  generatedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
// Index: { tenantId: 1, month: -1 }
```

### TreeSubmission Model

```javascript
{
  userId: ObjectId (ref: User),
  imageUrl: String,
  location: String,
  plantedDate: Date,
  aiAnalysis: {
    classification: Enum ['likely_genuine', 'likely_fake', 'uncertain'],
    confidence: Number (0-1),
    reasoning: String,
    modelUsed: String,
    analyzedAt: Date
  },
  status: Enum ['pending', 'approved', 'rejected'],
  adminDecision: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  pointsAwarded: Number (default: 0),
  month: String ('YYYY-MM'),
  createdAt: Date,
  updatedAt: Date
}
// Index: { userId: 1, status: 1, month: -1 }
```

### LeaveRequest Model

```javascript
{
  userId: ObjectId (ref: User),
  flatId: ObjectId (ref: Flat),
  startDate: Date,
  endDate: Date,
  reason: String,
  emergencyContact: String,
  status: Enum ['pending', 'approved', 'rejected'],
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
// Index: { userId: 1, status: 1 }
```

### Payment Model

```javascript
{
  billId: ObjectId (ref: Bill),
  userId: ObjectId (ref: User),
  amount: Number,
  bkashTransactionId: String (required),
  bkashPhoneNumber: String,
  status: Enum ['pending', 'verified', 'rejected'],
  verifiedBy: ObjectId (ref: User),
  verifiedAt: Date,
  rejectionReason: String,
  receiptUrl: String,
  createdAt: Date,
  updatedAt: Date
}
// Index: { bkashTransactionId: 1, status: 1 }
```

### Notification Model

```javascript
{
  recipientId: ObjectId (ref: User),
  recipientRole: String (for broadcast),
  title: String,
  message: String,
  type: Enum ['info', 'warning', 'success', 'error'],
  category: Enum ['bill', 'payment', 'booking', 'problem', 'tree', 'leave', 'general'],
  relatedId: ObjectId,
  relatedModel: String,
  isRead: Boolean (default: false),
  sentViaEmail: Boolean (default: false),
  createdAt: Date
}
// Index: { recipientId: 1, isRead: 1, createdAt: -1 }
```

---

## 🔐 Authentication & Authorization

### JWT Token Strategy

#### Access Token

- **Purpose:** Authenticate API requests
- **Expiry:** 15 minutes (configurable)
- **Storage:** Memory (React state/context)
- **Payload:** `{ userId, email, role }`

#### Refresh Token

- **Purpose:** Issue new access tokens
- **Expiry:** 7 days (configurable)
- **Storage:**
  - Backend: User.refreshTokens array
  - Frontend: httpOnly cookie (if deployed) or localStorage (local dev)
- **Rotation:** New refresh token issued on each use

### Token Flow

```
1. User Login
   → Backend validates credentials
   → Generates access token (15m) + refresh token (7d)
   → Stores refresh token in User.refreshTokens[]
   → Returns both tokens to frontend

2. API Request
   → Frontend attaches access token in Authorization header
   → Backend verifies token via middleware
   → Request proceeds if valid

3. Access Token Expired
   → Frontend detects 401 response
   → Sends refresh token to /api/auth/refresh
   → Backend validates refresh token
   → Issues new access token + rotates refresh token
   → Frontend retries original request

4. Refresh Token Expired
   → User redirected to login
```

### Role-Based Access Control

```javascript
// Middleware: roleGuard(['admin', 'owner'])
Roles:
  - admin: Full system access
  - owner: Manage owned flats, view reports
  - tenant: Pay bills, report problems, submit trees, request leave
  - visitor: Browse flats, submit booking requests
  - employee: View assigned tasks
```

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Access | Description              |
| ------ | ----------- | ------ | ------------------------ |
| POST   | `/register` | Public | Register new user        |
| POST   | `/login`    | Public | Login and get tokens     |
| POST   | `/refresh`  | Public | Refresh access token     |
| POST   | `/logout`   | Auth   | Invalidate refresh token |
| GET    | `/me`       | Auth   | Get current user         |
| PUT    | `/profile`  | Auth   | Update profile           |

---

### Admin Routes (`/api/admin`)

| Method            | Endpoint                   | Access | Description                 |
| ----------------- | -------------------------- | ------ | --------------------------- |
| **Buildings**     |                            |        |                             |
| POST              | `/buildings`               | Admin  | Create building             |
| GET               | `/buildings`               | Admin  | List all buildings          |
| PUT               | `/buildings/:id`           | Admin  | Update building             |
| DELETE            | `/buildings/:id`           | Admin  | Delete building             |
| **Flats**         |                            |        |                             |
| POST              | `/flats`                   | Admin  | Create flat                 |
| PUT               | `/flats/:id`               | Admin  | Update flat                 |
| DELETE            | `/flats/:id`               | Admin  | Delete flat                 |
| **Employees**     |                            |        |                             |
| POST              | `/employees`               | Admin  | Create employee             |
| GET               | `/employees`               | Admin  | List employees              |
| PUT               | `/employees/:id`           | Admin  | Update employee             |
| DELETE            | `/employees/:id`           | Admin  | Delete employee             |
| **Payments**      |                            |        |                             |
| GET               | `/payments/pending`        | Admin  | Pending verifications       |
| POST              | `/payments/:id/verify`     | Admin  | Verify payment              |
| POST              | `/payments/:id/reject`     | Admin  | Reject payment              |
| **Bookings**      |                            |        |                             |
| GET               | `/bookings`                | Admin  | All booking requests        |
| POST              | `/bookings/:id/approve`    | Admin  | Approve booking             |
| POST              | `/bookings/:id/reject`     | Admin  | Reject booking              |
| **Problems**      |                            |        |                             |
| GET               | `/problems`                | Admin  | All problem reports         |
| POST              | `/problems/:id/assign`     | Admin  | Assign to employee          |
| PUT               | `/problems/:id/status`     | Admin  | Update status               |
| **Trees**         |                            |        |                             |
| GET               | `/trees`                   | Admin  | All tree submissions        |
| POST              | `/trees/:id/approve`       | Admin  | Approve tree (award points) |
| POST              | `/trees/:id/reject`        | Admin  | Reject tree                 |
| **Leave**         |                            |        |                             |
| GET               | `/leave`                   | Admin  | All leave requests          |
| POST              | `/leave/:id/approve`       | Admin  | Approve leave               |
| POST              | `/leave/:id/reject`        | Admin  | Reject leave                |
| **Notifications** |                            |        |                             |
| POST              | `/notifications/broadcast` | Admin  | Send notification           |

---

### Flats (`/api/flats`)

| Method | Endpoint    | Access | Description                 |
| ------ | ----------- | ------ | --------------------------- |
| GET    | `/`         | Public | List available flats        |
| GET    | `/:id`      | Public | Flat details                |
| GET    | `/search`   | Public | Search flats (query params) |
| GET    | `/my-flats` | Owner  | Owner's flats               |

---

### Payments (`/api/payments`)

| Method | Endpoint       | Access | Description     |
| ------ | -------------- | ------ | --------------- |
| POST   | `/`            | Tenant | Submit payment  |
| GET    | `/my-payments` | Auth   | User's payments |
| GET    | `/:id`         | Auth   | Payment details |

---

### Bills (`/api/bills`)

| Method | Endpoint    | Access | Description   |
| ------ | ----------- | ------ | ------------- |
| GET    | `/my-bills` | Tenant | User's bills  |
| GET    | `/:id`      | Auth   | Bill details  |
| POST   | `/generate` | Admin  | Generate bill |

---

### Trees (`/api/trees`)

| Method | Endpoint              | Access | Description               |
| ------ | --------------------- | ------ | ------------------------- |
| POST   | `/submit`             | Tenant | Submit tree (upload + AI) |
| GET    | `/my-submissions`     | Auth   | User's submissions        |
| GET    | `/leaderboard`        | Public | Monthly leaderboard       |
| GET    | `/leaderboard/:month` | Public | Specific month            |

---

### Problems (`/api/problems`)

| Method | Endpoint      | Access | Description     |
| ------ | ------------- | ------ | --------------- |
| POST   | `/`           | Auth   | Report problem  |
| GET    | `/my-reports` | Auth   | User's reports  |
| GET    | `/:id`        | Auth   | Problem details |

---

### Leave (`/api/leave`)

| Method | Endpoint       | Access | Description     |
| ------ | -------------- | ------ | --------------- |
| POST   | `/`            | Tenant | Request leave   |
| GET    | `/my-requests` | Auth   | User's requests |
| GET    | `/:id`         | Auth   | Request details |

---

### Bookings (`/api/bookings`)

| Method | Endpoint       | Access  | Description            |
| ------ | -------------- | ------- | ---------------------- |
| POST   | `/`            | Visitor | Submit booking request |
| GET    | `/my-bookings` | Auth    | User's bookings        |

---

### Notifications (`/api/notifications`)

| Method | Endpoint    | Access | Description          |
| ------ | ----------- | ------ | -------------------- |
| GET    | `/`         | Auth   | User's notifications |
| PUT    | `/:id/read` | Auth   | Mark as read         |
| PUT    | `/read-all` | Auth   | Mark all as read     |

---

### Ollama Proxy (`/api/predict`)

| Method | Endpoint           | Access | Description            |
| ------ | ------------------ | ------ | ---------------------- |
| POST   | `/flat-price`      | Public | Predict flat price     |
| POST   | `/area-suggestion` | Public | Suggest area by budget |

**Request Body (flat-price):**

```json
{
  "area": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "floor": 5,
  "location": "Dhanmondi"
}
```

**Response:**

```json
{
  "success": true,
  "prediction": {
    "estimatedRent": 25000,
    "confidence": "medium",
    "factors": ["prime location", "adequate space"],
    "range": { "min": 22000, "max": 28000 }
  }
}
```

---

## 🤖 AI Integration Details

### Tree Verification Process

#### 1. User uploads tree image

Frontend → `/api/trees/submit` (multipart/form-data)

#### 2. Backend saves image locally

```
/backend/uploads/trees/tree_<userId>_<timestamp>.jpg
```

#### 3. Backend calls Ollama with strict prompt

**Prompt Template** (`/backend/utils/promptTemplates.js`):

```javascript
const TREE_VERIFICATION_PROMPT = `
You are an expert environmental analyst. Analyze this tree plantation image.

STRICT OUTPUT FORMAT (JSON only):
{
  "classification": "likely_genuine" | "likely_fake" | "uncertain",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief 1-2 sentence explanation"
}

GUIDELINES:
- "likely_genuine": Real tree, proper plantation, visible soil/roots
- "likely_fake": Stock photo, indoor plant, screenshot, heavily edited
- "uncertain": Poor quality, ambiguous, insufficient evidence

Image analysis requested. Respond ONLY with JSON.
`;
```

#### 4. Ollama API call

```javascript
// POST http://localhost:11434/api/generate
{
  "model": "llama2",
  "prompt": "<full_prompt_with_context>",
  "stream": false,
  "format": "json"
}
```

#### 5. Parse AI response

```javascript
{
  classification: 'likely_genuine',
  confidence: 0.85,
  reasoning: 'Visible young tree sapling with exposed roots in outdoor soil.'
}
```

#### 6. Store in TreeSubmission model

- Status: `pending`
- AI analysis attached
- Admin reviews and makes final decision

#### 7. Admin approval → Award points

- Default: 10 points per approved tree
- Monthly leaderboard calculated
- Winner gets 1000 BDT discount on next bill

---

### Flat Prediction

#### Endpoint: `/api/predict/flat-price`

**Request:**

```json
{
  "area": 1500,
  "bedrooms": 3,
  "bathrooms": 2,
  "floor": 4,
  "location": "Gulshan"
}
```

**Prompt Template:**

```javascript
const FLAT_PREDICTION_PROMPT = `
You are a real estate pricing expert in Dhaka, Bangladesh.

INPUT:
- Area: {area} sqft
- Bedrooms: {bedrooms}
- Bathrooms: {bathrooms}
- Floor: {floor}
- Location: {location}

OUTPUT (JSON only):
{
  "estimatedRent": <number in BDT>,
  "confidence": "low" | "medium" | "high",
  "factors": ["factor1", "factor2"],
  "range": {
    "min": <number>,
    "max": <number>
  }
}

Consider: location prestige, area size, floor preference, market rates in Dhaka.
Respond ONLY with JSON.
`;
```

**Ollama Response:**

```json
{
  "estimatedRent": 28000,
  "confidence": "high",
  "factors": ["prime Gulshan area", "adequate 3BR space", "mid-level floor"],
  "range": { "min": 25000, "max": 31000 }
}
```

---

### Ollama Graceful Degradation

If Ollama is unavailable:

```javascript
// Tree verification fallback
{
  classification: 'uncertain',
  confidence: 0,
  reasoning: 'AI service unavailable. Manual review required.'
}

// Flat prediction fallback
{
  error: 'Prediction service unavailable',
  suggestion: 'Contact admin for manual pricing'
}
```

---

## 💳 Payment Workflow (bKash Manual Verification)

### Tenant Flow

1. **View Bills** → `/billing`
2. **Select unpaid bill**
3. **Make bKash payment externally** (via bKash app/USSD)
4. **Submit transaction details** via `/api/payments`:
   ```json
   {
     "billId": "64abc123...",
     "bkashTransactionId": "8HK3JD9X2L",
     "bkashPhoneNumber": "01712345678",
     "amount": 15000
   }
   ```
5. **Status:** `pending`
6. **Notification sent** to admin

### Admin Flow

1. **View pending payments** → `/admin/payments`
2. **Verify in bKash merchant account** (manual check)
3. **Approve:**
   - POST `/api/admin/payments/:id/verify`
   - Payment status → `verified`
   - Bill status → `paid`
   - Email notification to tenant
4. **Reject:**
   - POST `/api/admin/payments/:id/reject`
   - Payment status → `rejected`
   - Provide rejection reason
   - Tenant can resubmit

---

## 📧 Email Notifications

### Configuration

**Gmail Example:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Generate at Google Account settings
```

**Mailtrap Example (Dev/Testing):**

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
```

### Email Templates

Located in `/backend/utils/emailTemplates.js`:

- **Payment Verified:** Confirmation with bill details
- **Payment Rejected:** Reason and resubmission instructions
- **Booking Approved:** Flat details and next steps
- **Tree Approved:** Congratulations + points awarded
- **Leave Approved:** Dates and emergency contact confirmation
- **Bill Generated:** Monthly bill summary with due date
- **Problem Assigned:** Employee notification

### Sending Logic

```javascript
// backend/config/email.js
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
```

**Note:** For Gmail, enable "Less secure app access" or use App Passwords with 2FA enabled.

---

## 🎨 Frontend Structure

### Routes

```javascript
// App.jsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected Routes */}
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Role-based */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/owner" element={<OwnerDashboard />} />
      <Route path="/visitor" element={<VisitorDashboard />} />

      {/* Features */}
      <Route path="/flat/:id" element={<FlatDetails />} />
      <Route path="/tree" element={<TreeVerification />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/booking-requests" element={<BookingRequests />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/leave" element={<Leave />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### API Client with JWT

```javascript
// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach access token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### UI Style Guidelines

- **Minimalistic:** Clean layouts, ample whitespace
- **Human-designed:** Avoid over-polished AI aesthetics
  - Use subtle shadows, not heavy gradients
  - Prefer simple borders over complex shapes
  - Friendly typography (Inter, Roboto, or system fonts)
- **Responsive:** Mobile-first approach with CSS Grid/Flexbox
- **Accessible:** Proper semantic HTML, ARIA labels
- **Color Scheme:**
  - Primary: Calm blue (#3B82F6)
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Error: Red (#EF4444)
  - Neutral: Gray scale

### Key Components

#### TreeUpload.jsx

```jsx
// Upload tree image
// Display AI confidence bar
// Show disclaimer: "AI is advisory. Admin has final approval."
```

#### Leaderboard.jsx

```jsx
// Monthly top 10 tree planters
// Highlight current user position
// Show winner's discount badge
```

#### PaymentForm.jsx

```jsx
// Input: bkashTransactionId, phone, amount
// Validation: transaction ID format
// Submit to /api/payments
```

#### FlatCard.jsx

```jsx
// Display: image, area, bedrooms, rent
// "Predict Price" button → calls /api/predict/flat-price
// Show AI suggestion as tooltip
```

---

## 🧪 Testing

### Backend Testing

#### Manual Testing with cURL

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tenant1",
    "email": "tenant1@test.com",
    "password": "Pass@123",
    "role": "tenant",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tenant1@test.com",
    "password": "Pass@123"
  }'
```

**Get Flats (with token):**

```bash
curl -X GET http://localhost:5000/api/flats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Postman Collection

Create collection with:

- Environment variables for `{{baseUrl}}` and `{{accessToken}}`
- Pre-request scripts to auto-attach token
- Tests for response validation

### Frontend Testing

#### Manual Testing Checklist

- [ ] Login/Logout flows
- [ ] Role-based route protection
- [ ] Token refresh on expiry
- [ ] File upload (tree images)
- [ ] Form validation
- [ ] API error handling
- [ ] Responsive design (mobile, tablet, desktop)

#### Browser Console Checks

```javascript
// Check token storage
localStorage.getItem("accessToken");
localStorage.getItem("refreshToken");

// Test API call
fetch("http://localhost:5000/api/flats")
  .then((r) => r.json())
  .then(console.log);
```

---

## 🌱 Seed Data

Run seed script to populate initial data:

```bash
cd backend
npm run seed
```

### Created Accounts

| Role     | Email                | Password     |
| -------- | -------------------- | ------------ |
| Admin    | admin@housefit.local | Admin@123    |
| Owner    | owner1@test.com      | Owner@123    |
| Tenant   | tenant1@test.com     | Tenant@123   |
| Visitor  | visitor1@test.com    | Visitor@123  |
| Employee | emp1@test.com        | Employee@123 |

### Sample Data

- **3 Buildings** (Green Villa, Blue Heights, Royal Apartments)
- **15 Flats** across buildings (mix of available/occupied)
- **5 Sample Bills** for tenants
- **3 Tree Submissions** (approved, pending, rejected)
- **2 Problem Reports**
- **1 Booking Request**

---

## 🚦 Running the Full Stack

### Terminal 1: MongoDB

```bash
mongod
# or use MongoDB Atlas (no local needed)
```

### Terminal 2: Ollama

```bash
ollama serve
```

### Terminal 3: Backend

```bash
cd backend
npm run dev
```

✅ Backend running on http://localhost:5000

### Terminal 4: Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend running on http://localhost:5173

---

## 🎯 Demo Checklist

### Admin Demo

- [ ] Login as admin
- [ ] Create new building
- [ ] Add flats to building
- [ ] View pending payments → Verify one
- [ ] View pending tree submissions → Approve one
- [ ] Assign problem report to employee
- [ ] Broadcast notification to all tenants

### Tenant Demo

- [ ] Login as tenant
- [ ] View assigned flat
- [ ] Upload tree image → Check AI analysis
- [ ] View bills → Submit payment with bKash ID
- [ ] Report a problem (with image)
- [ ] Request leave
- [ ] Check notifications

### Visitor Demo

- [ ] Browse available flats
- [ ] Use flat prediction tool
- [ ] Submit booking request
- [ ] Check request status

### Owner Demo

- [ ] View owned flats
- [ ] See tenant details
- [ ] View monthly revenue

### AI Demo

- [ ] Tree upload → Show AI confidence
- [ ] Flat prediction → Show price range
- [ ] Compare different areas/sizes

---

## 🔒 Security Considerations

### Implemented Security

✅ **Password Hashing** (bcrypt with salt rounds: 10)  
✅ **JWT Secrets** (min 32 characters, from env)  
✅ **Helmet.js** (security headers)  
✅ **Rate Limiting** (100 requests per 15 min)  
✅ **CORS** (restricted to FRONTEND_URL)  
✅ **Input Validation** (express-validator)  
✅ **SQL Injection Protection** (Mongoose ODM)  
✅ **File Upload Limits** (5MB max)  
✅ **Role-based Access Control**

### Additional Recommendations (for production)

⚠️ **HTTPS Only** (use Let's Encrypt for SSL)  
⚠️ **Environment Variables** (never commit .env)  
⚠️ **Database Backups** (daily automated)  
⚠️ **Logging & Monitoring** (Winston, Morgan)  
⚠️ **Session Management** (Redis for token blacklist)  
⚠️ **Content Security Policy**  
⚠️ **Dependency Scanning** (npm audit)  
⚠️ **API Versioning** (/api/v1)

### Known Limitations

🔴 **bKash verification is manual** (no API integration)  
🔴 **Local file storage** (not scalable; migrate to S3/Cloudinary)  
🔴 **AI is advisory only** (not production-grade classification)  
🔴 **Email via Gmail** (rate-limited; use SendGrid/AWS SES for production)  
🔴 **Refresh tokens in DB** (consider Redis)

---

## 📝 File Storage Strategy

### Current: Local Storage

```
/backend/uploads/
  ├── trees/
  │   └── tree_64abc123_1735824000000.jpg
  ├── flats/
  │   └── flat_64xyz789_1735824000000.jpg
  └── profiles/
      └── profile_64def456_1735824000000.jpg
```

**Naming Convention:**

```javascript
const filename = `${category}_${userId}_${Date.now()}.${ext}`;
```

**Database Storage:**

```javascript
{
  imageUrl: "/uploads/trees/tree_64abc123_1735824000000.jpg";
}
```

### Future: S3 Migration

**Code comments added for S3 transition:**

```javascript
// backend/utils/fileUpload.js

// TODO: Replace local storage with S3
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY
// });
//
// const uploadToS3 = async (file) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `${category}/${filename}`,
//     Body: file.buffer,
//     ContentType: file.mimetype
//   };
//   const result = await s3.upload(params).promise();
//   return result.Location; // S3 URL
// };
```

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Fix:**

- Start MongoDB: `mongod`
- Check MONGO_URI in .env
- For Atlas: verify IP whitelist and credentials

#### Ollama Not Responding

```
Error: connect ECONNREFUSED localhost:11434
```

**Fix:**

- Start Ollama: `ollama serve`
- Verify OLLAMA_URL in .env
- Test: `curl http://localhost:11434/api/tags`

#### Email Not Sending

```
Error: Invalid login: 535 Authentication failed
```

**Fix (Gmail):**

- Enable 2FA on Google Account
- Generate App Password: https://myaccount.google.com/apppasswords
- Use app password in SMTP_PASS

**Fix (Mailtrap):**

- Create free account at mailtrap.io
- Copy credentials from inbox settings

#### JWT Secret Missing

```
Error: secretOrPrivateKey must have a value
```

**Fix:**

- Ensure .env has JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
- Minimum 32 characters each
- Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Frontend Issues

#### API Calls Failing (CORS)

```
Access to fetch blocked by CORS policy
```

**Fix:**

- Verify FRONTEND_URL in backend .env matches frontend dev server
- Check VITE_API_BASE_URL in frontend .env

#### Token Not Persisting

```
User logged out on page refresh
```

**Fix:**

- Check localStorage in browser dev tools
- Ensure apiClient interceptor is configured
- Verify AuthContext persistence logic

#### File Upload Fails

```
413 Payload Too Large
```

**Fix:**

- Reduce image size (max 5MB)
- Check MAX_FILE_SIZE in both .env files
- Update backend multer limits if needed

### Ollama Issues

#### Model Not Found

```
Error: model 'llama2' not found
```

**Fix:**

```bash
ollama pull llama2
# or
ollama pull mistral  # faster alternative
```

#### Slow Response Times

**Optimization:**

- Use smaller model: `ollama pull mistral`
- Increase timeout in axios config
- Consider GPU acceleration (if available)

#### JSON Parsing Error

```
Unexpected token in JSON
```

**Fix:**

- Ollama may return non-JSON text
- Update prompt to emphasize "JSON only"
- Add response validation and fallback

---

## 🚀 Deployment Considerations

### Backend Deployment (e.g., Railway, Render, Heroku)

1. **Environment Variables:**

   - Set all .env values in platform dashboard
   - Use production MongoDB Atlas URI
   - Generate strong JWT secrets

2. **Start Command:**

   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

3. **File Uploads:**

   - Migrate to S3/Cloudinary before deployment
   - Local uploads will be lost on dyno restart

4. **Ollama:**
   - Cannot run on most PaaS platforms (requires GPU/high RAM)
   - Options:
     - Deploy Ollama on separate VPS (DigitalOcean, Linode)
     - Use OpenAI API as fallback
     - Disable AI features in production

### Frontend Deployment (Vercel)

1. **Build Command:**

   ```bash
   npm run build
   ```

2. **Environment Variables:**

   - `VITE_API_BASE_URL`: Production backend URL

3. **Deploy:**

   ```bash
   vercel --prod
   ```

4. **CORS Update:**
   - Add Vercel URL to backend FRONTEND_URL

### Database (MongoDB Atlas)

1. **Create Cluster** (free M0 tier)
2. **Whitelist IPs** (0.0.0.0/0 for testing, specific IPs for production)
3. **Connection String:**
   ```
   mongodb+srv://<user>:<pass>@cluster.mongodb.net/housefit?retryWrites=true&w=majority
   ```

---

## ⚠️ Important Disclaimers

### AI Advisory Notice

> **The AI-based tree verification system is for DEMONSTRATION and ADVISORY purposes only.**
>
> - AI classification (likely_genuine, likely_fake, uncertain) is not definitive
> - Admin review and approval is MANDATORY before awarding points
> - Do not rely solely on AI confidence scores
> - False positives and false negatives are expected
> - System is designed for educational use, not production verification

### Flat Prediction Disclaimer

> **Flat price predictions are estimates based on limited data and should not be used as financial advice.**
>
> - Predictions are generated by local LLM with no real market data
> - Accuracy depends on model quality and training
> - Users should verify prices through official market research
> - System is for demonstration and learning purposes

### Payment Security Notice

> **bKash transaction verification is MANUAL and does not integrate with bKash APIs.**
>
> - Admins must log into bKash merchant account separately
> - No automated validation of transaction IDs
> - Risk of fraud if admin does not verify properly
> - For production, integrate bKash Payment Gateway API

### Email Service Notice

> **Email notifications use free SMTP providers (Gmail/Mailtrap) and are rate-limited.**
>
> - Gmail: ~100 emails/day for personal accounts
> - For production, use transactional email service (SendGrid, AWS SES, Mailgun)
> - Current implementation is demo-quality only

### Local File Storage Warning

> **Images are stored locally on the backend server and will be lost if the server restarts (on platforms like Heroku).**
>
> - Not suitable for production
> - Migrate to cloud storage (AWS S3, Cloudinary) before deployment
> - Code includes comments for S3 migration

---

## 📚 Additional Resources

### Documentation Links

- **MongoDB:** https://docs.mongodb.com/
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **Vite:** https://vitejs.dev/
- **Ollama:** https://ollama.ai/
- **JWT:** https://jwt.io/
- **Nodemailer:** https://nodemailer.com/
- **Mongoose:** https://mongoosejs.com/

### Learning Resources

- **JWT Best Practices:** https://datatracker.ietf.org/doc/html/rfc8725
- **React Router:** https://reactrouter.com/
- **MongoDB Indexes:** https://www.mongodb.com/docs/manual/indexes/
- **Helmet.js Security:** https://helmetjs.github.io/

### Tools

- **Postman:** API testing
- **MongoDB Compass:** Database GUI
- **VS Code Extensions:**
  - ESLint
  - Prettier
  - REST Client
  - MongoDB for VS Code

---

## 🤝 Contributing

This is a university project. For any improvements:

1. Document changes in this README
2. Update .env.example files if adding new variables
3. Maintain backward compatibility
4. Add comments for future developers
5. Test thoroughly before committing

---

## 📄 License

This project is for educational purposes. Not licensed for commercial use.

---

## 👥 Support

For issues or questions:

1. Check Troubleshooting section above
2. Review environment variable configuration
3. Verify all services (MongoDB, Ollama, backend, frontend) are running
4. Check browser console and backend logs for errors

---

## 🎓 Project Context

**Course:** Software Engineering / Web Development  
**Type:** University Project  
**Purpose:** Demonstrate full-stack development skills with modern MERN stack and AI integration  
**Scope:** Local development with cloud deployment readiness

---

**Last Updated:** January 2, 2026  
**Version:** 1.0.0  
**Status:** Development Blueprint

---

### Quick Start Summary

```bash
# 1. Clone/setup project
cd HouseFit

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run seed
npm run dev

# 3. Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev

# 4. Start MongoDB (new terminal)
mongod

# 5. Start Ollama (new terminal)
ollama serve
ollama pull llama2

# 6. Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# Login as admin@housefit.local / Admin@123
```

---

**🎉 You're all set! Start building HouseFit!** 🏠✨

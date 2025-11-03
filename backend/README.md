# Todo List Backend API

Backend API untuk aplikasi Todo List menggunakan FastAPI dan SQLAlchemy.

## 🚀 Fitur

- ✅ Authentication (Register & Login) dengan JWT
- ✅ CRUD Operations untuk Todos
- ✅ User-specific todos
- ✅ SQLite Database
- ✅ CORS support untuk Next.js
- ✅ Auto-generated API documentation (Swagger UI)

## 📋 Requirements

- Python 3.8+
- pip

## 🛠️ Installation

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Setup environment variables (optional):**
```bash
cp env.example .env
# Edit .env file dengan konfigurasi Anda
```

## 🏃 Running the Server

```bash
uvicorn main:app --reload
```

Server akan berjalan di: `http://localhost:8000`

## 📚 API Documentation

Setelah server berjalan, akses dokumentasi API di:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔐 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "name": "User Name",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Todos

#### Get All Todos
```http
GET /api/todos
Authorization: Bearer <token>
```

#### Get Todo by ID
```http
GET /api/todos/{todo_id}
Authorization: Bearer <token>
```

#### Create Todo
```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Belajar FastAPI",
  "completed": false,
  "due_date": "2024-12-31T00:00:00"
}
```

#### Update Todo
```http
PUT /api/todos/{todo_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Belajar FastAPI (Updated)",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /api/todos/{todo_id}
Authorization: Bearer <token>
```

#### Clear Completed Todos
```http
DELETE /api/todos/completed/clear
Authorization: Bearer <token>
```

## 📁 Project Structure

```
backend/
├── main.py              # Entry point aplikasi
├── database.py          # Database configuration
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── auth.py              # Authentication utilities
├── routers/
│   ├── __init__.py
│   ├── auth.py          # Authentication routes
│   └── todos.py         # Todo CRUD routes
├── requirements.txt     # Python dependencies
├── env.example          # Environment variables example
└── README.md            # Documentation
```

## 🔒 Security

- Password di-hash menggunakan bcrypt
- JWT tokens untuk authentication
- Token expiration: 30 menit (default)
- CORS dikonfigurasi untuk Next.js (localhost:3000)

## 💾 Database

Aplikasi menggunakan SQLite database (`todo_app.db`) yang akan dibuat otomatis saat pertama kali menjalankan server.

### Models:

**User:**
- id (Integer, Primary Key)
- username (String, Unique)
- name (String)
- hashed_password (String)
- created_at (DateTime)

**Todo:**
- id (Integer, Primary Key)
- text (String)
- completed (Boolean)
- created_at (DateTime)
- due_date (DateTime, Optional)
- user_id (Integer, Foreign Key)

## 🧪 Testing

Anda bisa test API menggunakan:
1. Swagger UI di `/docs`
2. Postman
3. cURL
4. HTTPie

## 🔄 Integration dengan Next.js

Backend sudah dikonfigurasi dengan CORS untuk menerima request dari Next.js di `http://localhost:3000`.

Untuk mengintegrasikan dengan frontend Next.js:

1. Install axios di Next.js:
```bash
npm install axios
```

2. Buat API service di Next.js untuk berkomunikasi dengan backend
3. Simpan JWT token di localStorage atau cookies
4. Sertakan token di header setiap request

## 📝 Notes

- Ganti `SECRET_KEY` di `auth.py` untuk production
- Untuk production, gunakan database yang lebih robust (PostgreSQL, MySQL)
- Implementasikan rate limiting untuk security
- Tambahkan logging untuk monitoring

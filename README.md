# 📝 Todo App - Full Stack Task Management

A modern, full-featured todo application built with Next.js and FastAPI. Manage your tasks efficiently with a beautiful, responsive interface supporting both Indonesian and English languages.

## ✨ Features

- 🎯 **Task Management** - Create, edit, delete, and organize tasks
- 📅 **Calendar Integration** - Schedule and track events
- 📊 **Statistics Dashboard** - View productivity metrics
- 📝 **Notes** - Keep important notes organized
- 🌓 **Dark/Light Mode** - Comfortable viewing in any lighting
- 🌍 **Bilingual** - Full support for Indonesian and English
- 🔐 **Authentication** - Secure user registration and login
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Context API** - State management

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/todo-app.git
cd todo-app
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Create Test User (Optional)**
```bash
cd backend
python create_test_user.py
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload
```
Backend runs on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

### Default Test Account
- Email: `test@example.com`
- Password: `test123`

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── views/       # Page views
│   │   ├── Login.tsx    # Login component
│   │   ├── Register.tsx # Registration
│   │   └── ...
│   ├── context/         # React context
│   └── lib/             # Utilities & API
├── backend/
│   ├── main.py          # FastAPI app
│   ├── models.py        # Database models
│   ├── routers/         # API routes
│   ├── auth.py          # Authentication
│   └── database.py      # Database config
└── public/              # Static files
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Backend
- `python check_users.py` - Check registered users
- `python create_test_user.py` - Create test user
- `python backup_db.py` - Backup database

## 🎨 Features in Detail

### Task Management
- ✅ Create tasks with title, description, category, priority
- ✅ Set due dates and deadlines
- ✅ Mark tasks as complete
- ✅ Filter by status, category, priority
- ✅ Sort by date, priority, deadline
- ✅ Search functionality

### Calendar
- 📅 View monthly calendar
- 📅 Add events with date and time
- 📅 Color-coded events
- 📅 Upcoming events list

### Notes
- 📝 Create colorful notes
- 📝 Categorize notes
- 📝 Rich text support
- 📝 Category statistics

### Statistics
- 📊 Completion rate
- 📊 Weekly productivity chart
- 📊 Category distribution
- 📊 Streak tracking

## 🌍 Internationalization

The app supports two languages:
- 🇮🇩 Bahasa Indonesia
- 🇬🇧 English

Switch languages in Settings.

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- Secure HTTP-only cookies
- CORS protection

## 📱 Responsive Design

Optimized for:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created with ❤️ by Rosfi

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the powerful backend framework
- Tailwind CSS for beautiful styling

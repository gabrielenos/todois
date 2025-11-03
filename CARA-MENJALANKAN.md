# 🚀 Cara Menjalankan Todo List App

## ✅ Cara Paling Mudah (Recommended)

### 1. Double-click file ini:
```
START-APP.bat
```

### 2. Tunggu ~10 detik

### 3. Buka browser: http://localhost:3000

**Itu saja!** Script akan otomatis:
- ✅ Buat file `.env.local` (jika belum ada)
- ✅ Hapus database lama
- ✅ Start backend di http://localhost:8000
- ✅ Start frontend di http://localhost:3000
- ✅ Buka 2 terminal window

**TIDAK PERLU INSTALL APA-APA LAGI!**

---

## 📝 Cara Manual (Jika perlu)

### 1. Start Backend
Double-click:
```
start-backend.bat
```
Atau manual:
```bash
cd backend
python -m uvicorn main:app --reload
```

### 2. Start Frontend (Terminal baru)
Double-click:
```
start-frontend.bat
```
Atau manual:
```bash
npm run dev
```

---

## 🌐 URL Penting

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## ❌ Jika Masih "Failed to fetch"

### Cek 1: Pastikan Backend Jalan
Buka: http://localhost:8000
Harus muncul:
```json
{
  "message": "Welcome to Todo List API",
  "docs": "/docs",
  "version": "1.0.0"
}
```

### Cek 2: Pastikan Port Tidak Bentrok
Jika port 8000 atau 3000 sudah dipakai:
- Tutup aplikasi lain yang pakai port tersebut
- Atau restart komputer

### Cek 3: Restart Semua
1. Tutup semua terminal
2. Double-click `START-APP.bat` lagi

---

## 🎯 Test Aplikasi

1. Buka http://localhost:3000
2. Klik "Daftar sekarang"
3. Isi form:
   - Nama: Test User
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Klik "Daftar Sekarang"
5. Ikuti onboarding (3 langkah)
6. Mulai pakai aplikasi!

---

## 📦 Tidak Perlu Install Apa-apa Lagi!

Semua dependency sudah terinstall:
- ✅ Python packages (FastAPI, SQLAlchemy, dll)
- ✅ Node modules (Next.js, React, dll)
- ✅ Database (SQLite - otomatis dibuat)

---

## 🔧 Troubleshooting

### Error: "python tidak dikenali"
Install Python dari: https://www.python.org/downloads/

### Error: "npm tidak dikenali"
Install Node.js dari: https://nodejs.org/

### Error: "Module not found"
Jalankan sekali saja:
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
npm install
```

---

## 📞 Bantuan

Jika masih error, cek:
1. Backend terminal - ada error message?
2. Frontend terminal - ada error message?
3. Browser console (F12) - ada error?

Kirim screenshot error untuk bantuan lebih lanjut.

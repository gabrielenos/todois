"""
Script untuk membuat user test jika database kosong
"""
from database import SessionLocal, engine, Base
from models import User
import bcrypt

def create_test_user():
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Cek apakah sudah ada user dengan email ini
        existing = db.query(User).filter(User.email == "test@example.com").first()
        if existing:
            print("⚠️  User test sudah ada!")
            print(f"   Email    : {existing.email}")
            print(f"   Username : {existing.username}")
            print(f"   Password : test123")
            return
        
        # Buat user baru dengan bcrypt langsung
        password = "test123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_user = User(
            name="Test User",
            username="testuser",
            email="test@example.com",
            hashed_password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("✅ User test berhasil dibuat!")
        print("\n📧 Login dengan:")
        print("   Email    : test@example.com")
        print("   Password : test123")
        print("\n💡 Gunakan kredensial ini untuk login di aplikasi")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Membuat user test...\n")
    create_test_user()

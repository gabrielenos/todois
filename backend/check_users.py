"""
Script untuk melihat semua user yang terdaftar di database
"""
from database import SessionLocal
from models import User

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        
        if not users:
            print("❌ Tidak ada user di database!")
            print("\n💡 Solusi:")
            print("   1. Daftar akun baru di aplikasi")
            print("   2. Atau jalankan: python create_test_user.py")
            return
        
        print(f"✅ Ditemukan {len(users)} user di database:\n")
        print("=" * 70)
        for i, user in enumerate(users, 1):
            print(f"{i}. Nama     : {user.name}")
            print(f"   Username : {user.username}")
            print(f"   Email    : {user.email}")
            print(f"   ID       : {user.id}")
            print(f"   Dibuat   : {user.created_at}")
            print("-" * 70)
        
        print("\n💡 Untuk login, gunakan:")
        print("   Email    : (email di atas)")
        print("   Password : (password yang Anda buat saat daftar)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🔍 Mengecek user di database...\n")
    check_users()

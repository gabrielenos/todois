"""
Script untuk membuat demo users
Jalankan: python seed_data.py
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def seed_users():
    db = SessionLocal()
    
    # Check if users already exist
    existing_users = db.query(User).count()
    if existing_users > 0:
        print(f"Database sudah memiliki {existing_users} users. Skip seeding.")
        db.close()
        return
    
    # Demo users
    demo_users = [
        {
            "username": "admin",
            "name": "Administrator",
            "password": "admin123"
        },
        {
            "username": "user",
            "name": "User Demo",
            "password": "user123"
        }
    ]
    
    for user_data in demo_users:
        hashed_password = get_password_hash(user_data["password"])
        user = User(
            username=user_data["username"],
            name=user_data["name"],
            hashed_password=hashed_password
        )
        db.add(user)
        print(f"✓ Created user: {user_data['username']} / {user_data['password']}")
    
    db.commit()
    db.close()
    print("\n✅ Seeding completed!")
    print("\nDemo credentials:")
    print("1. admin / admin123")
    print("2. user / user123")

if __name__ == "__main__":
    print("🌱 Seeding database...")
    seed_users()

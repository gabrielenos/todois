"""
Script untuk backup database
"""
import shutil
from datetime import datetime
import os

def backup_database():
    source = "todo_app.db"
    
    if not os.path.exists(source):
        print("❌ Database tidak ditemukan!")
        return
    
    # Create backups folder if not exists
    if not os.path.exists("backups"):
        os.makedirs("backups")
    
    # Create backup with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    destination = f"backups/todo_app_backup_{timestamp}.db"
    
    try:
        shutil.copy2(source, destination)
        print(f"✅ Database berhasil di-backup ke: {destination}")
        
        # Show backup size
        size = os.path.getsize(destination)
        print(f"📦 Ukuran: {size:,} bytes")
        
    except Exception as e:
        print(f"❌ Error saat backup: {e}")

if __name__ == "__main__":
    print("🔄 Membackup database...\n")
    backup_database()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, todos, notes
import models
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo List API",
    description="Backend API untuk aplikasi Todo List",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mengizinkan semua origin untuk sementara
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(todos.router, prefix="/api/todos", tags=["Todos"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Todo List API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

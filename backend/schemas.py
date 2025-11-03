from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    user: User
    access_token: str
    token_type: str = "bearer"

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

# Todo Schemas
class TodoBase(BaseModel):
    text: str
    completed: bool = False
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    priority: str = "medium"
    description: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    description: Optional[str] = None

class Todo(TodoBase):
    id: int
    created_at: datetime
    user_id: int
    category: Optional[str] = None
    priority: str = "medium"
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

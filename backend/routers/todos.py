from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db
from auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Todo])
def get_todos(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all todos for current user"""
    todos = db.query(models.Todo).filter(
        models.Todo.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return todos

@router.get("/{todo_id}", response_model=schemas.Todo)
def get_todo(
    todo_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific todo by ID"""
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return todo

@router.post("/", response_model=schemas.Todo, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: schemas.TodoCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new todo"""
    db_todo = models.Todo(
        **todo.dict(),
        user_id=current_user.id
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.put("/{todo_id}", response_model=schemas.Todo)
def update_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update todo"""
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    # Update only provided fields
    update_data = todo_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)
    
    db.commit()
    db.refresh(todo)
    return todo

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete todo"""
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    db.delete(todo)
    db.commit()
    return None

@router.delete("/completed/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_completed_todos(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete all completed todos"""
    db.query(models.Todo).filter(
        models.Todo.user_id == current_user.id,
        models.Todo.completed == True
    ).delete()
    db.commit()
    return None

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Note, User
from routers.auth import get_current_user

router = APIRouter()

# Pydantic schemas
class NoteCreate(BaseModel):
    title: str
    content: str | None = None
    category: str | None = None
    color: str = 'yellow'

class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    category: str | None = None
    color: str | None = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str | None
    category: str | None
    color: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# GET all notes
@router.get("/", response_model=List[NoteResponse])
def get_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notes = db.query(Note).filter(Note.user_id == current_user.id).order_by(Note.updated_at.desc()).all()
    return notes


# GET single note
@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


# CREATE note
@router.post("/", response_model=NoteResponse)
def create_note(
    note_data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_note = Note(
        title=note_data.title,
        content=note_data.content,
        category=note_data.category,
        color=note_data.color,
        user_id=current_user.id
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


# UPDATE note
@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    if note_data.title is not None:
        note.title = note_data.title
    if note_data.content is not None:
        note.content = note_data.content
    if note_data.category is not None:
        note.category = note_data.category
    if note_data.color is not None:
        note.color = note_data.color
    
    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    return note


# DELETE note
@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}

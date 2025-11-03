const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  name: string;
  created_at: string;
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data?.detail) {
      if (typeof data.detail === 'string') return data.detail;
      return JSON.stringify(data.detail);
    }
    return JSON.stringify(data);
  } catch {
    try {
      return await res.text();
    } catch {
      return 'Request failed';
    }
  }
}

export interface LoginResponse {
  user: ApiUser;
  access_token: string;
  token_type: string;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiRegister(name: string, username: string, email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiMe(token: string): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiUpdateProfile(token: string, name: string): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiChangePassword(token: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

// Todos
export interface ApiTodo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  due_date: string | null;
  user_id: number;
  category: string | null;
  priority: string;
  description: string | null;
}

export interface ApiTodoCreate {
  text: string;
  completed?: boolean;
  due_date?: string | null;
  category?: string | null;
  priority?: string;
  description?: string | null;
}

export interface ApiTodoUpdate {
  text?: string;
  completed?: boolean;
  due_date?: string | null;
  category?: string | null;
  priority?: string;
  description?: string | null;
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  } as const;
}

export async function apiGetTodos(token: string): Promise<ApiTodo[]> {
  const res = await fetch(`${API_BASE}/api/todos/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiCreateTodo(token: string, data: ApiTodoCreate): Promise<ApiTodo> {
  const res = await fetch(`${API_BASE}/api/todos/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiUpdateTodo(token: string, id: number, data: ApiTodoUpdate): Promise<ApiTodo> {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiDeleteTodo(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function apiClearCompleted(token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/todos/completed/clear`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
}

// ============================================
// NOTES API
// ============================================

export interface ApiNote {
  id: number;
  title: string;
  content: string | null;
  category: string | null;
  color: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface NoteCreateData {
  title: string;
  content?: string | null;
  category?: string | null;
  color?: string;
}

export interface NoteUpdateData {
  title?: string;
  content?: string | null;
  category?: string | null;
  color?: string;
}

export async function apiGetNotes(token: string): Promise<ApiNote[]> {
  const res = await fetch(`${API_BASE}/api/notes/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiGetNote(token: string, id: number): Promise<ApiNote> {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiCreateNote(token: string, data: NoteCreateData): Promise<ApiNote> {
  const res = await fetch(`${API_BASE}/api/notes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiUpdateNote(token: string, id: number, data: NoteUpdateData): Promise<ApiNote> {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiDeleteNote(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
}

# CodeMind AI — API Documentation

Base URL: `http://localhost:5000/api`

All AI endpoints are rate-limited to 20 requests/minute.

## Auth

### POST /auth/register
```json
{ "username": "john", "email": "john@example.com", "password": "secret123" }
```

### POST /auth/login
```json
{ "email": "john@example.com", "password": "secret123" }
```
Returns: `{ "token": "jwt_token", "user": {...} }`

### GET /auth/me
Requires: `Authorization: Bearer <token>`

---

## Code

### POST /code/generate
```json
{ "prompt": "Create a binary search function", "language": "python", "mode": "beginner" }
```

### POST /code/debug
```json
{ "code": "...", "language": "python" }
```

### POST /code/convert
```json
{ "code": "...", "fromLanguage": "python", "toLanguage": "javascript" }
```

### POST /code/complexity
```json
{ "code": "...", "language": "python" }
```

---

## Chat

### POST /chat
```json
{
  "messages": [
    { "role": "user", "content": "What is a closure?" }
  ]
}
```

---

## User (Auth Required)

- `GET /user/profile`
- `PATCH /user/preferences` — `{ preferredLanguage, skillLevel }`
- `POST /user/snippets` — `{ title, code, language }`
- `GET /user/snippets`
- `DELETE /user/snippets/:id`

# PhD Database Design Documentation

## 1. System Architecture
This project utilizes a **Dual-Layer Local Storage System**:
1. **Primary Layer:** SQLite (`phd_database_v2.sqlite`) using a JSON-storage pattern for high-performance offline access.
2. **Secondary Layer:** JSON backup files (`data/students.json`) for data portability and human-readable debugging.

## 2. Database Schema (JSON Structure)

### 2.1 Users Collection
Used for Authentication and Authorization.
```json
{
  "_id": "UUID",
  "username": "string (unique)",
  "password": "string",
  "role": "Admin | Staff | Student | HOD",
  "email": "string",
  "createdAt": "ISOString",
  "updatedAt": "ISOString"
}
```

### 2.2 Students Collection
The core data structure for scholar management.
```json
{
  "_id": "UUID",
  "regNo": "string (unique)",
  "name": "string",
  "email": "string (unique)",
  "department": "string",
  "supervisor": "string",
  "status": "string",
  "researchTopic": "string",
  "timeline": [
    { "stage": "string", "status": "Pending|Completed", "dateCompleted": "Date" }
  ],
  "literaturePapers": [
    { "title": "string", "journal": "string", "year": "string", "doi": "string" }
  ],
  "provisionFiles": [{ "name": "string", "url": "string" }],
}
```

## 3. SQL Query Reference (SQLite)

### Initialize Tables
```sql
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    data JSON
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    data JSON
);
```

### Upsert Logic (Insert or Update)
```sql
INSERT INTO students (id, email, data)
VALUES (?, ?, ?)
ON CONFLICT(email) DO UPDATE SET data = excluded.data;
```

## 4. Maintenance Scripts
- `inject_sqlite.js`: Populates the database with initial dummy data.
- `dump_students.js`: Exports the current database state to a text file.
- `show_db.js`: Displays the current SQLite database content in the console.

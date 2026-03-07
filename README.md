# PhD Scholar Management System

A robust, local-first web application for managing PhD scholar data, progress tracking, and administrative workflows.

## 🚀 Features

- **Scholar Dashboard**: Visualize research progress, timelines, and publication details.
- **Dual-Layer Storage**: Combines the performance of SQLite with the portability of JSON backups.
- **Role-Based Access**: 
  - **Admins/HOD**: Full access to all scholar records.
  - **Staff**: View and update permissions.
  - **Students**: Secure access to their own progress data.
- **Modern UI**: Clean, responsive dashboard with interactive toast notifications.
- **Offline Ready**: Designed for high availability with local-first database architecture.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend**: Node.js, Express.
- **Database**: SQLite (using `sqlite3`) with JSON-storage pattern.
- **Styling**: Custom CSS with Glassmorphism and modern design principles.

## 📂 Project Structure

- `server.js`: Main Express server configuration.
- `database.js`: SQLite connection and query logic.
- `dashboard.html`: Main interface for scholar management.
- `database_design.md`: Detailed documentation of the data schema.
- `routes/`: API endpoint definitions for auth and student data.

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

## 📥 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sharfrinmuji-lang/phd-database.git
   cd phd-database
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   node inject_sqlite.js
   ```

## 🖥️ Usage

1. Start the server:
   ```bash
   node server.js
   ```

2. Open your browser and navigate to `http://localhost:3000/login.html`.

## 📄 License

MIT License - See the project for more details.

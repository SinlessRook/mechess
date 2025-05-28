# ♟️ Mechess

**Mechess** is a full-stack web application for individuals to host chess tournaments and track player performance. It provides a sleek, user-friendly interface for managing games, viewing leaderboards, and analyzing player statistics.

## 🌐 Live Demo

Coming soon!

## 📁 Project Structure

```
Mechess/
├── client/            # Frontend (React + Tailwind CSS)
│   ├── .env           # Contains BACKEND_URL, DEBUG_MODE
│   └── ...
├── server/            # Backend (Django + PostgreSQL)
│   ├── .env           # Contains DEBUG, MODE, DATABASE_URL
│   └── ...
├── README.md
└── ...
```

## 🚀 Features

* 🏆 Create and manage chess tournaments
* 📊 Track player statistics and performance
* 📈 View interactive leaderboards
* 🔍 Search and filter matches
* 🌐 Integrates with Chess.com API for profile and game data
* 🎨 Modern and responsive UI with animations

## 🛠️ Installation

### Prerequisites

* Node.js (v16 or later)
* Python (v3.10 or later)
* PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/SinlessRook/Mechess.git
cd Mechess
```

### 2. Setup Backend (Django)

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file in the server directory with:
# DEBUG=True
# MODE=development
# DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
# ALLOWED_HOSTS

python manage.py migrate
python manage.py runserver
```

### 3. Setup Frontend (React)

```bash
cd ../client
npm install

# Create a .env file in the client directory with:
# VITE_BACKEND_URL=http://localhost:8000
# VITE_DEBUG_MODE=true

npm run dev
```

Visit: `http://localhost:5173`

## 📂 Environment Variables

### `client/.env`

```
VITE_BACKEND_URL=http://localhost:8000
VITE_DEBUG_MODE=true
```

### `server/.env`

```
DEBUG=True
MODE=development
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
```

## ♟️ Chess.com API Integration

Mechess integrates with the [Chess.com Public API](https://www.chess.com/news/view/published-data-api) to fetch player data, match history, and profile details. This allows:

* Viewing player profiles and ratings
* Analyzing historical performance
* Displaying user avatars and statistics

No authentication is required for public Chess.com profiles.

## 🖼️ Screenshots

![Leaderboard Screenshot](./Screenshots/leaderboard.png)
![Profile Page Screenshot](./Screenshots/profile.png)
![Loading Screen](./Screenshots/Loading%20Screen.png)

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by [SinlessRook](https://github.com/SinlessRook)

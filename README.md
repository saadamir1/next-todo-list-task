# Next-Todo-List-Task

A simple, elegant task management application built with Next.js and Express.

## Features

- Create, read, update, and delete tasks
- Toggle task completion status
- Set priority levels (Low, Medium, High)
- Dark mode support
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Lucide React icons
- **Backend**: Express.js
- **Structure**: Full-stack JavaScript application

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/next-todo-list-task.git
   cd next-todo-list-task
   ```

2. Install dependencies
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. Set up environment variables
   ```bash
   # Create .env file in root directory
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env
   ```

### Running the Application

1. Start the backend server
   ```bash
   # From the server directory
   npm start
   ```

2. In a new terminal, start the frontend
   ```bash
   # From the root directory
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
next-todo-list-task/
├── .next/               # Next.js build output
├── components/          # React components
│   └── DarkModeToggle.tsx
├── pages/               # Next.js pages
│   ├── task/
│   │   └── [id].js      # Task detail page
│   ├── _app.js          # Custom App component
│   └── index.js         # Task list page
├── public/              # Public assets
├── server/              # Express backend
│   └── server.js        # API server
├── styles/              # CSS styles
├── .env                 # Environment variables
└── next.config.ts       # Next.js configuration
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET | Get all tasks |
| `/api/tasks` | POST | Create a new task |
| `/api/tasks/:id` | GET | Get a specific task |
| `/api/tasks/:id` | DELETE | Delete a task |
| `/api/tasks/:id/toggle` | PUT | Toggle task completion status |

## Author

Saad Amir - [Medium](https://medium.com/@saadamir1) - [GitHub](https://github.com/saadamir1) - [Email](mailto:saadamir070@gmail.com)
# Project Setup Instructions

This project consists of a Next.js frontend and a Node.js Express backend.

## Prerequisites

- Node.js installed.
- MongoDB installed and running locally on port 27017 (or update `backend/.env`).

## Installation

1.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

## Running the Application

To run both the frontend and backend concurrently:

```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

## Features Implemented

- **Authentication:** Signup and Login using JWT. authenticated sessions persist via HTTP-only cookies.
- **Dashboard:** Fetches real data (documents, access logs) from the backend.
- **Uploads:** Secure file upload to backend `backend/uploads` directory.
- **Database:** MongoDB stores Users, 3D Models (Documents), and Activity Logs.

## Backend Structure

- `backend/src/server.js`: Main entry point.
- `backend/src/models`: Database schemas (User, Model3D, Activity).
- `backend/src/controllers`: Business logic.
- `backend/src/routes`: API endpoints.

npm install
npm run dev
npm install
npm start

# Iris Web App

A full-stack web application built with **React, TypeScript, Redux, Sass** (frontend) and **Node.js, Express, MongoDB** (backend).

---

## Features

- User Authentication (Register & Login)
- JWT-based authorization
- Editable user profile with profile picture upload
- Responsive UI (mobile friendly)
- Redux state management
- Sass-based styling with clean and modern UI

---

## Tech Stack

**Frontend:**
- React + TypeScript
- Redux Toolkit
- Sass
- Axios
- React Router v6

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Nodemailer for email notifications (optional)

---

## Project Structure

```
iris/
│
├─ backend/
│  ├─ index.js           # Express server entry point
│  ├─ models/            # Mongoose schemas
│  ├─ routes/            # API routes (auth, users)
│  ├─ controllers/       # Route controllers
│  ├─ middleware/        # Express middleware (auth, upload)
│  ├─ utils/             # Utilities (e.g., sendEmail)
│  ├─ uploads/           # Uploaded profile pictures
│  ├─ .env               # Environment variables
│  └─ package.json
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/     # Reusable React components
│  │  ├─ pages/          # App pages (Login, Register, Profile, Welcome)
│  │  ├─ redux/          # Redux store and slices
│  │  ├─ styles/         # Sass styles
│  │  ├─ api.ts          # Axios instance
│  │  └─ main.tsx        # App entry point
│  ├─ public/            # Static assets
│  ├─ package.json
│  └─ README.md
└─ README.md
```

---

## Installation & Setup

### Backend
1. Navigate to the backend folder:
	```sh
	cd backend
	npm install
	```
2. Create a `.env` file in backend with:
	```env
	MONGO_URI=<Your MongoDB URI>
	JWT_SECRET=<Your JWT Secret>
	```
3. Start the server:
	```sh
	npm run dev
	```
	Server runs on [http://localhost:5000](http://localhost:5000)

### Frontend
1. Navigate to the frontend folder:
	```sh
	cd frontend
	npm install
	```
2. Start the development server:
	```sh
	npm run dev
	```
	Frontend runs on [http://localhost:5173](http://localhost:5173) (Vite default)

---

## Usage

- Register a new account
- Login with your email and password
- Update your profile (upload picture, edit bio)
- Enjoy a responsive, modern UI

---

## Notes

- `JWT_SECRET` can be any random string, used to sign tokens.
- Frontend and backend endpoints must match.
- Email confirmation feature can be disabled for development if it causes issues.
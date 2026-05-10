# Drivecare

A vehicle service booking platform for Bangalore — offering car and bike washing, detailing, and full servicing with doorstep service.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Express.js + MongoDB (Mongoose) + JWT Authentication
- **Auth:** Email OTP via Nodemailer

## Project Structure

```
Drivecare/
├── Drivecare_app/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── Nav/        # Public pages (Home, Login, Services, Pricing, Contact)
│       │   ├── user/       # User dashboard (vehicles, addresses, bookings)
│       │   ├── admin/      # Admin panel (services, agents)
│       │   ├── Context/    # Auth & Data contexts
│       │   ├── api/        # Axios instance
│       │   └── ui/         # shadcn/ui components
│       └── App.jsx         # Routes
├── Drivecare_service/      # Express backend
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # Route handlers
│   ├── Routes/             # Express routes
│   ├── middlewares/        # Auth middleware
│   └── Utils/              # Email utility
└── README.md
```

## Setup

### Backend

```bash
cd Drivecare_service
npm install
cp .env.example .env     # Fill in your values
npm run dev
```

### Frontend

```bash
cd Drivecare_app
npm install
npm run dev
```

## Environment Variables

See `Drivecare_service/.env.example` for required backend configuration.

## Roles

- **User:** Book services, manage vehicles and addresses
- **Admin:** Manage services, agents, and bookings
- **Agent:** Handle assigned service jobs

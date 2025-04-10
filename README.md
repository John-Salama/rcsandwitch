# RCSandwitch - Sandwich Ordering System

A sandwich ordering system built with Next.js, Express, and MongoDB.

## Architecture

- **Frontend**: Next.js application that provides the UI for users and admins
- **Backend**: Express.js REST API with MongoDB for data storage
- **Authentication**: JWT-based authentication using NextAuth.js

## Prerequisites

- Node.js 18+ and npm
- MongoDB installed locally or a MongoDB Atlas account

## Getting Started

### Setting up MongoDB

1. Install MongoDB locally or create a MongoDB Atlas cluster
2. The application will connect to `mongodb://localhost:27017/rcsandwitch` by default
3. If using a different MongoDB connection string, update it in `/express/config.env`

### Installation

```bash
# Install Next.js frontend dependencies
npm install

# Install Express API dependencies
cd express
npm install
cd ..
```

### Setting up the Admin User

```bash
# Create the admin user for the first time
npm run setup-db
```

This will create an admin user with the following credentials:

- Email: admin@rcsandwitch.com
- Password: admin123

### Running the Application

```bash
# Run both frontend and backend in development mode
npm run dev

# Or run them separately
npm run dev:next    # Run just the Next.js frontend
npm run dev:api     # Run just the Express API
```

The application will be available at:

- Frontend: http://localhost:3000
- API: http://localhost:5000/api/v1

## Features

- User-facing sandwich ordering system
- Admin dashboard for managing orders and sandwiches
- Real-time order tracking and summary reports
- Mobile-responsive design

## Migration Note

This application has been migrated from SQLite/Prisma to MongoDB/Express for improved scalability and performance.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

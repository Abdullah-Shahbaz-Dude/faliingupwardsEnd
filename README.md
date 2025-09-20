# Falling Upward - Physiotherapy Consultation Website

Falling Upward is a comprehensive physiotherapy consultation website built with Next.js, featuring user authentication, appointment booking, admin dashboard, and workbook management.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Architecture Change

**Important Notice**: This project has been restructured to separate the frontend and backend:

- **Frontend**: Next.js application (this repository)
- **Backend**: Node.js/Express application (separate repository)

The backend code that was previously part of this Next.js application has been moved to a separate Node.js backend. See the `/backup` directory for the extracted backend code and instructions for setting up the separate backend service.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **Marketing Website**: Information about the services offered
- **Booking Forms**: Online booking system for consultations with different specialists
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Static Pages**: About, services, team information, and more

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable UI components
- `/public` - Static assets
- `/backup` - Backend code that has been moved out to a separate Node.js backend (for reference)

## Setting Up the Backend

See the README in the `/backup` directory for instructions on setting up the separate Node.js backend which will handle:

- User authentication
- Workbook management (40 workbooks)
- Database operations
- Admin dashboard functionality

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000 # URL to your Node.js backend
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

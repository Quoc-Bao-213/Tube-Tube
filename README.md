# TubeTube

A comprehensive video platform built with Next.js, featuring video uploading, playback, and social features.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [Neon](https://neon.tech/) (PostgreSQL), [Drizzle ORM](https://orm.drizzle.team/)
- **API:** [tRPC](https://trpc.io/)
- **Video:** [Mux](https://www.mux.com/)
- **File Upload:** [UploadThing](https://uploadthing.com/)
- **AI:** [Google GenAI](https://ai.google.dev/)
- **Caching/Rate Limiting:** [Upstash Redis](https://upstash.com/)

## Features

- **User Authentication:** Secure sign-up and sign-in with Clerk.
- **Video Upload:** Seamless video uploading using UploadThing and Mux.
- **Video Playback:** High-quality video streaming with Mux Player.
- **Interactive UI:** Modern and responsive interface built with Shadcn UI and Tailwind CSS.
- **Backend API:** Type-safe API endpoints with tRPC.
- **Database Management:** Efficient data handling with Drizzle ORM and Neon.

## Getting Started

### Prerequisites

- Node.js
- Bun, npm, or yarn

### Environment Variables

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

### Installation

Install the dependencies:

```bash
bun install
# or
npm install
# or
yarn install
```

### Running the Development Server

To run the development server with the webhook listener (requires ngrok):

```bash
bun run dev:all
```

Or to run just the Next.js app:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `dev:all`: Runs both the webhook listener and the Next.js development server concurrently.
- `dev:webhook`: Starts the ngrok tunnel for webhooks.
- `dev`: Starts the Next.js development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality issues.

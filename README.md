# Zentlify - Curated Product Discovery

Zentlify is a modern, performance-focused web application built with Next.js that serves as a curated discovery platform for Amazon products. It leverages Server-Side Rendering (SSR), a proxy API layer with Redis caching, and a clean, responsive interface to provide users with a seamless shopping experience.

## ✨ Key Features

*   **Modern Tech Stack**: Built with Next.js 16 (App Router), React 19, and TypeScript.
*   **Performance First**: Implements a robust caching strategy with Redis to minimize external API calls and ensure fast page loads.
*   **Server-Side Rendering (SSR)**: Pages are rendered on the server for optimal SEO and initial load performance.
*   **Dynamic Product Carousels**: The homepage features multiple carousels (Bestsellers, Trending, etc.) that fetch data concurrently.
*   **Detailed Product Pages**: Clean, user-friendly product detail pages with image galleries, descriptions, and affiliate links.
*   **API Proxy Layer**: All external API calls are routed through an internal Next.js API layer to protect API keys and manage caching.
*   **Responsive Design**: A mobile-first UI built with Tailwind CSS that looks great on all devices.

## 🛠️ Technology Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Caching**: Redis (via `ioredis`)
*   **External API**: Real-Time Amazon Data API

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm
*   A running Redis instance.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zentlify-app.git
cd zentlify-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project by copying the example file:

```bash
cp .env.local.example .env.local
```

Now, open `.env.local` and add your credentials.

```env
# Redis Connection Details
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# RapidAPI Credentials for Amazon Data
RAPID_API_KEY=your_rapidapi_key_here
RAPID_API_HOST=real-time-amazon-data.p.rapidapi.com
```

You will need to get your own `RAPID_API_KEY` by subscribing to the Real-Time Amazon Data API on RapidAPI.

### 4. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the result.

## 📁 Project Structure

The project follows the standard Next.js App Router structure with a few key directories:

```
└── app/
    ├── (main)/         # Route group for the main application UI (pages, layouts)
    ├── api/            # API routes acting as a proxy to the external Amazon API
    ├── product/        # Dynamic route for the product detail page
    └── layout.tsx      # Root layout of the application
└── cache/
    └── productCache.ts # Functions for interacting with the Redis cache
└── components/
    ├── feature/        # High-level components with business logic
    └── ui/             # Reusable, general-purpose UI components
└── services/
    ├── rapidApi.ts     # Core logic for fetching data from the external API
    └── redisClient.ts  # Initializes and exports the Redis client instance
└── types/
    └── product.ts      # TypeScript type definitions for product data
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

For deployment, you will need to set up a Redis database (e.g., Vercel KV or Upstash) and configure the environment variables in your Vercel project settings.

Check out our Next.js deployment documentation for more details.


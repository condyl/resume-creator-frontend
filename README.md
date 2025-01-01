# Resume Creator - Frontend

A modern web application for creating and managing professional resumes with a clean, user-friendly interface.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-frontend-repo-url>
cd <frontend-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# Replace the following values:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

You can find these values in your Supabase project dashboard under Settings > API.

## Features

- User authentication with Supabase
- Interactive resume builder
- Real-time preview
- Multiple resume templates
- PDF export functionality
- Personal information management
- Work experience tracking
- Education history
- Skills and projects sections

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase for authentication and data storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
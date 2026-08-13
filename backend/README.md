# Backend - MyProfile API Server

This is the backend Node.js/Express API server for MyProfile.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: (Check database configuration)
- **Language**: JavaScript/TypeScript

## Project Structure

```
backend/
├── src/                  # Source code
├── database/            # Database configuration and migrations
├── scripts/             # Utility scripts
├── test/                # Test files
├── docs/                # Documentation
├── .env                 # Environment variables (not committed)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── server.js            # Entry point
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Database (check configuration)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database connection strings
- API keys
- Port configuration
- JWT secrets

### Development

Start the development server:

```bash
npm start
```

Or use nodemon for auto-reload:

```bash
npm run dev
```

### Database Setup

Run database migrations (if applicable):

```bash
npm run migrate
```

Seed database with initial data:

```bash
npm run seed
```

## API Endpoints

The API provides endpoints for:
- Authentication (login, register)
- Products (CRUD operations)
- Orders (create, update, list)
- Profile management
- Admin operations

## Testing

Run tests:

```bash
npm test
```

## Deployment

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run prod
```

## Architecture

The backend follows a typical Express.js pattern:
- `server.js` - Main entry point
- `src/` - Application logic
- `database/` - Database layer
- `scripts/` - Utility and maintenance scripts

## Security

- Environment variables for sensitive data
- JWT authentication
- CORS configuration
- Input validation

## Development Notes

- This backend serves the frontend React Native/Expo application
- API documentation should be available in the `docs/` folder
- Check `server.js` for the main server configuration

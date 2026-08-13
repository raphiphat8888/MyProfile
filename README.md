# MyProfile

A full-stack application with React Native/Expo frontend and Node.js/Express backend.

## Project Structure

```
MyProfile/
├── frontend/             # React Native/Expo mobile application
│   ├── app/             # Expo Router pages
│   ├── components/      # UI components
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom hooks
│   ├── services/        # API integration layer
│   ├── providers/       # Provider components
│   ├── constants/       # App constants
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utility functions
│   └── assets/          # Images and static files
├── backend/             # Node.js/Express API server
│   ├── src/             # Source code
│   ├── database/        # Database configuration
│   ├── scripts/         # Utility scripts
│   ├── test/            # Test files
│   └── docs/            # API documentation
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (for frontend development)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

See [frontend/README.md](frontend/README.md) for detailed frontend instructions.

### Backend Setup

```bash
cd backend
npm install
npm start
```

See [backend/README.md](backend/README.md) for detailed backend instructions.

## Development Workflow

1. Start the backend server (typically on port 3000 or configured in backend/.env)
2. Start the frontend development server
3. The frontend will connect to the backend API through the services layer

## Features

- **Authentication**: User login/logout with JWT
- **Product Management**: Browse, search, and manage products
- **Shopping Cart**: Add items and manage quantities
- **Order Management**: Create and track orders
- **Admin Panel**: Inventory management, order processing
- **Profile Management**: User profiles and settings

## Technologies

### Frontend
- Expo (v54.0.34)
- React Native
- Expo Router
- TypeScript
- React Context API

### Backend
- Node.js
- Express.js
- Database (check backend configuration)

## Contributing

1. Follow the existing code structure
2. Maintain separation between frontend and backend
3. Update documentation when adding features
4. Test changes before committing

## Deployment

- Frontend: Deploy via Expo or build native apps
- Backend: Deploy to cloud platform (AWS, Heroku, etc.)

## License

[Add your license here]

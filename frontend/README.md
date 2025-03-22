# Task Management Application - Frontend

## Overview
A modern task management application built with React and TypeScript, featuring a clean and intuitive user interface for managing tasks and projects.

## Features
- User authentication and authorization
- Task creation, updating, and deletion
- Task categorization and filtering
- Real-time updates
- Responsive design for mobile and desktop

## Technologies Used
- React
- TypeScript
- Tailwind CSS
- Axios for API communication
- React Query for state management
- React Router for navigation

## Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn package manager

## Installation
1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services
├── styles/        # Global styles
├── theme.ts       # Material-UI theme configuration
├── App.tsx        # Root component
└── main.tsx       # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
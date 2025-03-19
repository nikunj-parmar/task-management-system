# Task Management System - Frontend

This is the frontend application for the Task Management System, built with React, TypeScript, and Material-UI.

## Features

- User authentication (login/register)
- Dashboard with task statistics
- Task management (create, read, update, delete)
- User management (for administrators)
- User settings and profile management
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running (see backend README for setup)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-system/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
REACT_APP_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

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

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- React Query
- React Hook Form
- Zod
- Axios

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
# Multi-Tenant Task Management System

A scalable, secure task management system built with Django and PostgreSQL, featuring multi-tenancy, role-based access control, and comprehensive API documentation.

## Features

- **Multi-Tenancy**: Secure data isolation using PostgreSQL schemas
- **Role-Based Access Control (RBAC)**: Granular permissions for different user roles
- **Task Management**:
  - Task creation, assignment, and tracking
  - Comments and attachments support
  - Priority and status management
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Authentication**: JWT-based authentication system
- **DevOps Ready**: Docker and Kubernetes configurations included

## Tech Stack

- **Backend**: Django 5.1.7, Django REST Framework 3.15.2
- **Database**: PostgreSQL 13+
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Documentation**: drf-spectacular (Swagger/OpenAPI)
- **Containerization**: Docker, Kubernetes
- **CI/CD**: GitHub Actions

## Prerequisites

- Python 3.10+
- PostgreSQL 13+
- Docker (optional)
- Kubernetes (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-system
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run migrations:
```bash
python manage.py migrate_schemas --shared
python manage.py migrate
```

6. Create public tenant:
```bash
python manage.py setup_public_tenant
```

7. Create a superuser:
```bash
python manage.py createsuperuser
```

8. Run the development server:
```bash
python manage.py runserver
```

## API Documentation

Access the API documentation at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## API Endpoints

### Tenant Management
- `POST /api/tenants/`: Create a new tenant
- `GET /api/tenants/`: List all tenants
- `GET /api/tenants/{id}/`: Get tenant details
- `PUT /api/tenants/{id}/`: Update tenant
- `DELETE /api/tenants/{id}/`: Delete tenant

### User Management
- `POST /api/users/`: Create a new user
- `GET /api/users/`: List all users
- `GET /api/users/{id}/`: Get user details
- `PUT /api/users/{id}/`: Update user
- `DELETE /api/users/{id}/`: Delete user
- `GET /api/users/me/`: Get current user

### Task Management
- `POST /api/tasks/`: Create a new task
- `GET /api/tasks/`: List all tasks
- `GET /api/tasks/{id}/`: Get task details
- `PUT /api/tasks/{id}/`: Update task
- `DELETE /api/tasks/{id}/`: Delete task
- `POST /api/tasks/{id}/comments/`: Add comment
- `POST /api/tasks/{id}/attachments/`: Add attachment

### Authentication
- `POST /api/token/`: Obtain JWT token
- `POST /api/token/refresh/`: Refresh JWT token

## Docker Deployment

1. Build the image:
```bash
docker build -t task-management-system .
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

## Kubernetes Deployment

1. Apply Kubernetes configurations:
```bash
kubectl apply -f k8s/
```

2. Access the service:
```bash
kubectl get svc task-management
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
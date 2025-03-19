from django.contrib.auth import get_user_model
from django.shortcuts import render
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (OpenApiExample, OpenApiParameter,
                                   extend_schema)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import CustomUserSerializer, UserCreateSerializer

User = get_user_model()

@extend_schema(
    tags=['Users'],
    summary="User Management",
    description="API endpoints for managing users in the system",
    parameters=[
        OpenApiParameter(
            name="search",
            type=OpenApiTypes.STR,
            description="Search users by username or email",
            required=False
        ),
        OpenApiParameter(
            name="role",
            type=OpenApiTypes.STR,
            description="Filter users by role",
            required=False,
            enum=["admin", "manager", "user"]
        ),
    ],
    examples=[
        OpenApiExample(
            'User Creation Example',
            value={
                "username": "john_doe",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "user"
            },
            request_only=True,
        ),
    ]
)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'manager':
            return User.objects.filter(role='employee')
        return User.objects.filter(id=user.id)

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return CustomUserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @extend_schema(
        summary="Get Current User",
        description="Retrieve the currently authenticated user's information",
        responses={200: CustomUserSerializer},
        examples=[
            OpenApiExample(
                'Current User Response Example',
                value={
                    "id": 1,
                    "username": "john_doe",
                    "email": "john@example.com",
                    "first_name": "John",
                    "last_name": "Doe",
                    "role": "user"
                },
                response_only=True,
            ),
        ]
    )
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

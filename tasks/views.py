from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django_filters import rest_framework as filters
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (OpenApiExample, OpenApiParameter,
                                   extend_schema)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task, TaskAttachment, TaskComment
from .permissions import IsTaskAssigneeOrAdmin, IsTaskCreatorOrAdmin
from .serializers import (TaskAttachmentSerializer, TaskCommentSerializer,
                          TaskSerializer)

# Create your views here.

class TaskFilter(filters.FilterSet):
    class Meta:
        model = Task
        fields = {
            'title': ['exact', 'icontains'],
            'description': ['icontains'],
            'status': ['exact'],
            'priority': ['exact'],
            'due_date': ['exact', 'gt', 'lt'],
            'created_at': ['exact', 'gt', 'lt'],
            'updated_at': ['exact', 'gt', 'lt'],
            'assigned_to': ['exact'],
            'created_by': ['exact'],
        }

@extend_schema(
    tags=['Tasks'],
    summary="Task Management",
    description="API endpoints for managing tasks in the system",
    parameters=[
        OpenApiParameter(
            name="status",
            type=OpenApiTypes.STR,
            description="Filter tasks by status (pending, in_progress, completed)",
            required=False,
            enum=["pending", "in_progress", "completed"]
        ),
        OpenApiParameter(
            name="priority",
            type=OpenApiTypes.STR,
            description="Filter tasks by priority (low, medium, high)",
            required=False,
            enum=["low", "medium", "high"]
        ),
        OpenApiParameter(
            name="due_date",
            type=OpenApiTypes.DATE,
            description="Filter tasks by due date",
            required=False
        ),
        OpenApiParameter(
            name="assignee",
            type=OpenApiTypes.INT,
            description="Filter tasks by assignee ID",
            required=False
        ),
        OpenApiParameter(
            name="search",
            type=OpenApiTypes.STR,
            description="Search in title and description",
            required=False
        ),
    ],
    examples=[
        OpenApiExample(
            'Task Creation Example',
            value={
                "title": "Complete project documentation",
                "description": "Write comprehensive documentation for the API",
                "due_date": "2024-03-01",
                "priority": "high",
                "status": "pending"
            },
            request_only=True,
        ),
    ]
)
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskAssigneeOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Task.objects.all()
        elif user.role == 'manager':
            return Task.objects.filter(created_by=user) | Task.objects.filter(assigned_to=user)
        else:
            return Task.objects.filter(assigned_to=user)

    def get_permissions(self):
        if self.action == 'destroy':
            return [permissions.IsAuthenticated(), IsTaskCreatorOrAdmin()]
        return super().get_permissions()

    @extend_schema(
        summary="Add Comment to Task",
        description="Add a new comment to a specific task",
        request=TaskCommentSerializer,
        responses={201: TaskCommentSerializer},
        examples=[
            OpenApiExample(
                'Comment Creation Example',
                value={
                    "content": "This task needs more details",
                    "parent": None
                },
                request_only=True,
            ),
        ]
    )
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        task = self.get_object()
        serializer = TaskCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(task=task, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Add Attachment to Task",
        description="Upload a new attachment to a specific task",
        request=TaskAttachmentSerializer,
        responses={201: TaskAttachmentSerializer},
        examples=[
            OpenApiExample(
                'Attachment Upload Example',
                value={
                    "file": "example.pdf",
                    "description": "Project requirements document"
                },
                request_only=True,
            ),
        ]
    )
    @action(detail=True, methods=['post'])
    def add_attachment(self, request, pk=None):
        task = self.get_object()
        serializer = TaskAttachmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(task=task, uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    tags=['Comments'],
    summary="Task Comments",
    description="API endpoints for managing task comments",
    parameters=[
        OpenApiParameter(
            name="task_pk",
            type=OpenApiTypes.INT,
            description="ID of the task",
            required=True
        ),
    ],
    examples=[
        OpenApiExample(
            'Comment Creation Example',
            value={
                "content": "This task needs more details",
                "parent": None
            },
            request_only=True,
        ),
    ]
)
class TaskCommentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskComment.objects.filter(task_id=self.kwargs['task_pk'])

    def perform_create(self, serializer):
        task = get_object_or_404(Task, pk=self.kwargs['task_pk'])
        serializer.save(task=task, user=self.request.user)

@extend_schema(
    tags=['Attachments'],
    summary="Task Attachments",
    description="API endpoints for managing task attachments",
    parameters=[
        OpenApiParameter(
            name="task_pk",
            type=OpenApiTypes.INT,
            description="ID of the task",
            required=True
        ),
    ],
    examples=[
        OpenApiExample(
            'Attachment Upload Example',
            value={
                "file": "example.pdf",
                "description": "Project requirements document"
            },
            request_only=True,
        ),
    ]
)
class TaskAttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskAttachment.objects.filter(task_id=self.kwargs['task_pk'])

    def perform_create(self, serializer):
        task = get_object_or_404(Task, pk=self.kwargs['task_pk'])
        serializer.save(task=task, uploaded_by=self.request.user)

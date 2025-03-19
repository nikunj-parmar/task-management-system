from django.db import transaction
from django.shortcuts import render
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (OpenApiExample, OpenApiParameter,
                                   extend_schema)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Domain, Tenant
from .serializers import DomainSerializer, TenantSerializer

# Create your views here.

@extend_schema(
    tags=['Tenants'],
    summary="Tenant Management",
    description="API endpoints for managing tenants in the multi-tenant system",
    parameters=[
        OpenApiParameter(
            name="search",
            type=OpenApiTypes.STR,
            description="Search tenants by name or domain",
            required=False
        ),
        OpenApiParameter(
            name="is_active",
            type=OpenApiTypes.BOOL,
            description="Filter tenants by active status",
            required=False
        ),
    ],
    examples=[
        OpenApiExample(
            'Tenant Creation Example',
            value={
                "name": "Acme Corporation",
                "schema_name": "acme",
                "paid_until": "2024-12-31",
                "on_trial": False,
                "created_on": "2024-01-01"
            },
            request_only=True,
        ),
    ]
)
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Tenant.objects.all()
        return Tenant.objects.filter(id=self.request.user.tenant_id)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tenant = serializer.save()
        
        # Create domain for the tenant
        domain = Domain()
        domain.domain = request.data.get('domain')
        domain.tenant = tenant
        domain.is_primary = True
        domain.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Add Domain to Tenant",
        description="Add a new domain to an existing tenant",
        request=DomainSerializer,
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT
        },
        examples=[
            OpenApiExample(
                'Domain Addition Example',
                value={
                    "domain": "acme.example.com"
                },
                request_only=True,
            ),
            OpenApiExample(
                'Success Response Example',
                value={
                    "message": "Domain added successfully"
                },
                response_only=True,
            ),
            OpenApiExample(
                'Error Response Example',
                value={
                    "error": "Domain is required"
                },
                response_only=True,
            ),
        ]
    )
    @action(detail=True, methods=['post'])
    def add_domain(self, request, pk=None):
        tenant = self.get_object()
        domain = request.data.get('domain')
        
        if not domain:
            return Response(
                {'error': 'Domain is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_domain = Domain()
        new_domain.domain = domain
        new_domain.tenant = tenant
        new_domain.is_primary = False
        new_domain.save()
        
        return Response({'message': 'Domain added successfully'})

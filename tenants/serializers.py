from rest_framework import serializers

from .models import Domain, Tenant


class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ['id', 'domain', 'is_primary']

class TenantSerializer(serializers.ModelSerializer):
    domains = DomainSerializer(many=True, read_only=True)
    domain = serializers.CharField(write_only=True)

    class Meta:
        model = Tenant
        fields = ['id', 'name', 'paid_until', 'on_trial', 'created_on', 'domains', 'domain']
        read_only_fields = ['created_on'] 
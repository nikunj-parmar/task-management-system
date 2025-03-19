from django.core.management.base import BaseCommand
from django.db import connection
from django_tenants.utils import (get_public_schema_name,
                                  get_tenant_domain_model, get_tenant_model)

Tenant = get_tenant_model()
Domain = get_tenant_domain_model()

class Command(BaseCommand):
    help = 'Sets up the public tenant for local development'

    def handle(self, *args, **options):
        # Create public tenant if it doesn't exist
        public_tenant, created = Tenant.objects.get_or_create(
            schema_name=get_public_schema_name(),
            defaults={
                'name': 'Public Tenant',
                'paid_until': '2024-12-31',
                'on_trial': False
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Created public tenant'))
        else:
            self.stdout.write(self.style.SUCCESS('Public tenant already exists'))

        # Create domain for public tenant
        domain, created = Domain.objects.get_or_create(
            domain='127.0.0.1',
            tenant=public_tenant,
            defaults={'is_primary': True}
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Created domain for public tenant'))
        else:
            self.stdout.write(self.style.SUCCESS('Domain for public tenant already exists'))

        # Create domain for localhost
        domain, created = Domain.objects.get_or_create(
            domain='localhost',
            tenant=public_tenant,
            defaults={'is_primary': False}
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Created domain for localhost'))
        else:
            self.stdout.write(self.style.SUCCESS('Domain for localhost already exists')) 
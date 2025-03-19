from django.db import migrations
from django_tenants.utils import (get_public_schema_name,
                                  get_tenant_domain_model, get_tenant_model)


def setup_public_tenant(apps, schema_editor):
    Tenant = get_tenant_model()
    Domain = get_tenant_domain_model()

    # Create public tenant
    public_tenant, created = Tenant.objects.get_or_create(
        schema_name=get_public_schema_name(),
        defaults={
            'name': 'Public Tenant',
            'paid_until': '2024-12-31',
            'on_trial': False
        }
    )

    # Create domain for public tenant
    Domain.objects.get_or_create(
        domain='127.0.0.1',
        tenant=public_tenant,
        defaults={'is_primary': True}
    )

    # Create domain for localhost
    Domain.objects.get_or_create(
        domain='localhost',
        tenant=public_tenant,
        defaults={'is_primary': False}
    )

class Migration(migrations.Migration):
    dependencies = [
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(setup_public_tenant),
    ] 
from django.db import models
from django_tenants.models import DomainMixin, TenantMixin

# Create your models here.

class Tenant(TenantMixin):
    name = models.CharField(max_length=100)
    paid_until = models.DateField(null=True, blank=True)
    on_trial = models.BooleanField(default=False)
    created_on = models.DateField(auto_now_add=True)
    auto_create_schema = True

    def __str__(self):
        return self.name

class Domain(DomainMixin):
    pass

from django.db import models
from core.models import Auditable

class Client(Auditable):
    name = models.CharField(max_length=300)
    tax = models.CharField(max_length=9, blank=True, null=True, unique=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=500, blank=True)
    notes = models.TextField(blank=True)
    is_potential = models.BooleanField(default=True)
    trade_name = models.CharField(max_length=300, blank=True)
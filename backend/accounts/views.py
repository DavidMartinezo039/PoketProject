from django.shortcuts import render
from accounts.serializers import AccountSerializer
from accounts.models import User
from rest_framework import generics

# Create your views here.
class AccountsList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = AccountSerializer
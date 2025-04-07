from rest_framework import viewsets, permissions
from .models import Country, State, City, Location, Industry, Account, AccountLocation, Contact, ContactLocation
from .serializers import (
    CountrySerializer, StateSerializer, CitySerializer, LocationSerializer,
    IndustrySerializer, AccountSerializer, AccountDetailSerializer,
    AccountLocationSerializer, ContactSerializer, ContactDetailSerializer,
    ContactLocationSerializer
)

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [permissions.IsAuthenticated]

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    permission_classes = [permissions.IsAuthenticated]

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.IsAuthenticated]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = [permissions.IsAuthenticated]

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return AccountDetailSerializer
        return AccountSerializer

class AccountLocationViewSet(viewsets.ModelViewSet):
    queryset = AccountLocation.objects.all()
    serializer_class = AccountLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return ContactDetailSerializer
        return ContactSerializer

class ContactLocationViewSet(viewsets.ModelViewSet):
    queryset = ContactLocation.objects.all()
    serializer_class = ContactLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

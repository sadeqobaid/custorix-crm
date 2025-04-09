from rest_framework import viewsets, permissions
from .models import Country, State, City, Location, Industry, Account, AccountLocation, Contact, ContactLocation
from .serializers import (
    CountrySerializer, StateSerializer, StateReadSerializer, CitySerializer, CityReadSerializer, 
    LocationSerializer, LocationReadSerializer, IndustrySerializer, 
    AccountSerializer, AccountReadSerializer, AccountDetailSerializer,
    AccountLocationSerializer, AccountLocationReadSerializer, 
    ContactSerializer, ContactReadSerializer, ContactDetailSerializer,
    ContactLocationSerializer, ContactLocationReadSerializer
)

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return StateReadSerializer
        return StateSerializer
        
    def perform_create(self, serializer):
        serializer.save()
        
    def perform_update(self, serializer):
        serializer.save()

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CityReadSerializer
        return CitySerializer
        
    def perform_create(self, serializer):
        serializer.save()
        
    def perform_update(self, serializer):
        serializer.save()

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LocationReadSerializer
        return LocationSerializer
        
    def perform_create(self, serializer):
        serializer.save()
        
    def perform_update(self, serializer):
        serializer.save()

class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        serializer.save()
        
    def perform_update(self, serializer):
        serializer.save()

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AccountDetailSerializer
        elif self.action == 'list':
            return AccountReadSerializer
        return AccountSerializer
        
    def perform_create(self, serializer):
        serializer.save()
        
    def perform_update(self, serializer):
        serializer.save()

class AccountLocationViewSet(viewsets.ModelViewSet):
    queryset = AccountLocation.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return AccountLocationReadSerializer
        return AccountLocationSerializer
        
    def perform_create(self, serializer):
        serializer.save()
        
    def perform_update(self, serializer):
        serializer.save()

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ContactDetailSerializer
        elif self.action == 'list':
            return ContactReadSerializer
        return ContactSerializer
        
    def perform_create(self, serializer):
        # Debug logging
        import logging
        logger = logging.getLogger(__name__)
        logger.error("CONTACT CREATE: Attempting to save contact")
        try:
            # Force save with transaction
            from django.db import transaction
            with transaction.atomic():
                contact = serializer.save()
                logger.error(f"CONTACT CREATE: Successfully saved contact with ID {contact.id}")
                # Verify it exists in DB
                verify = Contact.objects.filter(id=contact.id).first()
                logger.error(f"CONTACT CREATE: Verification query result: {verify is not None}")
        except Exception as e:
            logger.error(f"CONTACT CREATE: Error saving contact: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        # Debug logging
        import logging
        logger = logging.getLogger(__name__)
        logger.error("CONTACT UPDATE: Attempting to update contact")
        try:
            # Force save with transaction
            from django.db import transaction
            with transaction.atomic():
                contact = serializer.save()
                logger.error(f"CONTACT UPDATE: Successfully updated contact with ID {contact.id}")
        except Exception as e:
            logger.error(f"CONTACT UPDATE: Error updating contact: {str(e)}")
            raise
class ContactLocationViewSet(viewsets.ModelViewSet):
    queryset = ContactLocation.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ContactLocationReadSerializer
        return ContactLocationSerializer
        
    def perform_create(self, serializer):
        serializer.save()
        
    def perform_update(self, serializer):
        serializer.save()

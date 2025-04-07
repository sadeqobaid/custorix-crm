from rest_framework import serializers
from .models import Country, State, City, Location, Industry, Account, AccountLocation, Contact, ContactLocation

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    
    class Meta:
        model = State
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    state = StateSerializer(read_only=True)
    
    class Meta:
        model = City
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    state = StateSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    
    class Meta:
        model = Location
        fields = '__all__'

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True)
    
    class Meta:
        model = Account
        fields = ['id', 'account_name', 'account_number', 'industry', 'website', 
                 'phone', 'status', 'created_at', 'updated_at']

class AccountDetailSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True)
    parent_account = AccountSerializer(read_only=True)
    
    class Meta:
        model = Account
        fields = '__all__'

class AccountLocationSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    
    class Meta:
        model = AccountLocation
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'account', 'title', 
                 'email', 'phone', 'is_primary', 'created_at', 'updated_at']

class ContactDetailSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    
    class Meta:
        model = Contact
        fields = '__all__'

class ContactLocationSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    
    class Meta:
        model = ContactLocation
        fields = '__all__'

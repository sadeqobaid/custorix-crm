from rest_framework import serializers
from .models import Country, State, City, Location, Industry, Account, AccountLocation, Contact, ContactLocation

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'
        
class StateReadSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    
    class Meta:
        model = State
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'
        
class CityReadSerializer(serializers.ModelSerializer):
    state = StateReadSerializer(read_only=True)
    
    class Meta:
        model = City
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'
        
class LocationReadSerializer(serializers.ModelSerializer):
    city = CityReadSerializer(read_only=True)
    state = StateReadSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    
    class Meta:
        model = Location
        fields = '__all__'

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'account_name', 'account_number', 'industry', 'website', 
                 'phone', 'status', 'created_at', 'updated_at', 'parent_account',
                 'description', 'annual_revenue', 'employee_count', 'assigned_to']
                 
    def create(self, validated_data):
        account = Account.objects.create(**validated_data)
        return account
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class AccountReadSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True)
    
    class Meta:
        model = Account
        fields = ['id', 'account_name', 'account_number', 'industry', 'website', 
                 'phone', 'status', 'created_at', 'updated_at']

class AccountDetailSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True)
    parent_account = AccountReadSerializer(read_only=True)
    
    class Meta:
        model = Account
        fields = '__all__'

class AccountLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountLocation
        fields = '__all__'
        
    def create(self, validated_data):
        account_location = AccountLocation.objects.create(**validated_data)
        return account_location
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
        
class AccountLocationReadSerializer(serializers.ModelSerializer):
    account = AccountReadSerializer(read_only=True)
    location = LocationReadSerializer(read_only=True)
    
    class Meta:
        model = AccountLocation
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'account', 'title', 
                 'email', 'phone', 'mobile', 'is_primary', 'is_decision_maker',
                 'assigned_to', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Ensure we're creating a valid contact with required fields
        contact = Contact.objects.create(**validated_data)
        return contact
        
    def update(self, instance, validated_data):
        # Update the contact instance with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ContactReadSerializer(serializers.ModelSerializer):
    account = AccountReadSerializer(read_only=True)
    
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'account', 'title', 
                 'email', 'phone', 'is_primary', 'created_at', 'updated_at']

class ContactDetailSerializer(serializers.ModelSerializer):
    account = AccountReadSerializer(read_only=True)
    
    class Meta:
        model = Contact
        fields = '__all__'

class ContactLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactLocation
        fields = '__all__'
        
    def create(self, validated_data):
        contact_location = ContactLocation.objects.create(**validated_data)
        return contact_location
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
        
class ContactLocationReadSerializer(serializers.ModelSerializer):
    contact = ContactReadSerializer(read_only=True)
    location = LocationReadSerializer(read_only=True)
    
    class Meta:
        model = ContactLocation
        fields = '__all__'

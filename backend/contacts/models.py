from django.db import models
from core.models import BaseModel
from accounts.models import User

class Country(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Countries"

class State(BaseModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='states')
    
    def __str__(self):
        return f"{self.name}, {self.country.code}"
    
    class Meta:
        unique_together = ('name', 'country')

class City(BaseModel):
    name = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='cities')
    
    def __str__(self):
        return f"{self.name}, {self.state.code}"
    
    class Meta:
        verbose_name_plural = "Cities"
        unique_together = ('name', 'state')

class Location(BaseModel):
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='locations')
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='locations')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='locations')
    postal_code = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    
    def __str__(self):
        return f"{self.address_line1}, {self.city.name}, {self.state.code}, {self.country.code}"

class Industry(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Industries"

class Account(BaseModel):
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50, unique=True)
    parent_account = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='child_accounts')
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, related_name='accounts')
    website = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    annual_revenue = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    employee_count = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Active')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_accounts')
    locations = models.ManyToManyField(Location, through='AccountLocation', related_name='accounts')
    
    def __str__(self):
        return self.account_name

class AccountLocation(BaseModel):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    is_primary = models.BooleanField(default=False)
    location_type = models.CharField(max_length=50, default='Business')
    
    class Meta:
        unique_together = ('account', 'location')

class Contact(BaseModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='contacts')
    title = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    mobile = models.CharField(max_length=20, null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    is_decision_maker = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_contacts')
    locations = models.ManyToManyField(Location, through='ContactLocation', related_name='contacts')
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class ContactLocation(BaseModel):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    is_primary = models.BooleanField(default=False)
    location_type = models.CharField(max_length=50, default='Business')
    
    class Meta:
        unique_together = ('contact', 'location')

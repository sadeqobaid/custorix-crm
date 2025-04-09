from django.contrib import admin
from .models import (
    Country,
    State,
    City,
    Location,
    Industry,
    Account,
    AccountLocation,
    Contact,
    ContactLocation
)

# Register your models
admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(Location)
admin.site.register(Industry)
admin.site.register(Account)
admin.site.register(AccountLocation)
admin.site.register(Contact)
admin.site.register(ContactLocation)

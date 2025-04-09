from django.contrib import admin
from .models import (
    SalesStage,
    Product,
    PriceBook,
    PriceBookEntry,
    Opportunity,
    OpportunityContact,
    OpportunityProduct
)

# Register your models
admin.site.register(SalesStage)
admin.site.register(Product)
admin.site.register(PriceBook)
admin.site.register(PriceBookEntry)
admin.site.register(Opportunity)
admin.site.register(OpportunityContact)
admin.site.register(OpportunityProduct)

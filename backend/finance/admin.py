from django.contrib import admin
from .models import (
    Currency,
    TaxRate,
    Invoice,
    InvoiceLineItem,
    Payment,
    Expense,
    FinancialAccount,
    FinancialTransaction
)

# Register your models
admin.site.register(Currency)
admin.site.register(TaxRate)
admin.site.register(Invoice)
admin.site.register(InvoiceLineItem)
admin.site.register(Payment)
admin.site.register(Expense)
admin.site.register(FinancialAccount)
admin.site.register(FinancialTransaction)

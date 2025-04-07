from django.db import models
from core.models import BaseModel
from accounts.models import User
from contacts.models import Account, Contact

class Currency(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True)
    symbol = models.CharField(max_length=5)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Currencies"

class TaxRate(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.rate}%)"

class Invoice(BaseModel):
    invoice_number = models.CharField(max_length=50, unique=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='invoices')
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, null=True, related_name='invoices')
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=50, default='Draft')
    subtotal = models.DecimalField(max_digits=18, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2)
    total_amount = models.DecimalField(max_digits=18, decimal_places=2)
    notes = models.TextField(null=True, blank=True)
    terms = models.TextField(null=True, blank=True)
    currency = models.ForeignKey(Currency, on_delete=models.SET_NULL, null=True, related_name='invoices')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_invoices')
    
    def __str__(self):
        return self.invoice_number

class InvoiceLineItem(BaseModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='line_items')
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=18, decimal_places=2)
    tax_rate = models.ForeignKey(TaxRate, on_delete=models.SET_NULL, null=True, related_name='invoice_items')
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2)
    total = models.DecimalField(max_digits=18, decimal_places=2)
    
    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.description}"

class Payment(BaseModel):
    payment_number = models.CharField(max_length=50, unique=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateField()
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    reference_number = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.payment_number

class Expense(BaseModel):
    expense_number = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    expense_date = models.DateField()
    category = models.CharField(max_length=100)
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    currency = models.ForeignKey(Currency, on_delete=models.SET_NULL, null=True, related_name='expenses')
    tax_rate = models.ForeignKey(TaxRate, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=18, decimal_places=2)
    status = models.CharField(max_length=50, default='Pending')
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='submitted_expenses')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    approved_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.expense_number

class FinancialAccount(BaseModel):
    account_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    balance = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    currency = models.ForeignKey(Currency, on_delete=models.SET_NULL, null=True, related_name='financial_accounts')
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class FinancialTransaction(BaseModel):
    transaction_number = models.CharField(max_length=50, unique=True)
    account = models.ForeignKey(FinancialAccount, on_delete=models.CASCADE, related_name='transactions')
    transaction_date = models.DateField()
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    type = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    reference = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.transaction_number

from django.db import models
from core.models import BaseModel
from accounts.models import User
from contacts.models import Account, Contact

class SalesStage(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    probability = models.DecimalField(max_digits=5, decimal_places=2)
    is_closed = models.BooleanField(default=False)
    is_won = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order']

class Product(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    product_code = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)
    standard_price = models.DecimalField(max_digits=18, decimal_places=2)
    is_active = models.BooleanField(default=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.name

class PriceBook(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class PriceBookEntry(BaseModel):
    price_book = models.ForeignKey(PriceBook, on_delete=models.CASCADE, related_name='entries')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_book_entries')
    unit_price = models.DecimalField(max_digits=18, decimal_places=2)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.product.name} - {self.price_book.name}"
    
    class Meta:
        unique_together = ('price_book', 'product')

class Opportunity(BaseModel):
    name = models.CharField(max_length=255)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='opportunities')
    stage = models.ForeignKey(SalesStage, on_delete=models.SET_NULL, null=True, related_name='opportunities')
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    close_date = models.DateField()
    probability = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    next_step = models.CharField(max_length=255, null=True, blank=True)
    is_closed = models.BooleanField(default=False)
    is_won = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_opportunities')
    contacts = models.ManyToManyField(Contact, through='OpportunityContact', related_name='opportunities')
    products = models.ManyToManyField(Product, through='OpportunityProduct', related_name='opportunities')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Opportunities"

class OpportunityContact(BaseModel):
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('opportunity', 'contact')

class OpportunityProduct(BaseModel):
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=18, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=18, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price * (1 - self.discount / 100)
        super().save(*args, **kwargs)
    
    class Meta:
        unique_together = ('opportunity', 'product')

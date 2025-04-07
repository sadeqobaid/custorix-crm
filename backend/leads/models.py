from django.db import models
from core.models import BaseModel
from accounts.models import User
from contacts.models import Account, Contact

class LeadSource(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name

class LeadStatus(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    is_converted = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Lead Statuses"
        ordering = ['order']

class Lead(BaseModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    title = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    mobile = models.CharField(max_length=20, null=True, blank=True)
    lead_source = models.ForeignKey(LeadSource, on_delete=models.SET_NULL, null=True, related_name='leads')
    status = models.ForeignKey(LeadStatus, on_delete=models.SET_NULL, null=True, related_name='leads')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_leads')
    description = models.TextField(null=True, blank=True)
    converted_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='converted_leads')
    converted_contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name='converted_leads')
    converted_date = models.DateTimeField(null=True, blank=True)
    lead_score = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class LeadScoringRule(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    field_name = models.CharField(max_length=100)
    condition = models.CharField(max_length=50)
    value = models.CharField(max_length=255)
    score_value = models.IntegerField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

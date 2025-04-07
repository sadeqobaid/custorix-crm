from django.db import models
from core.models import BaseModel
from accounts.models import User
from contacts.models import Account, Contact

class CampaignType(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name

class Campaign(BaseModel):
    name = models.CharField(max_length=255)
    type = models.ForeignKey(CampaignType, on_delete=models.SET_NULL, null=True, related_name='campaigns')
    status = models.CharField(max_length=50, default='Planned')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    budgeted_cost = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    actual_cost = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    expected_revenue = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='owned_campaigns')
    
    def __str__(self):
        return self.name

class EmailTemplate(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_email_templates')
    
    def __str__(self):
        return self.name

class MarketingAsset(BaseModel):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    file_url = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_marketing_assets')
    campaigns = models.ManyToManyField(Campaign, related_name='marketing_assets')
    
    def __str__(self):
        return self.name

class CampaignMember(BaseModel):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='members')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, null=True, blank=True, related_name='campaign_memberships')
    status = models.CharField(max_length=50, default='Sent')
    response_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.contact} - {self.campaign}"
    
    class Meta:
        unique_together = ('campaign', 'contact')

class EmailCampaign(BaseModel):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='email_campaigns')
    email_template = models.ForeignKey(EmailTemplate, on_delete=models.CASCADE, related_name='email_campaigns')
    scheduled_date = models.DateTimeField()
    sent_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Scheduled')
    
    def __str__(self):
        return f"{self.campaign.name} - {self.email_template.name}"

class EmailCampaignResult(BaseModel):
    email_campaign = models.ForeignKey(EmailCampaign, on_delete=models.CASCADE, related_name='results')
    recipient = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='received_emails')
    sent_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    bounced = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.email_campaign} - {self.recipient}"
    
    class Meta:
        unique_together = ('email_campaign', 'recipient')

from django.contrib import admin
from .models import (
    CampaignType,
    Campaign,
    EmailTemplate,
    MarketingAsset,
    CampaignMember,
    EmailCampaign,
    EmailCampaignResult
)

# Register your models
admin.site.register(CampaignType)
admin.site.register(Campaign)
admin.site.register(EmailTemplate)
admin.site.register(MarketingAsset)
admin.site.register(CampaignMember)
admin.site.register(EmailCampaign)
admin.site.register(EmailCampaignResult)

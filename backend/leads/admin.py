from django.contrib import admin
from .models import (
    LeadSource,
    LeadStatus,
    Lead,
    LeadScoringRule
)

# Register your models
admin.site.register(LeadSource)
admin.site.register(LeadStatus)
admin.site.register(Lead)
admin.site.register(LeadScoringRule)

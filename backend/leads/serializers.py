from rest_framework import serializers
from .models import LeadSource, LeadStatus, Lead, LeadScoringRule

class LeadSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadSource
        fields = '__all__'

class LeadStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadStatus
        fields = '__all__'

class LeadSerializer(serializers.ModelSerializer):
    lead_source = LeadSourceSerializer(read_only=True)
    status = LeadStatusSerializer(read_only=True)
    
    class Meta:
        model = Lead
        fields = ['id', 'first_name', 'last_name', 'company_name', 'title', 
                 'email', 'phone', 'lead_source', 'status', 'lead_score',
                 'created_at', 'updated_at']

class LeadDetailSerializer(serializers.ModelSerializer):
    lead_source = LeadSourceSerializer(read_only=True)
    status = LeadStatusSerializer(read_only=True)
    
    class Meta:
        model = Lead
        fields = '__all__'

class LeadScoringRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadScoringRule
        fields = '__all__'

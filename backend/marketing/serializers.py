from rest_framework import serializers
from .models import CampaignType, Campaign, EmailTemplate, MarketingAsset, CampaignMember, EmailCampaign, EmailCampaignResult

class CampaignTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignType
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    type = CampaignTypeSerializer(read_only=True)
    
    class Meta:
        model = Campaign
        fields = ['id', 'name', 'type', 'status', 'start_date', 'end_date', 
                 'budgeted_cost', 'actual_cost', 'created_at', 'updated_at']

class CampaignDetailSerializer(serializers.ModelSerializer):
    type = CampaignTypeSerializer(read_only=True)
    
    class Meta:
        model = Campaign
        fields = '__all__'

class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = '__all__'

class MarketingAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingAsset
        fields = '__all__'

class CampaignMemberSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer(read_only=True)
    
    class Meta:
        model = CampaignMember
        fields = '__all__'

class EmailCampaignSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer(read_only=True)
    email_template = EmailTemplateSerializer(read_only=True)
    
    class Meta:
        model = EmailCampaign
        fields = '__all__'

class EmailCampaignResultSerializer(serializers.ModelSerializer):
    email_campaign = EmailCampaignSerializer(read_only=True)
    
    class Meta:
        model = EmailCampaignResult
        fields = '__all__'

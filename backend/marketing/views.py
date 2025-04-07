from rest_framework import viewsets, permissions
from .models import CampaignType, Campaign, EmailTemplate, MarketingAsset, CampaignMember, EmailCampaign, EmailCampaignResult
from .serializers import (
    CampaignTypeSerializer, CampaignSerializer, CampaignDetailSerializer,
    EmailTemplateSerializer, MarketingAssetSerializer, CampaignMemberSerializer,
    EmailCampaignSerializer, EmailCampaignResultSerializer
)

class CampaignTypeViewSet(viewsets.ModelViewSet):
    queryset = CampaignType.objects.all()
    serializer_class = CampaignTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return CampaignDetailSerializer
        return CampaignSerializer

class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

class MarketingAssetViewSet(viewsets.ModelViewSet):
    queryset = MarketingAsset.objects.all()
    serializer_class = MarketingAssetSerializer
    permission_classes = [permissions.IsAuthenticated]

class CampaignMemberViewSet(viewsets.ModelViewSet):
    queryset = CampaignMember.objects.all()
    serializer_class = CampaignMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all()
    serializer_class = EmailCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmailCampaignResultViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaignResult.objects.all()
    serializer_class = EmailCampaignResultSerializer
    permission_classes = [permissions.IsAuthenticated]

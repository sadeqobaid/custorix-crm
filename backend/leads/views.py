from rest_framework import viewsets, permissions
from .models import LeadSource, LeadStatus, Lead, LeadScoringRule
from .serializers import (
    LeadSourceSerializer, LeadStatusSerializer, LeadSerializer,
    LeadDetailSerializer, LeadScoringRuleSerializer
)

class LeadSourceViewSet(viewsets.ModelViewSet):
    queryset = LeadSource.objects.all()
    serializer_class = LeadSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

class LeadStatusViewSet(viewsets.ModelViewSet):
    queryset = LeadStatus.objects.all()
    serializer_class = LeadStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return LeadDetailSerializer
        return LeadSerializer

class LeadScoringRuleViewSet(viewsets.ModelViewSet):
    queryset = LeadScoringRule.objects.all()
    serializer_class = LeadScoringRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

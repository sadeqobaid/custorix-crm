from rest_framework import viewsets, permissions
from .models import SalesStage, Product, PriceBook, PriceBookEntry, Opportunity, OpportunityContact, OpportunityProduct
from .serializers import (
    SalesStageSerializer, ProductSerializer, PriceBookSerializer,
    PriceBookEntrySerializer, OpportunitySerializer, OpportunityDetailSerializer,
    OpportunityContactSerializer, OpportunityProductSerializer
)

class SalesStageViewSet(viewsets.ModelViewSet):
    queryset = SalesStage.objects.all()
    serializer_class = SalesStageSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class PriceBookViewSet(viewsets.ModelViewSet):
    queryset = PriceBook.objects.all()
    serializer_class = PriceBookSerializer
    permission_classes = [permissions.IsAuthenticated]

class PriceBookEntryViewSet(viewsets.ModelViewSet):
    queryset = PriceBookEntry.objects.all()
    serializer_class = PriceBookEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return OpportunityDetailSerializer
        return OpportunitySerializer

class OpportunityContactViewSet(viewsets.ModelViewSet):
    queryset = OpportunityContact.objects.all()
    serializer_class = OpportunityContactSerializer
    permission_classes = [permissions.IsAuthenticated]

class OpportunityProductViewSet(viewsets.ModelViewSet):
    queryset = OpportunityProduct.objects.all()
    serializer_class = OpportunityProductSerializer
    permission_classes = [permissions.IsAuthenticated]

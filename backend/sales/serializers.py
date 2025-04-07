from rest_framework import serializers
from .models import SalesStage, Product, PriceBook, PriceBookEntry, Opportunity, OpportunityContact, OpportunityProduct

class SalesStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesStage
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class PriceBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceBook
        fields = '__all__'

class PriceBookEntrySerializer(serializers.ModelSerializer):
    price_book = PriceBookSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = PriceBookEntry
        fields = '__all__'

class OpportunitySerializer(serializers.ModelSerializer):
    stage = SalesStageSerializer(read_only=True)
    
    class Meta:
        model = Opportunity
        fields = ['id', 'name', 'account', 'stage', 'amount', 'close_date', 
                 'probability', 'is_closed', 'is_won', 'created_at', 'updated_at']

class OpportunityDetailSerializer(serializers.ModelSerializer):
    stage = SalesStageSerializer(read_only=True)
    
    class Meta:
        model = Opportunity
        fields = '__all__'

class OpportunityContactSerializer(serializers.ModelSerializer):
    opportunity = OpportunitySerializer(read_only=True)
    
    class Meta:
        model = OpportunityContact
        fields = '__all__'

class OpportunityProductSerializer(serializers.ModelSerializer):
    opportunity = OpportunitySerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OpportunityProduct
        fields = '__all__'

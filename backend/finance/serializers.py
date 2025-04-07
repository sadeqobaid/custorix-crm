from rest_framework import serializers
from .models import Currency, TaxRate, Invoice, InvoiceLineItem, Payment, Expense, FinancialAccount, FinancialTransaction

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'

class TaxRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRate
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'account', 'issue_date', 'due_date', 
                 'status', 'total_amount', 'currency', 'created_at', 'updated_at']

class InvoiceDetailSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    
    class Meta:
        model = Invoice
        fields = '__all__'

class InvoiceLineItemSerializer(serializers.ModelSerializer):
    tax_rate = TaxRateSerializer(read_only=True)
    
    class Meta:
        model = InvoiceLineItem
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    tax_rate = TaxRateSerializer(read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'

class FinancialAccountSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)
    
    class Meta:
        model = FinancialAccount
        fields = '__all__'

class FinancialTransactionSerializer(serializers.ModelSerializer):
    account = FinancialAccountSerializer(read_only=True)
    
    class Meta:
        model = FinancialTransaction
        fields = '__all__'

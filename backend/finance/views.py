from rest_framework import viewsets, permissions
from .models import Currency, TaxRate, Invoice, InvoiceLineItem, Payment, Expense, FinancialAccount, FinancialTransaction
from .serializers import (
    CurrencySerializer, TaxRateSerializer, InvoiceSerializer, InvoiceDetailSerializer,
    InvoiceLineItemSerializer, PaymentSerializer, ExpenseSerializer,
    FinancialAccountSerializer, FinancialTransactionSerializer
)

class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [permissions.AllowAny]

class TaxRateViewSet(viewsets.ModelViewSet):
    queryset = TaxRate.objects.all()
    serializer_class = TaxRateSerializer
    permission_classes = [permissions.IsAuthenticated]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return InvoiceDetailSerializer
        return InvoiceSerializer

class InvoiceLineItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceLineItem.objects.all()
    serializer_class = InvoiceLineItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

class FinancialAccountViewSet(viewsets.ModelViewSet):
    queryset = FinancialAccount.objects.all()
    serializer_class = FinancialAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

class FinancialTransactionViewSet(viewsets.ModelViewSet):
    queryset = FinancialTransaction.objects.all()
    serializer_class = FinancialTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

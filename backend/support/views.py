from rest_framework import viewsets, permissions
from .models import TicketPriority, TicketStatus, TicketCategory, SLA, SupportTicket, TicketComment, KnowledgeBaseArticle, ArticleRating
from .serializers import (
    TicketPrioritySerializer, TicketStatusSerializer, TicketCategorySerializer,
    SLASerializer, SupportTicketSerializer, SupportTicketDetailSerializer,
    TicketCommentSerializer, KnowledgeBaseArticleSerializer, 
    KnowledgeBaseArticleDetailSerializer, ArticleRatingSerializer
)

class TicketPriorityViewSet(viewsets.ModelViewSet):
    queryset = TicketPriority.objects.all()
    serializer_class = TicketPrioritySerializer
    permission_classes = [permissions.AllowAny]

class TicketStatusViewSet(viewsets.ModelViewSet):
    queryset = TicketStatus.objects.all()
    serializer_class = TicketStatusSerializer
    permission_classes = [permissions.AllowAny]

class TicketCategoryViewSet(viewsets.ModelViewSet):
    queryset = TicketCategory.objects.all()
    serializer_class = TicketCategorySerializer
    permission_classes = [permissions.AllowAny]

class SLAViewSet(viewsets.ModelViewSet):
    queryset = SLA.objects.all()
    serializer_class = SLASerializer
    permission_classes = [permissions.AllowAny]

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return SupportTicketDetailSerializer
        return SupportTicketSerializer

class TicketCommentViewSet(viewsets.ModelViewSet):
    queryset = TicketComment.objects.all()
    serializer_class = TicketCommentSerializer
    permission_classes = [permissions.AllowAny]

class KnowledgeBaseArticleViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeBaseArticle.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return KnowledgeBaseArticleDetailSerializer
        return KnowledgeBaseArticleSerializer

class ArticleRatingViewSet(viewsets.ModelViewSet):
    queryset = ArticleRating.objects.all()
    serializer_class = ArticleRatingSerializer
    permission_classes = [permissions.AllowAny]

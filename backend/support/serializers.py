from rest_framework import serializers
from .models import TicketPriority, TicketStatus, TicketCategory, SLA, SupportTicket, TicketComment, KnowledgeBaseArticle, ArticleRating

class TicketPrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketPriority
        fields = '__all__'

class TicketStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketStatus
        fields = '__all__'

class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = '__all__'

class SLASerializer(serializers.ModelSerializer):
    class Meta:
        model = SLA
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    status = TicketStatusSerializer(read_only=True)
    priority = TicketPrioritySerializer(read_only=True)
    category = TicketCategorySerializer(read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'ticket_number', 'subject', 'account', 'contact', 
                 'status', 'priority', 'category', 'due_date', 'created_at', 'updated_at']

class SupportTicketDetailSerializer(serializers.ModelSerializer):
    status = TicketStatusSerializer(read_only=True)
    priority = TicketPrioritySerializer(read_only=True)
    category = TicketCategorySerializer(read_only=True)
    sla = SLASerializer(read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = '__all__'

class TicketCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketComment
        fields = '__all__'

class KnowledgeBaseArticleSerializer(serializers.ModelSerializer):
    category = TicketCategorySerializer(read_only=True)
    
    class Meta:
        model = KnowledgeBaseArticle
        fields = ['id', 'title', 'category', 'is_published', 'published_date', 
                 'view_count', 'is_internal', 'created_at', 'updated_at']

class KnowledgeBaseArticleDetailSerializer(serializers.ModelSerializer):
    category = TicketCategorySerializer(read_only=True)
    
    class Meta:
        model = KnowledgeBaseArticle
        fields = '__all__'

class ArticleRatingSerializer(serializers.ModelSerializer):
    article = KnowledgeBaseArticleSerializer(read_only=True)
    
    class Meta:
        model = ArticleRating
        fields = '__all__'

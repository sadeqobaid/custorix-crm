from django.contrib import admin
from .models import (
    TicketPriority, 
    TicketStatus, 
    TicketCategory, 
    SLA, 
    SupportTicket, 
    TicketComment, 
    KnowledgeBaseArticle, 
    ArticleRating
)

# Register your models
admin.site.register(TicketPriority)
admin.site.register(TicketStatus)
admin.site.register(TicketCategory)
admin.site.register(SLA)
admin.site.register(SupportTicket)
admin.site.register(TicketComment)
admin.site.register(KnowledgeBaseArticle)
admin.site.register(ArticleRating)

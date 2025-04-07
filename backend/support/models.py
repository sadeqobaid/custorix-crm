from django.db import models
from core.models import BaseModel
from accounts.models import User
from contacts.models import Account, Contact

class TicketPriority(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Ticket Priorities"
        ordering = ['order']

class TicketStatus(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)
    is_closed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Ticket Statuses"
        ordering = ['order']

class TicketCategory(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Ticket Categories"

class SLA(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    response_time_hours = models.IntegerField()
    resolution_time_hours = models.IntegerField()
    
    def __str__(self):
        return self.name

class SupportTicket(BaseModel):
    ticket_number = models.CharField(max_length=50, unique=True)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='support_tickets')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='support_tickets')
    status = models.ForeignKey(TicketStatus, on_delete=models.SET_NULL, null=True, related_name='tickets')
    priority = models.ForeignKey(TicketPriority, on_delete=models.SET_NULL, null=True, related_name='tickets')
    category = models.ForeignKey(TicketCategory, on_delete=models.SET_NULL, null=True, related_name='tickets')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    sla = models.ForeignKey(SLA, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    due_date = models.DateTimeField(null=True, blank=True)
    resolution_date = models.DateTimeField(null=True, blank=True)
    resolution_summary = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.ticket_number} - {self.subject}"

class TicketComment(BaseModel):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='ticket_comments')
    is_internal = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Comment on {self.ticket.ticket_number}"

class KnowledgeBaseArticle(BaseModel):
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.ForeignKey(TicketCategory, on_delete=models.SET_NULL, null=True, related_name='kb_articles')
    is_published = models.BooleanField(default=False)
    published_date = models.DateTimeField(null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='kb_articles')
    view_count = models.IntegerField(default=0)
    is_internal = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

class ArticleRating(BaseModel):
    article = models.ForeignKey(KnowledgeBaseArticle, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField()
    comment = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='article_ratings')
    
    def __str__(self):
        return f"Rating for {self.article.title}"
    
    class Meta:
        unique_together = ('article', 'created_by')

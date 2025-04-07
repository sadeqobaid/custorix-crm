from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import (
    UserViewSet, RoleViewSet, PermissionViewSet, DepartmentViewSet,
    TeamViewSet, TeamMemberViewSet, UserPermissionViewSet, RolePermissionViewSet
)
from contacts.views import (
    CountryViewSet, StateViewSet, CityViewSet, LocationViewSet,
    IndustryViewSet, AccountViewSet, AccountLocationViewSet,
    ContactViewSet, ContactLocationViewSet
)
from leads.views import (
    LeadSourceViewSet, LeadStatusViewSet, LeadViewSet, LeadScoringRuleViewSet
)
from sales.views import (
    SalesStageViewSet, ProductViewSet, PriceBookViewSet, PriceBookEntryViewSet,
    OpportunityViewSet, OpportunityContactViewSet, OpportunityProductViewSet
)
from marketing.views import (
    CampaignTypeViewSet, CampaignViewSet, EmailTemplateViewSet, MarketingAssetViewSet,
    CampaignMemberViewSet, EmailCampaignViewSet, EmailCampaignResultViewSet
)
from support.views import (
    TicketPriorityViewSet, TicketStatusViewSet, TicketCategoryViewSet, SLAViewSet,
    SupportTicketViewSet, TicketCommentViewSet, KnowledgeBaseArticleViewSet, ArticleRatingViewSet
)
from finance.views import (
    CurrencyViewSet, TaxRateViewSet, InvoiceViewSet, InvoiceLineItemViewSet,
    PaymentViewSet, ExpenseViewSet, FinancialAccountViewSet, FinancialTransactionViewSet
)

router = DefaultRouter()

# Accounts app
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'team-members', TeamMemberViewSet)
router.register(r'user-permissions', UserPermissionViewSet)
router.register(r'role-permissions', RolePermissionViewSet)

# Contacts app
router.register(r'countries', CountryViewSet)
router.register(r'states', StateViewSet)
router.register(r'cities', CityViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'industries', IndustryViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'account-locations', AccountLocationViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'contact-locations', ContactLocationViewSet)

# Leads app
router.register(r'lead-sources', LeadSourceViewSet)
router.register(r'lead-statuses', LeadStatusViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'lead-scoring-rules', LeadScoringRuleViewSet)

# Sales app
router.register(r'sales-stages', SalesStageViewSet)
router.register(r'products', ProductViewSet)
router.register(r'price-books', PriceBookViewSet)
router.register(r'price-book-entries', PriceBookEntryViewSet)
router.register(r'opportunities', OpportunityViewSet)
router.register(r'opportunity-contacts', OpportunityContactViewSet)
router.register(r'opportunity-products', OpportunityProductViewSet)

# Marketing app
router.register(r'campaign-types', CampaignTypeViewSet)
router.register(r'campaigns', CampaignViewSet)
router.register(r'email-templates', EmailTemplateViewSet)
router.register(r'marketing-assets', MarketingAssetViewSet)
router.register(r'campaign-members', CampaignMemberViewSet)
router.register(r'email-campaigns', EmailCampaignViewSet)
router.register(r'email-campaign-results', EmailCampaignResultViewSet)

# Support app
router.register(r'ticket-priorities', TicketPriorityViewSet)
router.register(r'ticket-statuses', TicketStatusViewSet)
router.register(r'ticket-categories', TicketCategoryViewSet)
router.register(r'slas', SLAViewSet)
router.register(r'support-tickets', SupportTicketViewSet)
router.register(r'ticket-comments', TicketCommentViewSet)
router.register(r'kb-articles', KnowledgeBaseArticleViewSet)
router.register(r'article-ratings', ArticleRatingViewSet)

# Finance app
router.register(r'currencies', CurrencyViewSet)
router.register(r'tax-rates', TaxRateViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'invoice-line-items', InvoiceLineItemViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'financial-accounts', FinancialAccountViewSet)
router.register(r'financial-transactions', FinancialTransactionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
]

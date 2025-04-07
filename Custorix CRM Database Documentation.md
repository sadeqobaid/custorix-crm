Custorix CRM Database Documentation
Overview

The Custorix CRM database is a comprehensive relational database designed to support all aspects of customer relationship management, including sales, marketing, customer support, accounting, and business operations. This schema provides a robust foundation for a modern CRM system with extensive functionality across all business areas.

Schema Structure

The database is organized into several logical sections within the custorix schema:

Security and User Management
Location and Contact Information
Customer Relationship Management
Lead Management
Sales Management
Product and Pricing
Marketing
Customer Support
Accounting and Financial
Activity and Task Management
Automation and Workflow
Reporting and Analytics
Audit and Security
Integration
Data Import and Webhooks
Tagging System
Detailed Table Documentation

1. Security and User Management

roles

Purpose: Defines user roles within the system
Description: Stores different access levels and permissions groupings for users
Key Fields:
role_name: Name of the role (e.g., Administrator, Sales Representative)
is_system_role: Flag indicating if this is a built-in system role
permissions

Purpose: Defines granular permissions for system actions
Description: Individual permissions that can be assigned to roles or users
Key Fields:
permission_name: Unique name for the permission
resource_type: Type of resource this permission applies to
action_type: Action allowed by this permission
role_permissions

Purpose: Associates permissions with roles
Description: Many-to-many relationship between roles and permissions
departments

Purpose: Organizational department structure
Description: Defines company departments and their hierarchy
Key Fields:
department_name: Name of the department
parent_department_id: For hierarchical department structures
users

Purpose: Stores user/employee information
Description: Contains all user accounts with authentication and profile data
Key Fields:
email: User's email address (used for login)
password_hash: Securely hashed password
role_id: Primary role assignment
department_id: Department assignment
teams

Purpose: Defines cross-functional teams
Description: Groups of users working together on specific projects or accounts
Key Fields:
team_name: Name of the team
team_leader_id: User who leads the team
tokens

Purpose: Manages authentication tokens
Description: Stores API and session tokens for user authentication
Key Fields:
token: The actual token value
token_type: Type of token (access, refresh, api)
expires_at: When the token becomes invalid
2. Location and Contact Information

countries, states, cities

Purpose: Geographic reference data
Description: Hierarchical tables for country, state/province, and city data
locations

Purpose: Physical address storage
Description: Stores complete address information with geocoding
Key Fields:
address_line1, address_line2: Street address
city_id, state_id, country_id: Geographic references
latitude, longitude: For mapping and geolocation
3. Customer Relationship Management

accounts

Purpose: Stores customer organizations
Description: Main table for companies/organizations that are customers
Key Fields:
account_name: Name of the company
account_type_id: Classification of account type
industry_id: Industry classification
status: Current relationship status (prospect, customer, etc.)
contacts

Purpose: Stores individual people at customer organizations
Description: People associated with accounts (contacts)
Key Fields:
first_name, last_name: Contact name
account_id: Associated organization
is_primary: Flag for primary contact
is_decision_maker: Flag for purchasing authority
account_locations, contact_locations

Purpose: Associates locations with accounts/contacts
Description: Many-to-many relationships allowing multiple locations
4. Lead Management

leads

Purpose: Potential customer records
Description: Individuals or companies that may become customers
Key Fields:
company_name: Lead's organization
status_id: Current lead status
converted_account_id: If converted to customer
converted_contact_id: If converted to contact
lead_sources

Purpose: Tracks lead origins
Description: How leads were acquired (web, referral, etc.)
lead_scoring_rules

Purpose: Defines lead qualification criteria
Description: Rules for automatically scoring lead quality
5. Sales Management

opportunities

Purpose: Sales deals/pipeline
Description: Potential revenue-generating deals
Key Fields:
opportunity_name: Deal name
amount: Potential deal value
stage_id: Current sales stage
close_date: Expected close date
is_closed, is_won: Deal status flags
sales_stages

Purpose: Defines sales process stages
Description: Steps in the sales pipeline with probabilities
opportunity_contacts

Purpose: Associates contacts with opportunities
Description: Many-to-many relationship showing who's involved in deals
6. Product and Pricing

products

Purpose: Product catalog
Description: Items or services sold to customers
Key Fields:
product_name: Name of product/service
standard_price: Base price
is_active: Available for sale
price_books

Purpose: Alternative pricing structures
Description: Custom price lists for different customer segments
7. Marketing

campaigns

Purpose: Marketing initiatives
Description: Organized marketing efforts
Key Fields:
campaign_name: Name of campaign
type_id: Campaign type
budgeted_cost: Planned budget
expected_revenue: Anticipated results
email_templates

Purpose: Standardized email content
Description: Reusable email formats for campaigns
marketing_assets

Purpose: Digital marketing resources
Description: Files used in marketing (whitepapers, videos, etc.)
8. Customer Support

support_tickets

Purpose: Customer issue tracking
Description: Cases or tickets for customer support
Key Fields:
ticket_number: Unique identifier
subject: Brief description
priority_id: Urgency level
status_id: Current state
kb_articles

Purpose: Knowledge base content
Description: Help articles for self-service support
9. Accounting and Financial

invoices

Purpose: Customer billing
Description: Bills sent to customers
Key Fields:
invoice_number: Unique identifier
total_amount: Amount due
status: Payment status
payments

Purpose: Customer payments
Description: Records of payments received
Key Fields:
payment_number: Unique identifier
amount: Payment amount
payment_date: When received
10. Activity and Task Management

activities

Purpose: Calendar and tasks
Description: Meetings, calls, tasks
Key Fields:
subject: Brief description
start_date, end_date: When it occurs
status: Current state
11. Automation and Workflow

workflow_rules

Purpose: Business process automation
Description: Rules for automatic actions
Key Fields:
rule_name: Descriptive name
trigger_type: When rule executes
condition_logic: Criteria for execution
12. Reporting and Analytics

reports

Purpose: Saved report definitions
Description: Configurations for recurring reports
dashboards

Purpose: Data visualization
Description: Collections of report widgets
13. Audit and Security

audit_log

Purpose: Change tracking
Description: Records all significant data changes
Key Fields:
table_name: Affected table
action: Type of change
changes: What was modified
14. Integration

integration_connections

Purpose: External system integrations
Description: Configurations for connecting to other systems
15. Data Import and Webhooks

data_imports

Purpose: Bulk data loading
Description: Tracks imports of external data
Key Fields:
status: Import progress
success_count: Records imported
webhooks

Purpose: External event notifications
Description: Configurations for outgoing webhooks
16. Tagging System

tags

Purpose: Flexible categorization
Description: User-defined labels for any object type
Key Features and Functionality

Comprehensive CRM: Tracks all customer interactions from lead to sale to support
Flexible Security: Granular permissions and role-based access control
Sales Pipeline: Visualize and manage opportunities through stages
Marketing Automation: Campaign tracking and email automation
Customer Support: Ticketing system with SLA tracking
Financial Integration: Invoicing, payments, and accounting
Reporting: Custom reports and dashboards
Audit Trail: Complete change history for compliance
API and Integration: Webhooks and external system connections
Data Import/Export: Bulk data operations
Database Design Principles

Normalization: Properly normalized schema with minimal redundancy
Extensibility: Designed for future growth with flexible structures
Performance: Appropriate indexes and relationships for query efficiency
Security: Password hashing, audit logging, and permission controls
Data Integrity: Constraints and validation rules
Internationalization: Support for multiple currencies and locations
Views

The database includes several pre-defined views for common reporting needs:

active_accounts_with_open_opportunities: Shows customers with current sales opportunities
support_tickets_by_priority_status: Ticket counts by priority and status
monthly_revenue: Revenue trends by month
sales_pipeline_by_stage: Opportunity amounts by sales stage
user_activity_summary: User productivity metrics
Functions and Triggers

The schema includes several important functions and triggers:

Audit Logging: Automatic tracking of all data changes
Number Generation: For invoices, tickets, payments
Status Updates: Automatic account status changes
Calculations: Invoice totals, opportunity values
Data Validation: Email format checking, field constraints
Implementation Notes

Uses UUIDs for all primary keys
Includes created_at/updated_at timestamps on most tables
Follows consistent naming conventions
Uses PostgreSQL extensions like uuid-ossp and pgcrypto
Organized into logical schema groupings
This database schema provides a complete foundation for a modern CRM system with all necessary components for sales, marketing, customer service, and financial tracking while maintaining security, performance, and data integrity.
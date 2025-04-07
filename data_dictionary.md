# Data Dictionary for Custorix CRM Database

## Introduction

This data dictionary provides comprehensive information about the tables, columns, relationships, and constraints in the Custorix CRM database. It serves as a reference for developers, database administrators, and business analysts working with the system.

## Table of Contents

1. [User Management](#user-management)
2. [Location Management](#location-management)
3. [Account Management](#account-management)
4. [Contact Management](#contact-management)
5. [Lead Management](#lead-management)
6. [Opportunity Management](#opportunity-management)
7. [Product Management](#product-management)
8. [Campaign Management](#campaign-management)
9. [Email Marketing](#email-marketing)
10. [Support Management](#support-management)
11. [Knowledge Base](#knowledge-base)
12. [Financial Management](#financial-management)
13. [Workflow Automation](#workflow-automation)
14. [Notification System](#notification-system)
15. [Audit Logging](#audit-logging)

## User Management

### Table: roles

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| role_id | UUID | Unique identifier for the role | Primary Key |
| name | VARCHAR(100) | Name of the role | Not Null, Unique |
| description | TEXT | Description of the role's permissions and responsibilities | |
| created_at | TIMESTAMP | Date and time when the role was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the role was last updated | |

### Table: permissions

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| permission_id | UUID | Unique identifier for the permission | Primary Key |
| name | VARCHAR(100) | Name of the permission | Not Null, Unique |
| description | TEXT | Description of what the permission allows | |
| created_at | TIMESTAMP | Date and time when the permission was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the permission was last updated | |

### Table: role_permissions

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| role_id | UUID | Reference to the role | Foreign Key (roles.role_id), Not Null |
| permission_id | UUID | Reference to the permission | Foreign Key (permissions.permission_id), Not Null |
| created_at | TIMESTAMP | Date and time when the role-permission association was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between roles and permissions.*

### Table: departments

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| department_id | UUID | Unique identifier for the department | Primary Key |
| name | VARCHAR(100) | Name of the department | Not Null |
| description | TEXT | Description of the department | |
| parent_department_id | UUID | Reference to the parent department | Foreign Key (departments.department_id) |
| created_at | TIMESTAMP | Date and time when the department was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the department was last updated | |

### Table: users

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| user_id | UUID | Unique identifier for the user | Primary Key |
| username | VARCHAR(50) | Username for login | Not Null, Unique |
| email | VARCHAR(100) | Email address of the user | Not Null, Unique |
| password_hash | VARCHAR(255) | Hashed password for authentication | Not Null |
| first_name | VARCHAR(50) | First name of the user | Not Null |
| last_name | VARCHAR(50) | Last name of the user | Not Null |
| role_id | UUID | Reference to the user's role | Foreign Key (roles.role_id) |
| department_id | UUID | Reference to the user's department | Foreign Key (departments.department_id) |
| manager_id | UUID | Reference to the user's manager | Foreign Key (users.user_id) |
| phone | VARCHAR(20) | Phone number of the user | |
| status | VARCHAR(20) | Status of the user account (Active, Inactive, Locked, etc.) | Not Null, Default: 'Active' |
| last_login | TIMESTAMP | Date and time of the user's last login | |
| created_at | TIMESTAMP | Date and time when the user was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the user was last updated | |

### Table: user_permissions

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| user_id | UUID | Reference to the user | Foreign Key (users.user_id), Not Null |
| permission_id | UUID | Reference to the permission | Foreign Key (permissions.permission_id), Not Null |
| created_at | TIMESTAMP | Date and time when the user-permission association was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between users and permissions, allowing for user-specific permissions beyond their role.*

### Table: teams

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| team_id | UUID | Unique identifier for the team | Primary Key |
| name | VARCHAR(100) | Name of the team | Not Null |
| description | TEXT | Description of the team | |
| team_leader_id | UUID | Reference to the team leader | Foreign Key (users.user_id) |
| created_at | TIMESTAMP | Date and time when the team was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the team was last updated | |

### Table: team_members

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| team_id | UUID | Reference to the team | Foreign Key (teams.team_id), Not Null |
| user_id | UUID | Reference to the user | Foreign Key (users.user_id), Not Null |
| created_at | TIMESTAMP | Date and time when the team-member association was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between teams and users.*

### Table: tokens

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| token_id | UUID | Unique identifier for the token | Primary Key |
| user_id | UUID | Reference to the user | Foreign Key (users.user_id), Not Null |
| token | VARCHAR(255) | Token value for authentication | Not Null, Unique |
| expiry | TIMESTAMP | Expiration date and time of the token | Not Null |
| created_at | TIMESTAMP | Date and time when the token was created | Not Null, Default: CURRENT_TIMESTAMP |

### Table: login_history

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| login_id | UUID | Unique identifier for the login record | Primary Key |
| user_id | UUID | Reference to the user | Foreign Key (users.user_id), Not Null |
| ip_address | VARCHAR(45) | IP address from which the login was attempted | |
| user_agent | TEXT | User agent information of the browser/client | |
| status | VARCHAR(20) | Status of the login attempt (Success, Failed, etc.) | Not Null |
| created_at | TIMESTAMP | Date and time of the login attempt | Not Null, Default: CURRENT_TIMESTAMP |

## Location Management

### Table: countries

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| country_id | UUID | Unique identifier for the country | Primary Key |
| name | VARCHAR(100) | Name of the country | Not Null |
| code | VARCHAR(3) | ISO country code | Not Null, Unique |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: states

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| state_id | UUID | Unique identifier for the state/province | Primary Key |
| name | VARCHAR(100) | Name of the state/province | Not Null |
| country_id | UUID | Reference to the country | Foreign Key (countries.country_id), Not Null |
| code | VARCHAR(10) | State/province code | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: cities

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| city_id | UUID | Unique identifier for the city | Primary Key |
| name | VARCHAR(100) | Name of the city | Not Null |
| state_id | UUID | Reference to the state/province | Foreign Key (states.state_id), Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: locations

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| location_id | UUID | Unique identifier for the location | Primary Key |
| address_line1 | VARCHAR(255) | First line of the address | Not Null |
| address_line2 | VARCHAR(255) | Second line of the address | |
| postal_code | VARCHAR(20) | Postal/ZIP code | |
| city_id | UUID | Reference to the city | Foreign Key (cities.city_id) |
| state_id | UUID | Reference to the state/province | Foreign Key (states.state_id) |
| country_id | UUID | Reference to the country | Foreign Key (countries.country_id) |
| latitude | DECIMAL(10,8) | Latitude coordinate | |
| longitude | DECIMAL(11,8) | Longitude coordinate | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

## Account Management

### Table: industries

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| industry_id | UUID | Unique identifier for the industry | Primary Key |
| name | VARCHAR(100) | Name of the industry | Not Null, Unique |
| description | TEXT | Description of the industry | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: account_types

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| account_type_id | UUID | Unique identifier for the account type | Primary Key |
| name | VARCHAR(100) | Name of the account type (Customer, Partner, Prospect, etc.) | Not Null, Unique |
| description | TEXT | Description of the account type | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: account_categories

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| category_id | UUID | Unique identifier for the account category | Primary Key |
| name | VARCHAR(100) | Name of the category (Enterprise, SMB, etc.) | Not Null, Unique |
| description | TEXT | Description of the category | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: accounts

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| account_id | UUID | Unique identifier for the account | Primary Key |
| name | VARCHAR(255) | Name of the account/company | Not Null |
| account_type_id | UUID | Reference to the account type | Foreign Key (account_types.account_type_id) |
| category_id | UUID | Reference to the account category | Foreign Key (account_categories.category_id) |
| industry_id | UUID | Reference to the industry | Foreign Key (industries.industry_id) |
| parent_account_id | UUID | Reference to the parent account | Foreign Key (accounts.account_id) |
| owner_id | UUID | Reference to the account owner | Foreign Key (users.user_id) |
| website | VARCHAR(255) | Website URL of the account | |
| phone | VARCHAR(20) | Phone number of the account | |
| email | VARCHAR(100) | Email address of the account | |
| annual_revenue | DECIMAL(18,2) | Annual revenue of the account | |
| employee_count | INTEGER | Number of employees in the account | |
| status | VARCHAR(20) | Status of the account (Active, Inactive, etc.) | Not Null, Default: 'Active' |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: account_locations

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| account_id | UUID | Reference to the account | Foreign Key (accounts.account_id), Not Null |
| location_id | UUID | Reference to the location | Foreign Key (locations.location_id), Not Null |
| location_type | VARCHAR(50) | Type of location (Headquarters, Branch, etc.) | Not Null |
| is_primary | BOOLEAN | Whether this is the primary location for the account | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between accounts and locations.*

## Contact Management

### Table: contact_titles

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| title_id | UUID | Unique identifier for the contact title | Primary Key |
| title | VARCHAR(50) | Title (Mr., Ms., Dr., etc.) | Not Null, Unique |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: contacts

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| contact_id | UUID | Unique identifier for the contact | Primary Key |
| first_name | VARCHAR(50) | First name of the contact | Not Null |
| last_name | VARCHAR(50) | Last name of the contact | Not Null |
| title_id | UUID | Reference to the contact title | Foreign Key (contact_titles.title_id) |
| account_id | UUID | Reference to the associated account | Foreign Key (accounts.account_id) |
| owner_id | UUID | Reference to the contact owner | Foreign Key (users.user_id) |
| email | VARCHAR(100) | Email address of the contact | |
| phone | VARCHAR(20) | Phone number of the contact | |
| mobile | VARCHAR(20) | Mobile number of the contact | |
| status | VARCHAR(20) | Status of the contact (Active, Inactive, etc.) | Not Null, Default: 'Active' |
| birthdate | DATE | Birthdate of the contact | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: contact_locations

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| contact_id | UUID | Reference to the contact | Foreign Key (contacts.contact_id), Not Null |
| location_id | UUID | Reference to the location | Foreign Key (locations.location_id), Not Null |
| location_type | VARCHAR(50) | Type of location (Home, Work, etc.) | Not Null |
| is_primary | BOOLEAN | Whether this is the primary location for the contact | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between contacts and locations.*

## Lead Management

### Table: lead_sources

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| source_id | UUID | Unique identifier for the lead source | Primary Key |
| name | VARCHAR(100) | Name of the lead source (Website, Referral, etc.) | Not Null, Unique |
| description | TEXT | Description of the lead source | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: lead_statuses

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| status_id | UUID | Unique identifier for the lead status | Primary Key |
| name | VARCHAR(100) | Name of the status (New, Qualified, Disqualified, etc.) | Not Null, Unique |
| description | TEXT | Description of the status | |
| is_converted | BOOLEAN | Whether this status indicates a converted lead | Not Null, Default: FALSE |
| is_closed | BOOLEAN | Whether this status indicates a closed lead | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: leads

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| lead_id | UUID | Unique identifier for the lead | Primary Key |
| first_name | VARCHAR(50) | First name of the lead | Not Null |
| last_name | VARCHAR(50) | Last name of the lead | Not Null |
| title | VARCHAR(100) | Job title of the lead | |
| company | VARCHAR(255) | Company name of the lead | |
| email | VARCHAR(100) | Email address of the lead | |
| phone | VARCHAR(20) | Phone number of the lead | |
| source_id | UUID | Reference to the lead source | Foreign Key (lead_sources.source_id) |
| status_id | UUID | Reference to the lead status | Foreign Key (lead_statuses.status_id), Not Null |
| owner_id | UUID | Reference to the lead owner | Foreign Key (users.user_id) |
| industry_id | UUID | Reference to the industry | Foreign Key (industries.industry_id) |
| rating | VARCHAR(20) | Rating of the lead (Hot, Warm, Cold, etc.) | |
| estimated_value | DECIMAL(18,2) | Estimated value of the lead | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: lead_locations

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| lead_id | UUID | Reference to the lead | Foreign Key (leads.lead_id), Not Null |
| location_id | UUID | Reference to the location | Foreign Key (locations.location_id), Not Null |
| location_type | VARCHAR(50) | Type of location (Work, Home, etc.) | Not Null |
| is_primary | BOOLEAN | Whether this is the primary location for the lead | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between leads and locations.*

## Opportunity Management

### Table: opportunity_stages

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| stage_id | UUID | Unique identifier for the opportunity stage | Primary Key |
| name | VARCHAR(100) | Name of the stage (Prospecting, Qualification, etc.) | Not Null, Unique |
| description | TEXT | Description of the stage | |
| probability | INTEGER | Probability percentage for opportunities in this stage | Not Null |
| is_closed | BOOLEAN | Whether this stage indicates a closed opportunity | Not Null, Default: FALSE |
| is_won | BOOLEAN | Whether this stage indicates a won opportunity | Not Null, Default: FALSE |
| order_index | INTEGER | Order index for sorting stages | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: opportunity_types

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| type_id | UUID | Unique identifier for the opportunity type | Primary Key |
| name | VARCHAR(100) | Name of the type (New Business, Existing Business, etc.) | Not Null, Unique |
| description | TEXT | Description of the type | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: opportunities

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| opportunity_id | UUID | Unique identifier for the opportunity | Primary Key |
| name | VARCHAR(255) | Name of the opportunity | Not Null |
| account_id | UUID | Reference to the associated account | Foreign Key (accounts.account_id), Not Null |
| contact_id | UUID | Reference to the primary contact | Foreign Key (contacts.contact_id) |
| owner_id | UUID | Reference to the opportunity owner | Foreign Key (users.user_id), Not Null |
| stage_id | UUID | Reference to the opportunity stage | Foreign Key (opportunity_stages.stage_id), Not Null |
| type_id | UUID | Reference to the opportunity type | Foreign Key (opportunity_types.type_id) |
| amount | DECIMAL(18,2) | Total amount of the opportunity | |
| expected_revenue | DECIMAL(18,2) | Expected revenue from the opportunity | |
| close_date | DATE | Expected close date of the opportunity | |
| probability | INTEGER | Probability percentage of winning | |
| next_step | VARCHAR(255) | Description of the next step | |
| description | TEXT | Description of the opportunity | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: opportunity_competitors

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| opportunity_id | UUID | Reference to the opportunity | Foreign Key (opportunities.opportunity_id), Not Null |
| competitor_id | UUID | Reference to the competitor account | Foreign Key (accounts.account_id), Not Null |
| strengths | TEXT | Strengths of the competitor | |
| weaknesses | TEXT | Weaknesses of the competitor | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between opportunities and competitor accounts.*

### Table: opportunity_team_members

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| opportunity_id | UUID | Reference to the opportunity | Foreign Key (opportunities.opportunity_id), Not Null |
| user_id | UUID | Reference to the team member | Foreign Key (users.user_id), Not Null |
| role | VARCHAR(100) | Role of the team member in the opportunity | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between opportunities and users.*

## Product Management

### Table: product_categories

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| category_id | UUID | Unique identifier for the product category | Primary Key |
| name | VARCHAR(100) | Name of the category | Not Null |
| description | TEXT | Description of the category | |
| parent_category_id | UUID | Reference to the parent category | Foreign Key (product_categories.category_id) |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: products

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| product_id | UUID | Unique identifier for the product | Primary Key |
| name | VARCHAR(255) | Name of the product | Not Null |
| description | TEXT | Description of the product | |
| category_id | UUID | Reference to the product category | Foreign Key (product_categories.category_id) |
| sku | VARCHAR(100) | Stock Keeping Unit | Unique |
| unit_price | DECIMAL(18,2) | Standard unit price of the product | Not Null |
| active | BOOLEAN | Whether the product is active | Not Null, Default: TRUE |
| taxable | BOOLEAN | Whether the product is taxable | Not Null, Default: TRUE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: price_books

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| price_book_id | UUID | Unique identifier for the price book | Primary Key |
| name | VARCHAR(100) | Name of the price book | Not Null |
| description | TEXT | Description of the price book | |
| is_active | BOOLEAN | Whether the price book is active | Not Null, Default: TRUE |
| is_standard | BOOLEAN | Whether this is the standard price book | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: price_book_entries

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| entry_id | UUID | Unique identifier for the price book entry | Primary Key |
| price_book_id | UUID | Reference to the price book | Foreign Key (price_books.price_book_id), Not Null |
| product_id | UUID | Reference to the product | Foreign Key (products.product_id), Not Null |
| unit_price | DECIMAL(18,2) | Unit price in this price book | Not Null |
| active | BOOLEAN | Whether the entry is active | Not Null, Default: TRUE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: opportunity_products

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| opportunity_id | UUID | Reference to the opportunity | Foreign Key (opportunities.opportunity_id), Not Null |
| product_id | UUID | Reference to the product | Foreign Key (products.product_id), Not Null |
| quantity | DECIMAL(12,2) | Quantity of the product | Not Null, Default: 1 |
| unit_price | DECIMAL(18,2) | Unit price of the product | Not Null |
| discount | DECIMAL(5,2) | Discount percentage | Not Null, Default: 0 |
| total_price | DECIMAL(18,2) | Total price (quantity * unit_price * (1 - discount/100)) | Not Null |
| description | TEXT | Description or notes | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

*Note: This is a junction table implementing a many-to-many relationship between opportunities and products.*

## Campaign Management

### Table: campaign_types

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| type_id | UUID | Unique identifier for the campaign type | Primary Key |
| name | VARCHAR(100) | Name of the type (Email, Webinar, Conference, etc.) | Not Null, Unique |
| description | TEXT | Description of the type | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: campaign_statuses

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| status_id | UUID | Unique identifier for the campaign status | Primary Key |
| name | VARCHAR(100) | Name of the status (Planned, In Progress, Completed, etc.) | Not Null, Unique |
| description | TEXT | Description of the status | |
| is_active | BOOLEAN | Whether this status indicates an active campaign | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: campaigns

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| campaign_id | UUID | Unique identifier for the campaign | Primary Key |
| name | VARCHAR(255) | Name of the campaign | Not Null |
| description | TEXT | Description of the campaign | |
| type_id | UUID | Reference to the campaign type | Foreign Key (campaign_types.type_id), Not Null |
| status_id | UUID | Reference to the campaign status | Foreign Key (campaign_statuses.status_id), Not Null |
| owner_id | UUID | Reference to the campaign owner | Foreign Key (users.user_id), Not Null |
| start_date | DATE | Start date of the campaign | |
| end_date | DATE | End date of the campaign | |
| budgeted_cost | DECIMAL(18,2) | Budgeted cost of the campaign | |
| actual_cost | DECIMAL(18,2) | Actual cost of the campaign | |
| expected_revenue | DECIMAL(18,2) | Expected revenue from the campaign | |
| expected_response | INTEGER | Expected response percentage | |
| target_audience | TEXT | Description of the target audience | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: campaign_member_statuses

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| status_id | UUID | Unique identifier for the campaign member status | Primary Key |
| name | VARCHAR(100) | Name of the status (Sent, Responded, Converted, etc.) | Not Null, Unique |
| description | TEXT | Description of the status | |
| is_responded | BOOLEAN | Whether this status indicates a response | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: campaign_leads

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| campaign_id | UUID | Reference to the campaign | Foreign Key (campaigns.campaign_id), Not Null |
| lead_id | UUID | Reference to the lead | Foreign Key (leads.lead_id), Not Null |
| status_id | UUID | Reference to the campaign member status | Foreign Key (campaign_member_statuses.status_id), Not Null |
| response_date | TIMESTAMP | Date and time of the lead's response | |
| response_channel | VARCHAR(100) | Channel through which the lead responded | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

*Note: This is a junction table implementing a many-to-many relationship between campaigns and leads.*

### Table: campaign_contacts

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| campaign_id | UUID | Reference to the campaign | Foreign Key (campaigns.campaign_id), Not Null |
| contact_id | UUID | Reference to the contact | Foreign Key (contacts.contact_id), Not Null |
| status_id | UUID | Reference to the campaign member status | Foreign Key (campaign_member_statuses.status_id), Not Null |
| response_date | TIMESTAMP | Date and time of the contact's response | |
| response_channel | VARCHAR(100) | Channel through which the contact responded | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

*Note: This is a junction table implementing a many-to-many relationship between campaigns and contacts.*

## Email Marketing

### Table: email_templates

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| template_id | UUID | Unique identifier for the email template | Primary Key |
| name | VARCHAR(255) | Name of the template | Not Null |
| subject | VARCHAR(255) | Subject line of the email | Not Null |
| body | TEXT | Body content of the email | Not Null |
| format | VARCHAR(20) | Format of the email (HTML, Plain Text, etc.) | Not Null, Default: 'HTML' |
| owner_id | UUID | Reference to the template owner | Foreign Key (users.user_id), Not Null |
| is_active | BOOLEAN | Whether the template is active | Not Null, Default: TRUE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: email_campaigns

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| email_campaign_id | UUID | Unique identifier for the email campaign | Primary Key |
| campaign_id | UUID | Reference to the parent campaign | Foreign Key (campaigns.campaign_id), Not Null |
| template_id | UUID | Reference to the email template | Foreign Key (email_templates.template_id), Not Null |
| name | VARCHAR(255) | Name of the email campaign | Not Null |
| subject | VARCHAR(255) | Subject line of the email | Not Null |
| body | TEXT | Body content of the email | Not Null |
| sender_email | VARCHAR(100) | Sender email address | Not Null |
| sender_name | VARCHAR(100) | Sender name | Not Null |
| scheduled_date | TIMESTAMP | Scheduled date and time for sending | |
| sent_date | TIMESTAMP | Actual date and time when sent | |
| status | VARCHAR(50) | Status of the email campaign (Draft, Scheduled, Sent, etc.) | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: email_campaign_stats

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| stat_id | UUID | Unique identifier for the statistics record | Primary Key |
| email_campaign_id | UUID | Reference to the email campaign | Foreign Key (email_campaigns.email_campaign_id), Not Null |
| sent_count | INTEGER | Number of emails sent | Not Null, Default: 0 |
| delivered_count | INTEGER | Number of emails delivered | Not Null, Default: 0 |
| open_count | INTEGER | Number of emails opened | Not Null, Default: 0 |
| click_count | INTEGER | Number of clicks on links | Not Null, Default: 0 |
| bounce_count | INTEGER | Number of bounced emails | Not Null, Default: 0 |
| unsubscribe_count | INTEGER | Number of unsubscribes | Not Null, Default: 0 |
| complaint_count | INTEGER | Number of complaints | Not Null, Default: 0 |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

## Support Management

### Table: case_priorities

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| priority_id | UUID | Unique identifier for the case priority | Primary Key |
| name | VARCHAR(50) | Name of the priority (High, Medium, Low, etc.) | Not Null, Unique |
| description | TEXT | Description of the priority | |
| color | VARCHAR(7) | Color code for visual representation | |
| order_index | INTEGER | Order index for sorting priorities | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: case_statuses

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| status_id | UUID | Unique identifier for the case status | Primary Key |
| name | VARCHAR(50) | Name of the status (New, In Progress, Resolved, etc.) | Not Null, Unique |
| description | TEXT | Description of the status | |
| is_closed | BOOLEAN | Whether this status indicates a closed case | Not Null, Default: FALSE |
| order_index | INTEGER | Order index for sorting statuses | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: case_types

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| type_id | UUID | Unique identifier for the case type | Primary Key |
| name | VARCHAR(100) | Name of the type (Question, Problem, Feature Request, etc.) | Not Null, Unique |
| description | TEXT | Description of the type | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: cases

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| case_id | UUID | Unique identifier for the case | Primary Key |
| subject | VARCHAR(255) | Subject of the case | Not Null |
| description | TEXT | Description of the case | |
| status_id | UUID | Reference to the case status | Foreign Key (case_statuses.status_id), Not Null |
| priority_id | UUID | Reference to the case priority | Foreign Key (case_priorities.priority_id), Not Null |
| type_id | UUID | Reference to the case type | Foreign Key (case_types.type_id) |
| account_id | UUID | Reference to the associated account | Foreign Key (accounts.account_id), Not Null |
| contact_id | UUID | Reference to the contact who reported the case | Foreign Key (contacts.contact_id) |
| owner_id | UUID | Reference to the case owner | Foreign Key (users.user_id) |
| parent_case_id | UUID | Reference to the parent case | Foreign Key (cases.case_id) |
| origin | VARCHAR(50) | Origin of the case (Email, Phone, Web, etc.) | |
| reported_date | TIMESTAMP | Date and time when the case was reported | |
| due_date | TIMESTAMP | Due date for resolution | |
| escalated | BOOLEAN | Whether the case has been escalated | Not Null, Default: FALSE |
| closed_date | TIMESTAMP | Date and time when the case was closed | |
| resolution | TEXT | Resolution description | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: business_hours

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| hours_id | UUID | Unique identifier for the business hours | Primary Key |
| name | VARCHAR(100) | Name of the business hours | Not Null |
| description | TEXT | Description of the business hours | |
| time_zone | VARCHAR(50) | Time zone for the business hours | Not Null |
| monday_start | TIME | Monday start time | |
| monday_end | TIME | Monday end time | |
| tuesday_start | TIME | Tuesday start time | |
| tuesday_end | TIME | Tuesday end time | |
| wednesday_start | TIME | Wednesday start time | |
| wednesday_end | TIME | Wednesday end time | |
| thursday_start | TIME | Thursday start time | |
| thursday_end | TIME | Thursday end time | |
| friday_start | TIME | Friday start time | |
| friday_end | TIME | Friday end time | |
| saturday_start | TIME | Saturday start time | |
| saturday_end | TIME | Saturday end time | |
| sunday_start | TIME | Sunday start time | |
| sunday_end | TIME | Sunday end time | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: sla_policies

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| policy_id | UUID | Unique identifier for the SLA policy | Primary Key |
| name | VARCHAR(100) | Name of the SLA policy | Not Null |
| description | TEXT | Description of the SLA policy | |
| business_hours_id | UUID | Reference to the business hours | Foreign Key (business_hours.hours_id), Not Null |
| is_active | BOOLEAN | Whether the SLA policy is active | Not Null, Default: TRUE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: sla_terms

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| term_id | UUID | Unique identifier for the SLA term | Primary Key |
| policy_id | UUID | Reference to the SLA policy | Foreign Key (sla_policies.policy_id), Not Null |
| case_priority_id | UUID | Reference to the case priority | Foreign Key (case_priorities.priority_id), Not Null |
| response_time_hours | INTEGER | Response time in hours | Not Null |
| resolution_time_hours | INTEGER | Resolution time in hours | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: case_slas

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| case_id | UUID | Reference to the case | Foreign Key (cases.case_id), Not Null |
| policy_id | UUID | Reference to the SLA policy | Foreign Key (sla_policies.policy_id), Not Null |
| response_deadline | TIMESTAMP | Deadline for first response | |
| resolution_deadline | TIMESTAMP | Deadline for resolution | |
| response_met | BOOLEAN | Whether the response deadline was met | |
| resolution_met | BOOLEAN | Whether the resolution deadline was met | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: case_comments

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| comment_id | UUID | Unique identifier for the case comment | Primary Key |
| case_id | UUID | Reference to the case | Foreign Key (cases.case_id), Not Null |
| user_id | UUID | Reference to the user who made the comment | Foreign Key (users.user_id), Not Null |
| body | TEXT | Content of the comment | Not Null |
| is_public | BOOLEAN | Whether the comment is visible to customers | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: case_activities

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| activity_id | UUID | Unique identifier for the case activity | Primary Key |
| case_id | UUID | Reference to the case | Foreign Key (cases.case_id), Not Null |
| user_id | UUID | Reference to the user who performed the activity | Foreign Key (users.user_id), Not Null |
| activity_type | VARCHAR(50) | Type of activity (Email, Call, Meeting, etc.) | Not Null |
| description | TEXT | Description of the activity | |
| activity_date | TIMESTAMP | Date and time of the activity | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

### Table: case_team_members

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| case_id | UUID | Reference to the case | Foreign Key (cases.case_id), Not Null |
| user_id | UUID | Reference to the team member | Foreign Key (users.user_id), Not Null |
| role | VARCHAR(100) | Role of the team member in the case | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between cases and users.*

## Knowledge Base

### Table: kb_categories

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| category_id | UUID | Unique identifier for the knowledge base category | Primary Key |
| name | VARCHAR(100) | Name of the category | Not Null |
| description | TEXT | Description of the category | |
| parent_category_id | UUID | Reference to the parent category | Foreign Key (kb_categories.category_id) |
| order_index | INTEGER | Order index for sorting categories | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: kb_articles

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| article_id | UUID | Unique identifier for the knowledge base article | Primary Key |
| title | VARCHAR(255) | Title of the article | Not Null |
| body | TEXT | Content of the article | Not Null |
| summary | TEXT | Summary of the article | |
| keywords | TEXT | Keywords for search | |
| author_id | UUID | Reference to the author | Foreign Key (users.user_id), Not Null |
| category_id | UUID | Reference to the category | Foreign Key (kb_categories.category_id), Not Null |
| status | VARCHAR(20) | Status of the article (Draft, Published, Archived, etc.) | Not Null |
| views_count | INTEGER | Number of views | Not Null, Default: 0 |
| rating | DECIMAL(3,2) | Average rating of the article | |
| published_date | TIMESTAMP | Date and time when the article was published | |
| expiry_date | TIMESTAMP | Date and time when the article expires | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: kb_article_feedback

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| feedback_id | UUID | Unique identifier for the feedback | Primary Key |
| article_id | UUID | Reference to the article | Foreign Key (kb_articles.article_id), Not Null |
| user_id | UUID | Reference to the user who provided feedback | Foreign Key (users.user_id) |
| rating | INTEGER | Rating given to the article (1-5) | Not Null |
| comments | TEXT | Comments provided with the feedback | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

### Table: case_kb_articles

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| case_id | UUID | Reference to the case | Foreign Key (cases.case_id), Not Null |
| article_id | UUID | Reference to the knowledge base article | Foreign Key (kb_articles.article_id), Not Null |
| relevance | INTEGER | Relevance score (1-100) | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between cases and knowledge base articles.*

## Financial Management

### Table: currencies

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| currency_id | UUID | Unique identifier for the currency | Primary Key |
| code | VARCHAR(3) | ISO currency code | Not Null, Unique |
| name | VARCHAR(50) | Name of the currency | Not Null |
| symbol | VARCHAR(10) | Symbol of the currency | Not Null |
| exchange_rate | DECIMAL(10,6) | Exchange rate to the base currency | Not Null |
| is_base_currency | BOOLEAN | Whether this is the base currency | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: fiscal_years

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| fiscal_year_id | UUID | Unique identifier for the fiscal year | Primary Key |
| name | VARCHAR(50) | Name of the fiscal year | Not Null |
| start_date | DATE | Start date of the fiscal year | Not Null |
| end_date | DATE | End date of the fiscal year | Not Null |
| is_closed | BOOLEAN | Whether the fiscal year is closed | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: invoice_statuses

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| status_id | UUID | Unique identifier for the invoice status | Primary Key |
| name | VARCHAR(50) | Name of the status (Draft, Sent, Paid, etc.) | Not Null, Unique |
| description | TEXT | Description of the status | |
| is_paid | BOOLEAN | Whether this status indicates a paid invoice | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: invoices

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| invoice_id | UUID | Unique identifier for the invoice | Primary Key |
| invoice_number | VARCHAR(50) | Invoice number | Not Null, Unique |
| account_id | UUID | Reference to the account | Foreign Key (accounts.account_id), Not Null |
| contact_id | UUID | Reference to the contact | Foreign Key (contacts.contact_id) |
| opportunity_id | UUID | Reference to the opportunity | Foreign Key (opportunities.opportunity_id) |
| owner_id | UUID | Reference to the invoice owner | Foreign Key (users.user_id), Not Null |
| status_id | UUID | Reference to the invoice status | Foreign Key (invoice_statuses.status_id), Not Null |
| currency_id | UUID | Reference to the currency | Foreign Key (currencies.currency_id), Not Null |
| issue_date | DATE | Date when the invoice was issued | Not Null |
| due_date | DATE | Date when the invoice is due | Not Null |
| payment_terms | VARCHAR(100) | Payment terms of the invoice | |
| subtotal | DECIMAL(18,2) | Subtotal amount | Not Null |
| tax_amount | DECIMAL(18,2) | Tax amount | Not Null, Default: 0 |
| discount_amount | DECIMAL(18,2) | Discount amount | Not Null, Default: 0 |
| total_amount | DECIMAL(18,2) | Total amount | Not Null |
| balance | DECIMAL(18,2) | Remaining balance | Not Null |
| notes | TEXT | Notes or comments | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: invoice_items

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| item_id | UUID | Unique identifier for the invoice item | Primary Key |
| invoice_id | UUID | Reference to the invoice | Foreign Key (invoices.invoice_id), Not Null |
| product_id | UUID | Reference to the product | Foreign Key (products.product_id) |
| description | TEXT | Description of the item | Not Null |
| quantity | DECIMAL(12,2) | Quantity of the item | Not Null |
| unit_price | DECIMAL(18,2) | Unit price of the item | Not Null |
| tax_rate | DECIMAL(5,2) | Tax rate percentage | Not Null, Default: 0 |
| discount_percent | DECIMAL(5,2) | Discount percentage | Not Null, Default: 0 |
| total_price | DECIMAL(18,2) | Total price of the item | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: payment_methods

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| method_id | UUID | Unique identifier for the payment method | Primary Key |
| name | VARCHAR(100) | Name of the payment method (Credit Card, Bank Transfer, etc.) | Not Null, Unique |
| description | TEXT | Description of the payment method | |
| is_active | BOOLEAN | Whether the payment method is active | Not Null, Default: TRUE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: payments

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| payment_id | UUID | Unique identifier for the payment | Primary Key |
| payment_number | VARCHAR(50) | Payment number | Not Null, Unique |
| account_id | UUID | Reference to the account | Foreign Key (accounts.account_id), Not Null |
| method_id | UUID | Reference to the payment method | Foreign Key (payment_methods.method_id), Not Null |
| currency_id | UUID | Reference to the currency | Foreign Key (currencies.currency_id), Not Null |
| amount | DECIMAL(18,2) | Payment amount | Not Null |
| payment_date | DATE | Date of the payment | Not Null |
| reference_number | VARCHAR(100) | Reference number for the payment | |
| notes | TEXT | Notes or comments | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: invoice_payments

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| invoice_id | UUID | Reference to the invoice | Foreign Key (invoices.invoice_id), Not Null |
| payment_id | UUID | Reference to the payment | Foreign Key (payments.payment_id), Not Null |
| amount_applied | DECIMAL(18,2) | Amount applied to the invoice | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

*Note: This is a junction table implementing a many-to-many relationship between invoices and payments.*

### Table: expense_categories

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| category_id | UUID | Unique identifier for the expense category | Primary Key |
| name | VARCHAR(100) | Name of the category | Not Null, Unique |
| description | TEXT | Description of the category | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: expense_statuses

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| status_id | UUID | Unique identifier for the expense status | Primary Key |
| name | VARCHAR(50) | Name of the status (Submitted, Approved, Rejected, etc.) | Not Null, Unique |
| description | TEXT | Description of the status | |
| is_approved | BOOLEAN | Whether this status indicates an approved expense | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: expenses

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| expense_id | UUID | Unique identifier for the expense | Primary Key |
| description | TEXT | Description of the expense | Not Null |
| category_id | UUID | Reference to the expense category | Foreign Key (expense_categories.category_id), Not Null |
| user_id | UUID | Reference to the user who incurred the expense | Foreign Key (users.user_id), Not Null |
| status_id | UUID | Reference to the expense status | Foreign Key (expense_statuses.status_id), Not Null |
| currency_id | UUID | Reference to the currency | Foreign Key (currencies.currency_id), Not Null |
| amount | DECIMAL(18,2) | Expense amount | Not Null |
| expense_date | DATE | Date of the expense | Not Null |
| reimbursable | BOOLEAN | Whether the expense is reimbursable | Not Null, Default: TRUE |
| reimbursed | BOOLEAN | Whether the expense has been reimbursed | Not Null, Default: FALSE |
| receipt_url | VARCHAR(255) | URL to the receipt image/file | |
| notes | TEXT | Notes or comments | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: gl_accounts

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| account_id | UUID | Unique identifier for the GL account | Primary Key |
| account_number | VARCHAR(20) | Account number | Not Null, Unique |
| name | VARCHAR(100) | Name of the account | Not Null |
| description | TEXT | Description of the account | |
| account_type | VARCHAR(50) | Type of account (Asset, Liability, Equity, Revenue, Expense) | Not Null |
| parent_account_id | UUID | Reference to the parent account | Foreign Key (gl_accounts.account_id) |
| is_active | BOOLEAN | Whether the account is active | Not Null, Default: TRUE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: journal_entries

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| entry_id | UUID | Unique identifier for the journal entry | Primary Key |
| entry_number | VARCHAR(20) | Journal entry number | Not Null, Unique |
| description | TEXT | Description of the journal entry | Not Null |
| entry_date | DATE | Date of the journal entry | Not Null |
| reference | VARCHAR(100) | Reference information | |
| is_posted | BOOLEAN | Whether the journal entry is posted | Not Null, Default: FALSE |
| created_by | UUID | Reference to the user who created the entry | Foreign Key (users.user_id), Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: journal_items

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| item_id | UUID | Unique identifier for the journal item | Primary Key |
| entry_id | UUID | Reference to the journal entry | Foreign Key (journal_entries.entry_id), Not Null |
| account_id | UUID | Reference to the GL account | Foreign Key (gl_accounts.account_id), Not Null |
| description | TEXT | Description of the journal item | |
| debit_amount | DECIMAL(18,2) | Debit amount | Not Null, Default: 0 |
| credit_amount | DECIMAL(18,2) | Credit amount | Not Null, Default: 0 |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

## Workflow Automation

### Table: workflow_rules

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| rule_id | UUID | Unique identifier for the workflow rule | Primary Key |
| name | VARCHAR(100) | Name of the rule | Not Null |
| description | TEXT | Description of the rule | |
| object_type | VARCHAR(50) | Type of object the rule applies to (Lead, Opportunity, etc.) | Not Null |
| trigger_type | VARCHAR(50) | Type of trigger (Create, Update, Delete, etc.) | Not Null |
| trigger_criteria | TEXT | JSON criteria for when the rule should trigger | |
| is_active | BOOLEAN | Whether the rule is active | Not Null, Default: TRUE |
| created_by | UUID | Reference to the user who created the rule | Foreign Key (users.user_id), Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: workflow_actions

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| action_id | UUID | Unique identifier for the workflow action | Primary Key |
| rule_id | UUID | Reference to the workflow rule | Foreign Key (workflow_rules.rule_id), Not Null |
| action_type | VARCHAR(50) | Type of action (Email Alert, Field Update, Task Creation, etc.) | Not Null |
| action_details | TEXT | JSON details of the action to perform | Not Null |
| execution_order | INTEGER | Order in which the action should be executed | Not Null |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: workflow_logs

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| log_id | UUID | Unique identifier for the workflow log | Primary Key |
| rule_id | UUID | Reference to the workflow rule | Foreign Key (workflow_rules.rule_id), Not Null |
| action_id | UUID | Reference to the workflow action | Foreign Key (workflow_actions.action_id) |
| object_id | UUID | ID of the object that triggered the workflow | Not Null |
| status | VARCHAR(20) | Status of the workflow execution (Success, Failed, etc.) | Not Null |
| error_message | TEXT | Error message if the workflow failed | |
| execution_time | INTEGER | Time taken to execute the workflow (in milliseconds) | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

## Notification System

### Table: notification_types

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| type_id | UUID | Unique identifier for the notification type | Primary Key |
| name | VARCHAR(100) | Name of the notification type | Not Null, Unique |
| description | TEXT | Description of the notification type | |
| icon | VARCHAR(50) | Icon to display with the notification | |
| color | VARCHAR(7) | Color code for the notification | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

### Table: notifications

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| notification_id | UUID | Unique identifier for the notification | Primary Key |
| user_id | UUID | Reference to the user receiving the notification | Foreign Key (users.user_id), Not Null |
| type_id | UUID | Reference to the notification type | Foreign Key (notification_types.type_id), Not Null |
| title | VARCHAR(255) | Title of the notification | Not Null |
| message | TEXT | Message content of the notification | Not Null |
| link | VARCHAR(255) | Link to navigate to when the notification is clicked | |
| is_read | BOOLEAN | Whether the notification has been read | Not Null, Default: FALSE |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Date and time when the record was last updated | |

## Audit Logging

### Table: audit_logs

| Column | Data Type | Description | Constraints |
|--------|-----------|-------------|-------------|
| log_id | UUID | Unique identifier for the audit log | Primary Key |
| user_id | UUID | Reference to the user who performed the action | Foreign Key (users.user_id) |
| object_type | VARCHAR(50) | Type of object that was modified | Not Null |
| object_id | UUID | ID of the object that was modified | Not Null |
| action | VARCHAR(20) | Action performed (Create, Update, Delete, etc.) | Not Null |
| old_values | TEXT | JSON representation of the old values | |
| new_values | TEXT | JSON representation of the new values | |
| ip_address | VARCHAR(45) | IP address from which the action was performed | |
| user_agent | TEXT | User agent information | |
| created_at | TIMESTAMP | Date and time when the record was created | Not Null, Default: CURRENT_TIMESTAMP |

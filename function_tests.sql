-- Function Tests for Custorix CRM Database
-- This file contains tests to validate the behavior and correctness of database functions

-- Load pgTAP extension
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Begin transaction
BEGIN;

-- Plan the tests
SELECT plan(50);

-- Test FT-U-001: User Creation Function
SELECT has_function('custorix', 'create_user', ARRAY['varchar', 'varchar', 'varchar', 'varchar', 'varchar', 'uuid', 'uuid'], 'Function create_user should exist');

-- Test function behavior
SELECT lives_ok(
    $$SELECT custorix.create_user(
        'testuser', 
        'test@example.com', 
        'password123', 
        'Test', 
        'User', 
        (SELECT role_id FROM custorix.roles WHERE name = 'User'),
        (SELECT department_id FROM custorix.departments WHERE name = 'Sales')
    )$$,
    'create_user function should execute without errors'
);

SELECT results_eq(
    $$SELECT username, email, first_name, last_name FROM custorix.users WHERE username = 'testuser'$$,
    $$VALUES ('testuser', 'test@example.com', 'Test', 'User')$$,
    'create_user function should create user with correct data'
);

-- Test FT-U-002: Password Hashing Function
SELECT has_function('custorix', 'hash_password', ARRAY['varchar'], 'Function hash_password should exist');

-- Test function behavior
SELECT isnt(
    custorix.hash_password('password123'),
    'password123',
    'hash_password function should not return plain text password'
);

SELECT is_empty(
    $$SELECT 1 WHERE custorix.hash_password('password123') = custorix.hash_password('password123')$$,
    'hash_password function should generate different hashes for the same password (due to salt)'
);

-- Test FT-U-003: User Authentication Function
SELECT has_function('custorix', 'authenticate_user', ARRAY['varchar', 'varchar'], 'Function authenticate_user should exist');

-- Test function behavior
SELECT results_eq(
    $$SELECT custorix.authenticate_user('testuser', 'password123')$$,
    $$SELECT user_id FROM custorix.users WHERE username = 'testuser'$$,
    'authenticate_user function should return user_id for correct credentials'
);

SELECT is_null(
    $$SELECT custorix.authenticate_user('testuser', 'wrongpassword')$$,
    'authenticate_user function should return NULL for incorrect password'
);

SELECT is_null(
    $$SELECT custorix.authenticate_user('nonexistentuser', 'password123')$$,
    'authenticate_user function should return NULL for nonexistent user'
);

-- Test FT-U-004: Permission Check Function
SELECT has_function('custorix', 'user_has_permission', ARRAY['uuid', 'varchar'], 'Function user_has_permission should exist');

-- Test function behavior
SELECT ok(
    $$SELECT custorix.user_has_permission(
        (SELECT user_id FROM custorix.users WHERE username = 'admin'),
        'view_users'
    )$$,
    'user_has_permission function should return true for admin with view_users permission'
);

SELECT ok(
    NOT custorix.user_has_permission(
        (SELECT user_id FROM custorix.users WHERE username = 'testuser'),
        'admin_panel'
    ),
    'user_has_permission function should return false for regular user without admin_panel permission'
);

-- Test FT-D-001: Lead Conversion Function
SELECT has_function('custorix', 'convert_lead', ARRAY['uuid'], 'Function convert_lead should exist');

-- Test function behavior
SELECT lives_ok(
    $$SELECT custorix.convert_lead(
        (SELECT lead_id FROM custorix.leads WHERE email = 'lead@example.com')
    )$$,
    'convert_lead function should execute without errors'
);

SELECT isnt_empty(
    $$SELECT 1 FROM custorix.accounts a
      JOIN custorix.contacts c ON a.account_id = c.account_id
      JOIN custorix.opportunities o ON a.account_id = o.account_id
      JOIN custorix.leads l ON l.email = c.email
      WHERE l.email = 'lead@example.com'
      AND l.status_id = (SELECT status_id FROM custorix.lead_statuses WHERE name = 'Converted')$$,
    'convert_lead function should create account, contact, opportunity and update lead status'
);

-- Test FT-D-002: Opportunity Closing Function
SELECT has_function('custorix', 'close_opportunity', ARRAY['uuid', 'boolean', 'text'], 'Function close_opportunity should exist');

-- Test function behavior
SELECT lives_ok(
    $$SELECT custorix.close_opportunity(
        (SELECT opportunity_id FROM custorix.opportunities WHERE name = 'Test Opportunity'),
        TRUE,
        'Closed successfully'
    )$$,
    'close_opportunity function should execute without errors'
);

SELECT results_eq(
    $$SELECT stage_id, closed_date IS NOT NULL FROM custorix.opportunities WHERE name = 'Test Opportunity'$$,
    $$SELECT stage_id, TRUE FROM custorix.opportunity_stages WHERE is_closed = TRUE AND is_won = TRUE LIMIT 1$$,
    'close_opportunity function should update stage and set closed_date when won=TRUE'
);

-- Test FT-C-001: Opportunity Value Calculation Function
SELECT has_function('custorix', 'calculate_opportunity_value', ARRAY['uuid'], 'Function calculate_opportunity_value should exist');

-- Test function behavior
SELECT results_eq(
    $$SELECT custorix.calculate_opportunity_value(
        (SELECT opportunity_id FROM custorix.opportunities WHERE name = 'Test Opportunity')
    )$$,
    $$SELECT SUM(total_price) FROM custorix.opportunity_products 
      WHERE opportunity_id = (SELECT opportunity_id FROM custorix.opportunities WHERE name = 'Test Opportunity')$$,
    'calculate_opportunity_value function should return sum of opportunity product prices'
);

-- Test FT-C-004: SLA Deadline Calculation Function
SELECT has_function('custorix', 'calculate_sla_deadlines', ARRAY['uuid'], 'Function calculate_sla_deadlines should exist');

-- Test function behavior
SELECT lives_ok(
    $$SELECT custorix.calculate_sla_deadlines(
        (SELECT case_id FROM custorix.cases WHERE subject = 'Test Case')
    )$$,
    'calculate_sla_deadlines function should execute without errors'
);

SELECT isnt_empty(
    $$SELECT 1 FROM custorix.case_slas 
      WHERE case_id = (SELECT case_id FROM custorix.cases WHERE subject = 'Test Case')
      AND response_deadline IS NOT NULL
      AND resolution_deadline IS NOT NULL$$,
    'calculate_sla_deadlines function should set response and resolution deadlines'
);

-- Finish the tests and clean up
SELECT * FROM finish();
ROLLBACK;

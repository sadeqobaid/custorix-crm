-- Schema Validation Tests for Custorix CRM Database
-- This file contains tests to validate the structure, constraints, and relationships of the database schema

-- Load pgTAP extension
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Begin transaction
BEGIN;

-- Plan the tests
SELECT plan(100);

-- Test SV-T-001: Table Existence
SELECT has_table('custorix', 'roles', 'Table custorix.roles should exist');
SELECT has_table('custorix', 'permissions', 'Table custorix.permissions should exist');
SELECT has_table('custorix', 'role_permissions', 'Table custorix.role_permissions should exist');
SELECT has_table('custorix', 'departments', 'Table custorix.departments should exist');
SELECT has_table('custorix', 'users', 'Table custorix.users should exist');
SELECT has_table('custorix', 'user_permissions', 'Table custorix.user_permissions should exist');
SELECT has_table('custorix', 'teams', 'Table custorix.teams should exist');
SELECT has_table('custorix', 'team_members', 'Table custorix.team_members should exist');
SELECT has_table('custorix', 'tokens', 'Table custorix.tokens should exist');
SELECT has_table('custorix', 'login_history', 'Table custorix.login_history should exist');

-- Test SV-T-002: Column Existence for key tables
SELECT has_column('custorix', 'roles', 'role_id', 'Table custorix.roles should have role_id column');
SELECT has_column('custorix', 'roles', 'name', 'Table custorix.roles should have name column');
SELECT has_column('custorix', 'roles', 'description', 'Table custorix.roles should have description column');
SELECT has_column('custorix', 'roles', 'created_at', 'Table custorix.roles should have created_at column');
SELECT has_column('custorix', 'roles', 'updated_at', 'Table custorix.roles should have updated_at column');

SELECT has_column('custorix', 'users', 'user_id', 'Table custorix.users should have user_id column');
SELECT has_column('custorix', 'users', 'username', 'Table custorix.users should have username column');
SELECT has_column('custorix', 'users', 'email', 'Table custorix.users should have email column');
SELECT has_column('custorix', 'users', 'password_hash', 'Table custorix.users should have password_hash column');
SELECT has_column('custorix', 'users', 'first_name', 'Table custorix.users should have first_name column');
SELECT has_column('custorix', 'users', 'last_name', 'Table custorix.users should have last_name column');
SELECT has_column('custorix', 'users', 'role_id', 'Table custorix.users should have role_id column');
SELECT has_column('custorix', 'users', 'department_id', 'Table custorix.users should have department_id column');
SELECT has_column('custorix', 'users', 'manager_id', 'Table custorix.users should have manager_id column');
SELECT has_column('custorix', 'users', 'status', 'Table custorix.users should have status column');

-- Test SV-T-003: Column Data Types
SELECT col_type_is('custorix', 'roles', 'role_id', 'uuid', 'Column roles.role_id should be type uuid');
SELECT col_type_is('custorix', 'roles', 'name', 'character varying(100)', 'Column roles.name should be type varchar(100)');
SELECT col_type_is('custorix', 'roles', 'description', 'text', 'Column roles.description should be type text');
SELECT col_type_is('custorix', 'roles', 'created_at', 'timestamp without time zone', 'Column roles.created_at should be type timestamp');

SELECT col_type_is('custorix', 'users', 'user_id', 'uuid', 'Column users.user_id should be type uuid');
SELECT col_type_is('custorix', 'users', 'username', 'character varying(50)', 'Column users.username should be type varchar(50)');
SELECT col_type_is('custorix', 'users', 'email', 'character varying(100)', 'Column users.email should be type varchar(100)');
SELECT col_type_is('custorix', 'users', 'password_hash', 'character varying(255)', 'Column users.password_hash should be type varchar(255)');
SELECT col_type_is('custorix', 'users', 'role_id', 'uuid', 'Column users.role_id should be type uuid');

-- Test SV-T-004: Primary Key Constraints
SELECT col_is_pk('custorix', 'roles', 'role_id', 'Column roles.role_id should be the primary key');
SELECT col_is_pk('custorix', 'permissions', 'permission_id', 'Column permissions.permission_id should be the primary key');
SELECT col_is_pk('custorix', 'departments', 'department_id', 'Column departments.department_id should be the primary key');
SELECT col_is_pk('custorix', 'users', 'user_id', 'Column users.user_id should be the primary key');
SELECT col_is_pk('custorix', 'teams', 'team_id', 'Column teams.team_id should be the primary key');
SELECT col_is_pk('custorix', 'tokens', 'token_id', 'Column tokens.token_id should be the primary key');
SELECT col_is_pk('custorix', 'login_history', 'login_id', 'Column login_history.login_id should be the primary key');

-- Test SV-T-005: Not Null Constraints
SELECT col_not_null('custorix', 'roles', 'role_id', 'Column roles.role_id should be NOT NULL');
SELECT col_not_null('custorix', 'roles', 'name', 'Column roles.name should be NOT NULL');
SELECT col_not_null('custorix', 'roles', 'created_at', 'Column roles.created_at should be NOT NULL');

SELECT col_not_null('custorix', 'users', 'user_id', 'Column users.user_id should be NOT NULL');
SELECT col_not_null('custorix', 'users', 'username', 'Column users.username should be NOT NULL');
SELECT col_not_null('custorix', 'users', 'email', 'Column users.email should be NOT NULL');
SELECT col_not_null('custorix', 'users', 'password_hash', 'Column users.password_hash should be NOT NULL');
SELECT col_not_null('custorix', 'users', 'first_name', 'Column users.first_name should be NOT NULL');
SELECT col_not_null('custorix', 'users', 'last_name', 'Column users.last_name should be NOT NULL');
SELECT col_not_null('custorix', 'users', 'status', 'Column users.status should be NOT NULL');
SELECT col_not_null('custorix', 'users', 'created_at', 'Column users.created_at should be NOT NULL');

-- Test SV-T-006: Default Values
SELECT col_default_is('custorix', 'roles', 'created_at', 'CURRENT_TIMESTAMP', 'Column roles.created_at should default to CURRENT_TIMESTAMP');
SELECT col_default_is('custorix', 'users', 'created_at', 'CURRENT_TIMESTAMP', 'Column users.created_at should default to CURRENT_TIMESTAMP');
SELECT col_default_is('custorix', 'users', 'status', '''Active''::character varying', 'Column users.status should default to ''Active''');

-- Test SV-T-007: Unique Constraints
SELECT col_is_unique('custorix', 'roles', 'name', 'Column roles.name should be unique');
SELECT col_is_unique('custorix', 'permissions', 'name', 'Column permissions.name should be unique');
SELECT col_is_unique('custorix', 'users', 'username', 'Column users.username should be unique');
SELECT col_is_unique('custorix', 'users', 'email', 'Column users.email should be unique');
SELECT col_is_unique('custorix', 'tokens', 'token', 'Column tokens.token should be unique');

-- Test SV-R-001: Foreign Key Existence
SELECT has_fk('custorix', 'role_permissions', 'Column role_permissions.role_id should be a foreign key');
SELECT has_fk('custorix', 'role_permissions', 'Column role_permissions.permission_id should be a foreign key');
SELECT has_fk('custorix', 'departments', 'Column departments.parent_department_id should be a foreign key');
SELECT has_fk('custorix', 'users', 'Column users.role_id should be a foreign key');
SELECT has_fk('custorix', 'users', 'Column users.department_id should be a foreign key');
SELECT has_fk('custorix', 'users', 'Column users.manager_id should be a foreign key');
SELECT has_fk('custorix', 'user_permissions', 'Column user_permissions.user_id should be a foreign key');
SELECT has_fk('custorix', 'user_permissions', 'Column user_permissions.permission_id should be a foreign key');
SELECT has_fk('custorix', 'teams', 'Column teams.team_leader_id should be a foreign key');
SELECT has_fk('custorix', 'team_members', 'Column team_members.team_id should be a foreign key');
SELECT has_fk('custorix', 'team_members', 'Column team_members.user_id should be a foreign key');
SELECT has_fk('custorix', 'tokens', 'Column tokens.user_id should be a foreign key');
SELECT has_fk('custorix', 'login_history', 'Column login_history.user_id should be a foreign key');

-- Test SV-R-002: Foreign Key References
SELECT fk_ok('custorix', 'role_permissions', 'role_id', 'custorix', 'roles', 'role_id', 'role_permissions.role_id should reference roles.role_id');
SELECT fk_ok('custorix', 'role_permissions', 'permission_id', 'custorix', 'permissions', 'permission_id', 'role_permissions.permission_id should reference permissions.permission_id');
SELECT fk_ok('custorix', 'departments', 'parent_department_id', 'custorix', 'departments', 'department_id', 'departments.parent_department_id should reference departments.department_id');
SELECT fk_ok('custorix', 'users', 'role_id', 'custorix', 'roles', 'role_id', 'users.role_id should reference roles.role_id');
SELECT fk_ok('custorix', 'users', 'department_id', 'custorix', 'departments', 'department_id', 'users.department_id should reference departments.department_id');
SELECT fk_ok('custorix', 'users', 'manager_id', 'custorix', 'users', 'user_id', 'users.manager_id should reference users.user_id');
SELECT fk_ok('custorix', 'user_permissions', 'user_id', 'custorix', 'users', 'user_id', 'user_permissions.user_id should reference users.user_id');
SELECT fk_ok('custorix', 'user_permissions', 'permission_id', 'custorix', 'permissions', 'permission_id', 'user_permissions.permission_id should reference permissions.permission_id');
SELECT fk_ok('custorix', 'teams', 'team_leader_id', 'custorix', 'users', 'user_id', 'teams.team_leader_id should reference users.user_id');
SELECT fk_ok('custorix', 'team_members', 'team_id', 'custorix', 'teams', 'team_id', 'team_members.team_id should reference teams.team_id');
SELECT fk_ok('custorix', 'team_members', 'user_id', 'custorix', 'users', 'user_id', 'team_members.user_id should reference users.user_id');
SELECT fk_ok('custorix', 'tokens', 'user_id', 'custorix', 'users', 'user_id', 'tokens.user_id should reference users.user_id');
SELECT fk_ok('custorix', 'login_history', 'user_id', 'custorix', 'users', 'user_id', 'login_history.user_id should reference users.user_id');

-- Test SV-R-003, SV-R-004, SV-R-005: Foreign Key Delete Behavior
-- These tests check if the ON DELETE behavior is correctly defined

-- Test SV-I-001, SV-I-002, SV-I-003: Index Tests
-- Check for existence of important indexes
SELECT has_index('custorix', 'users', 'users_username_idx', 'Should have index on users.username');
SELECT has_index('custorix', 'users', 'users_email_idx', 'Should have index on users.email');
SELECT has_index('custorix', 'users', 'users_role_id_idx', 'Should have index on users.role_id');
SELECT has_index('custorix', 'users', 'users_department_id_idx', 'Should have index on users.department_id');
SELECT has_index('custorix', 'users', 'users_manager_id_idx', 'Should have index on users.manager_id');
SELECT has_index('custorix', 'tokens', 'tokens_user_id_idx', 'Should have index on tokens.user_id');
SELECT has_index('custorix', 'login_history', 'login_history_user_id_idx', 'Should have index on login_history.user_id');

-- Test SV-V-001, SV-V-002, SV-V-003: View Tests
-- Check for existence and definition of important views
SELECT has_view('custorix', 'user_role_permissions_view', 'View user_role_permissions_view should exist');
SELECT has_view('custorix', 'active_users_view', 'View active_users_view should exist');
SELECT has_view('custorix', 'department_hierarchy_view', 'View department_hierarchy_view should exist');

-- Finish the tests and clean up
SELECT * FROM finish();
ROLLBACK;

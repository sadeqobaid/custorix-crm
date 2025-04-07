# Database Security Configuration for Custorix CRM

This document provides comprehensive guidance on configuring security for the Custorix CRM PostgreSQL database. It covers authentication, authorization, encryption, network security, and audit logging.

## Table of Contents

1. [Authentication Configuration](#authentication-configuration)
2. [Role-Based Access Control](#role-based-access-control)
3. [Data Encryption](#data-encryption)
4. [Network Security](#network-security)
5. [Audit Logging](#audit-logging)
6. [Security Monitoring](#security-monitoring)
7. [Compliance Considerations](#compliance-considerations)

## Authentication Configuration

### Password Policies

Configure strong password policies in PostgreSQL:

```sql
-- Create a password check function
CREATE OR REPLACE FUNCTION custorix.check_password_strength(username text, password text, password_type text)
RETURNS boolean AS $$
DECLARE
  complexity_check boolean;
BEGIN
  -- Check password complexity (at least 8 chars, with uppercase, lowercase, number, and special char)
  complexity_check := (password ~ '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$');
  
  -- Ensure password doesn't contain username
  IF password ILIKE '%' || username || '%' THEN
    RETURN false;
  END IF;
  
  RETURN complexity_check;
END;
$$ LANGUAGE plpgsql;

-- Set password encryption to scram-sha-256 (more secure than md5)
ALTER SYSTEM SET password_encryption = 'scram-sha-256';

-- Set authentication parameters
ALTER SYSTEM SET authentication_timeout = '1min';
```

### Connection Security

Configure connection security parameters:

```sql
-- Limit failed login attempts
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET superuser_reserved_connections = 3;

-- Set SSL parameters
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = 'server.crt';
ALTER SYSTEM SET ssl_key_file = 'server.key';
ALTER SYSTEM SET ssl_ca_file = 'root.crt';
```

### SSL Certificate Setup

Generate and configure SSL certificates:

```bash
# Generate self-signed certificate (for production, use certificates from a trusted CA)
cd /etc/postgresql/14/main
sudo openssl req -new -x509 -days 365 -nodes -text -out server.crt \
  -keyout server.key -subj "/CN=db.custorix.com"
sudo chmod 600 server.key
sudo chown postgres:postgres server.key server.crt

# Restart PostgreSQL to apply SSL settings
sudo systemctl restart postgresql
```

## Role-Based Access Control

### Database Roles

Create roles with appropriate privileges:

```sql
-- Create application roles
CREATE ROLE custorix_app_user WITH LOGIN PASSWORD 'strong_password_here';
CREATE ROLE custorix_read_only WITH LOGIN PASSWORD 'strong_password_here';
CREATE ROLE custorix_admin WITH LOGIN PASSWORD 'strong_password_here';
CREATE ROLE custorix_backup WITH LOGIN PASSWORD 'strong_password_here';

-- Grant appropriate privileges
GRANT CONNECT ON DATABASE custorix TO custorix_app_user;
GRANT USAGE ON SCHEMA custorix TO custorix_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA custorix TO custorix_app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA custorix TO custorix_app_user;

-- Read-only role
GRANT CONNECT ON DATABASE custorix TO custorix_read_only;
GRANT USAGE ON SCHEMA custorix TO custorix_read_only;
GRANT SELECT ON ALL TABLES IN SCHEMA custorix TO custorix_read_only;

-- Admin role
GRANT custorix_app_user TO custorix_admin;
GRANT CREATE, USAGE ON SCHEMA custorix TO custorix_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA custorix TO custorix_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA custorix TO custorix_admin;

-- Backup role
GRANT CONNECT ON DATABASE custorix TO custorix_backup;
GRANT USAGE ON SCHEMA custorix TO custorix_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA custorix TO custorix_backup;
```

### Default Privileges for New Objects

Set default privileges for new objects:

```sql
-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA custorix
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO custorix_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA custorix
GRANT SELECT ON TABLES TO custorix_read_only;

ALTER DEFAULT PRIVILEGES IN SCHEMA custorix
GRANT ALL ON TABLES TO custorix_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA custorix
GRANT SELECT ON TABLES TO custorix_backup;

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA custorix
GRANT USAGE ON SEQUENCES TO custorix_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA custorix
GRANT ALL ON SEQUENCES TO custorix_admin;
```

### Row-Level Security

Implement row-level security for multi-tenant isolation:

```sql
-- Enable row-level security on tables
ALTER TABLE custorix.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custorix.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custorix.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE custorix.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE custorix.cases ENABLE ROW LEVEL SECURITY;
-- Continue for other tables that need RLS

-- Create policies for tenant isolation
CREATE POLICY tenant_isolation_accounts ON custorix.accounts
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_contacts ON custorix.contacts
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_opportunities ON custorix.opportunities
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Continue for other tables

-- Create policies for data ownership
CREATE POLICY owner_access_accounts ON custorix.accounts
    USING (owner_id = current_setting('app.current_user_id')::uuid);

-- Create bypass policy for admin users
CREATE POLICY admin_bypass_accounts ON custorix.accounts
    USING (pg_has_role(current_user, 'custorix_admin', 'member'));
```

## Data Encryption

### Transparent Data Encryption

Configure disk-level encryption:

```bash
# For Linux systems using LUKS encryption
sudo cryptsetup luksFormat /dev/sdb
sudo cryptsetup open /dev/sdb custorix_encrypted
sudo mkfs.ext4 /dev/mapper/custorix_encrypted
sudo mount /dev/mapper/custorix_encrypted /var/lib/postgresql/14/main
```

### Column-Level Encryption

Implement column-level encryption for sensitive data:

```sql
-- Create encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to encrypt sensitive data
CREATE OR REPLACE FUNCTION custorix.encrypt_sensitive_data(data text, key text)
RETURNS bytea AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrypt sensitive data
CREATE OR REPLACE FUNCTION custorix.decrypt_sensitive_data(encrypted_data bytea, key text)
RETURNS text AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data, key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example of using encryption for credit card data
ALTER TABLE custorix.payment_methods 
ADD COLUMN encrypted_card_number bytea,
ADD COLUMN encrypted_cvv bytea;

-- Remove plaintext columns if they exist
ALTER TABLE custorix.payment_methods 
DROP COLUMN IF EXISTS card_number,
DROP COLUMN IF EXISTS cvv;
```

## Network Security

### Host-Based Access Control

Configure `pg_hba.conf` for host-based authentication:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   custorix        custorix_app_user                       scram-sha-256
local   custorix        custorix_admin                          scram-sha-256

# Allow application servers
host    custorix        custorix_app_user  10.0.0.0/24          scram-sha-256+cert
host    custorix        custorix_admin     10.0.0.0/24          scram-sha-256+cert

# Allow backup server
host    custorix        custorix_backup    10.0.0.5/32          scram-sha-256+cert

# Deny all other connections
host    all             all               0.0.0.0/0             reject
```

### Firewall Configuration

Configure firewall rules to restrict database access:

```bash
# Allow only specific IPs to connect to PostgreSQL
sudo ufw allow from 10.0.0.0/24 to any port 5432
sudo ufw allow from 10.0.0.5 to any port 5432

# Deny all other connections to PostgreSQL port
sudo ufw deny 5432

# Enable the firewall
sudo ufw enable
```

## Audit Logging

### PostgreSQL Audit Logging

Configure PostgreSQL's built-in logging:

```sql
-- Set logging parameters
ALTER SYSTEM SET log_destination = 'csvlog';
ALTER SYSTEM SET logging_collector = on;
ALTER SYSTEM SET log_directory = 'pg_log';
ALTER SYSTEM SET log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log';
ALTER SYSTEM SET log_truncate_on_rotation = off;
ALTER SYSTEM SET log_rotation_age = '1d';
ALTER SYSTEM SET log_rotation_size = '100MB';

-- Set what to log
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log statements taking more than 1 second
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_line_prefix = '%m [%p] %q%u@%d ';
ALTER SYSTEM SET log_statement = 'ddl'; -- Log all DDL statements
```

### Application-Level Audit Logging

Implement triggers for application-level audit logging:

```sql
-- Create audit log table if not exists
CREATE TABLE IF NOT EXISTS custorix.audit_logs (
    audit_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    action varchar(50) NOT NULL,
    object_type varchar(100) NOT NULL,
    object_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address varchar(45),
    user_agent text,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_object ON custorix.audit_logs(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON custorix.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON custorix.audit_logs(created_at);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION custorix.audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    old_row_data jsonb;
    new_row_data jsonb;
BEGIN
    IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        old_row_data = to_jsonb(OLD);
    END IF;
    
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        new_row_data = to_jsonb(NEW);
    END IF;
    
    INSERT INTO custorix.audit_logs(
        user_id,
        action,
        object_type,
        object_id,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        NULLIF(current_setting('app.current_user_id', true), '')::uuid,
        TG_OP,
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN old_row_data->>'user_id'
            ELSE new_row_data->>'user_id'
        END::uuid,
        old_row_data,
        new_row_data,
        NULLIF(current_setting('app.client_ip', true), ''),
        NULLIF(current_setting('app.user_agent', true), '')
    );
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_trigger_users
AFTER INSERT OR UPDATE OR DELETE ON custorix.users
FOR EACH ROW EXECUTE FUNCTION custorix.audit_trigger_func();

CREATE TRIGGER audit_trigger_accounts
AFTER INSERT OR UPDATE OR DELETE ON custorix.accounts
FOR EACH ROW EXECUTE FUNCTION custorix.audit_trigger_func();

-- Continue for other tables that need auditing
```

## Security Monitoring

### Security Event Monitoring

Create views for security monitoring:

```sql
-- Create view for failed login attempts
CREATE OR REPLACE VIEW custorix.failed_login_attempts AS
SELECT
    user_id,
    ip_address,
    user_agent,
    COUNT(*) as attempt_count,
    MIN(created_at) as first_attempt,
    MAX(created_at) as last_attempt
FROM
    custorix.login_history
WHERE
    status = 'Failed'
    AND created_at > (CURRENT_TIMESTAMP - INTERVAL '24 hours')
GROUP BY
    user_id, ip_address, user_agent
HAVING
    COUNT(*) >= 3;

-- Create view for suspicious activities
CREATE OR REPLACE VIEW custorix.suspicious_activities AS
SELECT
    a.audit_id,
    a.user_id,
    u.username,
    a.action,
    a.object_type,
    a.object_id,
    a.ip_address,
    a.created_at
FROM
    custorix.audit_logs a
JOIN
    custorix.users u ON a.user_id = u.user_id
WHERE
    (a.action = 'DELETE' AND a.object_type IN ('accounts', 'opportunities', 'invoices'))
    OR (a.action = 'UPDATE' AND a.object_type = 'users' AND a.old_values->>'role_id' != a.new_values->>'role_id')
    OR (a.action = 'UPDATE' AND a.object_type = 'invoices' AND a.old_values->>'amount' != a.new_values->>'amount')
    AND a.created_at > (CURRENT_TIMESTAMP - INTERVAL '24 hours');
```

### Automated Security Alerts

Create functions for security alerts:

```sql
-- Create notification function
CREATE OR REPLACE FUNCTION custorix.send_security_alert(alert_type text, alert_message text, alert_data jsonb)
RETURNS void AS $$
BEGIN
    INSERT INTO custorix.notifications(
        notification_id,
        type,
        title,
        body,
        metadata,
        is_read,
        created_at
    ) VALUES (
        gen_random_uuid(),
        'security_alert',
        alert_type,
        alert_message,
        alert_data,
        false,
        CURRENT_TIMESTAMP
    );
    
    -- In a real implementation, this would also send email/SMS alerts
    -- This is a placeholder for that functionality
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check for security issues
CREATE OR REPLACE FUNCTION custorix.check_security_issues()
RETURNS void AS $$
DECLARE
    failed_login record;
    suspicious_activity record;
BEGIN
    -- Check for failed login attempts
    FOR failed_login IN SELECT * FROM custorix.failed_login_attempts LOOP
        PERFORM custorix.send_security_alert(
            'Multiple Failed Logins',
            'User ID ' || failed_login.user_id || ' has ' || failed_login.attempt_count || ' failed login attempts',
            jsonb_build_object(
                'user_id', failed_login.user_id,
                'ip_address', failed_login.ip_address,
                'attempt_count', failed_login.attempt_count,
                'time_range', jsonb_build_object(
                    'first_attempt', failed_login.first_attempt,
                    'last_attempt', failed_login.last_attempt
                )
            )
        );
    END LOOP;
    
    -- Check for suspicious activities
    FOR suspicious_activity IN SELECT * FROM custorix.suspicious_activities LOOP
        PERFORM custorix.send_security_alert(
            'Suspicious Activity Detected',
            'User ' || suspicious_activity.username || ' performed ' || suspicious_activity.action || ' on ' || suspicious_activity.object_type,
            jsonb_build_object(
                'user_id', suspicious_activity.user_id,
                'username', suspicious_activity.username,
                'action', suspicious_activity.action,
                'object_type', suspicious_activity.object_type,
                'object_id', suspicious_activity.object_id,
                'ip_address', suspicious_activity.ip_address,
                'timestamp', suspicious_activity.created_at
            )
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run security checks
-- This would typically be set up as a cron job or using pg_cron extension
-- Example using pg_cron:
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('security_check', '*/15 * * * *', 'SELECT custorix.check_security_issues()');
```

## Compliance Considerations

### Data Retention Policies

Implement data retention policies:

```sql
-- Create function to anonymize old data
CREATE OR REPLACE FUNCTION custorix.anonymize_old_data()
RETURNS void AS $$
BEGIN
    -- Anonymize contacts older than 7 years (for GDPR compliance)
    UPDATE custorix.contacts
    SET 
        first_name = 'Anonymized',
        last_name = 'Contact',
        email = 'anonymized_' || contact_id || '@example.com',
        phone = NULL,
        mobile = NULL,
        address = NULL,
        is_anonymized = TRUE
    WHERE 
        updated_at < (CURRENT_DATE - INTERVAL '7 years')
        AND is_anonymized = FALSE;
        
    -- Anonymize leads older than 2 years
    UPDATE custorix.leads
    SET 
        first_name = 'Anonymized',
        last_name = 'Lead',
        email = 'anonymized_' || lead_id || '@example.com',
        phone = NULL,
        company = 'Anonymized Company',
        is_anonymized = TRUE
    WHERE 
        updated_at < (CURRENT_DATE - INTERVAL '2 years')
        AND is_anonymized = FALSE;
        
    -- Archive old audit logs
    INSERT INTO custorix.audit_logs_archive
    SELECT * FROM custorix.audit_logs
    WHERE created_at < (CURRENT_DATE - INTERVAL '2 years');
    
    DELETE FROM custorix.audit_logs
    WHERE created_at < (CURRENT_DATE - INTERVAL '2 years');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule data retention job
SELECT cron.schedule('data_retention', '0 2 * * 0', 'SELECT custorix.anonymize_old_data()');
```

### GDPR Compliance

Implement GDPR-specific functions:

```sql
-- Create function to handle data subject access requests
CREATE OR REPLACE FUNCTION custorix.get_user_data(p_email text)
RETURNS jsonb AS $$
DECLARE
    user_data jsonb;
BEGIN
    -- Get user personal data
    SELECT jsonb_build_object(
        'user', jsonb_build_object(
            'user_id', u.user_id,
            'username', u.username,
            'email', u.email,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'phone', u.phone,
            'created_at', u.created_at,
            'updated_at', u.updated_at
        ),
        'contacts', (
            SELECT jsonb_agg(jsonb_build_object(
                'contact_id', c.contact_id,
                'first_name', c.first_name,
                'last_name', c.last_name,
                'email', c.email,
                'phone', c.phone,
                'mobile', c.mobile,
                'created_at', c.created_at,
                'updated_at', c.updated_at
            ))
            FROM custorix.contacts c
            WHERE c.email = p_email
        ),
        'leads', (
            SELECT jsonb_agg(jsonb_build_object(
                'lead_id', l.lead_id,
                'first_name', l.first_name,
                'last_name', l.last_name,
                'email', l.email,
                'phone', l.phone,
                'company', l.company,
                'created_at', l.created_at,
                'updated_at', l.updated_at
            ))
            FROM custorix.leads l
            WHERE l.email = p_email
        ),
        'login_history', (
            SELECT jsonb_agg(jsonb_build_object(
                'login_id', lh.login_id,
                'ip_address', lh.ip_address,
                'user_agent', lh.user_agent,
                'status', lh.status,
                'created_at', lh.created_at
            ))
            FROM custorix.login_history lh
            WHERE lh.user_id = u.user_id
            ORDER BY lh.created_at DESC
            LIMIT 100
        )
    ) INTO user_data
    FROM custorix.users u
    WHERE u.email = p_email;
    
    RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle right to be forgotten
CREATE OR REPLACE FUNCTION custorix.delete_user_data(p_email text)
RETURNS void AS $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get user ID
    SELECT user_id INTO v_user_id
    FROM custorix.users
    WHERE email = p_email;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Begin transaction
    BEGIN
        -- Anonymize user data
        UPDATE custorix.users
        SET 
            username = 'deleted_' || user_id,
            email = 'deleted_' || user_id || '@example.com',
            password_hash = NULL,
            first_name = 'Deleted',
            last_name = 'User',
            phone = NULL,
            status = 'Inactive',
            is_deleted = TRUE
        WHERE user_id = v_user_id;
        
        -- Anonymize contact data
        UPDATE custorix.contacts
        SET 
            first_name = 'Deleted',
            last_name = 'Contact',
            email = 'deleted_' || contact_id || '@example.com',
            phone = NULL,
            mobile = NULL,
            is_deleted = TRUE
        WHERE email = p_email;
        
        -- Anonymize lead data
        UPDATE custorix.leads
        SET 
            first_name = 'Deleted',
            last_name = 'Lead',
            email = 'deleted_' || lead_id || '@example.com',
            phone = NULL,
            company = 'Deleted Company',
            is_deleted = TRUE
        WHERE email = p_email;
        
        -- Record the deletion in compliance log
        INSERT INTO custorix.compliance_actions (
            action_id,
            action_type,
            subject_type,
            subject_id,
            requester_email,
            action_date,
            notes
        ) VALUES (
            gen_random_uuid(),
            'RIGHT_TO_BE_FORGOTTEN',
            'USER',
            v_user_id,
            p_email,
            CURRENT_TIMESTAMP,
            'User data anonymized per GDPR request'
        );
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This comprehensive security configuration provides a solid foundation for securing your Custorix CRM database. Implement these measures in stages, starting with the most critical security controls, and regularly review and update your security configuration as your system evolves and new security threats emerge.

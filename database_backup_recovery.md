# Database Backup and Recovery Procedures for Custorix CRM

This document outlines comprehensive backup and recovery procedures for the Custorix CRM PostgreSQL database. It covers backup strategies, automation, verification, and recovery procedures to ensure data protection and business continuity.

## Table of Contents

1. [Backup Strategy Overview](#backup-strategy-overview)
2. [Backup Types and Methods](#backup-types-and-methods)
3. [Backup Automation](#backup-automation)
4. [Backup Verification and Testing](#backup-verification-and-testing)
5. [Backup Storage and Retention](#backup-storage-and-retention)
6. [Recovery Procedures](#recovery-procedures)
7. [Disaster Recovery Planning](#disaster-recovery-planning)
8. [Documentation and Reporting](#documentation-and-reporting)

## Backup Strategy Overview

The Custorix CRM database backup strategy follows a multi-layered approach to ensure comprehensive data protection:

- **Daily full backups**: Complete database dumps every day during off-peak hours
- **Continuous WAL archiving**: Transaction log archiving for point-in-time recovery
- **Weekly schema-only backups**: For tracking schema changes over time
- **Monthly logical backups**: For long-term storage and cross-version compatibility
- **Pre-deployment backups**: Before any major system changes or updates

This strategy ensures multiple recovery options with minimal data loss potential while balancing performance impact and storage requirements.

## Backup Types and Methods

### Physical Backups (pg_basebackup)

Physical backups capture the raw database files for fast and complete recovery:

```bash
# Create a base backup directory
sudo mkdir -p /var/lib/postgresql/backups/basebackups
sudo chown postgres:postgres /var/lib/postgresql/backups/basebackups

# Run pg_basebackup as postgres user
sudo -u postgres pg_basebackup \
  -D /var/lib/postgresql/backups/basebackups/base_$(date +%Y%m%d_%H%M%S) \
  -Ft -z -Xs -P

# Explanation:
# -D: Directory to place the backup
# -Ft: Output in tar format
# -z: Compress with gzip
# -Xs: Include WAL files in the backup (stream method)
# -P: Show progress
```

### Logical Backups (pg_dump)

Logical backups provide flexibility and portability:

```bash
# Create a dump backup directory
sudo mkdir -p /var/lib/postgresql/backups/dumps
sudo chown postgres:postgres /var/lib/postgresql/backups/dumps

# Full database dump
sudo -u postgres pg_dump \
  -Fc \
  -v \
  -f /var/lib/postgresql/backups/dumps/custorix_$(date +%Y%m%d_%H%M%S).dump \
  custorix

# Schema-only backup
sudo -u postgres pg_dump \
  -Fc \
  -v \
  -s \
  -f /var/lib/postgresql/backups/dumps/custorix_schema_$(date +%Y%m%d_%H%M%S).dump \
  custorix

# Explanation:
# -Fc: Custom format (compressed and most flexible)
# -v: Verbose mode
# -f: Output file
# -s: Schema only (for schema-only backups)
```

### WAL Archiving for Point-in-Time Recovery

Configure continuous WAL (Write-Ahead Log) archiving:

```bash
# Create WAL archive directory
sudo mkdir -p /var/lib/postgresql/backups/wal_archive
sudo chown postgres:postgres /var/lib/postgresql/backups/wal_archive

# Edit postgresql.conf to enable WAL archiving
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add or modify these settings:
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /var/lib/postgresql/backups/wal_archive/%f && cp %p /var/lib/postgresql/backups/wal_archive/%f'
archive_timeout = 300  # seconds

# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql
```

## Backup Automation

### Automated Backup Script

Create a comprehensive backup script:

```bash
#!/bin/bash
# custorix_backup.sh - Automated backup script for Custorix CRM database

# Configuration
BACKUP_DIR="/var/lib/postgresql/backups"
BASEBACKUP_DIR="${BACKUP_DIR}/basebackups"
DUMP_DIR="${BACKUP_DIR}/dumps"
WAL_DIR="${BACKUP_DIR}/wal_archive"
LOG_DIR="${BACKUP_DIR}/logs"
RETENTION_DAYS=14
DB_NAME="custorix"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${LOG_DIR}/backup_${TIMESTAMP}.log"

# Ensure directories exist
mkdir -p ${BASEBACKUP_DIR} ${DUMP_DIR} ${LOG_DIR}
chown postgres:postgres ${BASEBACKUP_DIR} ${DUMP_DIR} ${LOG_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1
echo "=== Custorix CRM Database Backup - Started at $(date) ==="

# Function to handle errors
handle_error() {
    echo "ERROR: $1" >&2
    echo "Backup failed at $(date)" >&2
    exit 1
}

# Check day of week for different backup types
DOW=$(date +%u)  # 1-7 (Monday-Sunday)

# Daily full backup (physical or logical based on day)
if [ "$DOW" -eq "7" ]; then
    # Sunday: Physical full backup
    echo "Performing physical full backup (pg_basebackup)..."
    sudo -u postgres pg_basebackup \
        -D ${BASEBACKUP_DIR}/base_${TIMESTAMP} \
        -Ft -z -Xs -P || handle_error "Physical backup failed"
    echo "Physical backup completed successfully."
else
    # Other days: Logical full backup
    echo "Performing logical full backup (pg_dump)..."
    sudo -u postgres pg_dump \
        -Fc \
        -v \
        -f ${DUMP_DIR}/${DB_NAME}_${TIMESTAMP}.dump \
        ${DB_NAME} || handle_error "Logical backup failed"
    echo "Logical backup completed successfully."
fi

# Weekly schema-only backup (on Mondays)
if [ "$DOW" -eq "1" ]; then
    echo "Performing schema-only backup..."
    sudo -u postgres pg_dump \
        -Fc \
        -v \
        -s \
        -f ${DUMP_DIR}/${DB_NAME}_schema_${TIMESTAMP}.dump \
        ${DB_NAME} || handle_error "Schema backup failed"
    echo "Schema backup completed successfully."
fi

# Monthly logical backup with inserts (on 1st of month)
if [ "$(date +%d)" -eq "01" ]; then
    echo "Performing monthly logical backup with inserts..."
    sudo -u postgres pg_dump \
        -Fp \
        -v \
        -f ${DUMP_DIR}/${DB_NAME}_monthly_${TIMESTAMP}.sql \
        ${DB_NAME} || handle_error "Monthly backup failed"
    echo "Monthly backup completed successfully."
    
    # Compress the monthly backup
    gzip ${DUMP_DIR}/${DB_NAME}_monthly_${TIMESTAMP}.sql || handle_error "Monthly backup compression failed"
    echo "Monthly backup compressed successfully."
fi

# Cleanup old backups
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find ${BASEBACKUP_DIR} -type d -name "base_*" -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null
find ${DUMP_DIR} -type f -name "${DB_NAME}_*.dump" -mtime +${RETENTION_DAYS} -delete 2>/dev/null
find ${DUMP_DIR} -type f -name "${DB_NAME}_schema_*.dump" -mtime +${RETENTION_DAYS} -delete 2>/dev/null
find ${LOG_DIR} -type f -name "backup_*.log" -mtime +${RETENTION_DAYS} -delete 2>/dev/null
echo "Cleanup completed."

# Keep monthly backups for 1 year
find ${DUMP_DIR} -type f -name "${DB_NAME}_monthly_*.sql.gz" -mtime +365 -delete 2>/dev/null

# Verify the latest backup
echo "Verifying the latest backup..."
if [ "$DOW" -eq "7" ]; then
    # Verify physical backup
    LATEST_BACKUP=$(find ${BASEBACKUP_DIR} -type d -name "base_*" -printf "%T@ %p\n" | sort -n | tail -1 | cut -d' ' -f2-)
    if [ -z "$LATEST_BACKUP" ]; then
        handle_error "No physical backup found to verify"
    fi
    
    # Check if tar files exist and are not empty
    if [ ! -s "${LATEST_BACKUP}/base.tar.gz" ]; then
        handle_error "Physical backup verification failed: base.tar.gz is missing or empty"
    fi
    echo "Physical backup verification passed."
else
    # Verify logical backup
    LATEST_BACKUP=$(find ${DUMP_DIR} -type f -name "${DB_NAME}_*.dump" -printf "%T@ %p\n" | sort -n | tail -1 | cut -d' ' -f2-)
    if [ -z "$LATEST_BACKUP" ]; then
        handle_error "No logical backup found to verify"
    fi
    
    # Check if dump file exists and is not empty
    if [ ! -s "${LATEST_BACKUP}" ]; then
        handle_error "Logical backup verification failed: dump file is missing or empty"
    fi
    
    # Verify dump file integrity
    sudo -u postgres pg_restore -l ${LATEST_BACKUP} >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        handle_error "Logical backup verification failed: pg_restore test failed"
    fi
    echo "Logical backup verification passed."
fi

echo "=== Custorix CRM Database Backup - Completed at $(date) ==="
```

### Cron Job Setup

Schedule the backup script to run automatically:

```bash
# Edit crontab for postgres user
sudo -u postgres crontab -e

# Add the following line to run the backup daily at 1:00 AM
0 1 * * * /path/to/custorix_backup.sh

# Add a separate job for WAL archive cleanup (keep 7 days of WAL files)
0 2 * * * find /var/lib/postgresql/backups/wal_archive -type f -mtime +7 -delete
```

## Backup Verification and Testing

### Automated Backup Verification

Create a script to verify backups regularly:

```bash
#!/bin/bash
# custorix_verify_backup.sh - Verify Custorix CRM database backups

# Configuration
BACKUP_DIR="/var/lib/postgresql/backups"
BASEBACKUP_DIR="${BACKUP_DIR}/basebackups"
DUMP_DIR="${BACKUP_DIR}/dumps"
VERIFY_DIR="/tmp/custorix_verify"
LOG_DIR="${BACKUP_DIR}/logs"
DB_NAME="custorix"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${LOG_DIR}/verify_${TIMESTAMP}.log"

# Ensure directories exist
mkdir -p ${LOG_DIR} ${VERIFY_DIR}
chown postgres:postgres ${LOG_DIR} ${VERIFY_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1
echo "=== Custorix CRM Database Backup Verification - Started at $(date) ==="

# Function to handle errors
handle_error() {
    echo "ERROR: $1" >&2
    echo "Verification failed at $(date)" >&2
    
    # Send alert (replace with your notification method)
    echo "ALERT: Backup verification failed - $1" | mail -s "Custorix Backup Verification Failed" admin@example.com
    
    exit 1
}

# Find the latest backup
LATEST_DUMP=$(find ${DUMP_DIR} -type f -name "${DB_NAME}_*.dump" -printf "%T@ %p\n" | sort -n | tail -1 | cut -d' ' -f2-)
if [ -z "$LATEST_DUMP" ]; then
    handle_error "No logical backup found to verify"
fi

echo "Verifying latest logical backup: $(basename ${LATEST_DUMP})"

# Clean up verify directory
rm -rf ${VERIFY_DIR}/*

# Test restore to temporary directory
echo "Testing restore to file system..."
sudo -u postgres pg_restore -l ${LATEST_DUMP} >/dev/null 2>&1
if [ $? -ne 0 ]; then
    handle_error "Backup file is corrupted or invalid format"
fi

# Create a temporary database for verification
VERIFY_DB="custorix_verify_${TIMESTAMP}"
echo "Creating temporary database ${VERIFY_DB}..."
sudo -u postgres psql -c "CREATE DATABASE ${VERIFY_DB} WITH TEMPLATE template0;" || handle_error "Failed to create verification database"

# Restore the backup to the temporary database
echo "Restoring backup to temporary database..."
sudo -u postgres pg_restore -d ${VERIFY_DB} ${LATEST_DUMP} || handle_error "Failed to restore backup to verification database"

# Run basic validation queries
echo "Running validation queries..."
# Check if critical tables exist and have data
TABLES=("users" "accounts" "contacts" "opportunities" "leads" "cases")
for TABLE in "${TABLES[@]}"; do
    COUNT=$(sudo -u postgres psql -t -c "SELECT COUNT(*) FROM custorix.${TABLE};" ${VERIFY_DB} | tr -d ' ')
    echo "Table custorix.${TABLE}: ${COUNT} rows"
    if ! [[ "$COUNT" =~ ^[0-9]+$ ]]; then
        handle_error "Failed to query table custorix.${TABLE}"
    fi
done

# Check database size
DB_SIZE=$(sudo -u postgres psql -t -c "SELECT pg_size_pretty(pg_database_size('${VERIFY_DB}'));" | tr -d ' ')
echo "Verification database size: ${DB_SIZE}"

# Drop the temporary database
echo "Dropping temporary database..."
sudo -u postgres psql -c "DROP DATABASE ${VERIFY_DB};"

echo "Backup verification completed successfully."
echo "=== Custorix CRM Database Backup Verification - Completed at $(date) ==="
```

### Schedule Regular Verification

Set up a cron job to regularly verify backups:

```bash
# Edit crontab for postgres user
sudo -u postgres crontab -e

# Add the following line to run verification weekly on Saturdays at 3:00 AM
0 3 * * 6 /path/to/custorix_verify_backup.sh
```

## Backup Storage and Retention

### Backup Storage Strategy

Implement a comprehensive storage strategy:

```bash
#!/bin/bash
# custorix_backup_storage.sh - Manage backup storage and offsite copies

# Configuration
BACKUP_DIR="/var/lib/postgresql/backups"
OFFSITE_DIR="/mnt/offsite_storage"
CLOUD_BUCKET="s3://custorix-backups"
LOG_DIR="${BACKUP_DIR}/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${LOG_DIR}/storage_${TIMESTAMP}.log"

# Ensure directories exist
mkdir -p ${LOG_DIR} ${OFFSITE_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1
echo "=== Custorix CRM Backup Storage Management - Started at $(date) ==="

# Function to handle errors
handle_error() {
    echo "ERROR: $1" >&2
    echo "Storage management failed at $(date)" >&2
    exit 1
}

# Sync to offsite storage (NAS or external drive)
echo "Syncing backups to offsite storage..."
rsync -avz --delete ${BACKUP_DIR}/ ${OFFSITE_DIR}/ || handle_error "Offsite sync failed"
echo "Offsite sync completed."

# Upload to cloud storage (AWS S3)
echo "Uploading to cloud storage..."
# Daily backups - only keep the latest
aws s3 sync ${BACKUP_DIR}/dumps/ ${CLOUD_BUCKET}/dumps/ \
    --exclude "*" --include "custorix_*.dump" \
    --delete || handle_error "Cloud upload of daily backups failed"

# Weekly schema backups - keep all
aws s3 sync ${BACKUP_DIR}/dumps/ ${CLOUD_BUCKET}/dumps/ \
    --exclude "*" --include "custorix_schema_*.dump" || handle_error "Cloud upload of schema backups failed"

# Monthly backups - keep all
aws s3 sync ${BACKUP_DIR}/dumps/ ${CLOUD_BUCKET}/dumps/ \
    --exclude "*" --include "custorix_monthly_*.sql.gz" || handle_error "Cloud upload of monthly backups failed"

# Physical backups - only keep the latest
aws s3 sync ${BACKUP_DIR}/basebackups/ ${CLOUD_BUCKET}/basebackups/ \
    --delete || handle_error "Cloud upload of physical backups failed"

# WAL archives - keep 3 days worth
find ${BACKUP_DIR}/wal_archive -type f -mtime -3 | while read file; do
    aws s3 cp "$file" ${CLOUD_BUCKET}/wal_archive/$(basename "$file") || echo "Warning: Failed to upload WAL file $file"
done

echo "Cloud storage upload completed."

# Verify cloud storage
echo "Verifying cloud storage..."
aws s3 ls ${CLOUD_BUCKET}/dumps/ --recursive | grep "custorix_" || handle_error "Cloud storage verification failed"
echo "Cloud storage verification completed."

echo "=== Custorix CRM Backup Storage Management - Completed at $(date) ==="
```

### Backup Retention Policy

Document the backup retention policy:

| Backup Type | Local Retention | Offsite Retention | Cloud Retention |
|-------------|----------------|-------------------|-----------------|
| Daily Full Backups | 14 days | 30 days | 30 days |
| Weekly Schema Backups | 30 days | 90 days | 1 year |
| Monthly Logical Backups | 90 days | 1 year | 7 years |
| WAL Archives | 7 days | 14 days | 30 days |
| Pre-deployment Backups | Until next deployment | Until next deployment + 30 days | 90 days |

## Recovery Procedures

### Standard Recovery Procedure

Document the standard recovery procedure:

```bash
#!/bin/bash
# custorix_recovery.sh - Recover Custorix CRM database from backup

# Configuration
BACKUP_DIR="/var/lib/postgresql/backups"
BASEBACKUP_DIR="${BACKUP_DIR}/basebackups"
DUMP_DIR="${BACKUP_DIR}/dumps"
WAL_DIR="${BACKUP_DIR}/wal_archive"
LOG_DIR="${BACKUP_DIR}/logs"
DB_NAME="custorix"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${LOG_DIR}/recovery_${TIMESTAMP}.log"

# Ensure log directory exists
mkdir -p ${LOG_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1
echo "=== Custorix CRM Database Recovery - Started at $(date) ==="

# Function to handle errors
handle_error() {
    echo "ERROR: $1" >&2
    echo "Recovery failed at $(date)" >&2
    exit 1
}

# Function to display usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -t, --type TYPE       Recovery type: logical or physical (default: logical)"
    echo "  -b, --backup FILE     Specific backup file to restore (default: latest)"
    echo "  -p, --point-in-time TIME  Recover to specific point in time (format: 'YYYY-MM-DD HH:MM:SS')"
    echo "  -h, --help            Display this help message"
    exit 1
}

# Parse command line arguments
RECOVERY_TYPE="logical"
BACKUP_FILE=""
POINT_IN_TIME=""

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -t|--type)
            RECOVERY_TYPE="$2"
            shift 2
            ;;
        -b|--backup)
            BACKUP_FILE="$2"
            shift 2
            ;;
        -p|--point-in-time)
            POINT_IN_TIME="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate recovery type
if [[ "$RECOVERY_TYPE" != "logical" && "$RECOVERY_TYPE" != "physical" ]]; then
    handle_error "Invalid recovery type: $RECOVERY_TYPE. Must be 'logical' or 'physical'."
fi

# Find the backup file if not specified
if [[ -z "$BACKUP_FILE" ]]; then
    if [[ "$RECOVERY_TYPE" == "logical" ]]; then
        BACKUP_FILE=$(find ${DUMP_DIR} -type f -name "${DB_NAME}_*.dump" -printf "%T@ %p\n" | sort -n | tail -1 | cut -d' ' -f2-)
        if [[ -z "$BACKUP_FILE" ]]; then
            handle_error "No logical backup found"
        fi
        echo "Using latest logical backup: $(basename ${BACKUP_FILE})"
    else
        BACKUP_FILE=$(find ${BASEBACKUP_DIR} -type d -name "base_*" -printf "%T@ %p\n" | sort -n | tail -1 | cut -d' ' -f2-)
        if [[ -z "$BACKUP_FILE" ]]; then
            handle_error "No physical backup found"
        fi
        echo "Using latest physical backup: $(basename ${BACKUP_FILE})"
    fi
else
    # Verify the specified backup file exists
    if [[ ! -e "$BACKUP_FILE" ]]; then
        handle_error "Specified backup file does not exist: $BACKUP_FILE"
    fi
    echo "Using specified backup: $(basename ${BACKUP_FILE})"
fi

# Confirm recovery
echo "WARNING: This will replace the current database with the backup."
echo "Database: ${DB_NAME}"
echo "Recovery type: ${RECOVERY_TYPE}"
echo "Backup file: ${BACKUP_FILE}"
if [[ -n "$POINT_IN_TIME" ]]; then
    echo "Point-in-time recovery: ${POINT_IN_TIME}"
fi
echo ""
read -p "Are you sure you want to proceed? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Recovery cancelled."
    exit 0
fi

# Stop PostgreSQL service
echo "Stopping PostgreSQL service..."
sudo systemctl stop postgresql || handle_error "Failed to stop PostgreSQL service"

# Perform recovery based on type
if [[ "$RECOVERY_TYPE" == "logical" ]]; then
    # Logical recovery
    echo "Performing logical recovery..."
    
    # Drop and recreate the database
    echo "Dropping existing database..."
    sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DB_NAME};" || handle_error "Failed to drop database"
    
    echo "Creating new database..."
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} WITH TEMPLATE template0;" || handle_error "Failed to create database"
    
    # Restore from backup
    echo "Restoring from backup..."
    sudo -u postgres pg_restore -d ${DB_NAME} ${BACKUP_FILE} || handle_error "Failed to restore from backup"
    
    echo "Logical recovery completed successfully."
else
    # Physical recovery
    echo "Performing physical recovery..."
    
    # Get PostgreSQL data directory
    PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" | tr -d ' ')
    if [[ -z "$PG_DATA_DIR" ]]; then
        handle_error "Failed to determine PostgreSQL data directory"
    fi
    
    # Backup the current postgresql.conf and pg_hba.conf
    echo "Backing up configuration files..."
    cp ${PG_DATA_DIR}/postgresql.conf ${PG_DATA_DIR}/postgresql.conf.bak || handle_error "Failed to backup postgresql.conf"
    cp ${PG_DATA_DIR}/pg_hba.conf ${PG_DATA_DIR}/pg_hba.conf.bak || handle_error "Failed to backup pg_hba.conf"
    
    # Clear data directory
    echo "Clearing data directory..."
    sudo -u postgres rm -rf ${PG_DATA_DIR}/* || handle_error "Failed to clear data directory"
    
    # Extract backup
    echo "Extracting backup..."
    sudo -u postgres tar -xzf ${BACKUP_FILE}/base.tar.gz -C ${PG_DATA_DIR} || handle_error "Failed to extract base backup"
    
    # Restore configuration files
    echo "Restoring configuration files..."
    cp ${PG_DATA_DIR}/postgresql.conf.bak ${PG_DATA_DIR}/postgresql.conf || handle_error "Failed to restore postgresql.conf"
    cp ${PG_DATA_DIR}/pg_hba.conf.bak ${PG_DATA_DIR}/pg_hba.conf || handle_error "Failed to restore pg_hba.conf"
    
    # Create recovery.conf for point-in-time recovery if specified
    if [[ -n "$POINT_IN_TIME" ]]; then
        echo "Configuring point-in-time recovery..."
        cat > ${PG_DATA_DIR}/recovery.conf <<EOF
restore_command = 'cp ${WAL_DIR}/%f %p'
recovery_target_time = '${POINT_IN_TIME}'
recovery_target_action = 'promote'
EOF
        chown postgres:postgres ${PG_DATA_DIR}/recovery.conf
    fi
    
    echo "Physical recovery configured successfully."
fi

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
sudo systemctl start postgresql || handle_error "Failed to start PostgreSQL service"

# Verify recovery
echo "Verifying recovery..."
sudo -u postgres psql -c "\l" | grep ${DB_NAME} || handle_error "Database not found after recovery"
sudo -u postgres psql -c "SELECT COUNT(*) FROM custorix.users;" ${DB_NAME} || handle_error "Failed to query users table"

echo "Recovery verification completed successfully."
echo "=== Custorix CRM Database Recovery - Completed at $(date) ==="
```

### Point-in-Time Recovery Procedure

Document the point-in-time recovery procedure:

```bash
# Example of point-in-time recovery command
./custorix_recovery.sh --type physical --point-in-time "2025-03-15 14:30:00"
```

### Partial Recovery Procedure

Document the procedure for recovering specific tables:

```bash
#!/bin/bash
# custorix_partial_recovery.sh - Recover specific tables from backup

# Configuration
BACKUP_DIR="/var/lib/postgresql/backups"
DUMP_DIR="${BACKUP_DIR}/dumps"
LOG_DIR="${BACKUP_DIR}/logs"
DB_NAME="custorix"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${LOG_DIR}/partial_recovery_${TIMESTAMP}.log"
TEMP_DIR="/tmp/custorix_partial_recovery_${TIMESTAMP}"

# Ensure directories exist
mkdir -p ${LOG_DIR} ${TEMP_DIR}
chown postgres:postgres ${TEMP_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1
echo "=== Custorix CRM Partial Database Recovery - Started at $(date) ==="

# Function to handle errors
handle_error() {
    echo "ERROR: $1" >&2
    echo "Partial recovery failed at $(date)" >&2
    rm -rf ${TEMP_DIR}
    exit 1
}

# Function to display usage
usage() {
    echo "Usage: $0 -b BACKUP_FILE -t TABLE1,TABLE2,..."
    echo "Options:"
    echo "  -b, --backup FILE     Backup file to restore from"
    echo "  -t, --tables TABLES   Comma-separated list of tables to recover"
    echo "  -s, --schema          Include schema (CREATE TABLE statements)"
    echo "  -d, --data-only       Recover only data, not schema"
    echo "  -h, --help            Display this help message"
    exit 1
}

# Parse command line arguments
BACKUP_FILE=""
TABLES=""
INCLUDE_SCHEMA=false
DATA_ONLY=false

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -b|--backup)
            BACKUP_FILE="$2"
            shift 2
            ;;
        -t|--tables)
            TABLES="$2"
            shift 2
            ;;
        -s|--schema)
            INCLUDE_SCHEMA=true
            shift
            ;;
        -d|--data-only)
            DATA_ONLY=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate required parameters
if [[ -z "$BACKUP_FILE" ]]; then
    handle_error "Backup file must be specified"
fi

if [[ -z "$TABLES" ]]; then
    handle_error "Tables must be specified"
fi

if [[ ! -e "$BACKUP_FILE" ]]; then
    handle_error "Specified backup file does not exist: $BACKUP_FILE"
fi

# Convert comma-separated tables to array
IFS=',' read -ra TABLE_ARRAY <<< "$TABLES"
echo "Tables to recover: ${TABLES}"

# Create a list of tables for pg_restore
for TABLE in "${TABLE_ARRAY[@]}"; do
    echo "custorix.$TABLE" >> ${TEMP_DIR}/table_list.txt
done

# Perform recovery
echo "Extracting tables from backup..."
if [[ "$INCLUDE_SCHEMA" == true && "$DATA_ONLY" == false ]]; then
    # Extract schema and data
    sudo -u postgres pg_restore -l ${BACKUP_FILE} | grep -E "TABLE DATA.*custorix\.($(echo ${TABLES} | tr ',' '|'))" > ${TEMP_DIR}/restore_list.txt
    sudo -u postgres pg_restore -l ${BACKUP_FILE} | grep -E "TABLE.*custorix\.($(echo ${TABLES} | tr ',' '|'))" | grep -v "TABLE DATA" >> ${TEMP_DIR}/restore_list.txt
elif [[ "$DATA_ONLY" == true ]]; then
    # Extract data only
    sudo -u postgres pg_restore -l ${BACKUP_FILE} | grep -E "TABLE DATA.*custorix\.($(echo ${TABLES} | tr ',' '|'))" > ${TEMP_DIR}/restore_list.txt
else
    # Default: extract data and constraints, but not schema
    sudo -u postgres pg_restore -l ${BACKUP_FILE} | grep -E "TABLE DATA.*custorix\.($(echo ${TABLES} | tr ',' '|'))" > ${TEMP_DIR}/restore_list.txt
    sudo -u postgres pg_restore -l ${BACKUP_FILE} | grep -E "CONSTRAINT.*custorix\.($(echo ${TABLES} | tr ',' '|'))" >> ${TEMP_DIR}/restore_list.txt
    sudo -u postgres pg_restore -l ${BACKUP_FILE} | grep -E "INDEX.*custorix\.($(echo ${TABLES} | tr ',' '|'))" >> ${TEMP_DIR}/restore_list.txt
    sudo -u postgres pg_restore -l ${BACKUP_FILE} | grep -E "TRIGGER.*custorix\.($(echo ${TABLES} | tr ',' '|'))" >> ${TEMP_DIR}/restore_list.txt
fi

# Restore selected tables
echo "Restoring tables..."
sudo -u postgres pg_restore -L ${TEMP_DIR}/restore_list.txt -d ${DB_NAME} ${BACKUP_FILE} || handle_error "Failed to restore tables"

# Verify recovery
echo "Verifying recovery..."
for TABLE in "${TABLE_ARRAY[@]}"; do
    COUNT=$(sudo -u postgres psql -t -c "SELECT COUNT(*) FROM custorix.${TABLE};" ${DB_NAME} | tr -d ' ')
    echo "Table custorix.${TABLE}: ${COUNT} rows"
    if ! [[ "$COUNT" =~ ^[0-9]+$ ]]; then
        handle_error "Failed to query table custorix.${TABLE}"
    fi
done

# Clean up
rm -rf ${TEMP_DIR}

echo "Partial recovery completed successfully."
echo "=== Custorix CRM Partial Database Recovery - Completed at $(date) ==="
```

## Disaster Recovery Planning

### Disaster Recovery Plan

Document a comprehensive disaster recovery plan:

```markdown
# Custorix CRM Disaster Recovery Plan

## Recovery Time Objectives (RTO)
- Critical systems: 4 hours
- Non-critical systems: 24 hours

## Recovery Point Objectives (RPO)
- Maximum data loss: 15 minutes (using WAL archiving)

## Disaster Recovery Team
- Primary DBA: [Name], [Contact]
- Backup DBA: [Name], [Contact]
- System Administrator: [Name], [Contact]
- Application Owner: [Name], [Contact]

## Disaster Recovery Scenarios

### Scenario 1: Database Corruption
1. Stop the application to prevent further damage
2. Assess the extent of corruption
3. If partial corruption, attempt table-level recovery
4. If full corruption, perform full database recovery
5. Verify recovery and restart application

### Scenario 2: Server Hardware Failure
1. Activate standby server if available
2. If no standby, provision new server
3. Install PostgreSQL with same version
4. Restore from latest physical backup
5. Apply WAL archives for point-in-time recovery
6. Verify recovery and redirect application to new server

### Scenario 3: Data Center Outage
1. Activate DR site if available
2. If no DR site, provision cloud infrastructure
3. Restore database from cloud backups
4. Verify recovery and update DNS/load balancers
5. Restart application pointing to new infrastructure

## Recovery Testing Schedule
- Monthly: Table-level recovery test
- Quarterly: Full database recovery test
- Bi-annually: Disaster recovery simulation
```

### Standby Server Configuration

Document standby server setup for high availability:

```bash
# On primary server, configure for replication
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add or modify these settings:
wal_level = replica
max_wal_senders = 10
wal_keep_segments = 64
synchronous_standby_names = 'standby01'

# Configure authentication for replication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line:
host replication replicator 10.0.0.0/24 scram-sha-256

# Create replication user
sudo -u postgres psql -c "CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'strong_password_here';"

# Restart PostgreSQL
sudo systemctl restart postgresql

# On standby server, initialize with base backup
sudo systemctl stop postgresql
sudo -u postgres rm -rf /var/lib/postgresql/14/main/*
sudo -u postgres pg_basebackup -h primary_server_ip -U replicator -D /var/lib/postgresql/14/main -P -v

# Configure standby server
sudo -u postgres nano /var/lib/postgresql/14/main/postgresql.conf

# Add or modify these settings:
primary_conninfo = 'host=primary_server_ip port=5432 user=replicator password=strong_password_here application_name=standby01'
hot_standby = on

# Create standby.signal file
sudo -u postgres touch /var/lib/postgresql/14/main/standby.signal

# Start PostgreSQL on standby
sudo systemctl start postgresql

# Verify replication status on primary
sudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"
```

## Documentation and Reporting

### Backup Status Reporting

Create a script to generate backup status reports:

```bash
#!/bin/bash
# custorix_backup_report.sh - Generate backup status report

# Configuration
BACKUP_DIR="/var/lib/postgresql/backups"
BASEBACKUP_DIR="${BACKUP_DIR}/basebackups"
DUMP_DIR="${BACKUP_DIR}/dumps"
WAL_DIR="${BACKUP_DIR}/wal_archive"
LOG_DIR="${BACKUP_DIR}/logs"
REPORT_DIR="${BACKUP_DIR}/reports"
DB_NAME="custorix"
TIMESTAMP=$(date +%Y%m%d)
REPORT_FILE="${REPORT_DIR}/backup_report_${TIMESTAMP}.html"
EMAIL_RECIPIENTS="dba@example.com,admin@example.com"

# Ensure report directory exists
mkdir -p ${REPORT_DIR}

# Generate HTML report
cat > ${REPORT_FILE} <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Custorix CRM Backup Status Report - ${TIMESTAMP}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .success { color: green; }
        .warning { color: orange; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>Custorix CRM Backup Status Report</h1>
    <p>Generated on: $(date)</p>
    
    <h2>Recent Backups</h2>
    <table>
        <tr>
            <th>Backup Type</th>
            <th>Filename</th>
            <th>Date</th>
            <th>Size</th>
            <th>Status</th>
        </tr>
EOF

# Add recent logical backups
find ${DUMP_DIR} -type f -name "${DB_NAME}_*.dump" -mtime -7 | sort -r | while read file; do
    FILENAME=$(basename "$file")
    DATE=$(stat -c %y "$file" | cut -d. -f1)
    SIZE=$(du -h "$file" | cut -f1)
    
    # Check if backup verification was successful
    VERIFY_LOG=$(find ${LOG_DIR} -type f -name "verify_*.log" -mtime -7 | xargs grep -l "$FILENAME" | sort -r | head -1)
    if [[ -n "$VERIFY_LOG" ]]; then
        if grep -q "Backup verification completed successfully" "$VERIFY_LOG"; then
            STATUS="<span class=\"success\">Verified</span>"
        else
            STATUS="<span class=\"error\">Verification Failed</span>"
        fi
    else
        STATUS="<span class=\"warning\">Not Verified</span>"
    fi
    
    echo "<tr><td>Logical Backup</td><td>${FILENAME}</td><td>${DATE}</td><td>${SIZE}</td><td>${STATUS}</td></tr>" >> ${REPORT_FILE}
done

# Add recent physical backups
find ${BASEBACKUP_DIR} -type d -name "base_*" -mtime -7 | sort -r | while read dir; do
    DIRNAME=$(basename "$dir")
    DATE=$(stat -c %y "$dir" | cut -d. -f1)
    SIZE=$(du -sh "$dir" | cut -f1)
    
    # Check if backup verification was successful
    VERIFY_LOG=$(find ${LOG_DIR} -type f -name "verify_*.log" -mtime -7 | xargs grep -l "$DIRNAME" | sort -r | head -1)
    if [[ -n "$VERIFY_LOG" ]]; then
        if grep -q "Backup verification completed successfully" "$VERIFY_LOG"; then
            STATUS="<span class=\"success\">Verified</span>"
        else
            STATUS="<span class=\"error\">Verification Failed</span>"
        fi
    else
        STATUS="<span class=\"warning\">Not Verified</span>"
    fi
    
    echo "<tr><td>Physical Backup</td><td>${DIRNAME}</td><td>${DATE}</td><td>${SIZE}</td><td>${STATUS}</td></tr>" >> ${REPORT_FILE}
done

# Add WAL archiving status
WAL_COUNT=$(find ${WAL_DIR} -type f | wc -l)
LAST_WAL=$(find ${WAL_DIR} -type f | sort | tail -1)
LAST_WAL_TIME=$(stat -c %y "$LAST_WAL" 2>/dev/null | cut -d. -f1)

if [[ -z "$LAST_WAL_TIME" ]]; then
    WAL_STATUS="<span class=\"error\">No WAL files found</span>"
elif [[ $(( $(date +%s) - $(date -d "$LAST_WAL_TIME" +%s) )) -gt 3600 ]]; then
    WAL_STATUS="<span class=\"warning\">Last WAL older than 1 hour</span>"
else
    WAL_STATUS="<span class=\"success\">Active</span>"
fi

cat >> ${REPORT_FILE} <<EOF
    </table>
    
    <h2>WAL Archiving Status</h2>
    <table>
        <tr>
            <th>Total WAL Files</th>
            <th>Last WAL File</th>
            <th>Last WAL Time</th>
            <th>Status</th>
        </tr>
        <tr>
            <td>${WAL_COUNT}</td>
            <td>$(basename "$LAST_WAL")</td>
            <td>${LAST_WAL_TIME}</td>
            <td>${WAL_STATUS}</td>
        </tr>
    </table>
    
    <h2>Storage Usage</h2>
    <table>
        <tr>
            <th>Location</th>
            <th>Total Size</th>
            <th>Available Space</th>
            <th>Usage</th>
        </tr>
EOF

# Add storage usage information
BACKUP_SIZE=$(du -sh ${BACKUP_DIR} | cut -f1)
BACKUP_AVAIL=$(df -h ${BACKUP_DIR} | tail -1 | awk '{print $4}')
BACKUP_USAGE=$(df -h ${BACKUP_DIR} | tail -1 | awk '{print $5}')

echo "<tr><td>Local Backup Storage</td><td>${BACKUP_SIZE}</td><td>${BACKUP_AVAIL}</td><td>${BACKUP_USAGE}</td></tr>" >> ${REPORT_FILE}

if [[ -d "${OFFSITE_DIR}" ]]; then
    OFFSITE_SIZE=$(du -sh ${OFFSITE_DIR} 2>/dev/null | cut -f1)
    OFFSITE_AVAIL=$(df -h ${OFFSITE_DIR} 2>/dev/null | tail -1 | awk '{print $4}')
    OFFSITE_USAGE=$(df -h ${OFFSITE_DIR} 2>/dev/null | tail -1 | awk '{print $5}')
    
    echo "<tr><td>Offsite Backup Storage</td><td>${OFFSITE_SIZE}</td><td>${OFFSITE_AVAIL}</td><td>${OFFSITE_USAGE}</td></tr>" >> ${REPORT_FILE}
fi

# Add cloud storage information if AWS CLI is available
if command -v aws &>/dev/null; then
    CLOUD_SIZE=$(aws s3 ls ${CLOUD_BUCKET} --recursive --summarize | grep "Total Size" | awk '{print $3 " " $4}')
    echo "<tr><td>Cloud Backup Storage</td><td>${CLOUD_SIZE}</td><td>N/A</td><td>N/A</td></tr>" >> ${REPORT_FILE}
fi

cat >> ${REPORT_FILE} <<EOF
    </table>
    
    <h2>Recent Backup Logs</h2>
    <table>
        <tr>
            <th>Log File</th>
            <th>Date</th>
            <th>Status</th>
        </tr>
EOF

# Add recent backup logs
find ${LOG_DIR} -type f -name "backup_*.log" -mtime -7 | sort -r | head -10 | while read log; do
    LOG_NAME=$(basename "$log")
    LOG_DATE=$(stat -c %y "$log" | cut -d. -f1)
    
    if grep -q "Backup completed successfully" "$log"; then
        LOG_STATUS="<span class=\"success\">Success</span>"
    elif grep -q "ERROR" "$log"; then
        LOG_STATUS="<span class=\"error\">Failed</span>"
    else
        LOG_STATUS="<span class=\"warning\">Unknown</span>"
    fi
    
    echo "<tr><td>${LOG_NAME}</td><td>${LOG_DATE}</td><td>${LOG_STATUS}</td></tr>" >> ${REPORT_FILE}
done

cat >> ${REPORT_FILE} <<EOF
    </table>
    
    <p>For detailed information, please check the log files in ${LOG_DIR}</p>
</body>
</html>
EOF

# Send report by email
if command -v mail &>/dev/null; then
    (echo "To: ${EMAIL_RECIPIENTS}"; 
     echo "Subject: Custorix CRM Backup Status Report - ${TIMESTAMP}"; 
     echo "Content-Type: text/html"; 
     echo ""; 
     cat ${REPORT_FILE}) | sendmail -t
fi

echo "Backup status report generated: ${REPORT_FILE}"
```

### Schedule Regular Reporting

Set up a cron job to generate regular reports:

```bash
# Edit crontab for postgres user
sudo -u postgres crontab -e

# Add the following line to generate weekly reports on Mondays at 7:00 AM
0 7 * * 1 /path/to/custorix_backup_report.sh
```

This comprehensive backup and recovery documentation provides a solid foundation for protecting your Custorix CRM database. Implement these procedures in stages, starting with the most critical components, and regularly test your backup and recovery processes to ensure they work as expected when needed.

#!/bin/bash

# Start PostgreSQL service
sudo service postgresql start

# Create test database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS custorix_crm_test;"
sudo -u postgres psql -c "CREATE DATABASE custorix_crm_test OWNER custorix;"

# Import schema to test database
sudo -u postgres psql -d custorix_crm_test -f "/tmp/custorix_db_script.sql"

# Run database tests
echo "Running database validation tests..."
sudo -u postgres psql -d custorix_crm_test -f "/tmp/schema_validation_tests.sql"

# Run function tests
echo "Running database function tests..."
sudo -u postgres psql -d custorix_crm_test -f "/tmp/function_tests.sql"

echo "Database tests completed."

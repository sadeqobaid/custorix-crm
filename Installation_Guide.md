# Custorix CRM - Installation Guide

This document provides step-by-step instructions for installing the Custorix CRM system on your laptop.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Verifying Installation](#verifying-installation)
4. [Next Steps](#next-steps)

## Prerequisites

Before installing Custorix CRM, ensure your system meets the following requirements:

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **Disk Space**: At least 2GB of free disk space
- **Memory**: Minimum 4GB RAM (8GB or more recommended)
- **Software**:
  - Git
  - PostgreSQL 12+
  - Python 3.8+
  - Node.js 16+
  - npm 7+

## Installation Steps

### 1. Clone the Repository

Open a terminal or command prompt and run:

```bash
git clone https://github.com/sadeqobaid/custorix-crm.git
cd custorix-crm
```

### 2. Set Up the Database

1. Start PostgreSQL service on your machine
2. Create a database user and database:

```bash
# For Windows, use pgAdmin or psql from the command line
# For macOS/Linux:
sudo -u postgres psql -c "CREATE USER custorix WITH PASSWORD 'custorix_password';"
sudo -u postgres psql -c "CREATE DATABASE custorix_crm OWNER custorix;"
```

3. Import the database schema:

```bash
sudo -u postgres psql -d custorix_crm -f "Custorix CRM Database Script.sql"
```

### 3. Set Up the Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure the database connection in `config/settings.py`

5. Apply migrations:

```bash
python manage.py migrate
```

6. Create an admin user:

```bash
python manage.py createsuperuser
```

### 4. Set Up the Frontend

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

## Verifying Installation

### 1. Start the Backend Server

```bash
# From the backend directory with virtual environment activated
python manage.py runserver
```

The backend should start and be available at http://localhost:8000/api/

### 2. Start the Frontend Server

```bash
# From the frontend directory
npm run dev
```

The frontend should start and be available at http://localhost:5173/

### 3. Access the Application

Open your web browser and navigate to http://localhost:5173/

Log in with the admin credentials you created during setup.

## Next Steps

After successful installation:

1. Refer to the [Configuration Guide](Configuration_Guide.md) for detailed configuration options
2. Consult the [User Manual](User_Manual.md) to learn how to use the system
3. Import your business data into the system

For any issues during installation, please refer to the troubleshooting section in the Configuration Guide.

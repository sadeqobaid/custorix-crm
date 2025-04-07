# Custorix CRM - Configuration and Setup Guide

This document provides detailed instructions for setting up and running the Custorix CRM system on your local machine.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Database Setup](#database-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Running the System](#running-the-system)
6. [Troubleshooting](#troubleshooting)

## System Requirements

To run the Custorix CRM system, you need the following software installed on your machine:

- **PostgreSQL** (version 12 or higher)
- **Python** (version 3.8 or higher)
- **Node.js** (version 16 or higher)
- **npm** (version 7 or higher)

## Database Setup

1. **Install PostgreSQL** if you haven't already:
   - For Windows: Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)
   - For macOS: Use Homebrew with `brew install postgresql`
   - For Linux (Ubuntu/Debian): `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - Windows: The service should start automatically after installation
   - macOS: `brew services start postgresql`
   - Linux: `sudo service postgresql start`

3. **Create a database user and database**:
   ```bash
   sudo -u postgres psql
   ```

   Then in the PostgreSQL prompt:
   ```sql
   CREATE USER custorix WITH PASSWORD 'custorix_password';
   CREATE DATABASE custorix_crm OWNER custorix;
   \q
   ```

4. **Import the database schema**:
   ```bash
   sudo -u postgres psql -d custorix_crm -f "/path/to/custorix-crm/Custorix CRM Database Script.sql"
   ```
   Replace `/path/to/custorix-crm/` with the actual path to the repository on your machine.

## Backend Configuration

1. **Navigate to the backend directory**:
   ```bash
   cd /path/to/custorix-crm/backend
   ```

2. **Create and activate a virtual environment**:
   - Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install django djangorestframework psycopg2-binary django-cors-headers
   ```

4. **Configure database connection**:
   Create or edit the file `backend/config/settings.py` and ensure the database configuration looks like this:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'custorix_crm',
           'USER': 'custorix',
           'PASSWORD': 'custorix_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

5. **Apply migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser** (for admin access):
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin user.

## Frontend Configuration

1. **Navigate to the frontend directory**:
   ```bash
   cd /path/to/custorix-crm/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint**:
   Create or edit the file `frontend/src/api/config.js` to point to your backend server:
   ```javascript
   export const API_BASE_URL = 'http://localhost:8000/api';
   ```

## Running the System

### Start the Backend Server

1. **Navigate to the backend directory**:
   ```bash
   cd /path/to/custorix-crm/backend
   ```

2. **Activate the virtual environment** (if not already activated):
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. **Start the development server**:
   ```bash
   python manage.py runserver
   ```
   The backend API will be available at http://localhost:8000/api/

### Start the Frontend Server

1. **Navigate to the frontend directory**:
   ```bash
   cd /path/to/custorix-crm/frontend
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend application will be available at http://localhost:5173/

3. **Access the application**:
   Open your web browser and navigate to http://localhost:5173/
   - Login with the superuser credentials you created earlier

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL service is running
- Verify database credentials in `backend/config/settings.py`
- Check if the database exists: `sudo -u postgres psql -l`

### Backend Server Issues

- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check for error messages in the terminal where the server is running
- Verify that the database migrations have been applied

### Frontend Server Issues

- Ensure all dependencies are installed: `npm install`
- Check for error messages in the terminal where the server is running
- Verify that the API endpoint configuration is correct

### CORS Issues

If you encounter CORS (Cross-Origin Resource Sharing) errors:

1. Ensure the backend CORS settings in `backend/config/settings.py` include your frontend origin:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
   ]
   ```

2. Restart both backend and frontend servers

For any other issues, please refer to the project documentation or contact the development team.

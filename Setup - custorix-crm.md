Interactive Guide: Setting Up Custorix CRM

Step 1: Clone the Repository

First, let's get the code onto your local machine:
bash
# Open a terminal/command prompt
git clone https://github.com/sadeqobaid/custorix-crm.git
cd custorix-crm
Step 2: Set Up Environment Variables

Let's create your environment file:
bash
# Copy the example environment file
cp .env.example .env

# Now edit the .env file with your preferred text editor
# For example:
nano .env  # or use any text editor you prefer
Fill in the following values in your .env file:
# Database Configuration
DB_NAME=custorix_crm
DB_USER=custorix
DB_PASSWORD=custorix_password  # Choose a secure password
DB_HOST=localhost
DB_PORT=5432

# Django Secret Key (generate a random string) 
SECRET_KEY=your_secret_key_here

# Debug mode (set to False in production)
DEBUG=True

# Allowed hosts (comma-separated)
ALLOWED_HOSTS=localhost,127.0.0.1
Save and close the file.
Step 3: Set Up the Database

Let's set up PostgreSQL:
bash
# Start PostgreSQL service (if not already running)
# On Ubuntu/Debian:
sudo service postgresql start

# Create database user and database
sudo -u postgres psql -c "CREATE USER custorix WITH PASSWORD 'custorix_password';"
sudo -u postgres psql -c "CREATE DATABASE custorix_crm OWNER custorix;"

# Import the database schema
sudo -u postgres psql -d custorix_crm -f "Custorix CRM Database Script.sql"
Step 4: Set Up the Backend

Now let's configure the Django backend:
bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser
# Follow the prompts to create your admin username, email, and password

# Start the backend server
python manage.py runserver
The backend should now be running at http://localhost:8000/
Step 5: Set Up the Frontend

Open a new terminal window (keep the backend running)  and:
bash
# Navigate to the frontend directory from the project root
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
The frontend should now be running at http://localhost:5173/
Step 6: Access the CRM System

Open your web browser and navigate to http://localhost:5173/
Log in with the superuser credentials you created in Step 4
You should now see the Custorix CRM dashboard
Step 7: Explore the System

Now that you're logged in, you can:
Create and manage accounts and contacts
Track leads and opportunities
Set up marketing campaigns
Manage support tickets
Generate invoices and track payments
Troubleshooting

If you encounter any issues:
Database Connection Issues:
Ensure PostgreSQL is running
Verify database credentials in your .env file
Check database logs: sudo -u postgres psql -l
Backend Server Issues:
Check for error messages in the terminal
Verify all dependencies are installed
Ensure migrations have been applied
Frontend Issues:
Check for error messages in the terminal
Verify all dependencies are installed
Check that the API endpoint configuration points to your backend

Custorix CRM
A Modern, Scalable CRM with Full Business Integration

📌 Table of Contents

🚀 Features
🛠 Tech Stack
📂 Project Structure
⚙️ Setup & Installation
🏗 Development Guide
📊 Deployment
🔍 Testing
📜 License


🚀 Features
✔ Sales Automation – Lead tracking, pipeline management, forecasting
✔ Marketing Tools – Campaigns, email automation, analytics
✔ Customer Support – Ticketing, SLA tracking, knowledge base
✔ Accounting Integration – Invoicing, payments, expense tracking
✔ AI-Powered Insights – Predictive lead scoring, smart recommendations
✔ Multi-Platform – Web, mobile (iOS/Android), and API-first design

🛠 Tech Stack

Backend (Django/Python)

Component	Technology
Framework	Django 4.x
Database	PostgreSQL 14+
API	Django REST Framework
Auth	JWT + OAuth2
Search	Elasticsearch 8.x
Cache	Redis 7.x
Async	Celery + RabbitMQ
Frontend (React/TypeScript)

Component	Technology
Framework	React 18
State	Redux Toolkit
Styling	Tailwind CSS + MUI
Charts	Chart.js / D3.js
Build	Vite 4.x
Mobile (React Native)

Component	Technology
Framework	React Native 0.70+
Navigation	React Navigation 6.x
Offline	Redux Persist
DevOps & Infrastructure

Component	Technology
Containers	Docker + Kubernetes
CI/CD	GitHub Actions
Monitoring	Prometheus + Grafana
Cloud	AWS/GCP (Terraform)

📂 Project Structure

custorix-crm/
├── backend/
│   ├── apps/                 # Django apps (domain-driven)
│   │   ├── accounts/         # User/auth management
│   │   ├── contacts/         # Contact models/views
│   │   ├── leads/            # Lead processing
│   │   ├── sales/            # Opportunity pipeline
│   │   ├── marketing/        # Campaign automation
│   │   ├── support/          # Ticketing system
│   │   └── finance/          # Billing/invoicing
│   ├── config/               # Django config
│   │   ├── settings/         # Environment settings
│   │   │   ├── base.py       # Shared settings
│   │   │   ├── dev.py        # Development config
│   │   │   └── prod.py       # Production config
│   │   ├── static/           # Collected static files
│   │   ├── media/            # User uploads
│   │   └── urls.py           # Main URL routing
│   ├── requirements/
│   │   ├── base.txt          # Core dependencies
│   │   ├── dev.txt           # Dev tools (pytest, etc.)
│   │   └── prod.txt          # Production deps
│   └── Dockerfile            # Container config
│
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/              # API service layer
│   │   ├── components/
│   │   │   ├── ui/           # Buttons, inputs
│   │   │   ├── layout/       # Grids, cards
│   │   │   └── data/         # Tables, charts
│   │   ├── pages/            # Route-based views
│   │   ├── store/
│   │   │   ├── slices/       # Redux Toolkit slices
│   │   │   └── selectors/    # Memoized selectors
│   │   ├── styles/
│   │   │   ├── themes/       # Design system
│   │   │   └── global/       # Base styles
│   │   ├── utils/            # Helper functions
│   │   └── App.tsx           # Root component
│   ├── cypress/              # E2E tests
│   └── Dockerfile            # Production build
│
├── shared/                   # Cross-cutting concerns
│   ├── types/                # TypeScript types
│   └── schemas/              # JSON validation
│
├── infrastructure/
│   ├── kubernetes/
│   │   ├── base/             # Common manifests
│   │   └── overlays/         # Environment patches
│   ├── terraform/
│   │   ├── modules/          # Reusable components
│   │   └── environments/     # Env-specific configs
│   └── docker-compose.yml    # Local development
│
├── docs/
│   ├── api/                  # OpenAPI specs
│   └── architecture/
│       ├── adr/              # Architecture decisions
│       └── diagrams/         # System visuals
│
├── scripts/                  # Utility scripts
├── .env.example              # Environment template
├── .gitignore
├── .dockerignore
├── Makefile                  # Common commands
└── README.md                 # Project overview

⚙️ Setup & Installation

Prerequisites

Docker 20.10+
Node.js 18+
Python 3.9+
PostgreSQL 14+

Quick Start (Docker)
git clone https://github.com/your-repo/custorix-crm.git
cd custorix-crm
docker-compose up -d

Access:

Frontend → http://localhost:3000
Backend API → http://localhost:8000
Admin Panel → http://localhost:8000/admin

Manual Setup

1. Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements/local.txt
python manage.py migrate
python manage.py runserver

2. Frontend
cd frontend
npm install
npm run dev

3. Mobile
cd mobile
npm install
npx react-native start

🏗 Development Guide

1. Backend (Django)

Create a new app:

python manage.py startapp <app_name>

Run tests:

pytest

2. Frontend (React):

Add a new component:

cd src/components
mkdir NewComponent && touch NewComponent.tsx

3. Mobile (React Native):

Run on Android/iOS:

npx react-native run-android
npx react-native run-ios

📊 Deployment

Cloud (AWS/GCP)

cd infrastructure/terraform
terraform apply

Kubernetes

kubectl apply -f infrastructure/kubernetes/

CI/CD (GitHub Actions)

Pre-configured workflows in .github/workflows/

🔍 Testing

Test Type	Command
Unit	pytest (Backend)
Integration	npm test (Frontend)
E2E	cypress run

📜 License

MIT License © 2024 Custorix CRM

📩 Contact: Sadeq Obaid
			sadeqobaid@gmail.com
			+962 79 586 3773

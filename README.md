<!-- markdownlint-disable -->



#  Today work cd 

Note: Also study little bit the admin side 

phase 0: complete 
phase 1: complete
phase 2: complete  

phase3: complete (if little bit change you want so it can be done using admin side okay or hardcoded change then tell to opencode only in team seaction okay)

Phase 4:  Start (but more time spend on this okay our goal is this and cicd )






# step vy step command   
 python3 -m venv venv
 source venv/bin/activate


cd backend
python manage.py makemigrations
python manage.py migrate

python manage.py runserver


cd frontend : (phase2)
npm run dev



python manage.py createsuperuser
Username: admin
Email: khan@email.com
Password: ireg-admin-2026


http://localhost:8000/admin/      # when you search this on google it will show you admin panal enter the above username and password it will open inside things.




# IREG-IT Portal

Company website for IREG-IT with an AI-powered RAG chatbot.

## Stack
- **Backend:** Django + Django REST Framework
- **Frontend:** React (Vite)
- **Database:** PostgreSQL + pgvector
- **Deployment:** GitHub Actions → VPS (Apache + Gunicorn)

## Structure
- `backend/` — Django API and AI engine
- `frontend/` — React website and chat widget
- `docs/` — System design and build phases




ireg-it-portal/
│
├── .github/workflows/
│   ├── deploy.yml
│   └── deploy-staging.yml
│
├── backend/
│   ├── manage.py
│   ├── ireg/                          # from: django-admin startproject ireg .
│   │   ├── __init__.py
│   │   ├── settings/                  # split by hand from settings.py
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── local.py
│   │   │   ├── staging.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   ├── wsgi.py
│   │   └── celery.py                  # you add this by hand
│   │
│   ├── apps/                          # you create this folder + __init__.py
│   │   ├── __init__.py
│   │   ├── website/                   # from: startapp website apps/website
│   │   │   ├── models.py              # TeamMember, Service
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py                # ⚠ fix name = "apps.website"
│   │   │   └── tests/
│   │   │
│   │   ├── contact/                   # from: startapp contact apps/contact
│   │   │   ├── models.py              # ContactSubmission
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── apps.py                # ⚠ fix name = "apps.contact"
│   │   │   └── tests/
│   │   │
│   │   ├── chatbot/                   # from: startapp chatbot apps/chatbot   # important note: 
│   │   │   ├── models.py              # Document, Chunk, ChatSession, ChatMessage
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py                # ⚠ fix name = "apps.chatbot"
│   │   │   ├── tasks.py
│   │   │   └── tests/
│   │   │
│   │   └── core/                      # from: startapp core apps/core
│   │       ├── health.py
│   │       ├── permissions.py
│   │       ├── throttling.py
│   │       └── apps.py                # ⚠ fix name = "apps.core"
│   │
│   ├── ai_engine/                     # plain folders, NOT a Django app, no startapp
│   │   ├── __init__.py
│   │   ├── providers/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   └── openai_provider.py
│   │   ├── ingestion/
│   │   │   ├── __init__.py
│   │   │   ├── chunker.py
│   │   │   └── pipeline.py
│   │   ├── retrieval/
│   │   │   ├── __init__.py
│   │   │   └── vector_search.py
│   │   ├── generation/
│   │   │   ├── __init__.py
│   │   │   ├── prompt_builder.py
│   │   │   └── chat_engine.py
│   │   └── tests/
│   │
│   ├── prompts/                       # plain .txt files, no __init__.py needed
│   │   ├── system_prompt.txt
│   │   └── rag_answer_template.txt
│   │
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── .env.example
│
├── frontend/                          # React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Services.jsx
│   │   │   └── Contact.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ChatWidget/
│   │   │       ├── ChatIcon.jsx      # the floating bubble icon
│   │   │       ├── ChatWidget.jsx
│   │   │       ├── ChatMessage.jsx
│   │   │       ├── ChatInput.jsx
│   │   │       └── useChatStream.js
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── index.jsx
|   |   |---main.jsx
|   |   
│   ├── .env.example
│   └── package.json
│
├── experiments/                       # your AI scratch space, never deployed
│   ├── notebooks/
│   └── scripts/
│
├── docs/
│   └── IREG-IT-Portal-System-Design.md
│
├── .gitignore
└── README.md





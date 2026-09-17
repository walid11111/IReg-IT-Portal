# IREG-IT Portal — Build Phases (with real commands)

Follow these phases **in order**. Each one lists the exact commands to run,
what gets created, and a "Done when" checklist. Don't start a phase until the
previous one's checklist is fully checked.

---

## Phase 0 — Project setup & repo skeleton

**Goal:** an empty but correctly structured repo on GitHub.

**Tasks:**
```bash
mkdir ireg-it-portal && cd ireg-it-portal
mkdir backend frontend docs
git init
```
- [ ] Write `.gitignore`: `.env`, `venv/`, `node_modules/`, `__pycache__/`, `*.pyc`, `staticfiles/`, `.DS_Store`
- [ ] Write a short `README.md`
- [ ] Create GitHub repo, push this skeleton as the first commit

**Done when:** repo exists on GitHub with `backend/`, `frontend/`, `docs/` — all empty.

---

## Phase 1 — Django backend core (website + contact, no AI)

**Goal:** Django serves real team/services data, and accepts contact form submissions.

**Create the Django project (note the trailing dot — puts files directly in `backend/`, not a nested folder):**
```bash
cd backend
django-admin startproject ireg .
```

**Split settings.py into a package:**
```bash
mkdir ireg/settings
mv ireg/settings.py ireg/settings/base.py
touch ireg/settings/__init__.py ireg/settings/local.py ireg/settings/staging.py ireg/settings/production.py
```
In `local.py`: `from .base import *` then override `DEBUG`, `ALLOWED_HOSTS`, `DATABASES`.
In `manage.py` and `wsgi.py`: change `DJANGO_SETTINGS_MODULE` default to `"ireg.settings.local"`.

**Create the `apps/` folder and generate apps into it:**
```bash
mkdir apps && touch apps/__init__.py

python manage.py startapp website apps/website
python manage.py startapp contact apps/contact
python manage.py startapp core apps/core
```

**⚠ For each app just created**, open `apps/<name>/apps.py` and fix:
```python
name = "apps.website"   # not just "website" — must match the real import path
```
Then add all three to `INSTALLED_APPS` in `ireg/settings/base.py` as `"apps.website"`, `"apps.contact"`, `"apps.core"`.

**Tasks:**
- [ ] `website` app: `TeamMember` and `Service` models, DRF serializers + views for `/api/team/` and `/api/services/`, register in `admin.py`
- [ ] `contact` app: `ContactSubmission` model (name, email, message, created_at), serializer, `POST /api/contact/` view that saves the submission and sends a notification email (using Django's email backend, configured against your SMTP setup)
- [ ] `core` app: `/api/health/` endpoint returning `{"status": "ok"}`
- [ ] Write `.env.example` listing every needed env var name (no real values)
- [ ] Run migrations: `python manage.py makemigrations && python manage.py migrate`
- [ ] Create a superuser, add some real team/service data through Django admin

**Done when:** `python manage.py runserver` works, `/api/team/`, `/api/services/`, `/api/health/` all return real JSON, and POSTing to `/api/contact/` saves a row and (if SMTP is configured) sends an email.

---

## Phase 2 — React frontend core (plain content, no chatbot)

**Create the React app:**
```bash
cd ../frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom
```

**Tasks:**
- [ ] Set up routing across `pages/Home.jsx`, `About.jsx`, `Team.jsx`, `Services.jsx`, `Contact.jsx`
- [ ] Build `components/layout/Header.jsx`, `Footer.jsx`, `Nav.jsx`
- [ ] Fill pages with placeholder content and layout — no API calls yet

**Done when:** `npm run dev` shows a complete, navigable site with fake content.

---

## Phase 3 — Connect frontend and backend locally

**Backend:**
```bash
pip install django-cors-headers
```
Add `"corsheaders"` to `INSTALLED_APPS`, the middleware, and `CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]` in `local.py`.

**Frontend — create:**
```
src/api/client.js
src/api/team.js
src/api/services.js
src/api/contact.js
```

**Tasks:**
- [ ] `client.js` holds the base URL: `http://localhost:8000/api`
- [ ] Replace placeholder content in `Team.jsx`/`Services.jsx` with real API calls
- [ ] Wire the `Contact.jsx` form to `POST /api/contact/`
- [ ] Run both servers together, click through every page, confirm zero console errors

**Done when:** every page shows real Django data, and submitting the contact form actually creates a row in the database. Commit and tag this milestone — it's your first full-stack working version.

---

## Phase 4 — Chatbot backend (RAG pipeline)

**Create the chatbot app + ai_engine:**
```bash
cd ../backend
python manage.py startapp chatbot apps/chatbot
# fix apps.py name = "apps.chatbot", add to INSTALLED_APPS

mkdir -p ai_engine/providers ai_engine/ingestion ai_engine/retrieval ai_engine/generation
touch ai_engine/__init__.py ai_engine/providers/__init__.py ai_engine/ingestion/__init__.py \
      ai_engine/retrieval/__init__.py ai_engine/generation/__init__.py
mkdir prompts
```

**Tasks:**
- [ ] Enable the `pgvector` extension in Postgres, install the `pgvector` Python package
- [ ] `chatbot/models.py`: `Document`, `Chunk` (with a `VectorField` embedding column), `ChatSession`, `ChatMessage`
- [ ] `ai_engine/providers/`: your LLM provider's embed + generate calls behind a common interface
- [ ] `ai_engine/ingestion/chunker.py` + `pipeline.py`: split text, embed, save `Chunk` rows
- [ ] A management command `apps/chatbot/management/commands/ingest_content.py` that runs the pipeline against your real team bios/service text
- [ ] `ai_engine/retrieval/vector_search.py`: given a query embedding, return top-k chunks via pgvector
- [ ] `ai_engine/generation/chat_engine.py`: retrieve → build prompt (using `prompts/*.txt`) → call LLM
- [ ] `apps/chatbot/views.py`: thin view — receive message, call `chat_engine`, return the answer
- [ ] Test in Postman: ask a real question, confirm the answer is grounded in your real content

**Done when:** `POST /api/chat/` in Postman returns a correct, grounded answer — no frontend involved yet.

---

## Phase 5 — Chatbot frontend (the visible part)

**Create:**
```
frontend/src/components/ChatWidget/
├── ChatIcon.jsx
├── ChatWidget.jsx
├── ChatMessage.jsx
├── ChatInput.jsx
└── useChatStream.js
frontend/src/api/chat.js
```

**Tasks:**
- [ ] `ChatIcon.jsx`: floating round button, bottom-right, toggles the panel
- [ ] `ChatWidget.jsx`: message list + input, calls `api/chat.js`
- [ ] Wire send → response → display
- [ ] (Recommended) add streaming so replies appear incrementally

**Done when:** clicking the icon on your local site and asking a real question returns a real grounded answer in the panel.

---

## Phase 6 — Testing

**Tasks:**
- [ ] Django: tests for `/api/team/`, `/api/services/`, `/api/contact/`, and `/api/chat/` (mock the LLM call in tests — never hit a paid API from CI)
- [ ] `ai_engine`: unit tests for the chunker and vector search
- [ ] React: basic render tests for key components

**Done when:** `python manage.py test` and `npm test` both pass locally with zero failures.

---

## Phase 7 — CI on GitHub

**Create:** `.github/workflows/deploy.yml` (test job only, no deploy job yet)

**Tasks:**
- [ ] `test` job: checkout → spin up Postgres (`pgvector/pgvector` image) + Redis as service containers → install backend deps → `manage.py test` → install frontend deps → `npm test`
- [ ] Push, confirm the Actions tab goes green
- [ ] Fix any env-var/dependency mismatches CI surfaces that didn't show up locally

**Done when:** the Actions tab shows a consistent green checkmark on pushes.

---

## Phase 8 — CD (deploy) and go live

**Add to the same workflow file:** a `deploy` job.

**Tasks:**
- [ ] Prepare the VPS: Python, Node, Apache, Postgres+pgvector, Redis
- [ ] Gunicorn as a systemd service for Django
- [ ] Apache as reverse proxy + SSL (Let's Encrypt), serving the React build
- [ ] Add GitHub Secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, LLM API key, DB credentials
- [ ] `deploy` job: SSH in, `git pull`, install deps, `migrate`, `collectstatic`, `npm run build`, restart Gunicorn + Apache
- [ ] Push to `main`, watch it deploy, visit your real domain

**Done when:** your domain shows the real, live site with a working chatbot, and every future push to `main` deploys automatically.

---

## Quick reference — phase order

1. Project setup & repo skeleton
2. Django backend core (website + contact apps, no AI)
3. React frontend core (no chatbot)
4. Connect frontend + backend locally
5. Chatbot backend (RAG pipeline)
6. Chatbot frontend (icon + panel)
7. Testing
8. CI on GitHub
9. CD (auto-deploy) and go live

**Rule:** never start a phase until the previous phase's "Done when" line is fully true.

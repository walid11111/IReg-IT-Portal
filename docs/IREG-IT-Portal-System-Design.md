# IREG-IT Portal — Production System Design

**Stack:** React (frontend) + Django/DRF (backend) + PostgreSQL/pgvector (RAG store) + Celery/Redis (async) + GitHub Actions (CI/CD) + Apache (reverse proxy)

---

## 1. Goals & non-goals

**Goals**
- Public-facing company site (Home, About, Team, Services, Contact) that's fast and SEO-friendly
- RAG chatbot that answers questions grounded in real IREG-IT content, not hallucinated
- Deployable via the same CI/CD pattern your company already uses (GitHub Actions → SSH → Apache)
- Survives a real production load: concurrent users, occasional traffic spikes, LLM API latency

**Non-goals (for v1)**
- Multi-tenant support (this is a single-org site)
- Real-time multi-user chat (each session is independent, no websockets needed for v1 — polling/SSE is enough)

---

## 2. Environments

Three environments, each isolated:

| Env | Purpose | Branch | DB | Notes |
|---|---|---|---|---|
| **local** | Dev on your machine | any feature branch | local Postgres (Docker) | `.env.local`, `DEBUG=True` |
| **staging** | Pre-prod verification | `develop` | separate Postgres instance/DB name | mirrors prod config, smaller VPS or same VPS different port |
| **production** | Live site | `main` | production Postgres | `DEBUG=False`, real secrets, real domain |

Never point staging and prod at the same database. Never run migrations against prod without having run them against staging first.

---

## 3. Architecture layers

```
Browser
   │  HTTPS
   ▼
Apache (reverse proxy, SSL termination, serves React static build)
   │
   ├── / (static)              → React build files
   └── /api/*                  → proxied to Gunicorn
                                     │
                                     ▼
                          Gunicorn + Django (DRF)
                                     │
                     ┌───────────────┼────────────────┐
                     ▼               ▼                ▼
              PostgreSQL       Redis (cache +    External LLM API
             (+ pgvector)       Celery broker)    (chat generation)
                                     │
                                     ▼
                              Celery workers
                          (async ingestion/embedding)
```

### Why each piece is there
- **Apache as reverse proxy**: matches your company's existing pattern (all 3 CI/CD guides you read use Apache), handles SSL via Let's Encrypt, serves the React build directly (fast, no Django overhead for static assets)
- **Gunicorn**: production WSGI server for Django — `runserver` is dev-only and single-threaded, not safe for production
- **PostgreSQL + pgvector**: one database for both relational site data (team members, services) and vector embeddings — avoids running a separate vector DB
- **Redis**: dual purpose — Django cache backend (cuts DB load for repeat reads) and Celery message broker
- **Celery workers**: content ingestion (chunking + embedding new docs) is slow and shouldn't block a web request — runs as a background job
- **External LLM API**: kept behind a provider-agnostic interface (see §6) so you can swap providers without rewriting the chat view

---

## 4. Database schema (core tables)

```sql
-- Site content
TeamMember(id, name, role, bio, photo_url, order, is_active)
Service(id, title, description, icon, order, is_active)

-- RAG knowledge base
Document(id, title, source_type, source_url, uploaded_by, created_at)
Chunk(id, document_id FK, content, embedding VECTOR(1536), token_count, chunk_index)

-- Chat
ChatSession(id, session_token, user_ip_hash, created_at)
ChatMessage(id, session_id FK, role [user|assistant], content, retrieved_chunk_ids, created_at)
```

Notes:
- `embedding` dimension depends on your embedding model (1536 for OpenAI `text-embedding-3-small`, 1024/768 for others — pin this early, changing it means re-embedding everything)
- `retrieved_chunk_ids` on `ChatMessage` — store which chunks were used for each answer. Critical for debugging "why did the bot say that" and for evaluating retrieval quality later
- `user_ip_hash`, not raw IP — hash it (e.g. HMAC-SHA256 with a server secret) for basic abuse tracking without storing PII in plain form
- Add an **HNSW or IVFFlat index** on `Chunk.embedding` once you have enough rows (pgvector supports both) — sequential scan is fine at low volume but won't scale

---

## 5. API design

```
GET  /api/team/                    → list team members
GET  /api/services/                → list services
POST /api/chat/                    → { message, session_id? } → { reply, session_id }
GET  /api/chat/history/<session_id>/  → prior messages for that session
POST /api/contact/                 → contact form submission
```

- `/api/chat/` should support **streaming** (Server-Sent Events or chunked `StreamingHttpResponse`) so the reply appears incrementally rather than after a multi-second wait — LLM generation latency is the single biggest UX risk in this system
- Rate limit `/api/chat/` per session/IP (e.g. `django-ratelimit`, 10 messages/minute) — unmetered access to an LLM-backed endpoint is a direct cost/abuse vector
- Contact form: validate + honeypot field or simple CAPTCHA to cut spam

---

## 6. RAG pipeline design

### Ingestion (offline, via Celery task or management command)
1. Source content (team bios, service pages, uploaded docs) → chunked (~300–500 tokens per chunk, ~50 token overlap)
2. Each chunk embedded via the embedding API
3. Stored in `Chunk` table with a foreign key to `Document`

Run ingestion **on content change**, not on every deploy and not on every request. Trigger it manually or via a Django signal when a `TeamMember`/`Service`/`Document` is saved.

### Retrieval + generation (live, per chat request)
1. Embed the incoming user message
2. `SELECT ... ORDER BY embedding <-> %s LIMIT k` (pgvector cosine/L2 distance) — start with k=4–6
3. Build a prompt: system instructions + retrieved chunks + conversation history + user question
4. Call the LLM, stream the response back
5. Log which chunks were retrieved (for the `ChatMessage.retrieved_chunk_ids` field)

### Provider abstraction (important for production flexibility)
```python
# services/llm_provider.py
class LLMProvider(ABC):
    def embed(self, text: str) -> list[float]: ...
    def generate(self, messages: list[dict]) -> Iterator[str]: ...

class OpenAIProvider(LLMProvider): ...
class AnthropicProvider(LLMProvider): ...
```
Pick the active provider via a Django setting (`LLM_PROVIDER = "openai"`), not hardcoded imports scattered through views. Swapping providers later, or falling back to a second provider if one is down, becomes a one-line config change.

---

## 7. Security checklist

- [ ] `DEBUG = False` in production, enforced via environment variable, never hardcoded
- [ ] All secrets (`SECRET_KEY`, DB password, LLM API keys, `VM_SSH_PRIVATE_KEY`) in **GitHub Secrets**, injected as env vars — never committed, never in the repo even in a `.env.example` with real values
- [ ] `ALLOWED_HOSTS` locked to your real domain(s)
- [ ] HTTPS enforced (`SECURE_SSL_REDIRECT = True`), HSTS enabled
- [ ] CORS restricted to your frontend's actual origin (`django-cors-headers`, not `CORS_ALLOW_ALL_ORIGINS`)
- [ ] Rate limiting on `/api/chat/` and `/api/contact/`
- [ ] Django admin path not left at default `/admin/` in prod (obscurity isn't security, but cuts automated scans) + strong password + consider IP allowlist
- [ ] Postgres not exposed to the public internet — only reachable from the app server (firewall/`ufw`, same as your SMTP guide's approach)
- [ ] Dependency scanning (`pip-audit` or GitHub Dependabot) in CI
- [ ] User-submitted content (contact form, any chat input reflected back) properly escaped — Django templates auto-escape, but double-check anywhere you build raw HTML

---

## 8. CI/CD pipeline (mirrors your company's Django pipeline)

```yaml
name: IREG-IT CI/CD

on:
  push:
    branches: ["main", "develop"]
  pull_request:
    branches: ["main"]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16      # postgres image WITH pgvector preinstalled
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: ireg_test
        ports: ["5432:5432"]
        options: >-
          --health-cmd="pg_isready -U postgres"
          --health-interval=10s --health-timeout=5s --health-retries=5
      redis:
        image: redis:latest
        ports: ["6379:6379"]

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v3
        with: { python-version: "3.12" }

      - name: Backend deps
        run: |
          cd backend
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Backend tests
        run: |
          cd backend
          python manage.py migrate
          python manage.py test

      - name: Frontend deps + build
        run: |
          cd frontend
          npm ci
          npm run build

      - name: Frontend tests
        run: |
          cd frontend
          npm test -- --watchAll=false

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'      # only main deploys to prod; add a second job gated on develop for staging

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            set -e   # fail fast — don't limp forward on a broken step

            cd /var/www/ireg-it-portal

            git fetch origin
            git checkout main
            git pull origin main

            # --- Backend ---
            cd backend
            source venv/bin/activate
            pip install -r requirements.txt
            python manage.py migrate --noinput
            python manage.py collectstatic --noinput

            # --- Frontend ---
            cd ../frontend
            npm ci
            npm run build
            # build output served by Apache DocumentRoot

            # --- Restart services ---
            sudo systemctl restart gunicorn
            sudo systemctl restart celery-ireg
            sudo systemctl restart apache2
```

Differences from the generic tutorial you read earlier, borrowed instead from your company's real pipeline pattern:
- `set -e` so the script stops on the first failure instead of silently continuing (your company's script doesn't have this — worth adding, it's a real gap)
- Service container for Postgres uses the **pgvector-enabled image**, not plain `postgres:13` — plain Postgres doesn't have the extension
- Separate frontend and backend build/test steps since this is a two-stack repo, unlike the single-stack Django guide
- `git checkout main` + `git pull` rather than assuming clean state — same defensive pattern your company uses (they add a `git stash` too; add that if your VPS ever accumulates local changes)

**Staging**: duplicate the `deploy` job, gate on `develop` branch, point at a different directory/port on the VPS (or a second VPS if budget allows). Never test migrations for the first time on `main`.

---

## 9. Zero(ish)-downtime deploy notes

- Run `migrate` **before** restarting Gunicorn — new code shouldn't hit old schema
- Gunicorn restart via `systemctl restart` causes a brief gap; for true zero-downtime later, look at Gunicorn's graceful reload (`SIGHUP`) or running behind multiple app instances with a load balancer — not needed at your current scale, but know it exists
- Never run `collectstatic --noinput` and serve stale static files simultaneously — Apache should point at the same static root Django just wrote to

---

## 10. Observability

- **Error tracking**: Sentry (free tier is enough at this scale) wired into Django — catches unhandled exceptions in prod with stack traces, way better than grepping Apache logs
- **Health check endpoint**: `GET /api/health/` returning 200 + basic DB/Redis connectivity check — point an uptime monitor (UptimeRobot, free tier) at it
- **Logs**: Django logging config writing to files under `/var/log/ireg-it/`, rotated (`logrotate`), separate from Apache's own logs
- **LLM cost/usage tracking**: log token counts per chat request (most LLM APIs return usage in the response) — this is the one cost center that can silently balloon if the chat endpoint isn't rate-limited

---

## 11. Backup & recovery

- Nightly `pg_dump` cron job → compressed → stored off-VPS (S3, Backblaze, or even the company's Google Drive via a script) — losing the VPS shouldn't mean losing the database
- Keep at minimum 7 daily backups + 4 weekly
- Document the restore procedure once, before you need it under pressure

---

## 12. Open decisions still needed from you

1. **LLM provider** — OpenAI vs Anthropic vs self-hosted determines `requirements.txt` entries and the `LLM_PROVIDER` config value
2. **Embedding model + dimension** — pins the `VECTOR(n)` column size, hard to change later without re-embedding everything
3. **Content source for RAG** — static content you write vs. scraped pages vs. uploaded docs — determines whether you need a document upload/parsing pipeline (PDF/DOCX extraction) in addition to the chunking/embedding pipeline

---

## 13. Suggested build order

1. Django project + models (`TeamMember`, `Service`) + DRF endpoints — no chatbot yet
2. React site consuming those endpoints — static pages working end-to-end
3. CI/CD pipeline wired up and deploying the *plain* site successfully — prove the pipeline works before adding RAG complexity
4. Add `Document`/`Chunk` models + pgvector + ingestion command
5. Add `/api/chat/` with retrieval + generation, provider-abstracted
6. Add streaming, rate limiting, Sentry, health checks
7. Add Celery for async ingestion once ingestion volume justifies it (can start synchronous for v1 if content set is small)

Get the boring plumbing (steps 1–3) deployed and stable first. The RAG chatbot is the impressive part, but a broken deploy pipeline under a working chatbot is worse than a working deploy pipeline under a placeholder chatbot.

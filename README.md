# 🧠 BinaryTrace — Lightweight LLM Inference & Observability Platform

BinaryTrace is a lightweight full-stack LLM observability platform built for real-time inference monitoring, telemetry ingestion, and multi-provider AI interactions.

The platform supports:

* Multi-turn conversational chat
* Real-time SSE streaming
* Multi-provider LLM routing
* Async telemetry ingestion
* PII redaction middleware
* Analytics dashboards
* Dockerized deployment
* Kubernetes manifests

---

# ✨ Key Features

* Multi-provider LLM support (Gemini + OpenAI)
* Real-time streaming responses using SSE
* Lightweight inference logging SDK/wrapper
* Event-driven telemetry ingestion pipeline
* MongoDB telemetry + conversation persistence
* PII redaction middleware
* Observability dashboards for latency/errors/tokens
* Conversation persistence & resume support
* AbortController request cancellation
* Docker Compose local setup
* Kubernetes deployment manifests

---

# 🏗️ System Architecture

```text
Client UI
   │
   ▼
Express API Gateway
   │
   ▼
LLM Wrapper Layer
   ├── Gemini Provider
   └── OpenAI Provider
   │
   ▼
SSE Stream Response
   │
   ▼
Telemetry Event Emitter
   │
   ▼
Async Ingestion Worker
   │
   ▼
MongoDB
   │
   ▼
Analytics Dashboard
```

---

# 📋 Assignment Coverage

| Requirement                  | Status |
| ---------------------------- | ------ |
| Multi-turn Chat UI           | ✅      |
| LLM Wrapper SDK              | ✅      |
| Real-time Ingestion Pipeline | ✅      |
| Database Persistence         | ✅      |
| Multi-provider Support       | ✅      |
| Streaming Responses          | ✅      |
| Dashboard Metrics            | ✅      |
| Docker Compose Setup         | ✅      |
| Event-driven Architecture    | ✅      |
| PII Redaction                | ✅      |
| Conversation Resume/Cancel   | ✅      |
| Kubernetes Manifests         | ✅      |

---

# 🛠️ Tech Stack

## Frontend

* React
* TailwindCSS
* Recharts

## Backend

* Node.js
* Express.js
* Server-Sent Events (SSE)

## Database

* MongoDB Atlas
* Mongoose

## AI Providers

* Google Gemini Flash
* OpenAI GPT-4o Mini

## Infrastructure

* Docker Compose
* Kubernetes Manifests

---

# 🔒 Environment Variables

> [!WARNING]
> Google Gemini and OpenAI API keys are **NOT** pre-configured or hardcoded in this codebase due to cost and safety constraints. To test LLM generation, you must obtain your own keys and insert them into the `server/.env` file.

## `server/.env`

```env
PORT=4000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/binarytrace

GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

## `client/.env`

```env
VITE_API_URL=http://localhost:4000/api
```

---

# 🐳 Docker Compose Setup

Run the entire application stack with one command:

```bash
docker compose up --build
```

Services:

* Frontend
* Backend API
* MongoDB

Frontend URL:

```text
http://localhost:5173
```

---

# ☸️ Kubernetes Deployment

The repository includes lightweight Kubernetes manifests inside:

```text
/k8s
```

Deploy using:

```bash
kubectl apply -f k8s/deployment.yaml
```

The manifests include:

* Deployments
* Services
* ConfigMaps
* Secrets

---

# ⚡ Local Development

## Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

## Start Backend

```bash
cd server
npm run dev
```

## Start Frontend

```bash
cd client
npm run dev
```

---

# 🔄 Inference & Ingestion Flow

```text
User Prompt
     │
     ▼
PII Redaction Middleware
     │
     ▼
LLM Wrapper SDK
     │
     ├── SSE Streaming Response
     │
     ▼
Telemetry Event Emitter
     │
     ▼
Async Ingestion Worker
     │
     ▼
MongoDB Storage
     │
     ▼
Observability Dashboard
```

---

# 📊 Observability Metrics

The dashboard tracks:

* Total requests
* Average latency
* Error rate
* Token usage
* Provider usage
* Request trends
* Recent inference logs

---

# 🔐 PII Redaction

Before prompts are sent to external providers, sensitive information is automatically masked.

Supported patterns:

* Emails
* Phone numbers
* National IDs / SSNs

Example:

```text
john@gmail.com
→ [REDACTED_EMAIL]
```

---

# 🗄️ Database Design

## Collections

### Conversations

```text
title
provider
createdAt
updatedAt
```

### Messages

```text
conversationId
role
content
createdAt
```

### Inference Logs

```text
conversationId
provider
model
latency
promptTokens
completionTokens
status
error
inputPreview
outputPreview
createdAt
```

---

# 📌 Schema Design Decisions

* Chat history and telemetry logs are separated to avoid analytical workloads affecting conversational reads.
* MongoDB was selected due to its flexible document schema, which fits semi-structured telemetry payloads and evolving inference metadata.
* Inference logs store previews instead of full payloads to reduce storage overhead and improve privacy handling.

---

# ⚖️ Architectural Tradeoffs

## EventEmitter vs Dedicated Queue

The ingestion system uses Node.js EventEmitter for lightweight asynchronous processing.

### Benefits

* Zero external queue dependency
* Faster local setup
* Simpler development workflow

### Tradeoff

* In-memory events are not durable across crashes

### Future Scaling

* Redis/BullMQ
* Kafka
* RabbitMQ

---

## MongoDB vs Timeseries Databases

MongoDB simplifies:

* Setup
* Schema iteration
* JSON telemetry storage

Future scaling options:

* ClickHouse
* InfluxDB
* TimescaleDB

---

# 📈 Scaling Considerations

* EventEmitter can be replaced with Redis/BullMQ or Kafka for distributed ingestion pipelines.
* SSE streaming can be horizontally scaled behind load balancers.
* Kubernetes HPA can autoscale ingestion workers independently from API servers.
* Telemetry analytics can be migrated to columnar timeseries databases for large-scale workloads.

---

# 🛡️ Failure Handling

* Failed inference requests are logged with error metadata.
* Ingestion failures do not block chat responses.
* SSE streams terminate safely on disconnects.
* Provider failures are isolated through wrapper abstractions.
* Request cancellation uses AbortController.

---

# 🎤 Additional Features

* Voice-to-text message input
* Conversation resume support
* Request cancellation
* Real-time streaming UI
* Provider switching

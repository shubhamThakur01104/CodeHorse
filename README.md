# CodeHorse 🐴🤖

An automated AI-powered code review SaaS platform (inspired by CodeRabbit) that monitors GitHub pull requests via webhooks, performs context-aware code analysis using **RAG (Retrieval-Augmented Generation)**, and provides detailed automated feedback.

---

## 📌 1. Project Overview

**CodeHorse** is a full-stack SaaS web application designed to bridge the gap between human code reviews and automated intelligence. When developers create or synchronize a Pull Request on GitHub, CodeHorse instantly intercepts the webhook event, processes the code diff, queries a vector database for context, and generates comprehensive architectural and bug-finding reviews.

### What it solves and why it exists:
Manual code reviews can bottleneck development pipelines, leading to overlooked bugs, stylistic inconsistencies, and delayed feedback cycles. CodeHorse automates this bottleneck by acting as an intelligent virtual reviewer that inspects code changes in real-time, leveraging LLMs combined with repository-level vector context.

### Primary Purpose & Capabilities:
* **Real-Time GitHub Webhook Integration:** Listens to PR lifecycle events (`pull_request.opened`, `pull_request.synchronize`) to trigger automated analysis.
* **RAG-Powered Contextual Code Reviews:** Generates code embeddings and stores/queries them using **Pinecone** vector search alongside LLMs to ensure reviews understand the broader repository context.
* **Asynchronous Background Processing:** Uses **Inngest** to queue, process, and execute heavy AI review pipelines reliably without timing out HTTP webhook requests.
* **Modern Full-Stack Dashboard:** Built with **Next.js 16/React 19**, styled with Tailwind CSS, and secured with **Better Auth** (GitHub OAuth).
* **Relational Database & Tracking:** Powered by **PostgreSQL** and **Prisma ORM** to manage user sessions, connected repositories, and historical reviews.

---

## ⚡ 2. Key Features

* **Automated PR Monitoring:** Connect your GitHub repositories with a single click and let CodeHorse watch over every pull request.
* **Context-Aware AI Feedback:** Goes beyond simple linting by offering deep architectural insights, bug detections, and improvement suggestions.
* **Event-Driven Job Queues:** Background workers orchestrated via Inngest ensure seamless handling of high-concurrency PR events.
* **Interactive Dashboard:** Manage connected repositories, review past AI feedback, and monitor review statuses (`completed`, `pending`, `failed`).

---

## 🛠️ 3. Tech Stack

| Category | Technology / Library | Architectural Role |
| :--- | :--- | :--- |
| **Framework** | Next.js 14/15/16 (App Router), React | Full-stack web framework & modern UI rendering |
| **Language** | TypeScript | Type safety across client and server logic |
| **Database & ORM** | PostgreSQL, Prisma ORM | Relational data persistence & type-safe database client |
| **Authentication** | Better Auth (GitHub OAuth) | Secure user session management & third-party auth |
| **AI & Vector DB** | Google Gemini API, Pinecone, Vercel AI SDK | LLM text generation, code embeddings, and vector similarity search |
| **Background Jobs** | Inngest | Event-driven serverless background job orchestration |
| **Styling** | Tailwind CSS, Shadcn UI components | Clean, modern, responsive UI design |

---

## 🏗️ 4. System Architecture & Workflow

CodeHorse uses an event-driven architecture combining Next.js Server Actions, webhooks, vector search, and asynchronous background workers.

```mermaid
flowchart TD
    subgraph GitHub [GitHub Repository]
        PR[Pull Request Created / Updated]
    end

    subgraph CodeHorse [CodeHorse Platform (Next.js)]
        Webhook["/api/webhooks/github"] -->|Triggers Event| Inngest[Inngest Background Job]
        Dashboard[Next.js Dashboard] -->|User Actions| DB[(PostgreSQL + Prisma)]
    end

    subgraph AI_Pipeline [AI & RAG Engine]
        Inngest -->|Fetch Code Diff & Files| Gemini[Google Gemini API]
        Gemini -->|Generate Embeddings| Pinecone[(Pinecone Vector DB)]
        Pinecone -->|Context Retrieval| LLM[LLM Code Analysis]
    end

    subgraph Storage [Persistence]
        LLM -->|Save Review Results| DB
    end

    PR -->|HTTP POST Webhook| Webhook
```

### End-to-End Execution Flow:
1. **Repository Connection:** The user logs in via GitHub OAuth (Better Auth) and links their repository to CodeHorse.
2. **Webhook Trigger:** When a PR is opened or updated on GitHub, a secure webhook payload hits `/api/webhooks/github`.
3. **Background Job Dispatch:** An **Inngest** background function is triggered instantly, acknowledging the webhook immediately to prevent timeouts.
4. **RAG & Context Retrieval:** Inngest fetches the pull request diff, generates/retrieves vector embeddings via **Google Gemini** and **Pinecone**, and constructs a prompt with full repository context.
5. **AI Review Generation:** The LLM analyzes the code changes for bugs, security vulnerabilities, and code style.
6. **Persistence & UI Display:** The generated review is saved in PostgreSQL via **Prisma**, and users can view the detailed breakdown directly on their Next.js dashboard.

---

## 🚀 5. Getting Started

### Prerequisites
* Node.js / Bun installed on your machine.
* A PostgreSQL database instance (local or cloud like Neon/Supabase).
* API Keys for:
  * Google Gemini API
  * Pinecone Vector Database
  * Inngest (Event Key & Signing Key)
  * GitHub OAuth App credentials

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shubhamThakur01104/CodeHorse.git
   cd CodeHorse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/codehorse"
   BETTER_AUTH_SECRET="your_better_auth_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   GEMINI_API_KEY="your_gemini_api_key"
   PINECONE_API_KEY="your_pinecone_api_key"
   PINECONE_INDEX="your_pinecone_index"
   INNGEST_EVENT_KEY="your_inngest_event_key"
   INNGEST_SIGNING_KEY="your_inngest_signing_key"
   ```

4. **Run Database Migrations:**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Run Inngest Dev Server (for local webhook testing):**
   ```bash
   npx inngest-cli@latest dev
   ```

---

## 📄 License
This project is licensed under the MIT License.

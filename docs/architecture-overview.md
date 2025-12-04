 FILE 4  docs/architecture-overview.md

# Prometheus Architecture Overview

Prometheus is a modular, multi-agent, AI-assisted courseware generation system

built around three pillars:

1. **Core Engine (PKE + Generation + Formatting)**  

2. **Orchestrator (Multi-Agent Command Layer)**  

3. **UI (Prototype + Final Next.js Interface)**  

This document provides a high-level overview of how these components interact

and how Prometheus maintains coherence, precision, and reliability across all

modules and agents.

---

# 1. Top-Level Architecture

Prometheus2.0/

core/ # Engine (PKE, generation, formatting, API)

orchestrator/ # Multi-agent controller + task routing

ui/ # Streamlit prototype + Next.js final UI

docs/ # Governance, specifications, memory, workflows

Prometheus follows a **hub-and-spoke model**:

- **Hub:** The Orchestrator  

- **Spokes:**  

  - Core  

  - UI  

  - PKE  

  - External AI Agents (Sarah, Claude, Codex)

The system emphasizes **strong separation of responsibilities**,  

with **Sarah providing architectural authority** and  

**Claude/Codex providing implementation muscle**.

---

# 2. Core Components

## 2.1 Promethean Knowledge Engine (PKE)

The PKE is the structured-memory subsystem.

It provides:

- canonical course structures  

- domain knowledge  

- terminology rules  

- templates and formatting logic  

- data for lesson builders and assessment generators  

- thematic, taxonomic, and semantic coherence  

- retrieval across documents, policies, corpora, and learning assets  

It is **stateless** in execution but fed by curated, stable data stores.

---

## 2.2 Generation Engine

Responsible for producing:

- Course Descriptions  

- CLOs  

- Topics, Subtopics  

- Lesson Titles  

- Lesson Content  

- Slide Material  

- MCQs  

- QA Forms  

- Handbooks and PPT content  

Unlike raw LLM generation, Prometheus uses:

- constraint-based prompting  

- templates  

- semantic anchors  

- PKE-driven reinforcement  

- deterministic fl air-level variation  

---

## 2.3 Formatting Engine

Outputs:

- PowerPoint (PPTX)  

- Word (DOCX)  

- Excel (XLSX)  

- PDF  

Formatting rules:

- Rabdan branding as default  

- alternative themes supported  

- bilingual layout engine  

- grid-aligned, spacing-correct output  

- error checking for missing placeholders  

---

## 2.4 Core API (FastAPI)

A clean API layer enabling:

- UI  Core communication  

- Orchestrator hooks  

- external integration  

- future mobile/desktop clients  

---

# 3. Orchestrator

The Orchestrator manages:

- multi-agent assignments  

- cross-checking and validation  

- context injection  

- memory anchoring  

- reasoning loops  

- large task decomposition  

- error recovery  

Agents include:

- **Sarah**  strategic logic, architecture, constraints  

- **Claude**  large-scale code, structural transformations  

- **Codex**  fine-grained edits, file operations  

- (Future optional agents: test runner, documentation agent, build agent)

Each agent receives a **Context Package** containing:

- relevant architectural docs  

- PKE knowledge slices  

- memory framework references  

- prior decisions  

- task requirements  

This prevents drift and ensures coherence.

---

# 4. UI Layer

Two phases:

### 4.1 Streamlit Prototype

- Rapid iteration  

- Fast UX validation  

- Direct Core integration  

- Disposable by design, but essential for early testing  

### 4.2 Next.js UI (Vercel)

- Final interface  

- Production-ready  

- Dynamic course builder  

- EN/AR bilingual mode  

- Clean, premium aesthetic  

- Optimised component library  

- Full compatibility with Orchestrator API  

- Authentication optional (institution-dependent)  

---

# 5. Data Flow Summary

(User)



(UI)

 requests

(Core API)

 logic

(PKE + Generation + Formatting)

 artefacts

(UI preview or file export)

When high-level tasks are triggered:

Orchestrator

 decomposes

Agents execute in parallel

 validate with schemas + memory

Orchestrator aggregates

 returns final artefact

UI/Core consume as required

---

# 6. Development Workflow Principles

- **Spec-first development**  

- **Separation of concerns**  

- **Deterministic generation**  

- **Memory-aware orchestration**  

- **Test-heavy Core logic**  

- **Always review with Sarah for architecture**  

- **Claude for large-scale code**  

- **Codex for precise local changes**  

---

# 7. Status

This architecture overview will evolve as modules develop,  

but this version represents the agreed baseline for Prometheus2.0.
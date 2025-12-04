# Prometheus Core



The **Core** directory contains the computational heart of Prometheus:

the Promethean Knowledge Engine (PKE), the content generation modules, the

formatting and transformation layer, and the API surface that exposes all system

capabilities to the UI and Orchestrator.



This folder represents the engine room of the Prometheus ecosystem.



---



## Structure







core/

pke/ # Knowledge structures, retrieval, embeddings, corpora

generation/ # Course generation logic and content construction

formatting/ # PPTX, DOCX, XLSX, PDF and semantic formatting tools

api/ # FastAPI service exposing PKE + generation capabilities

tests/ # Unit, integration and regression tests

README.md # This file





---



## Responsibilities



### 1. Promethean Knowledge Engine (PKE)

- Loads structured knowledge inputs (course specs, templates, corpora).

- Performs passage retrieval and contextual reinforcement.

- Supplies ground truth to all AI agents.

- Ensures consistency in terminology, branding, structure, and constraints.



### 2. Generation Modules

- Constructs CLOs, Topics, Subtopics, Lessons, Slide Content, MCQs, QA Forms.

- Supports both AI-generated and user-specified content flows.

- Responsible for deterministic reproducibility when inputs are identical.



### 3. Formatting Layer

- Converts content into:

  - PowerPoint (PPTX)

  - Word (DOCX)

  - Excel (XLSX)

  - PDF (via LaTeX or ReportLab)

- Ensures Rabdan branding (or selected theme) is applied correctly.

- Enforces typography, layout rules, spacing, and bilingual column modes.



### 4. API Layer (FastAPI)

- Provides endpoints for:

  - /generate/course

  - /generate/lesson

  - /format/pptx

  - /format/docx

  - /format/xlsx

  - /pke/query

  - /orchestrator/hooks

- Interfaces cleanly with the UI (Streamlit prototype, Next.js final UI).



---



## Development Guidelines



- **Spec-first.**  

  All new modules require a written mini-spec in /docs/workflows before coding.



- **Test-first where possible.**  

  Regression tests are essential for PKE stability.



- **Pure logic only.**  

  No UI, orchestration, or agent logic resides here.



- **Idempotent generation.**  

  Same structured inputs must always yield identical outputs.



---



## Status



This directory is currently scaffolded and awaiting population.



All changes to this directory must be reviewed by Sarah (strategic logic)  

and may be implemented by Codex or Claude Code depending on scope.
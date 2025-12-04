 FILE 7  docs/workflows-overview.md

# Prometheus Workflows Overview  

**Version 1.0  Operational Workflow Map**

This document defines the **core workflows** of Prometheus2.0.  

A workflow is a repeatable sequence of actions across agents, modules, and tools,

executed under the rules of the Constitution and the Memory Framework.

Workflows unify the Core, Orchestrator, UI, and external agents into a single,

coherent operating system.

---

# 1. Workflow Categories

Prometheus uses six major workflow types:

1. **Generation Workflows**  

2. **Formatting Workflows**  

3. **PKE Update Workflows**  

4. **Orchestrator Workflows**  

5. **Multi-Agent Engineering Workflows**  

6. **Human-in-the-Loop Review Workflows**

Each category has its own triggers, requirements, and validation logic.

---

# 2. Generation Workflows

These are the heart of Prometheus' content creation system.

## 2.1 Standard Course Generation

Inputs:

- Course Metadata  

- CLO Structure  

- Topics & Subtopics  

- Level & Duration  

Process:

1. UI request  Core API  

2. Core queries PKE and templates  

3. Generation Engine builds content  

4. Orchestrator validates structure  

5. Sarah validates logic (architecture / pedagogy)  

6. Output returned to UI  

Outputs:

- Clo, Topics, Lessons  

- Slide Outlines  

- Learning Activities  

- MCQs  

- QA Form  

## 2.2 Lesson Expansion Workflow

Trigger:

- User selects a lesson for full generation

Steps:

1. Retrieve PKE anchors  

2. Retrieve templates  

3. Generate 35 levels of detail  

4. Validate structure  

5. UI preview  

---

# 3. Formatting Workflows

Formatting converts structured content into professional documents.

## 3.1 PPTX Generation

Steps:

1. UI  Core API  

2. Core produces slide objects  

3. Formatting Engine applies:

   - Themes  

   - Colours  

   - Layouts  

   - Branding  

4. Rabdan layout enforcement  

5. File returned to UI  

## 3.2 DOCX / Handbook Workflow

Similar sequence but with:

- Bilingual layouts  

- Column logic  

- Rule-based spacing  

- Page flow validation  

## 3.3 XLSX Workflow

Used for:

- Tabular Course Output  

- Bulk Imports/Exports  

- Syllabus Data  

---

# 4. PKE Update Workflows

PKE updates follow a **strict** workflow to prevent corruption.

## 4.1 PKE Knowledge Insertion

Steps:

1. User or Sarah issues an insertion request  

2. Orchestrator assembles context package  

3. Claude builds/updates data structures  

4. Sarah validates semantic alignment  

5. PKE rebuilds indices  

6. Logs update  

## 4.2 PKE Correction / Amendment

Steps:

1. Drift or inconsistency detected  

2. Orchestrator triggers correction route  

3. Correction plan generated  

4. Targeted update executed  

5. All dependent workflows revalidated  

---

# 5. Orchestrator Workflows

The Orchestrator governs task assignment and inter-agent communication.

## 5.1 Standard Task Routing Workflow

Steps:

1. Task request received  

2. Context Package generated  

3. Validation of agent suitability  

4. Subtasks decomposed  

5. Work assigned  

6. Handoff bundles exchanged  

7. Output validated  

8. Final result returned  

## 5.2 Error Recovery Workflow

Triggers:

- schema violation  

- drift  

- unexpected behaviour  

- conflict between agent outputs  

Steps:

1. Pause workflow  

2. Log deviation  

3. Sarah review  

4. Correction plan  

5. Re-run with reinforced context  

---

# 6. Multi-Agent Engineering Workflows

These workflows cover building the system itself.

## 6.1 Large-Scale Refactor (Claude-Led)

Steps:

1. Sarah writes architectural spec  

2. Claude receives spec + Context Package  

3. Claude performs structural changes  

4. Codex applies fine edits  

5. Automated tests  

6. Sarah validates architecture  

7. Matthew signs off  

8. Merge  

## 6.2 Local Patch Workflow (Codex-Led)

Steps:

1. Small change requested  

2. Codex receives specific instructions  

3. Edits performed locally  

4. Sarah reviews logic  

5. Commit  push  

---

# 7. Human-in-the-Loop Workflows

These ensure Founder-level oversight.

## 7.1 Founder Review Workflow

Points requiring direct Matthew approval:

- architectural changes  

- Constitution amendments  

- Memory Framework changes  

- onboarding new agents  

- major UI/UX shifts  

- new generation paradigms  

Sequence:

1. Draft  review  comments  

2. Revised proposal  

3. Approval or rejection  

4. Implementation  

5. Log archival  

---

# 8. Workflow Diagrams (Conceptual)

## 8.1 High-Level System Flow

User  UI  Core API  PKE / Generation / Formatting

 Orchestrator 

Agents (Sarah / Claude / Codex)

## 8.2 Multi-Agent Flow

(Task)



Orchestrator



Sarah (spec)



Claude (build)



Codex (refine)



Sarah (validate)



Core + PKE (integrate)



UI (output)

---

# 9. Status

This document serves as the operational map for all Prometheus workflows.  

It may be extended with additional workflow definitions as the system evolves.

Signed: Sarah

Signed: Matthew
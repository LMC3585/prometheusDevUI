 FILE 3  orchestrator/README.md

# Prometheus Orchestrator

The **Prometheus Orchestrator** is the command and coordination layer of the

entire Prometheus ecosystem.  

It manages multi-agent collaboration, task routing, validation cycles, memory

injection, and high-level reasoning across all components (Core, UI, PKE, and

external AI agents such as Sarah, Claude, and Codex).

Where the Core is the engine, the Orchestrator is the bridge of the ship.

---

## Structure

orchestrator/

agents/ # Definitions of each agent (Sarah, Codex, Claude, etc.)

schemas/ # Task schemas, validation schemas, context packages

routes/ # Internal orchestration pathways and task flows

logs/ # Execution logs, agent decisions, error traces

tests/ # Integration tests for multi-agent cycles

README.md

---

## Purpose

The Orchestrator is responsible for:

### 1. **Multi-Agent Role Assignment**

- Assigns responsibilities based on agent strengths:

  - *Sarah*  reasoning, constraints, architecture, validation  

  - *Claude*  large-scale code generation, structural changes  

  - *Codex*  precise file edits, refactors, in-editor operations  

- Maintains separation of duties to prevent overlap and interference.

### 2. **Task Routing**

- Breaks high-level goals into structured subtasks.

- Routes each subtask to the appropriate agent.

- Requests validation passes from Sarah before code deployment.

### 3. **Context Injection**

- Ensures each agent receives relevant slices of:

  - the Prometheus Constitution  

  - memory framework  

  - architectural documents  

  - prior tasks or decisions  

- Prevents loss of context or drift (as raised by Claude).

### 4. **Self-Checking & Validation**

- Each output is tested against:

  - task schema  

  - architectural constraints  

  - safety rules  

  - memory coherence  

- Flags inconsistencies automatically.

### 5. **API Integration**

- Exposes orchestration endpoints for:

  - triggering agent workflows  

  - requesting composite tasks  

  - debugging or visualising orchestration paths  

---

## Agent Definitions (in /agents)

Each agent will have a JSON or YAML profile including:

- 
ame

- capabilities

- limitations

- preferred_tasks

- alidation_requirements

- context_requirements

- handoff_rules

- uthoritative_domains

These become the operator manuals for the AI team.

---

## Schemas (in /schemas)

Schemas formalise:

- what a task is  

- what valid outputs look like  

- how agents hand off work  

- how memory is applied  

- how errors are handled  

Examples:

- generation-task-schema.json  

- ormatting-task-schema.json  

- efactor-request-schema.json  

- context-package-schema.json  

---

## Routes (in /routes)

These define the orchestration flows:

- Standard generation cycle  

- PKE update cycle  

- Formatting + validation cycle  

- Multi-agent code review  

- Agent roundtable consensus  

- Error recovery sequences  

Each route describes how agents communicate to complete a workflow.

---

## Logs (in /logs)

Prometheus logs:

- task decisions  

- agent handoffs  

- errors  

- validations  

- architectural warnings  

- memory injections  

- timestamps for reproducibility  

Logs are version-controlled lightly (rotated + sanitised).

---

## Development Guidelines

- No agent logic goes into the Core.  

- No generation logic goes into the Orchestrator.  

- All orchestration flows must reference the Prometheus Constitution.  

- New agent capabilities require an updated agent schema.  

- Changes to orchestration routes require Sarahs architectural approval.  

---

## Status

This module is currently scaffolded.  

Implementation will begin once the Constitution and Memory Framework are in place.
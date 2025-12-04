# Prometheus Chronicle Schema

This document formally specifies the structure of Chronicle events.

## Event Fields

- `timestamp` (string, required)  
  - ISO8601 UTC, e.g. `2025-12-10T09:41:00Z`

- `id` (string, required)  
  - Unique event identifier (`evt-YYYYMMDD-HHMMSS-XX`)

- `category` (string, required)  
  - One of:
    - `milestone`
    - `decision`
    - `implementation`
    - `refactor`
    - `failure`
    - `recovery`
    - `governance_change`
    - `pke_update`
    - `ui_change`
    - `safety_event`

- `subtype` (string, optional but recommended)  
  - Context-specific tag (e.g. `pptx_automation_v1`, `memory_framework_v1`)

- `actor` (string, required)  
  - `orchestrator`, `sarah`, `claude`, `codex`, `core`, `ui`, or future agents.

- `summary` (string, required)  
  - One-sentence description of the event.

- `details` (object, optional)  
  - `modules_touched` (array of strings)
  - `agents_involved` (array of strings)
  - `decision_basis` (string)
  - `related_tasks` (array of strings)
  - `links` (array of strings: docs, commits, issues, etc.)
  - `notes` (string; free-form comments)

Any additional fields must be backward compatible and documented here.
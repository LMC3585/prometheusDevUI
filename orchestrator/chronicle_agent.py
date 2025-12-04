"""
Prometheus Chronicle Agent (PCA)

Responsible for:
- Receiving structured event payloads from the Orchestrator and agents
- Enriching them with timestamps and IDs
- Appending them to the appropriate chronicle-YYYY.jsonl file
"""

from __future__ import annotations
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
import json
import uuid

CHRONICLE_DIR = Path("logs")

@dataclass
class ChronicleEvent:
    timestamp: str
    id: str
    category: str
    subtype: Optional[str]
    actor: str
    summary: str
    details: Dict[str, Any]

class ChronicleAgent:
    """
    The ChronicleAgent is a thin, deterministic logging layer.

    It does not make decisions, interpret content, or apply business logic.
    It simply records events in a stable, append-only format.
    """

    def __init__(self, chronicle_dir: Path = CHRONICLE_DIR) -> None:
        self.chronicle_dir = chronicle_dir
        self.chronicle_dir.mkdir(parents=True, exist_ok=True)

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    def _new_event_id(self) -> str:
        # Simple unique ID; can be replaced with a more structured scheme later
        return f"evt-{uuid.uuid4()}"

    def _chronicle_path_for_year(self, year: int) -> Path:
        return self.chronicle_dir / f"chronicle-{year}.jsonl"

    def log_event(
        self,
        category: str,
        actor: str,
        summary: str,
        subtype: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> ChronicleEvent:
        """
        Main public method for logging an event.
        """
        now = datetime.now(timezone.utc).replace(microsecond=0)
        event = ChronicleEvent(
            timestamp=now.isoformat(),
            id=self._new_event_id(),
            category=category,
            subtype=subtype,
            actor=actor,
            summary=summary,
            details=details or {},
        )

        self._append_event(event, year=now.year)
        return event

    def _append_event(self, event: ChronicleEvent, year: int) -> None:
        path = self._chronicle_path_for_year(year)
        with path.open("a", encoding="utf-8") as f:
            json_line = json.dumps(asdict(event), ensure_ascii=False)
            f.write(json_line + "\n")
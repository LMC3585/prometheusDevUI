"""Canonical course data structures used throughout Prometheus.

Each dataclass encodes a specific layer of the instructional design stack.
These models are intentionally rich because downstream generators rely on
them as the single source of truth for program structure, assessment
alignment, and delivery configuration.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


@dataclass(slots=True)
class PerformanceCriteria:
    """Observable behaviors that demonstrate mastery of a learning outcome."""

    key: str
    description: str
    proficiency: Optional[str] = None
    assessment_method: Optional[str] = None
    notes: Optional[str] = None


@dataclass(slots=True)
class SessionBlock:
    """Atomic delivery unit inside a lesson plan."""

    key: str
    title: str
    sequence: int
    duration_minutes: int
    modality: str = "in-person"
    activities: List[str] = field(default_factory=list)
    resources: List[str] = field(default_factory=list)
    assessment_links: List[str] = field(default_factory=list)


@dataclass(slots=True)
class Lesson:
    """A cohesive instructional chunk aligned to one or more CLOs."""

    key: str
    title: str
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    modality: Optional[str] = None
    objectives: List[str] = field(default_factory=list)
    associated_clos: List[str] = field(default_factory=list)
    performance_criteria: List[PerformanceCriteria] = field(default_factory=list)
    session_blocks: List[SessionBlock] = field(default_factory=list)
    resources: List[str] = field(default_factory=list)


@dataclass(slots=True)
class Subtopic:
    """Secondary grouping underneath a topic."""

    key: str
    title: str
    description: Optional[str] = None
    order: int = 0
    associated_clos: List[str] = field(default_factory=list)
    lessons: List[Lesson] = field(default_factory=list)


@dataclass(slots=True)
class Topic:
    """Primary curricular pillar that groups subtopics."""

    key: str
    title: str
    description: Optional[str] = None
    order: int = 0
    associated_clos: List[str] = field(default_factory=list)
    subtopics: List[Subtopic] = field(default_factory=list)


@dataclass(slots=True)
class CLO:
    """Course learning outcome tracked across topics, lessons, and assessments."""

    key: str
    description: str
    bloom_level: Optional[str] = None
    priority: Optional[str] = None
    assessment_methods: List[str] = field(default_factory=list)
    performance_criteria: List[PerformanceCriteria] = field(default_factory=list)


@dataclass(slots=True)
class AssessmentBlueprint:
    """Planned assessments and the CLOs/PCs they validate."""

    key: str
    title: str
    description: Optional[str] = None
    weight: Optional[float] = None
    linked_clos: List[str] = field(default_factory=list)
    linked_performance_criteria: List[str] = field(default_factory=list)
    instruments: List[str] = field(default_factory=list)


@dataclass(slots=True)
class QAProfile:
    """Authorship, review, and governance metadata for a course."""

    authors: List[str] = field(default_factory=list)
    reviewers: List[str] = field(default_factory=list)
    approvers: List[str] = field(default_factory=list)
    version: str = "0.1"
    last_reviewed: Optional[datetime] = None
    notes: Optional[str] = None


@dataclass(slots=True)
class OutputConfig:
    """Switches that downstream generators use to tailor their output."""

    include_session_blocks: bool = True
    include_performance_criteria: bool = True
    include_assessments: bool = True
    numbering_scheme: str = "hierarchical"
    locale: str = "en-US"
    timezone: str = "UTC"


@dataclass(slots=True)
class CourseMetadata:
    """Top-level aggregation that binds the entire instructional design."""

    course_id: str
    title: str
    description: Optional[str] = None
    version: str = "0.1"
    duration_hours: Optional[float] = None
    delivery_mode: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    clos: List[CLO] = field(default_factory=list)
    topics: List[Topic] = field(default_factory=list)
    assessment_blueprints: List[AssessmentBlueprint] = field(default_factory=list)
    qa_profile: Optional[QAProfile] = None
    output_config: OutputConfig = field(default_factory=OutputConfig)



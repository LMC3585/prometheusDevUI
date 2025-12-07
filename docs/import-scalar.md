## Scalar XLSX Importer

The Scalar template is a single-sheet workbook with one row per lesson/PC pair. The importer expects the following headers (order does not matter, but spelling does):

| Column              | Required | Description                                               |
|---------------------|----------|-----------------------------------------------------------|
| `Course Name`       | ✅        | Title for every row (first non-empty value becomes title) |
| `CLO` or `CLOs`     | ✅        | Course-level outcome text                                 |
| `Topic`             | ✅        | Top-level curricular grouping                             |
| `Subtopic`          | ✅        | Secondary grouping beneath a topic                        |
| `Lesson Title`      | ✅        | Lesson or session label                                   |
| `Performance Criteria` / `PCs` | ✅ | Observable behavior linked to the CLO                   |

Each subsequent row repeats the course name and outcome context so the importer can build a complete hierarchy:

```
Course Name | CLO | Topic | Subtopic | Lesson Title | Performance Criteria
```

Blank rows are ignored. Any missing required header raises a `ValueError`.

---

### Mapping to canonical models

- Every unique `CLO` becomes a `CLO` dataclass (`key`, `description`, and linked `performance_criteria`).
- Each `Topic` becomes a `Topic` dataclass (`order` is derived from first appearance). `associated_clos` stores the CLO keys encountered inside the topic.
- Each `Subtopic` is nested under its parent topic with its own `order`.
- Each `Lesson Title` becomes a `Lesson` object housed within the containing subtopic. Lessons keep track of `associated_clos` and link to the `PerformanceCriteria` instances referenced in their rows.
- Every unique `Performance Criteria` text becomes a `PerformanceCriteria` dataclass and is linked both to the lesson and the CLO.
- The resulting `CourseMetadata` stores the derived `course_id`, `title`, list of CLOs, and topic tree. `OutputConfig` and other optional sections use their defaults so downstream components have a stable shape.

---

### Using the importer

Dependencies: `openpyxl` (install with `pip install openpyxl`).

```python
from core.importers import load_course_from_scalar

course = load_course_from_scalar("path/to/scalar-template.xlsx")

print(course.title)
for clo in course.clos:
    print("CLO:", clo.description)
```

The importer automatically slugifies identifiers (`course_id`, `topic.key`, etc.) and de-duplicates repeated entities. The returned `CourseMetadata` instance is the same object graph used by all downstream generation steps, so no additional mapping is required.


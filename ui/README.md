 FILE 2  ui/README.md

# Prometheus UI

The **UI** directory contains both the early Streamlit prototype and the
final, production-grade Next.js interface for the Prometheus ecosystem.
The UI is responsible for presenting a clean, elegant, and highly functional
front-end through which instructors, developers, and operators interact with the
Promethean Engine (PKE), the Orchestrator, and the formatting tools.
The guiding design philosophy:
**precision, calm power, elegance, and zero friction.**

---

## Structure

ui/
streamlit-prototype/ # Phase 1  rapid prototyping environment
nextjs-ui/ # Phase 2  final production UI (Next.js + Vercel)
assets/ # Logos, SVGs, themes, style references
components/ # Shared UI components for both environments
README.md

---

## Purpose of Each Subdirectory

### 1. `streamlit-prototype/`

A rapid development sandbox used to:
- validate workflows  
- test early user flows  
- prove features before building them in Next.js  
- integrate quickly with the Core API  
- support immediate day-to-day development needs  

This prototype **is not** the final interface, but it is essential for rapid iteration.

### 2. `nextjs-ui/`

The real Prometheus UI.
It will provide:
- A crisp, executive-grade interface  
- Rabdan-compliant theming  
- Multi-language (EN/AR) toggle  
- Dynamic course builder  
- Real-time previews for lessons, templates, and formatted outputs  
- Integrated PKE query tools  
- A library interface for course assets  
- Authentication (depending on deployment requirements)  

It will be deployed on **Vercel**, backed by the Prometheus Core API.

### 3. `assets/`

Centralised repository for:
- SVGs (icons + custom graphics)  
- Colour palettes  
- Fonts (Bahnschrift SemiCondensed, Aptos, etc.)  
- Layout references  
- Wireframes, moodboards, mockups  

### 4. `components/`

Reusable pieces of UI logic:
- Header bars  
- Side navigation  
- Form builders  
- Table components  
- File uploaders  
- Preview components  
- Code/JSON viewers  
- Layout wrappers  

These will be used by both the prototype and the final UI.

---

## Principles & Design Ethos

- **Minimalism**  surfaces remain calm even when the system is powerful.  
- **Precision**  spacing, alignment, motion, responsiveness.  
- **No clutter**  every component must earn its place.  
- **Brand fidelity**  Rabdan theme as default; other themes optional.  
- **Performance**  Next.js static + server actions for fast rendering.  
- **Accessibility**  WCAG-aware design without visual compromise.  
- **Elegance**  Sean-Connery-in-a-Sinclair-suit energy. Quietly lethal.

---

## Development Guidelines

- Prototype in Streamlit *only to iterate fast*, then re-implement properly in Next.js.  
- All components must be written as independent, testable units.  
- API requests must be routed through a shared client.  
- Do not hardcode configuration; use `/config/ui.json`.  
- UI changes above minor tweaks must be reviewed by Sarah (design logic).  

---

## Status

This directory is scaffolded and ready for population.
The Next.js UI will be developed once the Core API stabilises  
and the Orchestrator interface is defined.
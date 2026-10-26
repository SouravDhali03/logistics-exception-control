# Logistics Exception Control

An AI-assisted operations control tower for detecting, reviewing, and resolving shipment exceptions with human approval at the point of action.

## What it includes

- Prioritized exception inbox presented as a sortable-style operational table
- Clear priority, uncertainty, ownership, and impact tags
- Right-side exception details drawer
- AI assessment with evidence, likely cause, business impact, and missing data
- Evidence, timeline, and audit views
- Resolution options with recovery, cost, SLA, and risk comparisons
- Low-risk and higher-risk approval flows
- Request-more-information and human override actions
- Local browser persistence for manually created demo exceptions
- IBM Carbon-inspired visual language with IBM Plex Sans and IBM Blue
- Hugeicons icon system

## Project structure

```text
dist/
  index.html   Application markup
  styles.css   IBM-inspired visual system and responsive layout
  app.js       Demo data, interactions, and local state
```

This is a buildless static HTML, CSS, and JavaScript application. It can be opened directly from `dist/index.html` or served from any static hosting provider.

## Run locally

From the project directory:

```bash
python3 -m http.server 4173 --directory dist
```

Then open <http://127.0.0.1:4173>.

## Notes

The current actions are prototype-safe demonstrations. Approval and execution flows record demo activity locally in the browser; they do not send carrier requests or customer notifications.

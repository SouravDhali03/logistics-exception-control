# Logistics Exception Control

An AI-assisted logistics control tower for detecting, prioritizing, investigating, and resolving shipment exceptions with clear human oversight.

**Live demo:** [logistics-exception-control-20261028.sourav-dhali.chatgpt.site](https://logistics-exception-control-20261028.sourav-dhali.chatgpt.site/)

> The demo is privately deployed. Access is limited to the site owner unless sharing is enabled in Sites.

## Overview

Logistics Exception Control helps operations coordinators focus on the shipment issues that need attention first. It combines a prioritized exception inbox with evidence-backed AI analysis, resolution options, approval controls, and decision history.

The current version is an interactive front-end prototype designed around the recommended AI-assisted exception detection and resolution journey.

## Key capabilities

- Full-width operations overview with live network status and key risk metrics
- Prioritized exception table with shipment ID, severity, pickup, drop-off, transport mode, impact, confidence, ownership, and row actions
- Critical, high, and medium priority tags based on IBM Carbon conventions
- Right-side exception drawer that keeps the inbox visible while a case is reviewed
- AI decision card covering what happened, supporting evidence, likely cause, business impact, uncertainty, and missing information
- Evidence provenance, reasoning trace, timeline, and audit views
- Recommended and alternative resolution options with recovery time, cost, SLA impact, and risk comparisons
- Human approval gates for higher-risk actions
- Request-more-information and AI override paths
- Notification, filtering, case creation, and row action interactions
- Local browser persistence for manually created demo exceptions

## Core workflow

1. AI continuously monitors milestones, ETA, tracking freshness, SLA commitments, and carrier events.
2. Potential exceptions are validated against supporting evidence.
3. Missing information is retrieved automatically or escalated to a coordinator.
4. Confirmed and uncertain exceptions are classified, assessed, and prioritized.
5. The coordinator reviews the AI decision card and available resolution options.
6. The selected action passes through risk-based approval before execution.
7. The system monitors new events, re-evaluates the case, and returns unresolved issues for another decision.
8. Resolved cases retain the recommendation, human decision, actions, outcome, corrections, and timestamps.

## Design approach

The interface uses a modernized IBM-inspired visual language:

- Geist typography
- IBM Blue as the primary brand color
- Carbon-style tags, spacing, borders, and interaction states
- Hugeicons for interface and transport-mode iconography
- Dense operational information presented with clear hierarchy and generous row spacing
- Responsive behavior for narrower screens

## Technology

- Semantic HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage` for prototype data persistence
- Static hosting with no build step or runtime dependencies

## Project structure

```text
dist/
  index.html   Application structure and accessible markup
  styles.css   Visual system, layout, states, and responsive rules
  app.js       Demo data, interactions, drawer flows, and local state

.openai/
  hosting.json Site hosting configuration
```

## Run locally

From the repository root, run:

```bash
python3 -m http.server 4173 --directory dist
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Deployment

The site is deployed as a private static Site. The deployment packages the contents of `dist/`; no build step, server runtime, or environment variables are required.

## Prototype scope

This repository is a product prototype. Approval and execution interactions record demo activity in the browser, but they do not connect to live carrier systems, send customer communications, or execute operational changes.

Production implementation would require authentication, role-based access, persistent backend storage, shipment and carrier integrations, notification services, observability, and security review.

## Repository

[github.com/SouravDhali03/logistics-exception-control](https://github.com/SouravDhali03/logistics-exception-control)

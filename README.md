# Logistics Exception Control

An AI-assisted logistics control tower for detecting, prioritizing, investigating, and resolving shipment exceptions with clear human oversight.

**Live demo:** [logistics-exception-control-20261028.sourav-dhali.chatgpt.site](https://logistics-exception-control-20261028.sourav-dhali.chatgpt.site/)

> The demo is privately deployed. Access is limited to the site owner unless sharing is enabled in Sites.

## Product objective

Logistics Exception Control turns scattered shipment signals into a clear, accountable decision workflow. Its goal is to help a logistics coordinator detect an exception early, understand what is known and uncertain, choose an appropriate response, and track the case until there is evidence that it is resolved.

The product is deliberately designed as decision support, not autonomous operations. AI accelerates investigation and comparison; a person approves material actions and remains accountable for the outcome.

## The coordinator's pain points

Logistics coordinators often manage many shipments at once while information is distributed across tracking feeds, carrier updates, terminals, customer commitments, and internal systems. A delayed shipment alone does not answer the questions needed to act:

- What happened, and which evidence supports it?
- Why is the customer or SLA commitment at risk?
- How urgent is this compared with other issues?
- Who owns the next step?
- Which response best balances recovery time, cost, and operational risk?
- Has the response actually worked, or does the exception need to be reopened?

Without a structured workflow, coordinators spend too much time manually investigating, switching between systems, explaining decisions, and reconstructing history after an issue is closed.

## How the product addresses those problems

| Pain point | Product response | Result |
| --- | --- | --- |
| Too many signals and exceptions | Prioritized inbox with severity, impact, confidence, owner, and route context | Attention is directed to the most consequential issues first. |
| Unclear facts versus assumptions | AI decision view separates verified facts, likely cause, business impact, inferred risk, and missing data | Coordinators can assess the quality of a recommendation before acting. |
| Difficult trade-offs | Recommended and alternative responses compare recovery time, added cost, SLA protection, and risk | Decisions are explicit and easier to justify. |
| Uncontrolled or high-risk action | Risk-based approval and human override controls | A coordinator keeps authority over operational commitments. |
| No clear follow-through | Resolution state moves from approval to monitoring, verified update, closure review, and reopening | A case stays visible until objective evidence supports closure. |
| Weak handoff and accountability | Timeline and audit views preserve evidence, decisions, corrections, and timestamps | Teams can understand what happened and why. |

## Key features

- **Prioritized exception inbox** — presents open exceptions with priority, business impact, confidence, ownership, and transport route.
- **Exception workspace** — opens a focused case view without losing the operational queue in the background.
- **Evidence-backed AI assessment** — summarizes what happened, probable cause, impact, evidence quality, and information gaps.
- **Evidence, timeline, and audit history** — gives coordinators context, provenance, and a record of activity.
- **Response comparison** — lets a coordinator compare recommended and alternative actions by recovery, cost, SLA benefit, and risk.
- **Human approval and override** — requires an explicit decision for material actions and provides a route to correct AI guidance.
- **Progressive resolution lifecycle** — after an action is approved, alternatives recede and the workspace switches to monitoring, verification, closure, or reopening.
- **Request-more-information flow** — represents how missing evidence can be escalated instead of treated as fact.
- **Operational controls** — filtering, ownership actions, manual exception creation, notifications, and local demo persistence support realistic exploration.

## How AI helps

AI is used to support four parts of the workflow:

1. **Detect and prioritize** — correlate milestones, ETA changes, tracking freshness, SLA commitments, and carrier events to identify exceptions worth attention.
2. **Investigate and explain** — synthesize operational signals into a plain-language assessment while identifying evidence, inference, and missing data separately.
3. **Recommend and compare** — propose response options and surface their likely trade-offs in time, cost, SLA protection, and risk.
4. **Monitor and learn** — watch for new or contradictory events, prompt a closure review when evidence is sufficient, and preserve human corrections as learning inputs.

AI does not replace operational judgment. Confidence is not certainty, inferred risks are not verified facts, and approval remains with the coordinator.

## Core workflow

1. Detect and validate a potential shipment exception.
2. Prioritize it against other active issues.
3. Investigate the case through evidence, inferred risk, and missing-data signals.
4. Compare possible responses and approve or override the recommended approach.
5. Track the approved response while awaiting an objective update.
6. Review closure criteria after verified evidence arrives.
7. Close the exception or reopen it when new information contradicts the outcome.

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

# Logistics Exception Control

An AI-assisted logistics control tower for detecting, prioritizing, investigating, and resolving shipment exceptions with clear human oversight.

**Public GitHub Pages demo:** [souravdhali03.github.io/logistics-exception-control](https://souravdhali03.github.io/logistics-exception-control/)

**Private Sites demo:** [logistics-exception-control-20261028.sourav-dhali.chatgpt.site](https://logistics-exception-control-20261028.sourav-dhali.chatgpt.site/)

> The GitHub Pages version is public. The Sites deployment remains private and owner-only.

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

## Design philosophy

The product is designed as a calm, trustworthy operational workspace: it should help a coordinator make a consequential decision quickly without hiding uncertainty or making the interface feel like an alarm console.

- **Decisions before decoration** — hierarchy gives priority to exception severity, impact, ownership, evidence quality, and the next decision. Decorative treatment is deliberately restrained.
- **Progressive disclosure** — the inbox supports scanning; the side workspace reveals evidence and trade-offs only when a case is opened; after approval, competing options disappear so monitoring becomes the active task.
- **Evidence is visible** — verified facts, AI inference, data gaps, confidence, and freshness are communicated as distinct states. The interface does not present an AI conclusion as certainty.
- **Human control is explicit** — recommendation, approval, override, closure review, and reopening each have clear UI states. A person remains responsible for material operational choices.
- **Status through restrained color** — neutral surfaces keep dense information readable; red highlights critical risk, amber indicates caution, blue signals active information, and green marks recorded or verified progress.
- **Operational density with breathing room** — compact tables support fast comparison, while generous padding, clear dividers, and aligned metrics prevent the workspace from becoming visually overwhelming.
- **Typography supports hierarchy** — a modern sans-serif system uses regular-weight headings and controlled scale changes so emphasis comes from structure and state, not excessive bold text.
- **Consistency across the lifecycle** — shared borders, top accents, tags, action patterns, and audit language connect detection, decision, monitoring, and closure into one coherent flow.
- **Responsive by default** — information remains legible and action controls remain reachable on narrower screens without changing the underlying decision model.

The result is a product language that feels operationally serious, AI-assisted, and accountable rather than merely dashboard-like.

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

The project has two static deployment options:

- **GitHub Pages:** [public project page](https://souravdhali03.github.io/logistics-exception-control/). The `.github/workflows/deploy-pages.yml` workflow publishes `dist/` whenever changes are pushed to `main`.
- **OpenAI Sites:** a private owner-only deployment that packages `dist/` without a build step, server runtime, or environment variables.

## Prototype scope

This repository is a product prototype. Approval and execution interactions record demo activity in the browser, but they do not connect to live carrier systems, send customer communications, or execute operational changes.

Production implementation would require authentication, role-based access, persistent backend storage, shipment and carrier integrations, notification services, observability, and security review.

## Repository details

| Item | Details |
| --- | --- |
| Repository | [SouravDhali03/logistics-exception-control](https://github.com/SouravDhali03/logistics-exception-control) |
| Public demo | [GitHub Pages](https://souravdhali03.github.io/logistics-exception-control/) |
| Primary branch | `main` |
| Application source | [`dist/`](./dist) |
| Design case study | [`DESIGN.md`](./DESIGN.md) |
| Pages workflow | [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) |

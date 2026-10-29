# Logistics Exception Control

An AI-assisted control tower that helps logistics coordinators detect, understand, decide, and follow through on shipment exceptions without surrendering human accountability.

[Open the live GitHub Pages prototype](https://souravdhali03.github.io/logistics-exception-control/) · [View the repository](https://github.com/SouravDhali03/logistics-exception-control) · [Read the design case study](./DESIGN.md)

> This is an interactive front-end prototype. External requests, approvals, carrier actions, and operational updates are simulated; nothing is sent to a live logistics system.

## Product objective

Logistics Exception Control turns fragmented shipment signals into a focused, evidence-backed workflow:

`Detect → Prioritize → Investigate → Decide → Approve → Monitor → Close or reopen`

The product should enable a coordinator to answer six practical questions quickly:

1. What happened?
2. What is verified, inferred, or still missing?
3. Which customer, SLA, financial, or compliance commitment is at risk?
4. Which response best balances recovery, cost, and operational exposure?
5. Who has authority to approve the response?
6. Has objective evidence confirmed that the exception is resolved?

AI accelerates analysis and comparison. A person remains responsible for material decisions, approvals, overrides, and closure.

## The problem

Logistics coordinators manage many shipments while evidence is spread across carriers, terminals, brokers, tracking feeds, warehouse systems, customer commitments, and internal tools. An alert may say that a shipment is late, but it rarely explains the cause, business consequence, available recovery paths, or what must happen next.

Common pain points include:

- **Fragmented operational signals** — the coordinator must reconstruct one case across several systems.
- **Alert overload** — every issue competes for attention, even when impact and urgency differ.
- **Unclear certainty** — verified events, model estimates, assumptions, and missing inputs are easily mixed together.
- **Complex trade-offs** — faster recovery can increase cost, compliance risk, or downstream commitments.
- **Unclear decision authority** — some actions are within coordinator limits; others require manager sign-off.
- **Weak follow-through** — approving an action is not the same as confirming that it worked.
- **Poor accountability** — teams need a durable explanation of what was recommended, chosen, corrected, and closed.

## Current prototype

The queue contains ten realistic exception examples spanning port disruption, temperature excursion, incomplete customs documents, stale tracking, delayed warehouse handoff, driver-hours compliance, customs release, missing proof of delivery, carrier-capacity loss, and offline temperature telemetry.

Six decision-rich cases have scenario-specific assessments and recovery choices. Each can move through decision, information request, sign-off, monitoring, closure-readiness, and closed states.

### 1. Prioritized exception inbox

The main table combines priority, route, impact, confidence, owner, status, and recency in one scan-friendly view. Filters support all exceptions, critical exceptions, and cases assigned to the current coordinator.

**Why it exists:** Coordinators need to direct attention by operational consequence, not simply by alert time.

### 2. Focused exception workspace

Opening a row reveals a right-side case workspace while keeping the queue visible behind it. The workspace includes Decision, Evidence, Timeline, and Audit views.

**Why it exists:** Deep investigation should not make the coordinator lose their place in the wider operation.

### 3. Evidence-backed AI assessment

The assessment separates four types of information:

- verified facts;
- likely cause and AI inference;
- business impact;
- missing data or open confirmation.

The evidence-readiness card shows confidence, source count, and freshness. The entire card opens the Evidence view, making provenance a primary interaction rather than a hidden footnote.

**Why it exists:** A recommendation is only useful when the coordinator can judge the evidence supporting it.

### 4. Compact response comparison

Recovery choices are presented as an accordion instead of multiple expanded cards. Every row exposes the same comparison fields: recovery time, added cost, and risk. The active row expands to show commitment protection, dependencies, assumptions, decision authority, and approval actions.

The leading option carries a distinct **AI recommended** badge, while muted surfaces and consistent grey borders keep the comparison calm and readable. The coordinator can inspect alternatives without losing the selected response.

**Why it exists:** Progressive disclosure keeps all necessary decision information available without overwhelming the user at first glance.

### 5. Human authority, sign-off, and override

The prototype uses a simulated $2,500 coordinator approval threshold:

- actions within the threshold can be reviewed and approved by the coordinator;
- actions above the threshold are sent for simulated manager sign-off;
- open dependencies remain visible before approval;
- the coordinator can override AI and record operational context that the recommendation missed.

**Why it exists:** AI can recommend an action, but it should not silently create cost, compliance, or customer commitments.

### 6. Request more information

When evidence is incomplete, the coordinator can record an information request instead of treating uncertainty as fact. The case enters an awaiting-information state and the recommendation is reassessed when a simulated verified reply arrives.

**Why it exists:** Sometimes the correct next step is to reduce uncertainty, not approve a recovery action.

### 7. Resolution lifecycle

Resolution monitoring stays out of the way until a response is selected. After approval or sign-off, the interface shifts from decision mode to follow-through:

- the selected response is recorded;
- competing alternatives are retained in decision history rather than left as active choices;
- the case waits for an objective carrier, terminal, broker, or customer update;
- closure review becomes available only after a verified checkpoint;
- contradictory evidence can reopen the decision;
- closed cases retain monitoring and audit history.

**Why it exists:** A task being approved or dispatched does not prove the underlying shipment risk has been resolved.

### 8. Monitoring, decision history, learning, and audit

The supporting product views organize cases that need follow-through, preserve human and system events, and collect AI overrides for review. Human corrections are learning candidates; they do not automatically retrain a model or change policy.

**Why it exists:** Operational trust depends on traceability and deliberate governance, not invisible automation.

## Pain point to feature mapping

| Coordinator pain point | Product feature | How it helps |
| --- | --- | --- |
| Too many competing exceptions | Prioritized queue, impact context, confidence, owner, filters | Directs attention to consequential work first. |
| Information scattered across systems | Focused workspace with Decision, Evidence, Timeline, and Audit | Brings the case narrative and provenance together. |
| Facts mixed with assumptions | Verified fact, AI inference, assessment, and data-gap labels | Makes uncertainty visible before a decision. |
| Difficult recovery trade-offs | Accordion comparison of recovery, cost, risk, commitment protection, and dependencies | Makes alternatives comparable without expanding every detail. |
| Missing operational confirmation | Request-more-information flow and explicit decision gates | Prevents incomplete evidence from being treated as certainty. |
| Unclear approval responsibility | Decision-authority state and simulated sign-off threshold | Routes high-cost actions to the appropriate human. |
| AI recommendation may miss context | Override flow and Learning review | Preserves human judgment and creates reviewable feedback. |
| Action approved but outcome unknown | Monitoring, verified update, closure criteria, and reopen flow | Keeps the case open until evidence supports resolution. |
| Weak accountability | Decision history and audit log | Records what changed, who acted, and why. |

## How AI helps

AI is bounded to decision support:

1. **Detect and correlate** — combine milestone changes, ETA variance, stale signals, SLA commitments, and carrier events into potential exceptions.
2. **Prioritize** — estimate urgency and business impact so the queue reflects operational consequence.
3. **Investigate and explain** — summarize what happened, identify a likely cause, expose missing data, and distinguish inference from evidence.
4. **Recommend and compare** — propose scenario-specific recovery paths with recovery, cost, risk, commitment protection, assumptions, and dependencies.
5. **Monitor and reassess** — react to verified or contradictory events and reopen the decision when the active plan is no longer supported.
6. **Support learning review** — preserve human overrides as candidates for evaluation without automatically changing model behavior.

AI does **not** approve expenditure, dispatch a carrier, contact a customer, close an exception, or rewrite operational policy in this prototype.

## Design philosophy

The interface is designed as a calm operational workspace rather than an alarm-heavy dashboard.

- **Decision-first hierarchy** — severity, impact, confidence, dependencies, authority, and next action lead the composition.
- **Progressive disclosure** — the queue supports scanning; the drawer reveals case evidence; the accordion expands only the response being evaluated.
- **Evidence before confidence** — confidence is accompanied by provenance, source count, freshness, and explicit data gaps.
- **Human control is visible** — approval, sign-off, override, closure, and reopening are distinct interaction states.
- **Minimal, meaningful color** — neutral surfaces and grey borders carry structure; red signals critical risk, amber signals caution, blue signals active information, and muted green identifies AI-supported or verified progress.
- **Regular-weight typography** — hierarchy comes from grouping, spacing, and scale rather than excessive bold text.
- **Consistent geometry** — rounded containers, pill tags, Hugeicons, aligned metrics, and shared control patterns create a coherent product language.
- **Operational density with breathing room** — the product preserves information needed for a consequential decision while reducing the amount shown simultaneously.

## Prototype workflow

1. Open an exception from the prioritized queue.
2. Review verified facts, AI inference, impact, missing data, confidence, and evidence freshness.
3. Open the Evidence view when source-level validation is needed.
4. Compare response rows and expand one option for its dependencies and trade-offs.
5. Request missing information, override AI, approve within authority, or request manager sign-off.
6. Monitor the selected response for an objective operational update.
7. Review all closure criteria after verified evidence arrives.
8. Close the exception, or reopen/reassess it when contradictory evidence appears.

## Technology

- Semantic HTML
- CSS with responsive layouts and design tokens
- Vanilla JavaScript
- [Hugeicons](https://hugeicons.com/) icon font
- Browser `localStorage` for locally created exceptions
- Static GitHub Pages deployment
- No framework, build step, server runtime, or production dependency

## Project structure

```text
dist/
  index.html                 Application structure and accessible markup
  styles.css                 Design system, responsive layout, and UI states
  app.js                     Demo data, scenarios, interactions, and local state
  assets/                    Logo, avatar, and supporting visual assets

.github/workflows/
  deploy-pages.yml           GitHub Pages deployment from dist/

.openai/
  hosting.json               OpenAI Sites hosting configuration

DESIGN.md                    Detailed product-design case study
README.md                    Product, implementation, and repository overview
```

## Run locally

From the repository root:

```bash
python3 -m http.server 4173 --directory dist
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Deployment

The public prototype is deployed from `dist/` by GitHub Actions whenever a commit reaches `main`:

- **Live site:** [souravdhali03.github.io/logistics-exception-control](https://souravdhali03.github.io/logistics-exception-control/)
- **Repository:** [github.com/SouravDhali03/logistics-exception-control](https://github.com/SouravDhali03/logistics-exception-control)
- **Primary branch:** `main`
- **Deployment workflow:** [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)

An additional private OpenAI Sites deployment is configured for owner-only review.

## Prototype boundaries and production requirements

The current build demonstrates the workflow and interaction model, not live logistics execution. It does not authenticate users, connect to carrier or terminal APIs, send messages, reserve capacity, create transport orders, or persist audit records to a backend.

A production implementation would require:

- authentication, role-based access, and configurable approval limits;
- durable case, evidence, decision, and audit storage;
- integrations with TMS, WMS, carrier, terminal, customs, telematics, ETA, and customer systems;
- task orchestration, notifications, customer communication, and execution confirmation;
- evidence provenance, data-quality monitoring, model evaluation, and AI governance;
- security, privacy, observability, recovery, and compliance review;
- outcome measurement for time to detect, time to decide, time to resolve, cost avoided, and commitment protection.

## Repository details

| Item | Details |
| --- | --- |
| Repository | [SouravDhali03/logistics-exception-control](https://github.com/SouravDhali03/logistics-exception-control) |
| Public demo | [GitHub Pages](https://souravdhali03.github.io/logistics-exception-control/) |
| Source | [`dist/`](./dist) |
| Design case study | [`DESIGN.md`](./DESIGN.md) |
| Hosting workflow | [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) |
| License | No license file is currently included. |

export interface BACase {
  id: string;
  code: string;
  title: string;
  sector: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  focusSkills: string[];
  learningObjective: string;
  narrative: string;
  yourRole: string;
  discussionQuestions: string[];
}

export const BA_CASES: BACase[] = [
  {
    id: 'meridian-claims',
    code: 'BA-101',
    title: 'Meridian Insurance: The Claims Backlog',
    sector: 'Insurance · Operations',
    difficulty: 'Foundational',
    focusSkills: ['business-problem-framing', 'as-is-process-investigator', 'stakeholder-register', 'power-interest-grid'],
    learningObjective:
      'Practise framing a noisy operational problem before solutioning, and mapping a contested stakeholder landscape.',
    narrative:
      'Meridian Insurance has a 45-day average claims settlement time against an industry benchmark of 12 days. Complaints to the regulator tripled in 18 months. The COO blames understaffed back office teams; the head of claims blames a legacy claims platform and "shadow spreadsheets" used by assessors; the CFO has frozen budget until someone shows her "the real numbers". A previous improvement programme two years ago cost £2.4M and was quietly abandoned. Front-line assessors report that straightforward claims are fine — the pain sits in claims involving multiple policies, where manual rework loops between underwriting and claims are routine. You have been brought in as the business analyst on a six-week discovery, reporting to the transformation director, who wants "a digital solution proposal" by the end.',
    yourRole:
      'You are the lead BA for the discovery. The transformation director expects a solution; you believe the problem is not yet framed properly.',
    discussionQuestions: [
      'Frame the business problem without jumping to a solution: what is the actual problem statement, and what evidence would strengthen or weaken it?',
      'Which facts, assumptions and unknowns would you separate before believing any stakeholder narrative?',
      'Build a stakeholder register for this situation. Who holds power, who has hidden influence, and how do you engage the CFO?',
      'How would you investigate the as-is rework loop between underwriting and claims — and what would you do about the shadow spreadsheets?',
    ],
  },
  {
    id: 'northgate-portal',
    code: 'BA-102',
    title: 'Northgate Council: The Portal Nobody Uses',
    sector: 'Government · Digital Services',
    difficulty: 'Foundational',
    focusSkills: ['requirements-quality-check', 'ambiguity-hunter', 'questionnaire-design', 'edge-case-elicitor'],
    learningObjective:
      'Diagnose why delivered requirements failed to produce adoption, and practise writing requirements that are testable and complete.',
    narrative:
      'Northgate Council spent £1.1M building a citizen self-service portal for housing repairs, benefits and waste services. The platform works: it was delivered on time and passed all acceptance tests. Two years on, only 7% of eligible residents use it. Call volumes are unchanged, staff re-key portal submissions into the same legacy system as phone requests, and the "report a missed bin" form generates duplicate reports because it does not check whether a collection for that address is already logged. The project team insists users were consulted — a survey was emailed to 4,000 residents and got 61 replies, all from residents over 65. The digital services lead suspects the requirements were written from the system\'s perspective ("the system shall provide a form...") rather than the citizen\'s. You are asked to review the requirement set and recommend what must change before any further investment.',
    yourRole:
      'You are the BA asked to audit the requirements and the elicitation approach that produced them.',
    discussionQuestions: [
      'What is wrong with the elicitation evidence behind this portal, and how would you redesign the research approach?',
      'Rewrite two of the described requirements so they are specific, testable and outcome-oriented.',
      'Which edge cases and exception flows were missed, and how would an edge-case elicitor have caught them?',
      'How do you distinguish a requirements problem from an adoption or service-design problem in your findings?',
    ],
  },
  {
    id: 'aurora-scheduling',
    code: 'BA-201',
    title: 'Aurora Health: The Scheduling Migration',
    sector: 'Healthcare · System Migration',
    difficulty: 'Intermediate',
    focusSkills: ['use-case-specification', 'requirements-traceability-starter', 'requirements-conflict-checker', 'definition-of-done-drafter'],
    learningObjective:
      'Practise specifying use cases, tracing requirements to tests, and surfacing conflicts between clinical, operational and vendor priorities.',
    narrative:
      'Aurora Health is migrating outpatient scheduling from a 20-year-old system to a modern cloud platform. Clinicians want appointment types to stay exactly as-is because "the clinic runs on muscle memory". The vendor\'s product forces a different scheduling model (pools instead of named clinics) that is more flexible but changes daily workflows. Nursing staff warn that any double-booking behaviour change could break the urgent-add-on process used for same-day cancellations — a process that exists only in one nurse\'s head. The programme board has promised "no change for clinicians" in its communications, which the delivery team knows is impossible. Test coverage focuses on happy paths; nobody has traced requirements to tests. Go-live is in nine weeks and the medical director is chairing the board.',
    yourRole:
      'You are the BA responsible for making scope, traceability and readiness honest before go-live.',
    discussionQuestions: [
      'Specify one use case for the urgent add-on scenario, including preconditions, main flow, extensions and exceptions.',
      'Start a traceability matrix: which requirements link to which tests, and what does the gap tell you about go-live risk?',
      'Where are the conflicts between the "no change" promise, the vendor model and clinical reality — and how would you surface them constructively?',
      'Draft a definition of done for this migration\'s requirements pack.',
    ],
  },
  {
    id: 'lumina-loyalty',
    code: 'BA-202',
    title: 'Lumina Retail: The Loyalty Programme Redesign',
    sector: 'Retail · Strategy & Value',
    difficulty: 'Intermediate',
    focusSkills: ['value-proposition-analysis', 'benefit-hypothesis-writer', 'moscow-prioritisation', 'porters-five-forces'],
    learningObjective:
      'Connect business strategy to a prioritised benefit hypothesis set, and resist building everything for everyone.',
    narrative:
      'Lumina Retail, a mid-market fashion chain with 120 stores, is losing its 18–30 demographic to online-first competitors. Its loyalty programme — points on spend, paper coupons — skews to customers over 50 and costs £3M a year to run. The marketing director wants "an app like Starbucks but better"; the e-commerce lead wants personalised offers driven by the existing CRM; the store operations director opposes anything that makes till transactions slower; the CFO wants a business case with measurable benefits within 12 months. A competitor just launched a paid-tier membership with free returns, and board pressure is high. Everyone agrees something must be done — and each sponsor has a different "something" in mind.',
    yourRole:
      'You are the BA on the strategy sprint tasked with turning competing ambitions into one prioritised, benefit-led scope.',
    discussionQuestions: [
      'Map the value proposition for the 18–30 segment: jobs, pains and gains versus what the current programme offers.',
      'Write three benefit hypotheses with measures, and identify the evidence you would need to validate or kill each one.',
      'Apply MoSCoW to the candidate feature set and defend what you deliberately will NOT do in the first release.',
      'How does a five-forces view change what the loyalty programme should actually try to achieve?',
    ],
  },
  {
    id: 'vertex-reporting',
    code: 'BA-301',
    title: 'Vertex Bank: The Regulatory Reporting Rewrite',
    sector: 'Banking · Compliance & Rules',
    difficulty: 'Advanced',
    focusSkills: ['business-rule-extractor', 'assumptions-constraints-log', 'evidence-gap-review', 'deliverable-consistency-check'],
    learningObjective:
      'Extract authoritative business rules from contradictory policy sources and keep an auditable assumptions log under regulatory scrutiny.',
    narrative:
      'Vertex Bank must rebuild its regulatory reporting pipeline after a supervisory finding that two reports submitted to the regulator were "materially inconsistent". The current rules live in a mix of a 400-page policy manual, three analyst wikis (two stale), legacy COBOL comments, and the tribal knowledge of Priya, a manager who is leaving in five months. Different teams interpret the same clause differently — and each interpretation is defensible. Compliance insists only the published regulation is authoritative; operations insists only the current process reflects reality; the regulator expects both to agree. An audit trail of every rule\'s source and approval is now mandatory. You have four months and one other BA.',
    yourRole:
      'You are the senior BA accountable for a defensible, auditable business rules baseline.',
    discussionQuestions: [
      'Design your approach to extract, classify and source-attribute the business rules — including how to handle contradictions between authority and reality.',
      'Build the skeleton of an assumptions and constraints log for this programme: what goes in it, who owns entries, when are they reviewed?',
      'Where would an evidence-gap review change your confidence in the baseline, and what would you do about Priya\'s departure?',
      'What consistency checks would you run across the deliverable pack before it goes to compliance sign-off?',
    ],
  },
  {
    id: 'cirrus-dashboard',
    code: 'BA-302',
    title: 'Cirrus Logistics: The "Simple" Dashboard Request',
    sector: 'Logistics · Scope & Framing',
    difficulty: 'Advanced',
    focusSkills: ['problem-statement-refiner', 'functional-vs-nonfunctional-splitter', 'requirements-prioritizer', 'prototype-elicitation'],
    learningObjective:
      'Resist premature solutioning on a senior stakeholder\'s pet request, and turn a vague ask into a scoped, prioritised requirement set.',
    narrative:
      'The COO of Cirrus Logistics walks past your desk: "Build me a simple dashboard showing where every vehicle, driver and parcel is, in real time, with alerts, and make it look like the SpaceX launch feed." He wants it "by the end of the quarter, how hard can it be?" Fleet data lives in four systems with different refresh rates — one updates only nightly. Drivers\' union agreements restrict telemetry monitoring of individuals. The existing BI team has a two-year backlog. A dashboard already exists that nobody uses because depot managers trust phone calls more. You have one conversation with the COO before he leaves for three weeks, and his assistant guards his calendar fiercely.',
    yourRole:
      'You are the BA who must convert a drive-by executive request into a properly framed initiative — without saying "no" and without saying "yes".',
    discussionQuestions: [
      'Refine "a simple dashboard" into a problem statement the COO would recognise as his own — what questions do you ask in your one conversation?',
      'Split the implied ask into functional and non-functional requirements, including the ones he did not say (refresh rate, availability, per-driver privacy).',
      'How would you use prototype elicitation to converge on scope you can actually deliver this quarter?',
      'Prioritise ruthlessly: what is the smallest thing that proves value — and how do you handle the political risk of deferring the "SpaceX feed"?',
    ],
  },
];

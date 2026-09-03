// AUTO-GENERATED from 45ck/business-analysis-skills (MIT). Do not edit by hand.
export interface BASkill {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  blurb: string;
  purpose: string;
  useWhen: string[];
  inputs: string[];
  procedure: string[];
  outputs: string[];
  guardrails: string[];
  completion: string[];
  raw: string;
}

export const CATEGORY_META: Record<string, { label: string; description: string }> = {
  "atomic": {
    "label": "Atomic Techniques",
    "description": "Core BA techniques you apply directly to a problem — strategy lenses, stakeholder tools, elicitation methods and specification patterns."
  },
  "requirements": {
    "label": "Requirements & Specification",
    "description": "Sharpen, split, normalise, audit and prioritise requirements until they are delivery-ready."
  },
  "elicitation": {
    "label": "Elicitation & Process",
    "description": "Extended elicitation and process tools: questioning structures, communication planning, as-is / to-be process work."
  },
  "workflow": {
    "label": "End-to-End Workflows",
    "description": "Multi-phase guided workflows that combine several techniques to take a problem from fuzzy to structured."
  },
  "quality": {
    "label": "Quality Checks",
    "description": "Review passes to run before sign-off: bias checks, evidence gaps, consistency and requirements quality."
  }
};

export const BA_SKILLS: BASkill[] = [
  {
    "slug": "business-problem-framing",
    "name": "Business Problem Framing",
    "category": "workflow",
    "categoryLabel": "End-to-End Workflows",
    "blurb": "End-to-end framing of a business problem before solutioning.",
    "purpose": "Frame a business problem or opportunity before solutioning.",
    "useWhen": [
      "a project is being initiated",
      "the team is jumping to solutions too quickly",
      "scope, objectives, assumptions, and options are blurry"
    ],
    "inputs": [
      "project or problem context",
      "goals and constraints",
      "known stakeholders, systems, and documents",
      "level of formality required"
    ],
    "procedure": [
      "State the business situation and trigger.",
      "Distinguish symptoms from root causes.",
      "Define objectives, desired outcomes, and success criteria.",
      "Identify assumptions, constraints, and non-negotiables.",
      "Define in-scope and out-of-scope boundaries.",
      "Generate multiple candidate solution directions.",
      "Compare options against business need, constraints, and feasibility.",
      "End with a recommended framing and unresolved questions."
    ],
    "outputs": [
      "problem statement",
      "root-cause notes",
      "objective and success criteria set",
      "scope statement",
      "assumptions/constraints log",
      "options summary"
    ],
    "guardrails": [
      "Explicitly separate fact, inference, and assumption.",
      "Prefer evidence-backed conclusions over polished speculation.",
      "Where conflict exists, record it rather than smoothing it away.",
      "Produce artifacts that can be inspected, edited, and reused."
    ],
    "completion": [
      "deliverable pack exists",
      "tradeoffs are explicit",
      "unknowns are logged",
      "next decisions are obvious"
    ],
    "raw": "## Purpose\nFrame a business problem or opportunity before solutioning.\n\n## Use when\n- a project is being initiated\n- the team is jumping to solutions too quickly\n- scope, objectives, assumptions, and options are blurry\n\n## Inputs\n- project or problem context\n- goals and constraints\n- known stakeholders, systems, and documents\n- level of formality required\n\n## Procedure\n1. State the business situation and trigger.\n2. Distinguish symptoms from root causes.\n3. Define objectives, desired outcomes, and success criteria.\n4. Identify assumptions, constraints, and non-negotiables.\n5. Define in-scope and out-of-scope boundaries.\n6. Generate multiple candidate solution directions.\n7. Compare options against business need, constraints, and feasibility.\n8. End with a recommended framing and unresolved questions.\n\n## Outputs\n- problem statement\n- root-cause notes\n- objective and success criteria set\n- scope statement\n- assumptions/constraints log\n- options summary\n\n## Guardrails\n- Explicitly separate fact, inference, and assumption.\n- Prefer evidence-backed conclusions over polished speculation.\n- Where conflict exists, record it rather than smoothing it away.\n- Produce artifacts that can be inspected, edited, and reused.\n\n## Completion criteria\n- deliverable pack exists\n- tradeoffs are explicit\n- unknowns are logged\n- next decisions are obvious\n"
  },
  {
    "slug": "process-modelling-and-improvement",
    "name": "Process Modelling And Improvement",
    "category": "workflow",
    "categoryLabel": "End-to-End Workflows",
    "blurb": "Model current state, find waste, design and validate improvements.",
    "purpose": "Understand the current process, surface pain points, and define an improved target process.",
    "useWhen": [
      "process inefficiency or inconsistency is a core issue",
      "as-is/to-be modelling is needed",
      "handoffs, roles, and decisions are not well understood"
    ],
    "inputs": [
      "project or problem context",
      "goals and constraints",
      "known stakeholders, systems, and documents",
      "level of formality required"
    ],
    "procedure": [
      "Define the business event, actors, boundaries, and outcome.",
      "Document the as-is process with tasks, flow, decisions, and handoffs.",
      "Identify bottlenecks, duplication, ambiguity, and failure points.",
      "Challenge assumptions and piecemeal modifications.",
      "Design the to-be process with explicit improvements.",
      "Compare as-is and to-be via a gap list.",
      "Capture benefits, risks, and change implications.",
      "Provide diagram-ready specs for UML activity or BPMN modelling."
    ],
    "outputs": [
      "as-is process spec",
      "to-be process spec",
      "gap analysis",
      "improvement actions",
      "diagram instructions"
    ],
    "guardrails": [
      "Explicitly separate fact, inference, and assumption.",
      "Prefer evidence-backed conclusions over polished speculation.",
      "Where conflict exists, record it rather than smoothing it away.",
      "Produce artifacts that can be inspected, edited, and reused."
    ],
    "completion": [
      "deliverable pack exists",
      "tradeoffs are explicit",
      "unknowns are logged",
      "next decisions are obvious"
    ],
    "raw": "## Purpose\nUnderstand the current process, surface pain points, and define an improved target process.\n\n## Use when\n- process inefficiency or inconsistency is a core issue\n- as-is/to-be modelling is needed\n- handoffs, roles, and decisions are not well understood\n\n## Inputs\n- project or problem context\n- goals and constraints\n- known stakeholders, systems, and documents\n- level of formality required\n\n## Procedure\n1. Define the business event, actors, boundaries, and outcome.\n2. Document the as-is process with tasks, flow, decisions, and handoffs.\n3. Identify bottlenecks, duplication, ambiguity, and failure points.\n4. Challenge assumptions and piecemeal modifications.\n5. Design the to-be process with explicit improvements.\n6. Compare as-is and to-be via a gap list.\n7. Capture benefits, risks, and change implications.\n8. Provide diagram-ready specs for UML activity or BPMN modelling.\n\n## Outputs\n- as-is process spec\n- to-be process spec\n- gap analysis\n- improvement actions\n- diagram instructions\n\n## Guardrails\n- Explicitly separate fact, inference, and assumption.\n- Prefer evidence-backed conclusions over polished speculation.\n- Where conflict exists, record it rather than smoothing it away.\n- Produce artifacts that can be inspected, edited, and reused.\n\n## Completion criteria\n- deliverable pack exists\n- tradeoffs are explicit\n- unknowns are logged\n- next decisions are obvious\n"
  },
  {
    "slug": "requirements-elicitation",
    "name": "Requirements Elicitation",
    "category": "workflow",
    "categoryLabel": "End-to-End Workflows",
    "blurb": "Full elicitation workflow from discovery through validated requirements.",
    "purpose": "Choose and plan the right elicitation mix across interviews, questionnaires, workshops, observation, and prototypes.",
    "useWhen": [
      "requirements are incomplete or unreliable",
      "stakeholders need structured elicitation",
      "you must decide how to gather evidence, not just what the requirements are"
    ],
    "inputs": [
      "project or problem context",
      "goals and constraints",
      "known stakeholders, systems, and documents",
      "level of formality required"
    ],
    "procedure": [
      "Clarify elicitation objectives and scope.",
      "Decide which techniques fit the context and why.",
      "Produce interview plans and question banks where needed.",
      "Produce workshop agenda and facilitation plan where needed.",
      "Produce questionnaire or observation plan where needed.",
      "Recommend prototypes/mock-ups if textual requirements are insufficient.",
      "Consolidate findings into a structured requirements discovery pack.",
      "Highlight contradictions, missing stakeholders, and follow-up actions."
    ],
    "outputs": [
      "elicitation strategy",
      "interview packs",
      "workshop plan",
      "questionnaire or observation plan",
      "prototype recommendation",
      "findings summary"
    ],
    "guardrails": [
      "Explicitly separate fact, inference, and assumption.",
      "Prefer evidence-backed conclusions over polished speculation.",
      "Where conflict exists, record it rather than smoothing it away.",
      "Produce artifacts that can be inspected, edited, and reused."
    ],
    "completion": [
      "deliverable pack exists",
      "tradeoffs are explicit",
      "unknowns are logged",
      "next decisions are obvious"
    ],
    "raw": "## Purpose\nChoose and plan the right elicitation mix across interviews, questionnaires, workshops, observation, and prototypes.\n\n## Use when\n- requirements are incomplete or unreliable\n- stakeholders need structured elicitation\n- you must decide how to gather evidence, not just what the requirements are\n\n## Inputs\n- project or problem context\n- goals and constraints\n- known stakeholders, systems, and documents\n- level of formality required\n\n## Procedure\n1. Clarify elicitation objectives and scope.\n2. Decide which techniques fit the context and why.\n3. Produce interview plans and question banks where needed.\n4. Produce workshop agenda and facilitation plan where needed.\n5. Produce questionnaire or observation plan where needed.\n6. Recommend prototypes/mock-ups if textual requirements are insufficient.\n7. Consolidate findings into a structured requirements discovery pack.\n8. Highlight contradictions, missing stakeholders, and follow-up actions.\n\n## Outputs\n- elicitation strategy\n- interview packs\n- workshop plan\n- questionnaire or observation plan\n- prototype recommendation\n- findings summary\n\n## Guardrails\n- Explicitly separate fact, inference, and assumption.\n- Prefer evidence-backed conclusions over polished speculation.\n- Where conflict exists, record it rather than smoothing it away.\n- Produce artifacts that can be inspected, edited, and reused.\n\n## Completion criteria\n- deliverable pack exists\n- tradeoffs are explicit\n- unknowns are logged\n- next decisions are obvious\n"
  },
  {
    "slug": "requirements-packager",
    "name": "Requirements Packager",
    "category": "workflow",
    "categoryLabel": "End-to-End Workflows",
    "blurb": "Package discovery notes into a delivery-ready requirements pack.",
    "purpose": "Assemble BA outputs into a coherent, reusable requirements or analysis pack.",
    "useWhen": [
      "elicitation and analysis outputs exist but are fragmented",
      "a formal document or pack is needed",
      "traceability and reviewability matter"
    ],
    "inputs": [
      "project or problem context",
      "goals and constraints",
      "known stakeholders, systems, and documents",
      "level of formality required"
    ],
    "procedure": [
      "Gather all existing artifacts and normalise terminology.",
      "Organise content into background, scope, models, catalogue, and open issues.",
      "Structure requirements into a navigable hierarchy.",
      "Link requirements back to needs, stakeholders, and sources.",
      "Insert diagrams, glossary, assumptions, and traceability references.",
      "Flag unresolved contradictions and decisions pending.",
      "Produce a review-ready package."
    ],
    "outputs": [
      "requirements document structure",
      "requirements catalogue",
      "glossary",
      "source/traceability notes",
      "open issues register"
    ],
    "guardrails": [
      "Explicitly separate fact, inference, and assumption.",
      "Prefer evidence-backed conclusions over polished speculation.",
      "Where conflict exists, record it rather than smoothing it away.",
      "Produce artifacts that can be inspected, edited, and reused."
    ],
    "completion": [
      "deliverable pack exists",
      "tradeoffs are explicit",
      "unknowns are logged",
      "next decisions are obvious"
    ],
    "raw": "## Purpose\nAssemble BA outputs into a coherent, reusable requirements or analysis pack.\n\n## Use when\n- elicitation and analysis outputs exist but are fragmented\n- a formal document or pack is needed\n- traceability and reviewability matter\n\n## Inputs\n- project or problem context\n- goals and constraints\n- known stakeholders, systems, and documents\n- level of formality required\n\n## Procedure\n1. Gather all existing artifacts and normalise terminology.\n2. Organise content into background, scope, models, catalogue, and open issues.\n3. Structure requirements into a navigable hierarchy.\n4. Link requirements back to needs, stakeholders, and sources.\n5. Insert diagrams, glossary, assumptions, and traceability references.\n6. Flag unresolved contradictions and decisions pending.\n7. Produce a review-ready package.\n\n## Outputs\n- requirements document structure\n- requirements catalogue\n- glossary\n- source/traceability notes\n- open issues register\n\n## Guardrails\n- Explicitly separate fact, inference, and assumption.\n- Prefer evidence-backed conclusions over polished speculation.\n- Where conflict exists, record it rather than smoothing it away.\n- Produce artifacts that can be inspected, edited, and reused.\n\n## Completion criteria\n- deliverable pack exists\n- tradeoffs are explicit\n- unknowns are logged\n- next decisions are obvious\n"
  },
  {
    "slug": "ssm-analysis",
    "name": "Ssm Analysis",
    "category": "workflow",
    "categoryLabel": "End-to-End Workflows",
    "blurb": "Soft Systems Methodology: rich pictures, root definitions, CATWOE, conceptual models.",
    "purpose": "Apply Soft Systems Methodology for ambiguous, multi-perspective, sociotechnical problems.",
    "useWhen": [
      "the situation is messy and contested",
      "conventional requirements framing is too narrow",
      "worldview, ownership, and environmental constraints matter heavily"
    ],
    "inputs": [
      "project or problem context",
      "goals and constraints",
      "known stakeholders, systems, and documents",
      "level of formality required"
    ],
    "procedure": [
      "Describe the messy situation without forcing premature structure.",
      "Produce a rich-picture-oriented summary or prompt.",
      "Identify relevant purposeful activity systems.",
      "Perform CATWOE for the most relevant systems.",
      "Write root definitions.",
      "Produce conceptual activity models.",
      "Compare conceptual models to the real world.",
      "Recommend feasible, desirable changes and open tensions."
    ],
    "outputs": [
      "messy-situation summary",
      "rich picture prompt/spec",
      "CATWOE tables",
      "root definitions",
      "conceptual activity model notes",
      "intervention options"
    ],
    "guardrails": [
      "Explicitly separate fact, inference, and assumption.",
      "Prefer evidence-backed conclusions over polished speculation.",
      "Where conflict exists, record it rather than smoothing it away.",
      "Produce artifacts that can be inspected, edited, and reused."
    ],
    "completion": [
      "deliverable pack exists",
      "tradeoffs are explicit",
      "unknowns are logged",
      "next decisions are obvious"
    ],
    "raw": "## Purpose\nApply Soft Systems Methodology for ambiguous, multi-perspective, sociotechnical problems.\n\n## Use when\n- the situation is messy and contested\n- conventional requirements framing is too narrow\n- worldview, ownership, and environmental constraints matter heavily\n\n## Inputs\n- project or problem context\n- goals and constraints\n- known stakeholders, systems, and documents\n- level of formality required\n\n## Procedure\n1. Describe the messy situation without forcing premature structure.\n2. Produce a rich-picture-oriented summary or prompt.\n3. Identify relevant purposeful activity systems.\n4. Perform CATWOE for the most relevant systems.\n5. Write root definitions.\n6. Produce conceptual activity models.\n7. Compare conceptual models to the real world.\n8. Recommend feasible, desirable changes and open tensions.\n\n## Outputs\n- messy-situation summary\n- rich picture prompt/spec\n- CATWOE tables\n- root definitions\n- conceptual activity model notes\n- intervention options\n\n## Guardrails\n- Explicitly separate fact, inference, and assumption.\n- Prefer evidence-backed conclusions over polished speculation.\n- Where conflict exists, record it rather than smoothing it away.\n- Produce artifacts that can be inspected, edited, and reused.\n\n## Completion criteria\n- deliverable pack exists\n- tradeoffs are explicit\n- unknowns are logged\n- next decisions are obvious\n"
  },
  {
    "slug": "stakeholder-analysis",
    "name": "Stakeholder Analysis",
    "category": "workflow",
    "categoryLabel": "End-to-End Workflows",
    "blurb": "Full stakeholder analysis workflow from identification to engagement plan.",
    "purpose": "Build a practical stakeholder management pack, not just a list of names.",
    "useWhen": [
      "multiple parties shape requirements or delivery",
      "politics, conflict, or unclear authority matter",
      "accountability and engagement need formalisation"
    ],
    "inputs": [
      "project or problem context",
      "goals and constraints",
      "known stakeholders, systems, and documents",
      "level of formality required"
    ],
    "procedure": [
      "Identify all stakeholder groups and key individuals.",
      "Capture interests, incentives, concerns, and likely influence.",
      "Map stakeholders on a power-interest grid.",
      "Define engagement posture by stakeholder category.",
      "Produce a RACI for major tasks/deliverables.",
      "Highlight conflicts, blockers, and negotiation needs.",
      "Recommend an engagement plan with cadence and artifacts."
    ],
    "outputs": [
      "stakeholder register",
      "power-interest grid",
      "RACI matrix",
      "conflict map",
      "engagement plan"
    ],
    "guardrails": [
      "Explicitly separate fact, inference, and assumption.",
      "Prefer evidence-backed conclusions over polished speculation.",
      "Where conflict exists, record it rather than smoothing it away.",
      "Produce artifacts that can be inspected, edited, and reused."
    ],
    "completion": [
      "deliverable pack exists",
      "tradeoffs are explicit",
      "unknowns are logged",
      "next decisions are obvious"
    ],
    "raw": "## Purpose\nBuild a practical stakeholder management pack, not just a list of names.\n\n## Use when\n- multiple parties shape requirements or delivery\n- politics, conflict, or unclear authority matter\n- accountability and engagement need formalisation\n\n## Inputs\n- project or problem context\n- goals and constraints\n- known stakeholders, systems, and documents\n- level of formality required\n\n## Procedure\n1. Identify all stakeholder groups and key individuals.\n2. Capture interests, incentives, concerns, and likely influence.\n3. Map stakeholders on a power-interest grid.\n4. Define engagement posture by stakeholder category.\n5. Produce a RACI for major tasks/deliverables.\n6. Highlight conflicts, blockers, and negotiation needs.\n7. Recommend an engagement plan with cadence and artifacts.\n\n## Outputs\n- stakeholder register\n- power-interest grid\n- RACI matrix\n- conflict map\n- engagement plan\n\n## Guardrails\n- Explicitly separate fact, inference, and assumption.\n- Prefer evidence-backed conclusions over polished speculation.\n- Where conflict exists, record it rather than smoothing it away.\n- Produce artifacts that can be inspected, edited, and reused.\n\n## Completion criteria\n- deliverable pack exists\n- tradeoffs are explicit\n- unknowns are logged\n- next decisions are obvious\n"
  },
  {
    "slug": "strategy-analysis",
    "name": "Strategy Analysis",
    "category": "workflow",
    "categoryLabel": "End-to-End Workflows",
    "blurb": "End-to-end strategy analysis combining multiple strategic lenses.",
    "purpose": "Combine strategic lenses into one coherent diagnosis and decision memo.",
    "useWhen": [
      "an initiative needs market, environment, or competitive framing",
      "leadership wants strategy analysis not just requirements work",
      "external forces strongly affect viability"
    ],
    "inputs": [
      "project or problem context",
      "goals and constraints",
      "known stakeholders, systems, and documents",
      "level of formality required"
    ],
    "procedure": [
      "Clarify the strategic decision to be supported.",
      "Run PESTLE for external environment.",
      "Run SWOT and prioritise the few load-bearing items.",
      "Run Porter if competition and market structure matter.",
      "Clarify the value proposition and customer-facing implications.",
      "Identify strategic risks, openings, and positioning choices.",
      "Produce a concise decision memo with options and recommendation."
    ],
    "outputs": [
      "integrated strategy memo",
      "PESTLE table",
      "prioritised SWOT",
      "five-forces summary",
      "value proposition assessment",
      "strategic recommendation"
    ],
    "guardrails": [
      "Explicitly separate fact, inference, and assumption.",
      "Prefer evidence-backed conclusions over polished speculation.",
      "Where conflict exists, record it rather than smoothing it away.",
      "Produce artifacts that can be inspected, edited, and reused."
    ],
    "completion": [
      "deliverable pack exists",
      "tradeoffs are explicit",
      "unknowns are logged",
      "next decisions are obvious"
    ],
    "raw": "## Purpose\nCombine strategic lenses into one coherent diagnosis and decision memo.\n\n## Use when\n- an initiative needs market, environment, or competitive framing\n- leadership wants strategy analysis not just requirements work\n- external forces strongly affect viability\n\n## Inputs\n- project or problem context\n- goals and constraints\n- known stakeholders, systems, and documents\n- level of formality required\n\n## Procedure\n1. Clarify the strategic decision to be supported.\n2. Run PESTLE for external environment.\n3. Run SWOT and prioritise the few load-bearing items.\n4. Run Porter if competition and market structure matter.\n5. Clarify the value proposition and customer-facing implications.\n6. Identify strategic risks, openings, and positioning choices.\n7. Produce a concise decision memo with options and recommendation.\n\n## Outputs\n- integrated strategy memo\n- PESTLE table\n- prioritised SWOT\n- five-forces summary\n- value proposition assessment\n- strategic recommendation\n\n## Guardrails\n- Explicitly separate fact, inference, and assumption.\n- Prefer evidence-backed conclusions over polished speculation.\n- Where conflict exists, record it rather than smoothing it away.\n- Produce artifacts that can be inspected, edited, and reused.\n\n## Completion criteria\n- deliverable pack exists\n- tradeoffs are explicit\n- unknowns are logged\n- next decisions are obvious\n"
  },
  {
    "slug": "catwoe-root-definition",
    "name": "Catwoe Root Definition",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Define a system root view via Customers, Actors, Transformation, Weltanschauung, Owner, Environment.",
    "purpose": "Define a purposeful activity system using CATWOE and produce a root definition.",
    "useWhen": [
      "the problem is messy, political, or systemic",
      "SSM-style framing is needed",
      "worldview and transformation need explicit treatment"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "CATWOE table",
      "root definition",
      "worldview notes",
      "scope and boundary notes"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nDefine a purposeful activity system using CATWOE and produce a root definition.\n\n## Use when\n- the problem is messy, political, or systemic\n- SSM-style framing is needed\n- worldview and transformation need explicit treatment\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- CATWOE table\n- root definition\n- worldview notes\n- scope and boundary notes\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "interview-design",
    "name": "Interview Design",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Plan structured stakeholder interviews with clear goals and question flows.",
    "purpose": "Plan stakeholder interviews that generate usable, structured insights.",
    "useWhen": [
      "requirements or stakeholder views must be elicited",
      "you need a question set and interview plan",
      "conflicting perspectives need unpacking"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "interview objectives",
      "interviewee list",
      "question set",
      "probe prompts",
      "logistics plan"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nPlan stakeholder interviews that generate usable, structured insights.\n\n## Use when\n- requirements or stakeholder views must be elicited\n- you need a question set and interview plan\n- conflicting perspectives need unpacking\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- interview objectives\n- interviewee list\n- question set\n- probe prompts\n- logistics plan\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "moscow-prioritisation",
    "name": "Moscow Prioritisation",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Split requirements into Must, Should, Could and Won't have.",
    "purpose": "Prioritise requirements or scope items into Must, Should, Could, and Won’t.",
    "useWhen": [
      "scope must be constrained",
      "tradeoffs need structured prioritisation",
      "release planning or negotiation is required"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "MoSCoW table",
      "rationale by item",
      "dependency notes",
      "release/scope implications"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nPrioritise requirements or scope items into Must, Should, Could, and Won’t.\n\n## Use when\n- scope must be constrained\n- tradeoffs need structured prioritisation\n- release planning or negotiation is required\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- MoSCoW table\n- rationale by item\n- dependency notes\n- release/scope implications\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "observation-study-plan",
    "name": "Observation Study Plan",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Plan structured observation of real work to expose hidden process steps.",
    "purpose": "Design a workplace observation approach to uncover real process behavior, not just reported behavior.",
    "useWhen": [
      "workarounds, handoffs, or tacit practices matter",
      "interview data may be unreliable or incomplete",
      "process understanding must be grounded in practice"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "observation plan",
      "observation checklist",
      "note-taking structure",
      "risk/ethics considerations",
      "synthesis prompts"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nDesign a workplace observation approach to uncover real process behavior, not just reported behavior.\n\n## Use when\n- workarounds, handoffs, or tacit practices matter\n- interview data may be unreliable or incomplete\n- process understanding must be grounded in practice\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- observation plan\n- observation checklist\n- note-taking structure\n- risk/ethics considerations\n- synthesis prompts\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "pestle-analysis",
    "name": "Pestle Analysis",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Scan Political, Economic, Social, Technological, Legal and Environmental factors around a problem.",
    "purpose": "Systematically scan the external environment across political, economic, sociocultural, technological, legal, and environmental dimensions.",
    "useWhen": [
      "the project is strategy-heavy",
      "external forces may shape viability, timing, or risk",
      "you need a structured environment scan before options analysis"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "PESTLE table",
      "implications by category",
      "top external opportunities",
      "top external threats",
      "monitoring signals"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nSystematically scan the external environment across political, economic, sociocultural, technological, legal, and environmental dimensions.\n\n## Use when\n- the project is strategy-heavy\n- external forces may shape viability, timing, or risk\n- you need a structured environment scan before options analysis\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- PESTLE table\n- implications by category\n- top external opportunities\n- top external threats\n- monitoring signals\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "porters-five-forces",
    "name": "Porters Five Forces",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Assess competitive forces: rivals, entrants, substitutes, supplier and buyer power.",
    "purpose": "Assess competitive pressure from entrants, suppliers, buyers, substitutes, and rivalry.",
    "useWhen": [
      "market attractiveness matters",
      "a product or service strategy is being evaluated",
      "you need a competition-oriented lens"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "five-forces assessment",
      "force-by-force rating",
      "strongest pressure points",
      "strategy implications"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nAssess competitive pressure from entrants, suppliers, buyers, substitutes, and rivalry.\n\n## Use when\n- market attractiveness matters\n- a product or service strategy is being evaluated\n- you need a competition-oriented lens\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- five-forces assessment\n- force-by-force rating\n- strongest pressure points\n- strategy implications\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "power-interest-grid",
    "name": "Power Interest Grid",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Position stakeholders by power and interest to plan engagement.",
    "purpose": "Classify stakeholders by influence and interest to guide engagement effort.",
    "useWhen": [
      "stakeholder management is needed",
      "resource constraints require selective engagement",
      "escalation paths are unclear"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "power-interest matrix",
      "category assignments",
      "engagement posture by stakeholder",
      "escalation notes"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nClassify stakeholders by influence and interest to guide engagement effort.\n\n## Use when\n- stakeholder management is needed\n- resource constraints require selective engagement\n- escalation paths are unclear\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- power-interest matrix\n- category assignments\n- engagement posture by stakeholder\n- escalation notes\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "process-model-spec",
    "name": "Process Model Spec",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Define process models with lanes, steps, decisions, inputs and outputs.",
    "purpose": "Specify a process model clearly enough that a UML activity diagram or BPMN model can be drawn consistently.",
    "useWhen": [
      "a process must be visualised",
      "as-is or to-be work needs explicit flow definition",
      "actors, decisions, and outcomes must be clarified"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "process narrative",
      "tasks/actors/decisions/outcome breakdown",
      "as-is or to-be model spec",
      "modelling assumptions"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nSpecify a process model clearly enough that a UML activity diagram or BPMN model can be drawn consistently.\n\n## Use when\n- a process must be visualised\n- as-is or to-be work needs explicit flow definition\n- actors, decisions, and outcomes must be clarified\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- process narrative\n- tasks/actors/decisions/outcome breakdown\n- as-is or to-be model spec\n- modelling assumptions\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "prototype-elicitation",
    "name": "Prototype Elicitation",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Use prototypes and mock-ups to draw out requirements stakeholders cannot articulate.",
    "purpose": "Use sketches, mock-ups, or prototypes to expose assumptions and refine requirements.",
    "useWhen": [
      "stakeholders struggle to react to text-only requirements",
      "interface, workflow, or interaction detail matters",
      "ambiguity remains after interviews/workshops"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "prototype goals",
      "prototype fidelity recommendation",
      "test scenarios",
      "feedback questions",
      "requirement changes log"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nUse sketches, mock-ups, or prototypes to expose assumptions and refine requirements.\n\n## Use when\n- stakeholders struggle to react to text-only requirements\n- interface, workflow, or interaction detail matters\n- ambiguity remains after interviews/workshops\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- prototype goals\n- prototype fidelity recommendation\n- test scenarios\n- feedback questions\n- requirement changes log\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "questionnaire-design",
    "name": "Questionnaire Design",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Design surveys that collect unbiased, analysable evidence at scale.",
    "purpose": "Design a survey or questionnaire for broad, structured information gathering.",
    "useWhen": [
      "stakeholders are widely distributed",
      "you need quantified opinion or pattern data",
      "interviews alone will not scale"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "questionnaire structure",
      "question bank",
      "response scales",
      "pilot-test notes",
      "analysis plan"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nDesign a survey or questionnaire for broad, structured information gathering.\n\n## Use when\n- stakeholders are widely distributed\n- you need quantified opinion or pattern data\n- interviews alone will not scale\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- questionnaire structure\n- question bank\n- response scales\n- pilot-test notes\n- analysis plan\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "raci-matrix",
    "name": "Raci Matrix",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Clarify who is Responsible, Accountable, Consulted and Informed.",
    "purpose": "Assign Responsible, Accountable, Consulted, and Informed roles to major tasks or deliverables.",
    "useWhen": [
      "ownership is blurry",
      "handoffs are failing",
      "a project or work package needs role clarity"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "RACI matrix",
      "role definitions",
      "identified ownership conflicts",
      "governance notes"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nAssign Responsible, Accountable, Consulted, and Informed roles to major tasks or deliverables.\n\n## Use when\n- ownership is blurry\n- handoffs are failing\n- a project or work package needs role clarity\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- RACI matrix\n- role definitions\n- identified ownership conflicts\n- governance notes\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "see-i-clarifier",
    "name": "See I Clarifier",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Clarify vague concepts using State, Events, Examples and Illustrations.",
    "purpose": "Clarify a concept using State, Elaborate, Exemplify, and Illustrate.",
    "useWhen": [
      "a term is fuzzy",
      "teams are talking past each other",
      "critical concepts need teaching or clarification"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "SEE-I explanation",
      "clarified terminology",
      "examples and non-examples",
      "simplified teaching version"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nClarify a concept using State, Elaborate, Exemplify, and Illustrate.\n\n## Use when\n- a term is fuzzy\n- teams are talking past each other\n- critical concepts need teaching or clarification\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- SEE-I explanation\n- clarified terminology\n- examples and non-examples\n- simplified teaching version\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "stakeholder-register",
    "name": "Stakeholder Register",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Identify stakeholders, their interests, influence and likely impact.",
    "purpose": "Identify stakeholders, their roles, interests, concerns, influence, and likely impact on the work.",
    "useWhen": [
      "stakeholder landscape is unclear",
      "a project is beginning",
      "engagement or governance work needs a baseline"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "stakeholder register",
      "interest/concern notes",
      "influence rating",
      "engagement recommendations"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nIdentify stakeholders, their roles, interests, concerns, influence, and likely impact on the work.\n\n## Use when\n- stakeholder landscape is unclear\n- a project is beginning\n- engagement or governance work needs a baseline\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- stakeholder register\n- interest/concern notes\n- influence rating\n- engagement recommendations\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "swot-prioritisation",
    "name": "Swot Prioritisation",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Analyse strengths, weaknesses, opportunities and threats, then prioritise what to act on.",
    "purpose": "Map strengths, weaknesses, opportunities, and threats, then prioritise the few that matter most.",
    "useWhen": [
      "a SWOT is explicitly requested",
      "you need a compact strategic diagnosis",
      "you need to transition from broad analysis to focused action"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "prioritised SWOT matrix",
      "rationale for each priority",
      "strategic implications",
      "suggested responses"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nMap strengths, weaknesses, opportunities, and threats, then prioritise the few that matter most.\n\n## Use when\n- a SWOT is explicitly requested\n- you need a compact strategic diagnosis\n- you need to transition from broad analysis to focused action\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- prioritised SWOT matrix\n- rationale for each priority\n- strategic implications\n- suggested responses\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "use-case-specification",
    "name": "Use Case Specification",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Specify actors, flows, preconditions and outcomes for system interactions.",
    "purpose": "Define actors, triggers, flows, exceptions, and outcomes for user-system interactions.",
    "useWhen": [
      "functional behavior must be described clearly",
      "requirements need structured interaction modelling",
      "design/testing traceability is important"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "use case list",
      "use case descriptions",
      "normal/alternate/exception flows",
      "acceptance notes"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nDefine actors, triggers, flows, exceptions, and outcomes for user-system interactions.\n\n## Use when\n- functional behavior must be described clearly\n- requirements need structured interaction modelling\n- design/testing traceability is important\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- use case list\n- use case descriptions\n- normal/alternate/exception flows\n- acceptance notes\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "value-proposition-analysis",
    "name": "Value Proposition Analysis",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Map customer jobs, pains and gains against products and services.",
    "purpose": "Clarify what value is delivered, to whom, and through which gain creators or pain relievers.",
    "useWhen": [
      "the organisation or product proposition is vague",
      "process redesign must remain customer-value aligned",
      "alternatives need customer-centric comparison"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "value proposition canvas summary",
      "customer pains/gains/jobs",
      "differentiators",
      "proposition risks"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nClarify what value is delivered, to whom, and through which gain creators or pain relievers.\n\n## Use when\n- the organisation or product proposition is vague\n- process redesign must remain customer-value aligned\n- alternatives need customer-centric comparison\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- value proposition canvas summary\n- customer pains/gains/jobs\n- differentiators\n- proposition risks\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "workshop-design",
    "name": "Workshop Design",
    "category": "atomic",
    "categoryLabel": "Atomic Techniques",
    "blurb": "Facilitation-ready agendas, activities and outputs for BA workshops.",
    "purpose": "Plan a facilitated workshop for collaborative elicitation, alignment, or prioritisation.",
    "useWhen": [
      "multiple stakeholders must align in real time",
      "a workshop is required to gather or reconcile views",
      "decisions or outputs must be produced collaboratively"
    ],
    "inputs": [
      "problem context",
      "available evidence and constraints",
      "known stakeholders or actors",
      "desired output format"
    ],
    "procedure": [
      "Clarify the decision or deliverable.",
      "State assumptions before analysis.",
      "Apply the technique explicitly rather than implicitly.",
      "Capture findings in a structured table or list.",
      "Separate facts, inferences, and unknowns.",
      "End with implications for next actions."
    ],
    "outputs": [
      "workshop objective",
      "agenda",
      "participant list",
      "facilitation techniques",
      "artifacts to capture"
    ],
    "guardrails": [
      "Do not present the technique as the answer; use it to inform a decision.",
      "Flag missing evidence and weak assumptions.",
      "Keep terminology consistent with the project glossary.",
      "Where tradeoffs exist, rank them explicitly."
    ],
    "completion": [
      "technique applied correctly",
      "assumptions visible",
      "findings actionable",
      "next step clear"
    ],
    "raw": "## Purpose\nPlan a facilitated workshop for collaborative elicitation, alignment, or prioritisation.\n\n## Use when\n- multiple stakeholders must align in real time\n- a workshop is required to gather or reconcile views\n- decisions or outputs must be produced collaboratively\n\n## Inputs\n- problem context\n- available evidence and constraints\n- known stakeholders or actors\n- desired output format\n\n## Procedure\n1. Clarify the decision or deliverable.\n2. State assumptions before analysis.\n3. Apply the technique explicitly rather than implicitly.\n4. Capture findings in a structured table or list.\n5. Separate facts, inferences, and unknowns.\n6. End with implications for next actions.\n\n## Outputs\n- workshop objective\n- agenda\n- participant list\n- facilitation techniques\n- artifacts to capture\n\n## Guardrails\n- Do not present the technique as the answer; use it to inform a decision.\n- Flag missing evidence and weak assumptions.\n- Keep terminology consistent with the project glossary.\n- Where tradeoffs exist, rank them explicitly.\n\n## Completion criteria\n- technique applied correctly\n- assumptions visible\n- findings actionable\n- next step clear\n"
  },
  {
    "slug": "acceptance-criteria-writer",
    "name": "Acceptance Criteria Writer",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Write testable, unambiguous acceptance criteria for requirements and stories.",
    "purpose": "Convert requirements or stories into observable, testable acceptance criteria.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"acceptance-criteria-writer\"\npack: \"requirements-discovery-pack\"\npurpose: \"Convert requirements or stories into observable, testable acceptance criteria.\"\ninputs: [\"requirements\", \"story or feature description\", \"constraints\", \"business rules\"]\noutputs: [\"acceptance criteria\", \"negative criteria\", \"ready-for-test checklist\"]\nhandoffs: [\"edge-case-elicitor\", \"requirements-traceability-starter\", \"test-design packs later\"]\n---\n# acceptance-criteria-writer\n\n## Purpose\nConvert requirements or stories into observable, testable acceptance criteria.\n\n## Trigger this skill when\n- Requirements are too high-level to test.\n- Stories exist but there is no clear done condition.\n- You need criteria before implementation or QA work.\n\n## Expected inputs\n- requirements\n- story or feature description\n- constraints\n- business rules\n\n## Deliverables\n- acceptance criteria\n- negative criteria\n- ready-for-test checklist\n\n## Operating procedure\n1. Rewrite each feature into actor + trigger + expected outcome.\n2. Add failure, validation, permission, state, and edge-case behavior.\n3. Use Given/When/Then or equivalent observable format.\n4. Mark any criteria blocked by unresolved ambiguity.\n\n## Quality gates\n- Criteria are observable and verifiable.\n- Criteria cover success and important failure modes.\n- No hidden implementation detail unless intentionally required.\n\n## Handoff targets\n- edge-case-elicitor\n- requirements-traceability-starter\n- test-design packs later\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "ambiguity-hunter",
    "name": "Ambiguity Hunter",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Hunt down vague, ambiguous language in documents and requirements.",
    "purpose": "Find ambiguous wording that makes a requirement unverifiable, inconsistent, or open to multiple interpretations.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"ambiguity-hunter\"\npack: \"requirements-discovery-pack\"\npurpose: \"Find ambiguous wording that makes a requirement unverifiable, inconsistent, or open to multiple interpretations.\"\ninputs: [\"requirements\", \"stories\", \"spec sections\", \"policy text\"]\noutputs: [\"ambiguity report\", \"rewrite suggestions\", \"question list\"]\nhandoffs: [\"requirements-interrogator\", \"acceptance-criteria-writer\", \"requirements-conflict-checker\"]\n---\n# ambiguity-hunter\n\n## Purpose\nFind ambiguous wording that makes a requirement unverifiable, inconsistent, or open to multiple interpretations.\n\n## Trigger this skill when\n- A spec uses flexible language.\n- Multiple teams will interpret the same requirement.\n- A document is heading toward sign-off or implementation.\n\n## Expected inputs\n- requirements\n- stories\n- spec sections\n- policy text\n\n## Deliverables\n- ambiguity report\n- rewrite suggestions\n- question list\n\n## Operating procedure\n1. Scan for subjective adjectives, overloaded nouns, missing units, missing actors, unclear referents, and hidden conditions.\n2. Flag each ambiguous segment and explain why it is risky.\n3. Suggest a tighter rewrite or a clarifying question.\n\n## Quality gates\n- Every flag explains the actual ambiguity, not just that the wording is bad.\n- Rewrites improve testability.\n- Questions are specific enough to answer decisively.\n\n## Handoff targets\n- requirements-interrogator\n- acceptance-criteria-writer\n- requirements-conflict-checker\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "assumption-extractor",
    "name": "Assumption Extractor",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Surface hidden assumptions hiding inside notes, docs and requests.",
    "purpose": "Identify what the request is quietly assuming about users, systems, processes, policies, data, budgets, and timelines.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"assumption-extractor\"\npack: \"requirements-discovery-pack\"\npurpose: \"Identify what the request is quietly assuming about users, systems, processes, policies, data, budgets, and timelines.\"\ninputs: [\"brief\", \"requirements\", \"architecture notes\", \"project plan\"]\noutputs: [\"assumptions register\", \"validation suggestions\", \"high-risk assumptions shortlist\"]\nhandoffs: [\"constraint-detector\", \"requirements-gap-auditor\", \"project-risk-register if present\"]\n---\n# assumption-extractor\n\n## Purpose\nIdentify what the request is quietly assuming about users, systems, processes, policies, data, budgets, and timelines.\n\n## Trigger this skill when\n- A spec looks confident but thin.\n- A project plan or design depends on unstated environmental facts.\n- You suspect the team is relying on defaults that may be false.\n\n## Expected inputs\n- brief\n- requirements\n- architecture notes\n- project plan\n\n## Deliverables\n- assumptions register\n- validation suggestions\n- high-risk assumptions shortlist\n\n## Operating procedure\n1. Scan for implied facts about actors, environments, dependencies, data shape, permissions, volumes, and delivery constraints.\n2. Convert each implied fact into an explicit assumption sentence.\n3. Rate each assumption by impact and likelihood of being wrong.\n4. Suggest how to validate or retire each high-risk assumption.\n\n## Quality gates\n- Assumptions are stated explicitly and testably.\n- High-risk assumptions are clearly separated from benign defaults.\n- No assumption is presented as a fact without evidence.\n\n## Handoff targets\n- constraint-detector\n- requirements-gap-auditor\n- project-risk-register if present\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "constraint-detector",
    "name": "Constraint Detector",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Detect real constraints vs preferences in problem statements.",
    "purpose": "Identify hard boundaries that shape the solution space: technical, legal, organizational, financial, time, platform, and integration constraints.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"constraint-detector\"\npack: \"requirements-discovery-pack\"\npurpose: \"Identify hard boundaries that shape the solution space: technical, legal, organizational, financial, time, platform, and integration constraints.\"\ninputs: [\"requirements\", \"project brief\", \"platform notes\", \"org policies\", \"integration context\"]\noutputs: [\"constraint register\", \"hard vs soft constraints split\", \"design impact notes\"]\nhandoffs: [\"requirements-prioritizer\", \"architecture-option-review if present\", \"definition-of-done-drafter\"]\n---\n# constraint-detector\n\n## Purpose\nIdentify hard boundaries that shape the solution space: technical, legal, organizational, financial, time, platform, and integration constraints.\n\n## Trigger this skill when\n- A team is picking solutions before checking boundaries.\n- The brief references mandated tools, vendors, deadlines, standards, or environments.\n- Feasibility or architecture work is starting.\n\n## Expected inputs\n- requirements\n- project brief\n- platform notes\n- org policies\n- integration context\n\n## Deliverables\n- constraint register\n- hard vs soft constraints split\n- design impact notes\n\n## Operating procedure\n1. Extract all explicit restrictions.\n2. Infer likely constraints from platform, regulation, team capability, procurement, environment, and integration context.\n3. Separate hard constraints from preferences and assumptions.\n4. Note which design options each hard constraint removes or weakens.\n\n## Quality gates\n- Preferences are not mislabeled as hard constraints.\n- Each constraint names its source where possible.\n- Design implications are captured.\n\n## Handoff targets\n- requirements-prioritizer\n- architecture-option-review if present\n- definition-of-done-drafter\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "definition-of-done-drafter",
    "name": "Definition Of Done Drafter",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Draft an explicit, agreed definition of done for deliverables.",
    "purpose": "Draft a requirement-aware definition of done covering analysis, design, implementation, testing, documentation, and operational readiness.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"definition-of-done-drafter\"\npack: \"requirements-discovery-pack\"\npurpose: \"Draft a requirement-aware definition of done covering analysis, design, implementation, testing, documentation, and operational readiness.\"\ninputs: [\"requirements\", \"acceptance criteria\", \"constraints\", \"quality expectations\", \"team process notes\"]\noutputs: [\"definition of done\", \"evidence checklist\", \"release readiness notes\"]\nhandoffs: [\"requirements-traceability-starter\", \"agile/project/testing packs later\"]\n---\n# definition-of-done-drafter\n\n## Purpose\nDraft a requirement-aware definition of done covering analysis, design, implementation, testing, documentation, and operational readiness.\n\n## Trigger this skill when\n- The team needs a shared completion standard.\n- Features are closing without consistent evidence.\n- Agile or iterative delivery is in use.\n\n## Expected inputs\n- requirements\n- acceptance criteria\n- constraints\n- quality expectations\n- team process notes\n\n## Deliverables\n- definition of done\n- evidence checklist\n- release readiness notes\n\n## Operating procedure\n1. Extract mandatory completion conditions from the requirement set.\n2. Add minimum gates for design impact checked, tests passed, docs updated, security/privacy checks, and deployment/rollback readiness where relevant.\n3. Split universal DoD items from feature-specific additions.\n\n## Quality gates\n- Done criteria are evidence-based.\n- The DoD reflects project risk and domain, not generic fluff.\n- Feature-specific obligations remain visible.\n\n## Handoff targets\n- requirements-traceability-starter\n- agile/project/testing packs later\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "edge-case-elicitor",
    "name": "Edge Case Elicitor",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Systematically elicit edge cases, exceptions and failure modes.",
    "purpose": "Generate realistic boundary, invalid, exceptional, and rarely discussed cases from normal requirements.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"edge-case-elicitor\"\npack: \"requirements-discovery-pack\"\npurpose: \"Generate realistic boundary, invalid, exceptional, and rarely discussed cases from normal requirements.\"\ninputs: [\"requirements\", \"acceptance criteria\", \"data rules\", \"workflow states\"]\noutputs: [\"edge-case catalogue\", \"negative scenarios\", \"follow-up questions\"]\nhandoffs: [\"acceptance-criteria-writer\", \"verification/test packs later\", \"ambiguity-hunter\"]\n---\n# edge-case-elicitor\n\n## Purpose\nGenerate realistic boundary, invalid, exceptional, and rarely discussed cases from normal requirements.\n\n## Trigger this skill when\n- A feature looks simple and therefore risky to under-specify.\n- Validation, permissions, workflow branching, or time/state logic exists.\n- Acceptance criteria are too happy-path heavy.\n\n## Expected inputs\n- requirements\n- acceptance criteria\n- data rules\n- workflow states\n\n## Deliverables\n- edge-case catalogue\n- negative scenarios\n- follow-up questions\n\n## Operating procedure\n1. Inspect actor, data, timing, ordering, concurrency, state, limits, and environment assumptions.\n2. Generate invalid, missing, duplicated, stale, partial, unauthorized, boundary, and sequencing scenarios.\n3. Mark which cases need requirement clarification vs direct acceptance criteria.\n\n## Quality gates\n- Cases are plausible, not random.\n- Edge cases map back to a real workflow or data rule.\n- Critical failure modes are represented.\n\n## Handoff targets\n- acceptance-criteria-writer\n- verification/test packs later\n- ambiguity-hunter\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "functional-vs-nonfunctional-splitter",
    "name": "Functional Vs Nonfunctional Splitter",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Split mixed statements into functional vs non-functional requirements.",
    "purpose": "Separate behaviors the system must perform from quality attributes, constraints, and operational rules.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"functional-vs-nonfunctional-splitter\"\npack: \"requirements-discovery-pack\"\npurpose: \"Separate behaviors the system must perform from quality attributes, constraints, and operational rules.\"\ninputs: [\"requirements text\", \"scope notes\", \"stakeholder needs\"]\noutputs: [\"functional requirements list\", \"non-functional requirements list\", \"misclassified statements list\"]\nhandoffs: [\"acceptance-criteria-writer\", \"requirements-prioritizer\", \"requirements-traceability-starter\"]\n---\n# functional-vs-nonfunctional-splitter\n\n## Purpose\nSeparate behaviors the system must perform from quality attributes, constraints, and operational rules.\n\n## Trigger this skill when\n- Requirements are mixed together in prose.\n- A brief uses vague statements like reliable, scalable, simple, secure, fast.\n- You need a cleaner input for design, estimation, or test planning.\n\n## Expected inputs\n- requirements text\n- scope notes\n- stakeholder needs\n\n## Deliverables\n- functional requirements list\n- non-functional requirements list\n- misclassified statements list\n\n## Operating procedure\n1. Extract each requirement statement independently.\n2. Classify it as functional, non-functional, business rule, external constraint, assumption, or design choice.\n3. Rewrite blended statements into multiple atomic requirements where necessary.\n4. Group non-functional items by category such as performance, security, usability, reliability, maintainability, compliance, and supportability.\n\n## Quality gates\n- Each requirement is atomic.\n- Quality constraints are not mislabeled as features.\n- Design choices are not silently treated as requirements.\n\n## Handoff targets\n- acceptance-criteria-writer\n- requirements-prioritizer\n- requirements-traceability-starter\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "problem-statement-refiner",
    "name": "Problem Statement Refiner",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Refine fuzzy problem statements into clear, scoped, evidence-backed statements.",
    "purpose": "Turn a vague idea, pain point, or project brief into a crisp problem statement with objective, scope, stakeholders, constraints, and success criteria.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"problem-statement-refiner\"\npack: \"requirements-discovery-pack\"\npurpose: \"Turn a vague idea, pain point, or project brief into a crisp problem statement with objective, scope, stakeholders, constraints, and success criteria.\"\ninputs: [\"raw brief\", \"business context\", \"user/stakeholder context\", \"known constraints\", \"known goals\"]\noutputs: [\"refined problem statement\", \"goal statement\", \"scope draft\", \"explicit assumptions\", \"open questions\", \"success criteria\"]\nhandoffs: [\"requirements-interrogator\", \"functional-vs-nonfunctional-splitter\", \"assumption-extractor\"]\n---\n# problem-statement-refiner\n\n## Purpose\nTurn a vague idea, pain point, or project brief into a crisp problem statement with objective, scope, stakeholders, constraints, and success criteria.\n\n## Trigger this skill when\n- The request is broad, solution-first, or unclear about the actual problem.\n- A repo or project starts with a one-paragraph brief, issue, or verbal idea.\n- You need a sharper statement before requirements, design, or estimation.\n\n## Expected inputs\n- raw brief\n- business context\n- user/stakeholder context\n- known constraints\n- known goals\n\n## Deliverables\n- refined problem statement\n- goal statement\n- scope draft\n- explicit assumptions\n- open questions\n- success criteria\n\n## Operating procedure\n1. Extract the current pain, desired outcome, affected users, and business context.\n2. Separate symptoms from root problem.\n3. Rewrite the problem in one sentence using actor + need + obstacle + impact.\n4. List scope boundaries, constraints, assumptions, and unknowns.\n5. Define measurable success criteria where possible.\n6. Surface the top unresolved questions that block good requirements.\n\n## Quality gates\n- Distinguishes problem from proposed solution.\n- Names the affected actor(s) and operational/business impact.\n- Contains scope and non-scope.\n- Includes unresolved questions instead of guessing.\n\n## Handoff targets\n- requirements-interrogator\n- functional-vs-nonfunctional-splitter\n- assumption-extractor\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "proto-requirements-normalizer",
    "name": "Proto Requirements Normalizer",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Normalise raw stakeholder statements into consistent requirement format.",
    "purpose": "Normalize rough issue text, chat notes, meeting bullets, or client messages into a usable proto-spec before formal analysis.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"proto-requirements-normalizer\"\npack: \"requirements-discovery-pack\"\npurpose: \"Normalize rough issue text, chat notes, meeting bullets, or client messages into a usable proto-spec before formal analysis.\"\ninputs: [\"raw notes\", \"messages\", \"issue text\", \"meeting bullets\"]\noutputs: [\"normalized proto-spec\", \"structured bullets\", \"unknowns list\", \"candidate requirement IDs\"]\nhandoffs: [\"problem-statement-refiner\", \"requirements-interrogator\", \"functional-vs-nonfunctional-splitter\"]\n---\n# proto-requirements-normalizer\n\n## Purpose\nNormalize rough issue text, chat notes, meeting bullets, or client messages into a usable proto-spec before formal analysis.\n\n## Trigger this skill when\n- Requirements exist only in messy notes or chat.\n- A repo issue or stakeholder message needs structure fast.\n- You need a clean starting point for the rest of the pack.\n\n## Expected inputs\n- raw notes\n- messages\n- issue text\n- meeting bullets\n\n## Deliverables\n- normalized proto-spec\n- structured bullets\n- unknowns list\n- candidate requirement IDs\n\n## Operating procedure\n1. Group raw notes into problem, actors, goals, behaviors, constraints, risks, and open questions.\n2. Rewrite fragments into clean requirement-like statements without pretending certainty.\n3. Preserve uncertainty explicitly.\n4. Assign provisional IDs so later artifacts can refer to them.\n\n## Quality gates\n- No invented certainty.\n- Raw note intent is preserved.\n- The output is structured enough to feed other skills.\n\n## Handoff targets\n- problem-statement-refiner\n- requirements-interrogator\n- functional-vs-nonfunctional-splitter\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "requirements-conflict-checker",
    "name": "Requirements Conflict Checker",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Find conflicts, contradictions and tensions between requirements.",
    "purpose": "Detect contradictions, tension, or incompatible expectations across requirements, business rules, policies, and constraints.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"requirements-conflict-checker\"\npack: \"requirements-discovery-pack\"\npurpose: \"Detect contradictions, tension, or incompatible expectations across requirements, business rules, policies, and constraints.\"\ninputs: [\"requirements set\", \"business rules\", \"constraints\", \"assumptions\"]\noutputs: [\"conflict matrix\", \"severity-ranked issues\", \"resolution options\"]\nhandoffs: [\"requirements-prioritizer\", \"decision-log if present\", \"problem-statement-refiner\"]\n---\n# requirements-conflict-checker\n\n## Purpose\nDetect contradictions, tension, or incompatible expectations across requirements, business rules, policies, and constraints.\n\n## Trigger this skill when\n- Requirements were gathered from multiple people or stages.\n- NFRs may compete with each other or with schedule/cost limits.\n- A change request could invalidate earlier decisions.\n\n## Expected inputs\n- requirements set\n- business rules\n- constraints\n- assumptions\n\n## Deliverables\n- conflict matrix\n- severity-ranked issues\n- resolution options\n\n## Operating procedure\n1. Compare requirements pairwise where overlap exists.\n2. Look for logical contradiction, duplicated intent with different wording, NFR tradeoff tension, and scope mismatch.\n3. Describe the impact of each conflict and the likely owner who must resolve it.\n4. Suggest resolution paths rather than silently choosing one.\n\n## Quality gates\n- Conflicts are concrete and source-linked.\n- Tradeoffs are explicit.\n- No silent assumption is used to 'resolve' a contradiction.\n\n## Handoff targets\n- requirements-prioritizer\n- decision-log if present\n- problem-statement-refiner\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "requirements-gap-auditor",
    "name": "Requirements Gap Auditor",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Audit a requirement set for missing coverage and gaps.",
    "purpose": "Audit a requirement set for what is missing relative to common engineering needs: actors, flows, data, validation, security, operations, and lifecycle.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"requirements-gap-auditor\"\npack: \"requirements-discovery-pack\"\npurpose: \"Audit a requirement set for what is missing relative to common engineering needs: actors, flows, data, validation, security, operations, and lifecycle.\"\ninputs: [\"requirements\", \"problem statement\", \"constraints\", \"assumptions\", \"acceptance criteria if any\"]\noutputs: [\"gap audit report\", \"missing topic checklist\", \"remediation suggestions\"]\nhandoffs: [\"requirements-interrogator\", \"constraint-detector\", \"definition-of-done-drafter\"]\n---\n# requirements-gap-auditor\n\n## Purpose\nAudit a requirement set for what is missing relative to common engineering needs: actors, flows, data, validation, security, operations, and lifecycle.\n\n## Trigger this skill when\n- A draft spec feels thin but the exact gaps are unclear.\n- Before sign-off, estimation, architecture, or build.\n- After a large edit or merge of multiple requirement sources.\n\n## Expected inputs\n- requirements\n- problem statement\n- constraints\n- assumptions\n- acceptance criteria if any\n\n## Deliverables\n- gap audit report\n- missing topic checklist\n- remediation suggestions\n\n## Operating procedure\n1. Check for normal completeness categories: actors, triggers, preconditions, postconditions, data, validation, permissions, error handling, NFRs, support/ops, reporting, auditability, rollout, and maintenance.\n2. Flag absent or weak areas.\n3. Suggest the next best artifact or question to close each major gap.\n\n## Quality gates\n- Gaps are categorized and evidence-based.\n- Findings distinguish absent, weak, and deferred.\n- Suggestions are actionable.\n\n## Handoff targets\n- requirements-interrogator\n- constraint-detector\n- definition-of-done-drafter\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "requirements-interrogator",
    "name": "Requirements Interrogator",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Interrogate raw notes to extract, question and sharpen requirements.",
    "purpose": "Run a disciplined clarification pass that pressure-tests requirements, surfaces hidden constraints, and exposes ambiguity early.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"requirements-interrogator\"\npack: \"requirements-discovery-pack\"\npurpose: \"Run a disciplined clarification pass that pressure-tests requirements, surfaces hidden constraints, and exposes ambiguity early.\"\ninputs: [\"problem statement\", \"existing requirements\", \"stakeholders\", \"project constraints\"]\noutputs: [\"clarification question set\", \"requirements issues list\", \"assumptions register\", \"updated requirement notes\"]\nhandoffs: [\"ambiguity-hunter\", \"constraint-detector\", \"acceptance-criteria-writer\"]\n---\n# requirements-interrogator\n\n## Purpose\nRun a disciplined clarification pass that pressure-tests requirements, surfaces hidden constraints, and exposes ambiguity early.\n\n## Trigger this skill when\n- The user has given requirements but they are incomplete, optimistic, or inconsistent.\n- You are about to design, estimate, or implement from natural-language requirements.\n- A change request may affect security, compliance, UX, or operations.\n\n## Expected inputs\n- problem statement\n- existing requirements\n- stakeholders\n- project constraints\n\n## Deliverables\n- clarification question set\n- requirements issues list\n- assumptions register\n- updated requirement notes\n\n## Operating procedure\n1. Read the current requirement set end to end.\n2. Probe for actor, trigger, precondition, main flow, exception flow, data, policy, security, timing, and operational concerns.\n3. Classify ambiguities into missing information, conflict, hidden assumption, scope uncertainty, and unverifiable statement.\n4. Prioritize the highest-risk unanswered questions first.\n5. Rewrite shaky requirements into testable language where enough context exists.\n\n## Quality gates\n- Questions are risk-based, not random.\n- Distinguishes missing requirement from implementation decision.\n- Marks unverifiable language such as fast, user-friendly, secure, intuitive, scalable.\n\n## Handoff targets\n- ambiguity-hunter\n- constraint-detector\n- acceptance-criteria-writer\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "requirements-prioritizer",
    "name": "Requirements Prioritizer",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Prioritise requirements using value, risk, effort and dependency logic.",
    "purpose": "Prioritize requirements using impact, risk, dependency, stakeholder value, and delivery sequencing.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"requirements-prioritizer\"\npack: \"requirements-discovery-pack\"\npurpose: \"Prioritize requirements using impact, risk, dependency, stakeholder value, and delivery sequencing.\"\ninputs: [\"requirements\", \"business goals\", \"constraints\", \"dependencies\", \"risks\"]\noutputs: [\"priority-ranked requirements\", \"MoSCoW or equivalent classification\", \"cut-line suggestions\"]\nhandoffs: [\"definition-of-done-drafter\", \"project-planning packs later\", \"requirements-traceability-starter\"]\n---\n# requirements-prioritizer\n\n## Purpose\nPrioritize requirements using impact, risk, dependency, stakeholder value, and delivery sequencing.\n\n## Trigger this skill when\n- There are too many requirements for one release.\n- A backlog or scope cut is needed.\n- Tradeoff decisions need a disciplined basis.\n\n## Expected inputs\n- requirements\n- business goals\n- constraints\n- dependencies\n- risks\n\n## Deliverables\n- priority-ranked requirements\n- MoSCoW or equivalent classification\n- cut-line suggestions\n\n## Operating procedure\n1. Score each requirement across value, risk reduction, dependency centrality, urgency, and effort sensitivity.\n2. Propose Must/Should/Could/Won't or equivalent categories.\n3. Highlight items that are low-value but high-cost or high-risk.\n4. Suggest a release cut line and rationale.\n\n## Quality gates\n- Priority rationale is explicit.\n- Dependencies are respected.\n- Critical compliance/security requirements are not accidentally demoted.\n\n## Handoff targets\n- definition-of-done-drafter\n- project-planning packs later\n- requirements-traceability-starter\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "requirements-traceability-starter",
    "name": "Requirements Traceability Starter",
    "category": "requirements",
    "categoryLabel": "Requirements & Specification",
    "blurb": "Start a traceability matrix linking goals to requirements to tests.",
    "purpose": "Create an initial traceability structure linking goals, requirements, acceptance criteria, design items, and tests.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"requirements-traceability-starter\"\npack: \"requirements-discovery-pack\"\npurpose: \"Create an initial traceability structure linking goals, requirements, acceptance criteria, design items, and tests.\"\ninputs: [\"goals\", \"requirements\", \"acceptance criteria\", \"design placeholders\"]\noutputs: [\"traceability matrix starter\", \"ID scheme\", \"coverage gaps\"]\nhandoffs: [\"requirements-gap-auditor\", \"test-design packs later\", \"change-impact work later\"]\n---\n# requirements-traceability-starter\n\n## Purpose\nCreate an initial traceability structure linking goals, requirements, acceptance criteria, design items, and tests.\n\n## Trigger this skill when\n- A project is becoming large enough that requirement drift is a risk.\n- There will be multiple artifacts or teams.\n- You need change impact visibility later.\n\n## Expected inputs\n- goals\n- requirements\n- acceptance criteria\n- design placeholders\n\n## Deliverables\n- traceability matrix starter\n- ID scheme\n- coverage gaps\n\n## Operating procedure\n1. Assign stable IDs to goals, requirements, and criteria.\n2. Link each requirement to source goal/stakeholder need.\n3. Link criteria to requirements and note future design/test links.\n4. Flag requirements with no source or no acceptance coverage.\n\n## Quality gates\n- IDs are stable and readable.\n- Every requirement has a source.\n- Uncovered requirements are explicitly flagged.\n\n## Handoff targets\n- requirements-gap-auditor\n- test-design packs later\n- change-impact work later\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer short, testable statements over long prose.\n- Surface risk and ambiguity instead of guessing.\n- Separate facts, assumptions, constraints, and open questions.\n\n## Failure modes to avoid\n- Do not invent stakeholder intent.\n- Do not convert preferences into mandatory requirements without evidence.\n- Do not hide unresolved ambiguity behind polished wording.\n- Do not collapse functional, non-functional, and business rule concerns into one blob.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Assumptions\n## Constraints\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "as-is-process-investigator",
    "name": "As Is Process Investigator",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Investigate and document the current state process with evidence.",
    "purpose": "Document and analyze the current-state process, including actors, steps, decisions, delays, pain points, exceptions, and unofficial workarounds.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"as-is-process-investigator\"\npack: \"business-analysis-pack\"\npurpose: \"Document and analyze the current-state process, including actors, steps, decisions, delays, pain points, exceptions, and unofficial workarounds.\"\ninputs: [\"interview notes\", \"observation notes\", \"documents\", \"current system/process context\"]\noutputs: [\"as-is process summary\", \"pain points\", \"handoff map\", \"gaps and risks\", \"candidate modeling notes\"]\nhandoffs: [\"to-be-process-designer\", \"business-rule-extractor\", \"benefit-hypothesis-writer\"]\n---\n# as-is-process-investigator\n\n## Purpose\nDocument and analyze the current-state process, including actors, steps, decisions, delays, pain points, exceptions, and unofficial workarounds.\n\n## Trigger this skill when\n- You need to understand the current process before recommending change.\n- The real workflow is unclear or disputed.\n- There are complaints but no agreed process map.\n\n## Expected inputs\n- interview notes\n- observation notes\n- documents\n- current system/process context\n\n## Deliverables\n- as-is process summary\n- pain points\n- handoff map\n- gaps and risks\n- candidate modeling notes\n\n## Operating procedure\n1. Reconstruct the current workflow from multiple evidence sources.\n2. List actors, triggers, decisions, artifacts, handoffs, timings, and exception paths.\n3. Identify bottlenecks, rework loops, and dependency pain points.\n4. Separate official process from how work actually gets done.\n5. Summarize the current-state findings and what should be preserved, fixed, or questioned.\n\n## Quality gates\n- Official and unofficial workflows are separated.\n- Pain points are grounded in observed or reported evidence.\n- The output is specific enough to inform to-be design.\n\n## Handoff targets\n- to-be-process-designer\n- business-rule-extractor\n- benefit-hypothesis-writer\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "benefit-hypothesis-writer",
    "name": "Benefit Hypothesis Writer",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Write measurable benefit hypotheses linking change to outcomes.",
    "purpose": "Turn proposed process or system changes into explicit benefit hypotheses with measurable expected outcomes and assumptions.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"benefit-hypothesis-writer\"\npack: \"business-analysis-pack\"\npurpose: \"Turn proposed process or system changes into explicit benefit hypotheses with measurable expected outcomes and assumptions.\"\ninputs: [\"problem statement\", \"as-is findings\", \"to-be proposal\", \"stakeholder goals\", \"baseline pain points\"]\noutputs: [\"benefit hypotheses\", \"success measures\", \"dependency assumptions\", \"evidence gaps\"]\nhandoffs: [\"stakeholder-communication-planner\", \"project-charter-writer if present\", \"requirements-prioritizer if present\"]\n---\n# benefit-hypothesis-writer\n\n## Purpose\nTurn proposed process or system changes into explicit benefit hypotheses with measurable expected outcomes and assumptions.\n\n## Trigger this skill when\n- A change is being proposed but the benefit case is weak or hand-wavy.\n- Stakeholders want to know why the change matters.\n- You need a bridge from analysis to business value.\n\n## Expected inputs\n- problem statement\n- as-is findings\n- to-be proposal\n- stakeholder goals\n- baseline pain points\n\n## Deliverables\n- benefit hypotheses\n- success measures\n- dependency assumptions\n- evidence gaps\n\n## Operating procedure\n1. List the proposed change and the baseline problem it addresses.\n2. Write hypotheses in the form: if we change X for Y context, we expect Z outcome because A.\n3. Define leading and lagging measures where possible.\n4. Capture assumptions, dependencies, and evidence gaps.\n5. Differentiate direct benefits, indirect benefits, and uncertain upside.\n\n## Quality gates\n- Hypotheses are measurable where possible.\n- Causal logic is explicit.\n- Assumptions and evidence gaps are visible.\n\n## Handoff targets\n- stakeholder-communication-planner\n- project-charter-writer if present\n- requirements-prioritizer if present\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "breakout-structure-designer",
    "name": "Breakout Structure Designer",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Design breakout group structures for large workshops.",
    "purpose": "Design breakout exercises that help groups generate structured output instead of parallel confusion.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"breakout-structure-designer\"\npack: \"business-analysis-pack\"\npurpose: \"Design breakout exercises that help groups generate structured output instead of parallel confusion.\"\ninputs: [\"workshop agenda\", \"participants\", \"objective\", \"artifact target\"]\noutputs: [\"breakout design\", \"group assignments\", \"facilitation instructions\", \"synthesis plan\"]\nhandoffs: [\"workshop-agenda-builder\", \"as-is-process-investigator\", \"to-be-process-designer\"]\n---\n# breakout-structure-designer\n\n## Purpose\nDesign breakout exercises that help groups generate structured output instead of parallel confusion.\n\n## Trigger this skill when\n- A workshop needs breakout sessions but the exercise design is unclear.\n- You need parallel stakeholder input without chaos.\n- The session must produce comparable outputs from multiple groups.\n\n## Expected inputs\n- workshop agenda\n- participants\n- objective\n- artifact target\n\n## Deliverables\n- breakout design\n- group assignments\n- facilitation instructions\n- synthesis plan\n\n## Operating procedure\n1. Choose groupings based on role mix, topic scope, and desired tension or consensus.\n2. Define the breakout task, expected artifact, and timebox.\n3. Write simple instructions and output format constraints.\n4. Plan how outputs will be synthesized in plenary.\n5. Add facilitator checkpoints and recovery plans.\n\n## Quality gates\n- Breakouts have a concrete output format.\n- Group structure supports the objective.\n- There is a synthesis method after the breakouts.\n\n## Handoff targets\n- workshop-agenda-builder\n- as-is-process-investigator\n- to-be-process-designer\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "business-rule-extractor",
    "name": "Business Rule Extractor",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Extract formal business rules from policies, docs and interviews.",
    "purpose": "Extract explicit and implicit business rules from interviews, documents, process descriptions, and system behavior.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"business-rule-extractor\"\npack: \"business-analysis-pack\"\npurpose: \"Extract explicit and implicit business rules from interviews, documents, process descriptions, and system behavior.\"\ninputs: [\"documents\", \"interview notes\", \"process notes\", \"system descriptions\"]\noutputs: [\"business rules register\", \"rule sources\", \"rule ambiguities\", \"rule conflicts\"]\nhandoffs: [\"as-is-process-investigator\", \"to-be-process-designer\", \"requirements packs later\"]\n---\n# business-rule-extractor\n\n## Purpose\nExtract explicit and implicit business rules from interviews, documents, process descriptions, and system behavior.\n\n## Trigger this skill when\n- Rules are scattered across documents, people, and legacy behavior.\n- Stakeholders speak in examples but the underlying rules are unclear.\n- The process depends on approvals, eligibility logic, exceptions, or policy constraints.\n\n## Expected inputs\n- documents\n- interview notes\n- process notes\n- system descriptions\n\n## Deliverables\n- business rules register\n- rule sources\n- rule ambiguities\n- rule conflicts\n\n## Operating procedure\n1. Scan source material for decision logic, eligibility criteria, timing rules, approval conditions, thresholds, and exceptions.\n2. Rewrite each rule into clear conditional language where possible.\n3. Link each rule to its source and confidence level.\n4. Separate confirmed rules from inferred rules.\n5. Flag conflicts, missing parameters, and unclear authority.\n\n## Quality gates\n- Rules are atomic and testable.\n- Source and confidence are captured.\n- Inferred rules are clearly marked.\n\n## Handoff targets\n- as-is-process-investigator\n- to-be-process-designer\n- requirements packs later\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "probe-question-generator",
    "name": "Probe Question Generator",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Generate probing questions that dig beneath stated wants.",
    "purpose": "Generate follow-up probe questions that push past generic answers into evidence, examples, rules, edge cases, and pain points.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"probe-question-generator\"\npack: \"business-analysis-pack\"\npurpose: \"Generate follow-up probe questions that push past generic answers into evidence, examples, rules, edge cases, and pain points.\"\ninputs: [\"base questions\", \"analysis theme\", \"stakeholder type\", \"current answers if any\"]\noutputs: [\"probe question set\", \"probe rationale\", \"likely signal targets\"]\nhandoffs: [\"interview-plan-designer\", \"business-rule-extractor\", \"as-is-process-investigator\"]\n---\n# probe-question-generator\n\n## Purpose\nGenerate follow-up probe questions that push past generic answers into evidence, examples, rules, edge cases, and pain points.\n\n## Trigger this skill when\n- Base questions are too shallow.\n- Stakeholders are likely to answer with generic or overly polished statements.\n- You need evidence-oriented follow-ups.\n\n## Expected inputs\n- base questions\n- analysis theme\n- stakeholder type\n- current answers if any\n\n## Deliverables\n- probe question set\n- probe rationale\n- likely signal targets\n\n## Operating procedure\n1. Review the base questions and identify where generic answers are likely.\n2. Generate probes for examples, exceptions, timings, frequency, triggers, approval rules, data, handoffs, and failure cases.\n3. Tailor probes to stakeholder vocabulary and likely blind spots.\n4. Tag each probe with what it is trying to uncover.\n5. Sequence probes from least to most challenging.\n\n## Quality gates\n- Probes seek observable detail.\n- Probes do not become hostile or leading.\n- Each probe is tied to a signal target.\n\n## Handoff targets\n- interview-plan-designer\n- business-rule-extractor\n- as-is-process-investigator\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "pyramid-funnel-diamond-interviewer",
    "name": "Pyramid Funnel Diamond Interviewer",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Apply pyramid, funnel and diamond questioning structures to interviews.",
    "purpose": "Choose and apply the right interview question structure: pyramid, funnel, or diamond, based on stakeholder type and elicitation objective.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"pyramid-funnel-diamond-interviewer\"\npack: \"business-analysis-pack\"\npurpose: \"Choose and apply the right interview question structure: pyramid, funnel, or diamond, based on stakeholder type and elicitation objective.\"\ninputs: [\"interview goal\", \"stakeholder type\", \"topic sensitivity\", \"known context\"]\noutputs: [\"recommended structure\", \"question order\", \"rationale\", \"example sequence\"]\nhandoffs: [\"probe-question-generator\", \"interview-plan-designer\", \"business-rule-extractor\"]\n---\n# pyramid-funnel-diamond-interviewer\n\n## Purpose\nChoose and apply the right interview question structure: pyramid, funnel, or diamond, based on stakeholder type and elicitation objective.\n\n## Trigger this skill when\n- You need help choosing how to sequence interview questions.\n- The topic is sensitive, ambiguous, or at risk of producing vague answers.\n- Different stakeholder types require different elicitation pacing.\n\n## Expected inputs\n- interview goal\n- stakeholder type\n- topic sensitivity\n- known context\n\n## Deliverables\n- recommended structure\n- question order\n- rationale\n- example sequence\n\n## Operating procedure\n1. Assess whether the interview should open broad, open narrow, or combine both.\n2. Match stakeholder type and topic sensitivity to pyramid, funnel, or diamond structure.\n3. Draft an ordered question sequence.\n4. Add transition prompts and contingency prompts.\n5. Explain why this structure fits the objective.\n\n## Quality gates\n- Structure matches the stakeholder and topic.\n- Questions move from one layer to the next deliberately.\n- The output includes rationale, not just a list.\n\n## Handoff targets\n- probe-question-generator\n- interview-plan-designer\n- business-rule-extractor\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "questionnaire-pilot-checker",
    "name": "Questionnaire Pilot Checker",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Pilot and stress-test questionnaires before full rollout.",
    "purpose": "Review a draft questionnaire for ambiguity, bias, fatigue, ordering issues, and poor measurement design before distribution.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"questionnaire-pilot-checker\"\npack: \"business-analysis-pack\"\npurpose: \"Review a draft questionnaire for ambiguity, bias, fatigue, ordering issues, and poor measurement design before distribution.\"\ninputs: [\"questionnaire draft\", \"target audience\", \"research goal\"]\noutputs: [\"pilot review findings\", \"revised questionnaire notes\", \"risk flags\", \"recommended fixes\"]\nhandoffs: [\"questionnaire-designer\", \"stakeholder-communication-planner\", \"benefit-hypothesis-writer\"]\n---\n# questionnaire-pilot-checker\n\n## Purpose\nReview a draft questionnaire for ambiguity, bias, fatigue, ordering issues, and poor measurement design before distribution.\n\n## Trigger this skill when\n- A questionnaire exists but has not been pressure-tested.\n- You want to avoid distributing a flawed instrument.\n- Early feedback suggests confusion or low response quality.\n\n## Expected inputs\n- questionnaire draft\n- target audience\n- research goal\n\n## Deliverables\n- pilot review findings\n- revised questionnaire notes\n- risk flags\n- recommended fixes\n\n## Operating procedure\n1. Review the draft for ambiguity, jargon, double meanings, and leading language.\n2. Check order effects, respondent burden, missing answer options, and broken logic.\n3. Assess whether the wording fits the audience.\n4. Recommend pilot changes before broader distribution.\n5. Highlight questions that will be hard to analyze.\n\n## Quality gates\n- Findings are concrete and actionable.\n- Bias and fatigue risks are visible.\n- Review considers the audience, not just wording quality.\n\n## Handoff targets\n- questionnaire-designer\n- stakeholder-communication-planner\n- benefit-hypothesis-writer\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "raci-rasci-builder",
    "name": "Raci Rasci Builder",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Build RASCI charts separating responsible, accountable, supportive, consulted, informed.",
    "purpose": "Clarify ownership, support, consultation, and accountability across analysis and delivery activities.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"raci-rasci-builder\"\npack: \"business-analysis-pack\"\npurpose: \"Clarify ownership, support, consultation, and accountability across analysis and delivery activities.\"\ninputs: [\"stakeholder list\", \"work activities\", \"decision points\", \"org context\"]\noutputs: [\"RACI or RASCI matrix\", \"role ambiguities\", \"ownership gaps\", \"decision bottlenecks\"]\nhandoffs: [\"stakeholder-communication-planner\", \"workshop-agenda-builder\", \"project-planning packs later\"]\n---\n# raci-rasci-builder\n\n## Purpose\nClarify ownership, support, consultation, and accountability across analysis and delivery activities.\n\n## Trigger this skill when\n- Roles are blurred or multiple people assume someone else owns the work.\n- Approvals and responsibilities are slowing progress.\n- You need a clear participation model for analysis and design tasks.\n\n## Expected inputs\n- stakeholder list\n- work activities\n- decision points\n- org context\n\n## Deliverables\n- RACI or RASCI matrix\n- role ambiguities\n- ownership gaps\n- decision bottlenecks\n\n## Operating procedure\n1. List key activities, decisions, and artifact responsibilities.\n2. Assign Responsible, Accountable, Consulted, Informed, and optionally Support roles.\n3. Detect cells with too many accountables, no responsible owner, or excessive consultation overhead.\n4. Highlight role conflicts and escalation needs.\n5. Output the matrix with interpretation notes.\n\n## Quality gates\n- Every critical activity has a responsible owner.\n- Accountability is singular where appropriate.\n- The matrix exposes bottlenecks instead of hiding them.\n\n## Handoff targets\n- stakeholder-communication-planner\n- workshop-agenda-builder\n- project-planning packs later\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "stakeholder-communication-planner",
    "name": "Stakeholder Communication Planner",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Plan who needs what message, on which channel, how often.",
    "purpose": "Define what each stakeholder group needs to know, when they need it, and how they should be engaged through the analysis lifecycle.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"stakeholder-communication-planner\"\npack: \"business-analysis-pack\"\npurpose: \"Define what each stakeholder group needs to know, when they need it, and how they should be engaged through the analysis lifecycle.\"\ninputs: [\"stakeholder map\", \"power-interest matrix\", \"project timeline\", \"decision points\"]\noutputs: [\"communication plan\", \"cadence recommendations\", \"owner suggestions\", \"engagement risks\"]\nhandoffs: [\"workshop-agenda-builder\", \"interview-plan-designer\", \"project-charter-writer if present\"]\n---\n# stakeholder-communication-planner\n\n## Purpose\nDefine what each stakeholder group needs to know, when they need it, and how they should be engaged through the analysis lifecycle.\n\n## Trigger this skill when\n- Stakeholder engagement is likely to drift or become ad hoc.\n- You need a deliberate communication approach before workshops or discovery sessions.\n- There are multiple audiences with different information needs.\n\n## Expected inputs\n- stakeholder map\n- power-interest matrix\n- project timeline\n- decision points\n\n## Deliverables\n- communication plan\n- cadence recommendations\n- owner suggestions\n- engagement risks\n\n## Operating procedure\n1. Segment stakeholders by information need, timing, influence, and required level of involvement.\n2. Map each segment to a cadence, channel, format, and owner.\n3. Separate decision communication from status communication.\n4. Identify moments that require consultation, sign-off, or escalation.\n5. Call out overload risk, silence risk, and bypass risk.\n\n## Quality gates\n- Plan is stakeholder-specific instead of one broadcast cadence for everyone.\n- Decision points and sign-off moments are explicit.\n- Communication risks are visible.\n\n## Handoff targets\n- workshop-agenda-builder\n- interview-plan-designer\n- project-charter-writer if present\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "to-be-process-designer",
    "name": "To Be Process Designer",
    "category": "elicitation",
    "categoryLabel": "Elicitation & Process",
    "blurb": "Design the improved future state process with measurable gains.",
    "purpose": "Design an improved future-state process with clearer roles, fewer pain points, and explicit transition implications.",
    "useWhen": [],
    "inputs": [],
    "procedure": [],
    "outputs": [],
    "guardrails": [],
    "completion": [],
    "raw": "---\nname: \"to-be-process-designer\"\npack: \"business-analysis-pack\"\npurpose: \"Design an improved future-state process with clearer roles, fewer pain points, and explicit transition implications.\"\ninputs: [\"as-is process findings\", \"business goals\", \"constraints\", \"stakeholder preferences\", \"risks\"]\noutputs: [\"to-be process outline\", \"changes from current state\", \"transition risks\", \"open design decisions\"]\nhandoffs: [\"benefit-hypothesis-writer\", \"raci-rasci-builder\", \"architecture/design packs later\"]\n---\n# to-be-process-designer\n\n## Purpose\nDesign an improved future-state process with clearer roles, fewer pain points, and explicit transition implications.\n\n## Trigger this skill when\n- The current process has been analyzed and future-state design is needed.\n- Stakeholders want improvement options rather than only problem documentation.\n- A change initiative needs a future workflow view.\n\n## Expected inputs\n- as-is process findings\n- business goals\n- constraints\n- stakeholder preferences\n- risks\n\n## Deliverables\n- to-be process outline\n- changes from current state\n- transition risks\n- open design decisions\n\n## Operating procedure\n1. Start from the business goal and current-state pain points.\n2. Propose a future-state workflow with revised roles, decisions, handoffs, and controls.\n3. Document what changes, what stays, and why.\n4. Highlight transition, adoption, and dependency risks.\n5. List open design decisions and unresolved tradeoffs.\n\n## Quality gates\n- The future-state process solves named pain points.\n- Differences from current state are explicit.\n- Transition implications are visible.\n\n## Handoff targets\n- benefit-hypothesis-writer\n- raci-rasci-builder\n- architecture/design packs later\n\n## Output style\n- Be explicit about uncertainty.\n- Prefer structured outputs over loose prose.\n- Separate confirmed findings, inferred findings, and open questions.\n- Preserve source context where practical.\n\n## Failure modes to avoid\n- Do not pretend weak evidence is confirmed fact.\n- Do not confuse stakeholder opinion with validated rule or process truth.\n- Do not hide missing coverage behind polished wording.\n- Do not flatten politically different stakeholders into one generic audience.\n\n## Minimum output skeleton\n```md\n## Summary\n## Findings\n## Structured outputs\n## Risks or tensions\n## Open questions\n## Recommended next skill\n```\n"
  },
  {
    "slug": "assumptions-constraints-log",
    "name": "Assumptions Constraints Log",
    "category": "quality",
    "categoryLabel": "Quality Checks",
    "blurb": "Build a living log of assumptions and constraints with owners and review dates.",
    "purpose": "Extract and normalise assumptions, constraints, and dependencies into one visible register.",
    "useWhen": [
      "project framing or requirements contain implicit assumptions",
      "constraints are scattered across artifacts",
      "reviewability and risk awareness matter"
    ],
    "inputs": [
      "artifact or analysis output under review",
      "source material and assumptions",
      "project context and quality bar"
    ],
    "procedure": [
      "Inspect the artifact systematically.",
      "Look for omissions, contradictions, weak assumptions, and vague language.",
      "Distinguish evidence-backed claims from inference.",
      "Record issues by severity.",
      "Recommend targeted fixes, not generic criticism.",
      "Re-state what would make the artifact review-ready."
    ],
    "outputs": [
      "assumptions register",
      "constraints register",
      "dependency notes",
      "watchlist items"
    ],
    "guardrails": [
      "Be concrete.",
      "Do not rewrite the whole artifact unless necessary.",
      "Focus on the highest-leverage defects first.",
      "Prefer explainable quality gates."
    ],
    "completion": [
      "key defects identified",
      "fixes proposed",
      "pass/fail or ready/not-ready decision given"
    ],
    "raw": "## Purpose\nExtract and normalise assumptions, constraints, and dependencies into one visible register.\n\n## Use when\n- project framing or requirements contain implicit assumptions\n- constraints are scattered across artifacts\n- reviewability and risk awareness matter\n\n## Inputs\n- artifact or analysis output under review\n- source material and assumptions\n- project context and quality bar\n\n## Procedure\n1. Inspect the artifact systematically.\n2. Look for omissions, contradictions, weak assumptions, and vague language.\n3. Distinguish evidence-backed claims from inference.\n4. Record issues by severity.\n5. Recommend targeted fixes, not generic criticism.\n6. Re-state what would make the artifact review-ready.\n\n## Outputs\n- assumptions register\n- constraints register\n- dependency notes\n- watchlist items\n\n## Guardrails\n- Be concrete.\n- Do not rewrite the whole artifact unless necessary.\n- Focus on the highest-leverage defects first.\n- Prefer explainable quality gates.\n\n## Completion criteria\n- key defects identified\n- fixes proposed\n- pass/fail or ready/not-ready decision given\n"
  },
  {
    "slug": "critical-thinking-bias-check",
    "name": "Critical Thinking Bias Check",
    "category": "quality",
    "categoryLabel": "Quality Checks",
    "blurb": "Check analysis for cognitive biases and weak reasoning.",
    "purpose": "Detect biased reasoning, oversimplification, hidden assumptions, and weak logic.",
    "useWhen": [
      "the analysis feels too neat",
      "a preferred solution may be biasing the work",
      "critical review is required before decisions"
    ],
    "inputs": [
      "artifact or analysis output under review",
      "source material and assumptions",
      "project context and quality bar"
    ],
    "procedure": [
      "Inspect the artifact systematically.",
      "Look for omissions, contradictions, weak assumptions, and vague language.",
      "Distinguish evidence-backed claims from inference.",
      "Record issues by severity.",
      "Recommend targeted fixes, not generic criticism.",
      "Re-state what would make the artifact review-ready."
    ],
    "outputs": [
      "bias and assumption log",
      "rival interpretations",
      "logic weaknesses",
      "revised decision notes"
    ],
    "guardrails": [
      "Be concrete.",
      "Do not rewrite the whole artifact unless necessary.",
      "Focus on the highest-leverage defects first.",
      "Prefer explainable quality gates."
    ],
    "completion": [
      "key defects identified",
      "fixes proposed",
      "pass/fail or ready/not-ready decision given"
    ],
    "raw": "## Purpose\nDetect biased reasoning, oversimplification, hidden assumptions, and weak logic.\n\n## Use when\n- the analysis feels too neat\n- a preferred solution may be biasing the work\n- critical review is required before decisions\n\n## Inputs\n- artifact or analysis output under review\n- source material and assumptions\n- project context and quality bar\n\n## Procedure\n1. Inspect the artifact systematically.\n2. Look for omissions, contradictions, weak assumptions, and vague language.\n3. Distinguish evidence-backed claims from inference.\n4. Record issues by severity.\n5. Recommend targeted fixes, not generic criticism.\n6. Re-state what would make the artifact review-ready.\n\n## Outputs\n- bias and assumption log\n- rival interpretations\n- logic weaknesses\n- revised decision notes\n\n## Guardrails\n- Be concrete.\n- Do not rewrite the whole artifact unless necessary.\n- Focus on the highest-leverage defects first.\n- Prefer explainable quality gates.\n\n## Completion criteria\n- key defects identified\n- fixes proposed\n- pass/fail or ready/not-ready decision given\n"
  },
  {
    "slug": "deliverable-consistency-check",
    "name": "Deliverable Consistency Check",
    "category": "quality",
    "categoryLabel": "Quality Checks",
    "blurb": "Check a BA artifact pack for internal consistency before handoff.",
    "purpose": "Check consistency across terminology, scope, roles, models, and requirements.",
    "useWhen": [
      "multiple BA artifacts must agree",
      "diagrams and text may have drifted",
      "a pack is about to go to review"
    ],
    "inputs": [
      "artifact or analysis output under review",
      "source material and assumptions",
      "project context and quality bar"
    ],
    "procedure": [
      "Inspect the artifact systematically.",
      "Look for omissions, contradictions, weak assumptions, and vague language.",
      "Distinguish evidence-backed claims from inference.",
      "Record issues by severity.",
      "Recommend targeted fixes, not generic criticism.",
      "Re-state what would make the artifact review-ready."
    ],
    "outputs": [
      "inconsistency report",
      "terminology fixes",
      "traceability mismatches",
      "correction checklist"
    ],
    "guardrails": [
      "Be concrete.",
      "Do not rewrite the whole artifact unless necessary.",
      "Focus on the highest-leverage defects first.",
      "Prefer explainable quality gates."
    ],
    "completion": [
      "key defects identified",
      "fixes proposed",
      "pass/fail or ready/not-ready decision given"
    ],
    "raw": "## Purpose\nCheck consistency across terminology, scope, roles, models, and requirements.\n\n## Use when\n- multiple BA artifacts must agree\n- diagrams and text may have drifted\n- a pack is about to go to review\n\n## Inputs\n- artifact or analysis output under review\n- source material and assumptions\n- project context and quality bar\n\n## Procedure\n1. Inspect the artifact systematically.\n2. Look for omissions, contradictions, weak assumptions, and vague language.\n3. Distinguish evidence-backed claims from inference.\n4. Record issues by severity.\n5. Recommend targeted fixes, not generic criticism.\n6. Re-state what would make the artifact review-ready.\n\n## Outputs\n- inconsistency report\n- terminology fixes\n- traceability mismatches\n- correction checklist\n\n## Guardrails\n- Be concrete.\n- Do not rewrite the whole artifact unless necessary.\n- Focus on the highest-leverage defects first.\n- Prefer explainable quality gates.\n\n## Completion criteria\n- key defects identified\n- fixes proposed\n- pass/fail or ready/not-ready decision given\n"
  },
  {
    "slug": "evidence-gap-review",
    "name": "Evidence Gap Review",
    "category": "quality",
    "categoryLabel": "Quality Checks",
    "blurb": "Review the evidence base behind a decision and expose gaps.",
    "purpose": "Find where conclusions outrun evidence and identify what still needs to be learned.",
    "useWhen": [
      "requirements or strategy work is being finalised",
      "stakeholder claims conflict",
      "the team needs a targeted follow-up plan"
    ],
    "inputs": [
      "artifact or analysis output under review",
      "source material and assumptions",
      "project context and quality bar"
    ],
    "procedure": [
      "Inspect the artifact systematically.",
      "Look for omissions, contradictions, weak assumptions, and vague language.",
      "Distinguish evidence-backed claims from inference.",
      "Record issues by severity.",
      "Recommend targeted fixes, not generic criticism.",
      "Re-state what would make the artifact review-ready."
    ],
    "outputs": [
      "evidence gap table",
      "unsupported claims list",
      "follow-up questions",
      "recommended next evidence sources"
    ],
    "guardrails": [
      "Be concrete.",
      "Do not rewrite the whole artifact unless necessary.",
      "Focus on the highest-leverage defects first.",
      "Prefer explainable quality gates."
    ],
    "completion": [
      "key defects identified",
      "fixes proposed",
      "pass/fail or ready/not-ready decision given"
    ],
    "raw": "## Purpose\nFind where conclusions outrun evidence and identify what still needs to be learned.\n\n## Use when\n- requirements or strategy work is being finalised\n- stakeholder claims conflict\n- the team needs a targeted follow-up plan\n\n## Inputs\n- artifact or analysis output under review\n- source material and assumptions\n- project context and quality bar\n\n## Procedure\n1. Inspect the artifact systematically.\n2. Look for omissions, contradictions, weak assumptions, and vague language.\n3. Distinguish evidence-backed claims from inference.\n4. Record issues by severity.\n5. Recommend targeted fixes, not generic criticism.\n6. Re-state what would make the artifact review-ready.\n\n## Outputs\n- evidence gap table\n- unsupported claims list\n- follow-up questions\n- recommended next evidence sources\n\n## Guardrails\n- Be concrete.\n- Do not rewrite the whole artifact unless necessary.\n- Focus on the highest-leverage defects first.\n- Prefer explainable quality gates.\n\n## Completion criteria\n- key defects identified\n- fixes proposed\n- pass/fail or ready/not-ready decision given\n"
  },
  {
    "slug": "requirements-quality-check",
    "name": "Requirements Quality Check",
    "category": "quality",
    "categoryLabel": "Quality Checks",
    "blurb": "Check requirements against quality criteria: clear, testable, feasible, traceable.",
    "purpose": "Evaluate whether requirements are clear, feasible, testable, prioritised, and traceable.",
    "useWhen": [
      "a requirements set is nearing signoff",
      "acceptance or implementation work depends on requirement quality",
      "the team wants objective gates"
    ],
    "inputs": [
      "artifact or analysis output under review",
      "source material and assumptions",
      "project context and quality bar"
    ],
    "procedure": [
      "Inspect the artifact systematically.",
      "Look for omissions, contradictions, weak assumptions, and vague language.",
      "Distinguish evidence-backed claims from inference.",
      "Record issues by severity.",
      "Recommend targeted fixes, not generic criticism.",
      "Re-state what would make the artifact review-ready."
    ],
    "outputs": [
      "requirement quality assessment",
      "ambiguous/non-testable items",
      "prioritisation issues",
      "traceability gaps",
      "release readiness judgement"
    ],
    "guardrails": [
      "Be concrete.",
      "Do not rewrite the whole artifact unless necessary.",
      "Focus on the highest-leverage defects first.",
      "Prefer explainable quality gates."
    ],
    "completion": [
      "key defects identified",
      "fixes proposed",
      "pass/fail or ready/not-ready decision given"
    ],
    "raw": "## Purpose\nEvaluate whether requirements are clear, feasible, testable, prioritised, and traceable.\n\n## Use when\n- a requirements set is nearing signoff\n- acceptance or implementation work depends on requirement quality\n- the team wants objective gates\n\n## Inputs\n- artifact or analysis output under review\n- source material and assumptions\n- project context and quality bar\n\n## Procedure\n1. Inspect the artifact systematically.\n2. Look for omissions, contradictions, weak assumptions, and vague language.\n3. Distinguish evidence-backed claims from inference.\n4. Record issues by severity.\n5. Recommend targeted fixes, not generic criticism.\n6. Re-state what would make the artifact review-ready.\n\n## Outputs\n- requirement quality assessment\n- ambiguous/non-testable items\n- prioritisation issues\n- traceability gaps\n- release readiness judgement\n\n## Guardrails\n- Be concrete.\n- Do not rewrite the whole artifact unless necessary.\n- Focus on the highest-leverage defects first.\n- Prefer explainable quality gates.\n\n## Completion criteria\n- key defects identified\n- fixes proposed\n- pass/fail or ready/not-ready decision given\n"
  }
];

export interface BATemplate { slug: string; name: string; content: string; }
export const BA_TEMPLATES: BATemplate[] = [
  {
    "slug": "definition-of-done-template",
    "name": "Definition Of Done Template",
    "content": "# Definition of Done Template\n\n## Universal gates\n- Requirement or story linked to source and owner\n- Acceptance criteria defined and reviewed\n- Validation / error handling considered\n- Tests or test evidence identified\n- Docs / notes updated where relevant\n- Security / privacy / permissions checked where relevant\n- Deployment and rollback impact reviewed where relevant\n\n## Feature-specific gates\n- \n- \n\n## Evidence\n- Requirement IDs:\n- Acceptance criteria IDs:\n- Test evidence:\n- Review evidence:\n"
  },
  {
    "slug": "questionnaire-template",
    "name": "Questionnaire Template",
    "content": "# Questionnaire Template\n\n## Objective\n## Audience\n## Distribution method\n## Questions\n1.\n2.\n3.\n\n## Analysis notes\n"
  },
  {
    "slug": "problem-statement-template",
    "name": "Problem Statement Template",
    "content": "# Problem Statement Template\n\n## Problem\n[Actor] needs to [goal], but is blocked by [obstacle/problem], causing [impact].\n\n## Context\n- Business / operational context:\n- Current workflow:\n- Triggering event / pain point:\n\n## In scope\n- \n- \n\n## Out of scope\n- \n- \n\n## Stakeholders\n- Primary:\n- Secondary:\n\n## Constraints\n- \n- \n\n## Assumptions\n- \n- \n\n## Success criteria\n- \n- \n\n## Open questions\n- \n- \n"
  },
  {
    "slug": "acceptance-criteria-template",
    "name": "Acceptance Criteria Template",
    "content": "# Acceptance Criteria Template\n\n## Feature / Requirement ID\n[ID]\n\n## Acceptance Criteria\n1. Given [context], when [action], then [observable result].\n2. Given [context], when [invalid or edge action], then [observable result].\n3. Given [permission/state condition], when [action], then [observable result].\n\n## Negative / Exception Cases\n- \n- \n\n## Notes / Dependencies\n- \n"
  },
  {
    "slug": "business-rules-template",
    "name": "Business Rules Template",
    "content": "# Business Rules Register\n\n| Rule ID | Rule Statement | Source | Confidence | Applies To | Exceptions | Notes |\n|---|---|---|---|---|---|---|\n| BR-001 |  |  |  |  |  |  |\n"
  },
  {
    "slug": "requirements-register-template",
    "name": "Requirements Register Template",
    "content": "# Requirements Register\n\n| ID | Type | Statement | Source | Priority | Status | Notes |\n|---|---|---|---|---|---|---|\n| FR-001 | Functional |  |  |  | Draft |  |\n| NFR-001 | Non-functional |  |  |  | Draft |  |\n| BR-001 | Business rule |  |  |  | Draft |  |\n| CON-001 | Constraint |  |  |  | Draft |  |\n"
  },
  {
    "slug": "process-analysis-template",
    "name": "Process Analysis Template",
    "content": "# Process Analysis\n\n## As-is summary\n## Actors\n## Trigger\n## Main flow\n## Exception flow\n## Handoffs\n## Pain points\n## Rules and constraints\n## To-be opportunities\n"
  },
  {
    "slug": "benefit-hypothesis-template",
    "name": "Benefit Hypothesis Template",
    "content": "# Benefit Hypotheses\n\n| Hypothesis ID | Proposed Change | Baseline Problem | Expected Outcome | Measure | Assumptions | Evidence Gaps |\n|---|---|---|---|---|---|---|\n| BH-001 |  |  |  |  |  |  |\n"
  },
  {
    "slug": "assumptions-and-constraints-template",
    "name": "Assumptions And Constraints Template",
    "content": "# Assumptions and Constraints Register\n\n## Assumptions\n| ID | Assumption | Impact if false | Likelihood wrong | Validation approach | Owner |\n|---|---|---|---|---|---|\n| ASM-001 |  |  |  |  |  |\n\n## Constraints\n| ID | Constraint | Type | Hard/Soft | Source | Design impact |\n|---|---|---|---|---|---|\n| CON-001 |  |  |  |  |  |\n"
  }
];

export const SKILL_COUNT = 53;

export function getSkill(slug: string): BASkill | undefined {
  return BA_SKILLS.find(s => s.slug === slug);
}

export function skillsByCategory(cat: string): BASkill[] {
  return BA_SKILLS.filter(s => s.category === cat);
}

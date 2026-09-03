/**
 * Extracts all BA skills + templates from the cloned repo into typed TS data modules.
 */
import fs from 'fs';
import path from 'path';

const REPO = '/home/z/my-project/repo-content';
const OUT = '/home/z/my-project/src/data';

const CATEGORY_MAP: Record<string, { category: string; blurb: string }> = {
  // Atomic techniques (17)
  'pestle-analysis': { category: 'atomic', blurb: 'Scan Political, Economic, Social, Technological, Legal and Environmental factors around a problem.' },
  'swot-prioritisation': { category: 'atomic', blurb: 'Analyse strengths, weaknesses, opportunities and threats, then prioritise what to act on.' },
  'porters-five-forces': { category: 'atomic', blurb: 'Assess competitive forces: rivals, entrants, substitutes, supplier and buyer power.' },
  'value-proposition-analysis': { category: 'atomic', blurb: 'Map customer jobs, pains and gains against products and services.' },
  'stakeholder-register': { category: 'atomic', blurb: 'Identify stakeholders, their interests, influence and likely impact.' },
  'power-interest-grid': { category: 'atomic', blurb: 'Position stakeholders by power and interest to plan engagement.' },
  'raci-matrix': { category: 'atomic', blurb: 'Clarify who is Responsible, Accountable, Consulted and Informed.' },
  'interview-design': { category: 'atomic', blurb: 'Plan structured stakeholder interviews with clear goals and question flows.' },
  'questionnaire-design': { category: 'atomic', blurb: 'Design surveys that collect unbiased, analysable evidence at scale.' },
  'workshop-design': { category: 'atomic', blurb: 'Facilitation-ready agendas, activities and outputs for BA workshops.' },
  'observation-study-plan': { category: 'atomic', blurb: 'Plan structured observation of real work to expose hidden process steps.' },
  'prototype-elicitation': { category: 'atomic', blurb: 'Use prototypes and mock-ups to draw out requirements stakeholders cannot articulate.' },
  'use-case-specification': { category: 'atomic', blurb: 'Specify actors, flows, preconditions and outcomes for system interactions.' },
  'process-model-spec': { category: 'atomic', blurb: 'Define process models with lanes, steps, decisions, inputs and outputs.' },
  'moscow-prioritisation': { category: 'atomic', blurb: 'Split requirements into Must, Should, Could and Won\'t have.' },
  'see-i-clarifier': { category: 'atomic', blurb: 'Clarify vague concepts using State, Events, Examples and Illustrations.' },
  'catwoe-root-definition': { category: 'atomic', blurb: 'Define a system root view via Customers, Actors, Transformation, Weltanschauung, Owner, Environment.' },
  // Requirements and specification (14)
  'acceptance-criteria-writer': { category: 'requirements', blurb: 'Write testable, unambiguous acceptance criteria for requirements and stories.' },
  'ambiguity-hunter': { category: 'requirements', blurb: 'Hunt down vague, ambiguous language in documents and requirements.' },
  'assumption-extractor': { category: 'requirements', blurb: 'Surface hidden assumptions hiding inside notes, docs and requests.' },
  'constraint-detector': { category: 'requirements', blurb: 'Detect real constraints vs preferences in problem statements.' },
  'definition-of-done-drafter': { category: 'requirements', blurb: 'Draft an explicit, agreed definition of done for deliverables.' },
  'edge-case-elicitor': { category: 'requirements', blurb: 'Systematically elicit edge cases, exceptions and failure modes.' },
  'functional-vs-nonfunctional-splitter': { category: 'requirements', blurb: 'Split mixed statements into functional vs non-functional requirements.' },
  'problem-statement-refiner': { category: 'requirements', blurb: 'Refine fuzzy problem statements into clear, scoped, evidence-backed statements.' },
  'proto-requirements-normalizer': { category: 'requirements', blurb: 'Normalise raw stakeholder statements into consistent requirement format.' },
  'requirements-conflict-checker': { category: 'requirements', blurb: 'Find conflicts, contradictions and tensions between requirements.' },
  'requirements-gap-auditor': { category: 'requirements', blurb: 'Audit a requirement set for missing coverage and gaps.' },
  'requirements-interrogator': { category: 'requirements', blurb: 'Interrogate raw notes to extract, question and sharpen requirements.' },
  'requirements-prioritizer': { category: 'requirements', blurb: 'Prioritise requirements using value, risk, effort and dependency logic.' },
  'requirements-traceability-starter': { category: 'requirements', blurb: 'Start a traceability matrix linking goals to requirements to tests.' },
  // Elicitation and process extensions (10)
  'raci-rasci-builder': { category: 'elicitation', blurb: 'Build RASCI charts separating responsible, accountable, supportive, consulted, informed.' },
  'stakeholder-communication-planner': { category: 'elicitation', blurb: 'Plan who needs what message, on which channel, how often.' },
  'probe-question-generator': { category: 'elicitation', blurb: 'Generate probing questions that dig beneath stated wants.' },
  'pyramid-funnel-diamond-interviewer': { category: 'elicitation', blurb: 'Apply pyramid, funnel and diamond questioning structures to interviews.' },
  'questionnaire-pilot-checker': { category: 'elicitation', blurb: 'Pilot and stress-test questionnaires before full rollout.' },
  'breakout-structure-designer': { category: 'elicitation', blurb: 'Design breakout group structures for large workshops.' },
  'as-is-process-investigator': { category: 'elicitation', blurb: 'Investigate and document the current state process with evidence.' },
  'to-be-process-designer': { category: 'elicitation', blurb: 'Design the improved future state process with measurable gains.' },
  'business-rule-extractor': { category: 'elicitation', blurb: 'Extract formal business rules from policies, docs and interviews.' },
  'benefit-hypothesis-writer': { category: 'elicitation', blurb: 'Write measurable benefit hypotheses linking change to outcomes.' },
  // Workflows (7)
  'business-problem-framing': { category: 'workflow', blurb: 'End-to-end framing of a business problem before solutioning.' },
  'strategy-analysis': { category: 'workflow', blurb: 'End-to-end strategy analysis combining multiple strategic lenses.' },
  'stakeholder-analysis': { category: 'workflow', blurb: 'Full stakeholder analysis workflow from identification to engagement plan.' },
  'requirements-elicitation': { category: 'workflow', blurb: 'Full elicitation workflow from discovery through validated requirements.' },
  'process-modelling-and-improvement': { category: 'workflow', blurb: 'Model current state, find waste, design and validate improvements.' },
  'ssm-analysis': { category: 'workflow', blurb: 'Soft Systems Methodology: rich pictures, root definitions, CATWOE, conceptual models.' },
  'requirements-packager': { category: 'workflow', blurb: 'Package discovery notes into a delivery-ready requirements pack.' },
  // Quality checks (5)
  'critical-thinking-bias-check': { category: 'quality', blurb: 'Check analysis for cognitive biases and weak reasoning.' },
  'assumptions-constraints-log': { category: 'quality', blurb: 'Build a living log of assumptions and constraints with owners and review dates.' },
  'evidence-gap-review': { category: 'quality', blurb: 'Review the evidence base behind a decision and expose gaps.' },
  'deliverable-consistency-check': { category: 'quality', blurb: 'Check a BA artifact pack for internal consistency before handoff.' },
  'requirements-quality-check': { category: 'quality', blurb: 'Check requirements against quality criteria: clear, testable, feasible, traceable.' },
};

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  atomic: { label: 'Atomic Techniques', description: 'Core BA techniques you apply directly to a problem — strategy lenses, stakeholder tools, elicitation methods and specification patterns.' },
  requirements: { label: 'Requirements & Specification', description: 'Sharpen, split, normalise, audit and prioritise requirements until they are delivery-ready.' },
  elicitation: { label: 'Elicitation & Process', description: 'Extended elicitation and process tools: questioning structures, communication planning, as-is / to-be process work.' },
  workflow: { label: 'End-to-End Workflows', description: 'Multi-phase guided workflows that combine several techniques to take a problem from fuzzy to structured.' },
  quality: { label: 'Quality Checks', description: 'Review passes to run before sign-off: bias checks, evidence gaps, consistency and requirements quality.' },
};

interface ParsedSkill {
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

function parseList(body: string): string[] {
  return body.split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('-') || /^\d+\./.test(l))
    .map(l => l.replace(/^-\s*/, '').replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

function parseSkill(slug: string, md: string): ParsedSkill {
  const sections: Record<string, string> = {};
  const regex = /^##\s+(.+)$/gm;
  const matches: { title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(md)) !== null) {
    matches.push({ title: m[1].trim().toLowerCase(), index: m.index });
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].title.length + 3;
    const end = i + 1 < matches.length ? matches[i + 1].index : md.length;
    sections[matches[i].title] = md.slice(start, end).trim();
  }
  const meta = CATEGORY_MAP[slug];
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    slug,
    name,
    category: meta.category,
    categoryLabel: CATEGORY_META[meta.category].label,
    blurb: meta.blurb,
    purpose: sections['purpose'] || '',
    useWhen: parseList(sections['use when'] || ''),
    inputs: parseList(sections['inputs'] || ''),
    procedure: parseList(sections['procedure'] || ''),
    outputs: parseList(sections['outputs'] || ''),
    guardrails: parseList(sections['guardrails'] || ''),
    completion: parseList(sections['completion criteria'] || ''),
    raw: md,
  };
}

function extract() {
  // ---- Skills ----
  const skillsDir = path.join(REPO, '.agents', 'skills');
  const slugs = fs.readdirSync(skillsDir).filter(d => fs.existsSync(path.join(skillsDir, d, 'SKILL.md')));
  const skills: ParsedSkill[] = [];
  for (const slug of slugs) {
    const md = fs.readFileSync(path.join(skillsDir, slug, 'SKILL.md'), 'utf-8');
    try {
      skills.push(parseSkill(slug, md));
    } catch (e) {
      console.error('Failed parsing', slug, e);
    }
  }
  // sort by category then name
  const catOrder = ['workflow', 'atomic', 'requirements', 'elicitation', 'quality'];
  skills.sort((a, b) => catOrder.indexOf(a.category) - catOrder.indexOf(b.category) || a.name.localeCompare(b.name));

  // ---- Templates ----
  const tplDir = path.join(REPO, 'docs', 'ba', 'templates');
  const templates = fs.readdirSync(tplDir).filter(f => f.endsWith('.md')).map(f => {
    const content = fs.readFileSync(path.join(tplDir, f), 'utf-8');
    const name = f.replace('-template.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { slug: f.replace('.md', ''), name: name + ' Template', content };
  });

  fs.mkdirSync(OUT, { recursive: true });
  const ts = `// AUTO-GENERATED from 45ck/business-analysis-skills (MIT). Do not edit by hand.
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

export const CATEGORY_META: Record<string, { label: string; description: string }> = ${JSON.stringify(CATEGORY_META, null, 2)};

export const BA_SKILLS: BASkill[] = ${JSON.stringify(skills, null, 2)};

export interface BATemplate { slug: string; name: string; content: string; }
export const BA_TEMPLATES: BATemplate[] = ${JSON.stringify(templates, null, 2)};

export const SKILL_COUNT = ${skills.length};

export function getSkill(slug: string): BASkill | undefined {
  return BA_SKILLS.find(s => s.slug === slug);
}

export function skillsByCategory(cat: string): BASkill[] {
  return BA_SKILLS.filter(s => s.category === cat);
}
`;
  fs.writeFileSync(path.join(OUT, 'skills-data.ts'), ts);
  console.log(`Extracted ${skills.length} skills and ${templates.length} templates`);
  const counts: Record<string, number> = {};
  skills.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
  console.log('By category:', counts);
}

extract();

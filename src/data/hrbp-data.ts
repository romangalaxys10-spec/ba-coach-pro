/**
 * HRBP / L&D curriculum — HR Business Partnering + Learning & Development.
 * Syllabus spine (SHRM/CIPD-influenced): Foundations → Practitioner → Strategic.
 * Lessons are delivered live by the AI coach (program persona) — the static data
 * provides outcomes, focus areas, key concepts and a practice task per lesson.
 */

export interface HrbpLesson {
  id: string; // hrbp:f:u1:l1 — namespaced for shared student progress
  title: string;
  focus: string;
  canDo: string;
  concepts: string[];
  task: string;
}

export interface HrbpUnit {
  id: string;
  title: string;
  theme: string;
  lessons: HrbpLesson[];
}

export interface HrbpLevel {
  id: string; // FOUNDATIONS | PRACTITIONER | STRATEGIC
  name: string;
  descriptor: string;
  units: HrbpUnit[];
}

const L = (
  id: string, title: string, focus: string, canDo: string,
  concepts: string[], task: string
): HrbpLesson => ({ id, title, focus, canDo, concepts, task });

export const HRBP_CURRICULUM: HrbpLevel[] = [
  /* ---------------------------------------------- FOUNDATIONS --------------------------------------------- */
  {
    id: 'FOUNDATIONS', name: 'HRBP Foundations', descriptor: 'Core people-practice building blocks: the HRBP role, employment basics, hiring and onboarding.',
    units: [
      {
        id: 'hrbp:f:u1', title: 'The HRBP Role', theme: 'What an HR Business Partner actually does',
        lessons: [
          L('hrbp:f:u1:l1', 'From Personnel to Strategic Partner', 'hr-strategy', 'I can explain the HRBP operating model and how it differs from classic HR admin.', ['Ulrich model', 'strategic partner', 'shared services', 'Centres of Excellence', 'stakeholder', 'value chain'], 'Explain to a mock COO what an HRBP does and how you would split your week across business partnering, projects and operations.'),
          L('hrbp:f:u1:l2', 'The Business Context', 'business-acumen', 'I can read a business model and describe its people implications.', ['business model', 'revenue drivers', 'cost base', 'headcount plan', 'org chart', 'P&L basics'], 'Take a company scenario, map how it makes money, and list the top 5 people risks and opportunities.'),
          L('hrbp:f:u1:l3', 'Employment Fundamentals', 'compliance', 'I can outline the core legal pillars every conversation sits on.', ['employment contract', 'working time', 'minimum wage', 'anti-discrimination', 'GDPR / data privacy', 'probation'], 'Answer 5 compliance spot-checks: spot the legal risk in each mini-scenario your coach poses.'),
          L('hrbp:f:u1:l4', 'The HRBP Toolkit', 'hr-operations', 'I can name the core artefacts and systems an HRBP runs day to day.', ['HRIS', 'employee lifecycle', 'policy suite', 'onboarding checklist', 'exit process', 'audit trail'], 'Design a one-page HRBP starter kit: the 10 artefacts you would build in your first 30 days.'),
        ],
      },
      {
        id: 'hrbp:f:u2', title: 'Talent Acquisition & Onboarding', theme: 'Hiring right and landing well',
        lessons: [
          L('hrbp:f:u2:l1', 'Workforce Needs & Intake', 'workforce-planning', 'I can turn a vague "we need people" into a structured hiring brief.', ['role scope', 'success profile', 'must-have vs nice-to-have', 'levelling', 'budget sign-off', 'hiring SLA'], 'Run an intake meeting roleplay with a hiring manager and produce a success profile for the role.'),
          L('hrbp:f:u2:l2', 'Structured Interviewing', 'talent-acquisition', 'I can design and run fair, predictive interviews.', ['competency-based', 'STAR method', 'structured scoring', 'interview bias', 'panel design', 'candidate experience'], 'Build a structured interview kit (questions + scorecard) for a given role and practise one interview live.'),
          L('hrbp:f:u2:l3', 'Assessment & Decision', 'assessment', 'I can weigh evidence and de-risk hiring decisions.', ['work samples', 'cognitive vs behavioural', 'reference checks', 'false positives', 'culture add', 'calibration'], 'Calibrate three candidate profiles with your coach and justify a final call against the scorecard.'),
          L('hrbp:f:u2:l4', 'Onboarding That Sticks', 'onboarding', 'I can design a 90-day journey that protects early retention.', ['pre-boarding', 'buddy system', '30/60/90 plan', 'early wins', 'probation review', 'time-to-productivity'], 'Draft a 30/60/90 onboarding plan for a new analyst and rehearse the day-1 welcome conversation.'),
        ],
      },
      {
        id: 'hrbp:f:u3', title: 'Performance & Feedback', theme: 'Goals, reviews and everyday feedback',
        lessons: [
          L('hrbp:f:u3:l1', 'Goal Setting Frameworks', 'performance', 'I can coach managers to write goals that actually drive behaviour.', ['SMART', 'OKRs', 'KPIs vs goals', 'cascading', 'stretch goals', 'goal drift'], 'Rewrite 3 weak goals into sharp ones and stress-test them with your coach.'),
          L('hrbp:f:u3:l2', 'The Performance Review Cycle', 'performance', 'I can run a review cycle end to end without drama.', ['calibration', 'self-review', 'rating scales', 'recency bias', 'review hygiene', 'appeals'], 'Plan a mini review cycle: timeline, comms, calibration rules — then defend the design choices.'),
          L('hrbp:f:u3:l3', 'Difficult Feedback Conversations', 'feedback', 'I can deliver hard messages that preserve dignity and drive change.', ['SBI model', 'radical candour', 'psychological safety', 'listening', 'action agreement', 'follow-up'], 'Roleplay a difficult feedback conversation: underperformer, defensive manager, and one heated case.'),
          L('hrbp:f:u3:l4', 'Managing Underperformance', 'performance', 'I can run a fair, documented improvement process.', ['PIP design', 'documentation', 'support plan', 'milestones', 'fair process', 'exit criteria'], 'Draft a 6-week performance improvement plan for a scenario employee and rehearse the kick-off talk.'),
        ],
      },
    ],
  },

  /* ---------------------------------------------- PRACTITIONER -------------------------------------------- */
  {
    id: 'PRACTITIONER', name: 'HRBP Practitioner', descriptor: 'The craft of partnering: org design, employee relations, wellbeing and the L&D core.',
    units: [
      {
        id: 'hrbp:p:u1', title: 'Org Design & Workforce Planning', theme: 'Shaping how work gets done',
        lessons: [
          L('hrbp:p:u1:l1', 'Operating Model & Structures', 'org-design', 'I can compare structures and recommend one that fits the strategy.', ['functional', 'matrix', 'product-aligned', 'spans & layers', 'accountability', 'RACI'], 'Redesign a bloated middle layer: propose a target structure and rehearse the leadership pitch.'),
          L('hrbp:p:u1:l2', 'Strategic Workforce Planning', 'workforce-planning', 'I can build a demand/supply view and a gap-closure plan.', ['demand forecast', 'supply analysis', 'skills gap', 'build vs buy vs borrow', 'scenario planning', 'succession'], 'Create a 3-scenario workforce plan for a scaling team and present the trade-offs.'),
          L('hrbp:p:u1:l3', 'Succession & Talent Reviews', 'talent', 'I can run a talent review that separates potential from performance.', ['9-box grid', 'high-potential', 'flight risk', 'bench strength', 'succession slate', 'development moves'], 'Facilitate a mock talent review: place 6 employees on the 9-box and defend each placement.'),
          L('hrbp:p:u1:l4', 'Reward Fundamentals', 'reward', 'I can explain pay architecture and spot equity issues.', ['job architecture', 'salary bands', 'market benchmarking', 'pay equity', 'bonus design', 'total rewards'], 'Diagnose a pay-equity red flag in sample data and script the conversation with the CFO.'),
        ],
      },
      {
        id: 'hrbp:p:u2', title: 'Employee Relations & Wellbeing', theme: 'Trust, conflict and healthy work',
        lessons: [
          L('hrbp:p:u2:l1', 'Investigations & Grievances', 'employee-relations', 'I can run a fair, unbiased investigation process.', ['grievance vs complaint', 'terms of reference', 'evidence', 'witness interviews', 'outcome letter', 'appeal rights'], 'Plan an investigation for a harassment allegation: scope, interviews, timeline and comms.'),
          L('hrbp:p:u2:l2', 'Conflict Mediation', 'conflict', 'I can mediate between colleagues without taking sides.', ['interests vs positions', 'mediation stages', 'ground rules', 'reframing', 'working agreement', 'escalation'], 'Mediate a two-party conflict roleplay and land a written working agreement.'),
          L('hrbp:p:u2:l3', 'Engagement & Listening', 'engagement', 'I can turn survey data into visible action.', ['engagement drivers', 'eNPS', 'pulse surveys', 'focus groups', 'action planning', 'feedback loop'], 'Interpret an engagement survey excerpt and design a 90-day action plan with your coach.'),
          L('hrbp:p:u2:l4', 'Wellbeing & Burnout Prevention', 'wellbeing', 'I can spot systemic burnout risk and design preventative support.', ['burnout signals', 'workload design', 'psychological safety', 'absence management', 'reasonable adjustments', 'return-to-work'], 'Audit a team scenario for burnout risk and pitch three systemic fixes to the manager.'),
        ],
      },
      {
        id: 'hrbp:p:u3', title: 'Learning & Development Core', theme: 'How people actually grow',
        lessons: [
          L('hrbp:p:u3:l1', 'Learning Needs Analysis', 'lnd', 'I can derive learning needs from business goals, not wish lists.', ['TNA', 'capability framework', 'skills matrix', 'priority matrix', 'stakeholder input', 'evidence'], 'Run a needs analysis for a struggling department and shortlist the top 3 capability gaps.'),
          L('hrbp:p:u3:l2', 'Learning Design That Works', 'lnd', 'I can apply evidence-based learning design to any topic.', ['70-20-10', 'spaced practice', 'retrieval practice', 'blended design', 'transfer to job', 'behaviour change'], 'Design a 4-week blended learning journey for one capability gap, including the transfer plan.'),
          L('hrbp:p:u3:l3', 'Coaching & Mentoring', 'coaching', 'I can coach with a structured model and set up mentoring that lasts.', ['GROW model', 'powerful questions', 'mentoring vs coaching', 'contracting', 'chemistry check', 'supervision'], 'Coach your AI "coachee" through a real career dilemma using GROW — then debrief the session.'),
          L('hrbp:p:u3:l4', 'Measuring Learning Impact', 'lnd', 'I can evaluate learning beyond happy sheets.', ['Kirkpatrick 4 levels', 'behaviour change', 'business impact', 'leading vs lagging', 'control groups', 'ROI debate'], 'Build an impact map for a leadership programme: what you would measure at each Kirkpatrick level.'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ STRATEGIC ---------------------------------------------- */
  {
    id: 'STRATEGIC', name: 'Strategic HRBP & L&D Leadership', descriptor: 'Evidence, influence and transformation: people analytics, learning strategy and leading change.',
    units: [
      {
        id: 'hrbp:s:u1', title: 'People Analytics & Evidence', theme: 'Decisions backed by data',
        lessons: [
          L('hrbp:s:u1:l1', 'People Analytics Foundations', 'analytics', 'I can frame a people question as a measurable one.', ['metrics vs analytics', 'hypothesis trees', 'data quality', 'correlation vs causation', 'privacy & ethics', 'storytelling'], 'Turn 3 vague leadership worries into analytic questions with data sources and hypotheses.'),
          L('hrbp:s:u1:l2', 'Turnover & Retention Analytics', 'analytics', 'I can diagnose attrition drivers and build a retention case.', ['regretted attrition', 'survival curves', 'exit data', 'cost of vacancy', 'retention levers', 'cohort analysis'], 'Analyse a sample attrition dataset with your coach and present the top 3 drivers plus fixes.'),
          L('hrbp:s:u1:l3', 'The HRBP Business Case', 'influence', 'I can write a people business case that survives a finance review.', ['cost-benefit', 'ROI models', 'risk framing', 'options appraisal', 'assumptions', 'exec summary'], 'Draft a one-page business case for a people investment and defend it in a mock exec meeting.'),
          L('hrbp:s:u1:l4', 'Influencing Without Authority', 'influence', 'I can move senior stakeholders who do not report to me.', ['stakeholder mapping', 'power/interest', 'pre-wiring', 'framing', 'coalition', 'say-do trust'], 'Plan an influence campaign for a controversial policy change and rehearse the hardest meeting.'),
        ],
      },
      {
        id: 'hrbp:s:u2', title: 'Learning Strategy & Culture', theme: 'Building a learning organisation',
        lessons: [
          L('hrbp:s:u2:l1', 'From Courses to Capability Strategy', 'lnd-strategy', 'I can shift the conversation from training demand to capability supply.', ['capability academy', 'skills taxonomy', 'role mobility', 'internal marketplace', 'career pathways', 'skills-based org'], 'Draft a 12-month capability strategy skeleton for a function and pitch it to your coach-CEO.'),
          L('hrbp:s:u2:l2', 'Culture & Leadership Development', 'culture', 'I can design leadership development that changes behaviour, not slide decks.', ['leadership spine', 'action learning', '360 feedback', 'behavioural signals', 'role models', 'culture diagnostics'], 'Design a first-line-leader programme: spine, experiences, and the behaviour metric for each module.'),
          L('hrbp:s:u2:l3', 'Skills-Based Organisations', 'future-work', 'I can explain and start implementing skills-based talent practice.', ['skills graph', 'de-jobbing', 'gig-lite internal', 'AI & skills inference', 'hiring on skills', 'credentialing'], 'Map one job family into skills, then redesign a role and its hiring plan around those skills.'),
          L('hrbp:s:u2:l4', 'Measuring the Learning Function', 'lnd-strategy', 'I can run L&D like a product team with outcome metrics.', ['north-star metric', 'adoption vs impact', 'cost per capability', 'portfolio review', 'sunset decisions', 'reporting cadence'], 'Build an L&D scorecard (5 metrics max) and defend which programmes you would sunset.'),
        ],
      },
      {
        id: 'hrbp:s:u3', title: 'Change & Transformation', theme: 'Leading people through big shifts',
        lessons: [
          L('hrbp:s:u3:l1', 'Change Frameworks in Practice', 'change', 'I can pick and tailor a change approach to the change at hand.', ['Kotter 8 steps', 'ADKAR', 'change curve', 'readiness assessment', 'change champion networks', 'resistance'], 'Plan a change approach for a reorganisation using two frameworks and compare the trade-offs.'),
          L('hrbp:s:u3:l2', 'Redundancy & Restructuring with Dignity', 'change', 'I can lead painful processes lawfully and humanely.', ['selection criteria', 'consultation', 'alternative roles', 'outplacement', 'survivor syndrome', 'comms cadence'], 'Script the full comms and consultation sequence for a 10% restructuring scenario.'),
          L('hrbp:s:u3:l3', 'HR Technology & AI in People Work', 'hrtech', 'I can evaluate HR tech and use AI responsibly in people processes.', ['HRIS ecosystem', 'AI in hiring risk', 'bias audits', 'employee data ethics', 'automation wins', 'adoption'], 'Assess an AI hiring tool: benefits, bias risks, guardrails — and give a go/no-go recommendation.'),
          L('hrbp:s:u3:l4', 'The Strategic HRBP Capstone', 'capstone', 'I can integrate the whole toolkit into a credible 100-day plan.', ['diagnosis', 'quick wins', 'stakeholder plan', 'people agenda', 'operating rhythm', 'success measures'], 'Capstone: present a full 100-day HRBP plan for a fictional company to your coach-exec board.'),
        ],
      },
    ],
  },
];

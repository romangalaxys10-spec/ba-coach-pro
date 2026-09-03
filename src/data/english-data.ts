/**
 * English School curriculum — CEFR A1 → C2 + Business English + Exam Prep.
 * Concept research: open-english-vn, Cambridge English, EF, British Council structures.
 * Lessons are delivered live by the AI tutor (program persona) — the static data
 * provides the syllabus spine: can-do outcomes, target vocabulary and grammar,
 * and a production task per lesson.
 */

export type EnFocus = 'grammar' | 'vocabulary' | 'speaking' | 'listening' | 'reading' | 'writing';

export interface EnLesson {
  id: string; // en:a1:u1:l1 — namespaced for shared student progress
  title: string;
  focus: EnFocus;
  canDo: string;
  vocab: string[];
  grammar: string;
  task: string;
}

export interface EnUnit {
  id: string; // en:a1:u1
  title: string;
  theme: string;
  lessons: EnLesson[];
}

export interface EnLevel {
  id: string; // A1 | A2 | B1 | B2 | C1 | C2 | BUS | EXAM
  name: string;
  descriptor: string;
  units: EnUnit[];
}

const L = (
  id: string, title: string, focus: EnFocus, canDo: string,
  vocab: string[], grammar: string, task: string
): EnLesson => ({ id, title, focus, canDo, vocab, grammar, task });

export const ENGLISH_CURRICULUM: EnLevel[] = [
  /* ------------------------------------------------ A1 ------------------------------------------------ */
  {
    id: 'A1', name: 'Beginner', descriptor: 'Understand and use familiar everyday expressions; introduce yourself and others.',
    units: [
      {
        id: 'en:a1:u1', title: 'First Contact', theme: 'Greetings, identity, the world around you',
        lessons: [
          L('en:a1:u1:l1', 'Hello & Goodbye', 'speaking', 'I can greet people and say goodbye politely.', ['hello', 'good morning', 'good night', 'see you', 'nice to meet you', 'how are you'], 'to be — I am / you are', 'Record a voice intro: greet, name yourself, ask how someone is.'),
          L('en:a1:u1:l2', 'The Alphabet & Sounds', 'listening', 'I can spell my name and understand spelled words.', ['A–Z pairs', 'vowels', 'double letters', 'spell', 'capital letter', 'lowercase'], 'Pronunciation: alphabet sounds', 'Spell your full name and email aloud; transcribe a spoken spelling.'),
          L('en:a1:u1:l3', 'Numbers, Age & Contact Details', 'vocabulary', 'I can give my age, phone number and email.', ['zero–twenty', 'thirty, forty…', 'phone number', 'email address', '@', 'dot'], 'Questions with What / How old', 'Exchange contact details with your tutor in a roleplay.'),
          L('en:a1:u1:l4', 'Countries, Languages & Nationalities', 'vocabulary', 'I can say where I am from and what languages I speak.', ['country', 'nationality', 'language', 'from', 'speak', 'live in'], 'Prepositions: from / in', 'Write 3 sentences: your country, city and languages.'),
          L('en:a1:u1:l5', 'Introducing Yourself & Others', 'speaking', 'I can introduce myself and a friend.', ['this is', 'let me introduce', 'job', 'student', 'married / single', 'years old'], 'Possessive adjectives: my / your / his / her', 'Voice task: introduce yourself, then a family member or friend.'),
        ],
      },
      {
        id: 'en:a1:u2', title: 'Everyday Life', theme: 'Family, possessions, routines, time',
        lessons: [
          L('en:a1:u2:l1', 'My Family', 'vocabulary', 'I can describe my family tree.', ['mother, father', 'sister, brother', 'wife, husband', 'children', 'grandparents', 'family tree'], 'Possessive ’s — Anna’s brother', 'Draw your family tree in words: 5 sentences.'),
          L('en:a1:u2:l2', 'What Have You Got?', 'grammar', 'I can describe possessions and objects around me.', ['have got', 'has got', 'a bag', 'a laptop', 'keys', 'an umbrella'], 'have got / has got + a / an', 'List 6 things you have got; ask your tutor about 3 things.'),
          L('en:a1:u2:l3', 'Daily Routines', 'vocabulary', 'I can describe my day from morning to night.', ['wake up', 'get dressed', 'have breakfast', 'go to work', 'cook dinner', 'go to bed'], 'Present simple: I / you / we / they', 'Record your typical day in 6 sentences.'),
          L('en:a1:u2:l4', 'What Time Is It?', 'listening', 'I can tell the time and understand times in conversation.', ['o’clock', 'half past', 'quarter to', 'quarter past', 'am / pm', 'midnight'], 'Prepositions of time: at / on / in', 'Say 6 times aloud; arrange a meeting time with your tutor.'),
          L('en:a1:u2:l5', 'Places in Town', 'reading', 'I can find places and read simple signs in town.', ['bank', 'supermarket', 'hospital', 'school', 'train station', 'next to / opposite'], 'There is / There are', 'Write 4 sentences about places near your home.'),
        ],
      },
      {
        id: 'en:a1:u3', title: 'Food & Shopping', theme: 'Eating, buying, prices',
        lessons: [
          L('en:a1:u3:l1', 'Food & Drinks', 'vocabulary', 'I can name common foods and say what I like.', ['bread', 'cheese', 'chicken', 'rice', 'coffee', 'juice'], 'like / love / hate + noun', 'Say what you eat for breakfast, lunch and dinner.'),
          L('en:a1:u3:l2', 'At the Café — Ordering', 'speaking', 'I can order food and drinks and ask for the bill.', ['Can I have…', 'I’d like…', 'the bill, please', 'for here or to go', 'anything else', 'How much is it?'], 'Would like + noun', 'Voice roleplay: order a full meal at a café.'),
          L('en:a1:u3:l3', 'Countable & Uncountable', 'grammar', 'I can talk about quantities of food.', ['some', 'any', 'a lot of', 'much / many', 'a bottle of', 'a kilo of'], 'some / any + countable / uncountable', 'Write your shopping list: 6 items with quantity phrases.'),
          L('en:a1:u3:l4', 'Clothes & Prices', 'vocabulary', 'I can shop for clothes and understand prices.', ['shirt, jacket', 'shoes, jeans', 'size', 'try on', 'expensive / cheap', 'discount'], 'How much is / are…?', 'Roleplay: buy 3 items, ask sizes and prices, pay.'),
          L('en:a1:u3:l5', 'Numbers & Money Review', 'listening', 'I can understand prices, change and phone numbers.', ['fifteen / fifty', 'hundred', 'total', 'change', 'receipt', 'card or cash'], 'Numbers 20–1,000', 'Listening drill: write 8 spoken prices and phone numbers.'),
        ],
      },
      {
        id: 'en:a1:u4', title: 'Past & Plans', theme: 'Talking about yesterday and tomorrow',
        lessons: [
          L('en:a1:u4:l1', 'Where Were You?', 'grammar', 'I can say where I was yesterday.', ['was', 'were', 'at home', 'at work', 'on holiday', 'busy'], 'was / were', 'Say where you were at 4 moments yesterday.'),
          L('en:a1:u4:l2', 'Last Weekend', 'grammar', 'I can describe simple past actions.', ['visited', 'watched', 'played', 'cooked', 'walked', 'stayed'], 'Past simple: regular -ed', 'Voice task: narrate your last weekend in 6 sentences.'),
          L('en:a1:u4:l3', 'Weekend Story — Irregular Verbs', 'grammar', 'I can tell a short story with common irregular verbs.', ['went', 'ate', 'saw', 'bought', 'took', 'made'], 'Past simple: irregular', 'Tell a 5-sentence story: what you did, saw and ate.'),
          L('en:a1:u4:l4', 'Future Plans', 'speaking', 'I can say my plans for tonight and next weekend.', ['tonight', 'tomorrow', 'next week', 'going to', 'plans', 'maybe'], 'be going to + verb', 'Record 5 plans for your next free day.'),
          L('en:a1:u4:l5', 'Invitations', 'speaking', 'I can invite, accept and politely refuse.', ['Would you like to…?', 'Let’s…', 'I’d love to', 'sorry, I can’t', 'How about…?', 'see you at'], 'Would you like to + verb', 'Roleplay: invite your tutor to dinner; accept a cinema invite.'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ A2 ------------------------------------------------ */
  {
    id: 'A2', name: 'Elementary', descriptor: 'Describe experiences, events and plans in simple connected text.',
    units: [
      {
        id: 'en:a2:u1', title: 'People & Personalities', theme: 'Character, comparison, relationships',
        lessons: [
          L('en:a2:u1:l1', 'Describing Character', 'vocabulary', 'I can describe people’s personalities.', ['friendly', 'hard-working', 'shy', 'generous', 'funny', 'serious'], 'adjective + noun / be + adjective', 'Describe 3 people you know with 2 traits each.'),
          L('en:a2:u1:l2', 'Comparatives', 'grammar', 'I can compare two people or things.', ['taller than', 'more interesting', 'better', 'worse', 'as … as', 'much + comparative'], '-er / more … than', 'Compare your city with another city: 5 sentences.'),
          L('en:a2:u1:l3', 'Superlatives', 'grammar', 'I can say the best, the worst and the most…', ['the best', 'the worst', 'the most beautiful', 'the biggest', 'the oldest', 'ever'], 'the -est / the most', 'Voice task: 4 superlative facts about your life.'),
          L('en:a2:u1:l4', 'Appearance & Style', 'vocabulary', 'I can describe what someone looks like and wears.', ['tall, slim', 'curly hair', 'glasses', 'well-dressed', 'looks like', 'in his thirties'], 'look like / look + adjective', 'Describe a friend so your tutor can picture them.'),
          L('en:a2:u1:l5', 'Relationships & Feelings', 'speaking', 'I can talk about friends and how I feel.', ['get on well', 'close to', 'argue', 'make up', 'happy / upset', 'excited about'], 'feel + adjective; verbs + -ing', 'Talk about your best friend and a recent feeling.'),
        ],
      },
      {
        id: 'en:a2:u2', title: 'Experiences & Travel', theme: 'Past stories, perfect tense, journeys',
        lessons: [
          L('en:a2:u2:l1', 'Irregular Past Review', 'grammar', 'I can narrate past events fluently.', ['drove', 'found', 'left', 'met', 'spent', 'thought'], 'Past simple: 30 key irregulars', 'Story chain: tell a 6-sentence travel story.'),
          L('en:a2:u2:l2', 'Have You Ever…?', 'grammar', 'I can ask and answer about life experiences.', ['ever', 'never', 'been to', 'seen', 'tried', 'already / yet'], 'Present perfect + past simple', 'Ask your tutor 4 “Have you ever…?” questions; answer theirs.'),
          L('en:a2:u2:l3', 'Travel & Transport', 'vocabulary', 'I can plan a trip and use transport phrases.', ['flight', 'book a room', 'border', 'luggage', 'platform', 'take a taxi'], 'Prepositions of movement: by / on / to', 'Plan a 3-day trip aloud: transport, hotel, activities.'),
          L('en:a2:u2:l4', 'At the Hotel & Directions', 'speaking', 'I can check in and follow directions.', ['reservation', 'check in / out', 'turn left', 'go straight', 'across from', 'block'], 'Imperatives for directions', 'Voice roleplay: hotel check-in + find the station.'),
          L('en:a2:u2:l5', 'Telling a Story', 'writing', 'I can write a short past narrative.', ['first', 'then', 'after that', 'suddenly', 'in the end', 'unfortunately'], 'Sequencing connectors', 'Write a 100-word story about a memorable day.'),
        ],
      },
      {
        id: 'en:a2:u3', title: 'Work & Ambitions', theme: 'Jobs, skills, future forms',
        lessons: [
          L('en:a2:u3:l1', 'Jobs & Workplaces', 'vocabulary', 'I can talk about jobs and workplaces.', ['salary', 'colleague', 'office', 'shift', 'apply for', 'experience'], 'work in / work for / work as', 'Describe your job (or ideal job) in 5 sentences.'),
          L('en:a2:u3:l2', 'Skills & Abilities', 'grammar', 'I can say what I can do well.', ['can / can’t', 'good at', 'manage to', 'know how to', 'learn to', 'skills'], 'can for ability; verb + to-infinitive', 'Voice pitch: your 3 strongest skills with examples.'),
          L('en:a2:u3:l3', 'Will vs Going To', 'grammar', 'I can choose the right future form.', ['will', 'going to', 'prediction', 'intention', 'promise', 'probably'], 'will vs be going to', 'Say 3 predictions and 3 intentions about next year.'),
          L('en:a2:u3:l4', 'A Simple Job Interview', 'speaking', 'I can answer basic interview questions.', ['Tell me about…', 'strengths', 'weakness', 'team', 'deadline', 'I would like to'], 'Present for routines + will for aims', 'Mock interview: 5 common questions with your tutor.'),
          L('en:a2:u3:l5', 'Formal Email Basics', 'writing', 'I can write a clear formal email.', ['Dear Sir / Madam', 'I am writing to', 'attached', 'regards', 'deadline', 'please find'], 'Email register: formal vs informal', 'Write a 90-word job application email.'),
        ],
      },
      {
        id: 'en:a2:u4', title: 'The World Around You', theme: 'Places, weather, requests',
        lessons: [
          L('en:a2:u4:l1', 'Geography & Landscapes', 'vocabulary', 'I can describe countries and landscapes.', ['mountain', 'coast', 'desert', 'river', 'island', 'border'], 'Comparative geography facts', 'Compare two regions you know in 5 sentences.'),
          L('en:a2:u4:l2', 'Weather & Seasons', 'speaking', 'I can discuss weather and plan around it.', ['forecast', 'cloudy', 'freezing', 'heatwave', 'season', 'it’s raining'], 'Present continuous for now/trends', 'Record a 1-minute weather report for your city.'),
          L('en:a2:u4:l3', 'Getting Around', 'listening', 'I can understand transport announcements.', ['platform', 'delayed', 'single / return', 'next stop', 'terminus', 'change at'], 'Transport collocations', 'Listen-and-reply: 4 station announcements.'),
          L('en:a2:u4:l4', 'Polite Requests', 'grammar', 'I can make and respond to requests.', ['Could you…?', 'Would you mind…?', 'certainly', 'no problem', 'I’m afraid…', 'of course'], 'Could / Would you mind + -ing', 'Roleplay: 5 requests at a hotel and office.'),
          L('en:a2:u4:l5', 'Problems & Solutions', 'speaking', 'I can explain a simple problem and ask for help.', ['there’s a problem with', 'it doesn’t work', 'broken', 'Can you help?', 'I need…', 'solution'], 'Present continuous problems', 'Voice task: report 3 problems (phone, booking, order).'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ B1 ------------------------------------------------ */
  {
    id: 'B1', name: 'Intermediate', descriptor: 'Deal with most situations; produce connected text on familiar topics.',
    units: [
      {
        id: 'en:b1:u1', title: 'Identity & Opinions', theme: 'Experience, habits, discussion skills',
        lessons: [
          L('en:b1:u1:l1', 'Perfect vs Past', 'grammar', 'I can choose present perfect or past simple correctly.', ['since', 'for', 'already', 'just', 'yet', 'ago'], 'Present perfect vs past simple', 'Talk about 4 life stages with the right tense.'),
          L('en:b1:u1:l2', 'Used To & Would', 'grammar', 'I can describe past habits and states.', ['used to', 'didn’t use to', 'would always', 'back then', 'these days', 'no longer'], 'used to / would for past habits', 'Voice: how your life has changed in 6 sentences.'),
          L('en:b1:u1:l3', 'Giving Opinions', 'speaking', 'I can agree, partly agree and disagree politely.', ['in my view', 'I’d say that', 'I see your point, but', 'on the whole', 'arguably', 'I’m convinced that'], 'Opinion + reason + example', 'Debate practice: 3 mini-statements with your tutor.'),
          L('en:b1:u1:l4', 'Describing Change', 'vocabulary', 'I can describe trends and transformations.', ['increase', 'decline', 'transform', 'gradually', 'dramatically', 'over time'], 'trend verbs + adverbs', 'Describe 4 changes in your country over 10 years.'),
          L('en:b1:u1:l5', 'Personality Deep-Dive', 'speaking', 'I can discuss character in depth.', ['ambitious', 'down-to-earth', 'hot-tempered', 'self-conscious', 'outgoing', 'reliable'], 'Personality collocations', 'Describe how a close friend’s personality shows in actions.'),
        ],
      },
      {
        id: 'en:b1:u2', title: 'Work & Study', theme: 'Professional communication, conditionals',
        lessons: [
          L('en:b1:u2:l1', 'Present Times at Work', 'grammar', 'I can use present tenses precisely at work.', ['currently', 'at the moment', 'these days', 'tend to', 'handle', 'be involved in'], 'Present simple vs continuous', 'Describe your current projects: 2 permanent, 2 temporary.'),
          L('en:b1:u2:l2', 'Real Conditionals', 'grammar', 'I can use zero and first conditionals.', ['if', 'unless', 'as long as', 'provided that', 'in case', 'otherwise'], 'Zero & first conditional', 'Voice: 5 work rules with if/unless.'),
          L('en:b1:u2:l3', 'Meetings & Calls', 'speaking', 'I can participate in a routine meeting.', ['agenda', 'action points', 'to sum up', 'let’s move on', 'could you clarify', 'follow up'], 'Polite interruption phrases', 'Roleplay a 10-minute project meeting.'),
          L('en:b1:u2:l4', 'Workplace Email & Chat', 'writing', 'I can write effective workplace messages.', ['follow up on', 'as discussed', 'by EOD', 'heads-up', 'action required', 'looping in'], 'Register: email vs chat', 'Write: a follow-up email + a 3-line chat summary.'),
          L('en:b1:u2:l5', 'Education & Learning Online', 'vocabulary', 'I can discuss study methods and progress.', ['course', 'enrol', 'assessment', 'deadline', 'revise', 'take notes'], 'Verb patterns: -ing vs to-infinitive', 'Explain your learning routine and 2 goals.'),
        ],
      },
      {
        id: 'en:b1:u3', title: 'Stories & Media', theme: 'Narrative tenses, news, reviews',
        lessons: [
          L('en:b1:u3:l1', 'Narrative Tenses', 'grammar', 'I can tell stories with layered tenses.', ['was walking', 'had finished', 'realised', 'meanwhile', 'all of a sudden', 'by the time'], 'Past continuous + past perfect', 'Voice: tell a 90-second dramatic story.'),
          L('en:b1:u3:l2', 'The News', 'vocabulary', 'I can discuss current events.', ['headline', 'source', 'report', 'break out', 'carry out', 'according to'], 'Present passive: is believed / was signed', 'Summarise one news story you know in 5 sentences.'),
          L('en:b1:u3:l3', 'Passive Voice', 'grammar', 'I can transform and use passives.', ['is made', 'was built', 'has been sent', 'will be announced', 'being tested', 'by whom'], 'Passive across tenses', 'Describe how 3 everyday things are made/done.'),
          L('en:b1:u3:l4', 'Films & Reviews', 'speaking', 'I can review a film or series convincingly.', ['plot', 'cast', 'setting', 'review', 'gripping', 'letdown'], 'Recommendation structures', 'Record a 90-second review of something you watched.'),
          L('en:b1:u3:l5', 'Social Media & Screens', 'speaking', 'I can debate technology habits.', ['screen time', 'scroll', 'post', 'privacy', 'notification', 'digital detox'], 'Quantifiers: too much / enough', 'Debate: “Kids under 12 shouldn’t have smartphones.”'),
        ],
      },
      {
        id: 'en:b1:u4', title: 'Choices & Probability', theme: 'Deduction, hypotheticals, complaints',
        lessons: [
          L('en:b1:u4:l1', 'Modals of Deduction', 'grammar', 'I can say how sure I am about guesses.', ['must be', 'can’t be', 'might be', 'could have', 'must have', 'definitely'], 'must / might / can’t + have', 'Deduction game: guess 3 mystery objects from clues.'),
          L('en:b1:u4:l2', 'Second Conditional', 'grammar', 'I can talk about imaginary situations.', ['If I had…, I would…', 'If we lived…', 'I’d definitely', 'hypothetically', 'suppose', 'wish'], 'Second conditional + wish', 'Voice: 4 “If I could change one thing…” answers.'),
          L('en:b1:u4:l3', 'Complaints & Appliances', 'speaking', 'I can complain effectively and politely.', ['I’m afraid there’s a problem', 'refund', 'faulty', 'inconvenience', 'sort it out', 'compensation'], 'Formal complaint structure', 'Roleplay: return a faulty product and get a refund.'),
          L('en:b1:u4:l4', 'Describing Objects & Products', 'vocabulary', 'I can describe products precisely.', ['lightweight', 'durable', 'waterproof', 'rechargeable', 'second-hand', 'worth it'], 'Compound adjectives', 'Pitch a product you love in 60 seconds.'),
          L('en:b1:u4:l5', 'Making Decisions', 'speaking', 'I can weigh options and decide with others.', ['pros and cons', 'on balance', 'let’s weigh up', 'the downside', 'deal-breaker', 'go for'], 'Decision-making phrases', 'Choose between 3 offers with your tutor; justify.'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ B2 ------------------------------------------------ */
  {
    id: 'B2', name: 'Upper-Intermediate', descriptor: 'Interact with fluency and spontaneity; present clear, detailed arguments.',
    units: [
      {
        id: 'en:b2:u1', title: 'Global Issues', theme: 'Environment, debating, cause & effect',
        lessons: [
          L('en:b2:u1:l1', 'Environment & Sustainability', 'vocabulary', 'I can discuss environmental issues precisely.', ['carbon footprint', 'renewable', 'emissions', 'sustainability', 'waste', 'biodiversity'], 'Articles: the / a / zero', 'Present your view on one green policy, with evidence.'),
          L('en:b2:u1:l2', 'Debating Skills', 'speaking', 'I can argue a position and rebut.', ['conceding that', 'the counterargument', 'on what grounds', 'correlation ≠ causation', 'let me address that', 'to play devil’s advocate'], 'Concession clauses: while / albeit', 'Formal debate with your tutor: 2 rounds, timed.'),
          L('en:b2:u1:l3', 'Cause & Effect', 'grammar', 'I can link causes and consequences.', ['due to', 'owing to', 'as a result', 'consequently', 'stem from', 'give rise to'], 'Cause/effect signposting', 'Explain one social trend: 3 causes, 2 effects.'),
          L('en:b2:u1:l4', 'Cities & Migration', 'reading', 'I can analyse texts about urban change.', ['urbanisation', 'infrastructure', 'influx', 'commute', 'housing crisis', 'quality of life'], 'Reduced relative clauses', 'Read a short article; summarise and critique it aloud.'),
          L('en:b2:u1:l5', 'Statistics & Data Talk', 'grammar', 'I can describe data accurately.', ['account for', 'roughly', 'a steep rise', 'plateau', 'twofold', 'per capita'], 'Numbers, fractions, trends', 'Describe a chart to your tutor in 90 seconds.'),
        ],
      },
      {
        id: 'en:b2:u2', title: 'Professional Communication', theme: 'Reports, negotiation, presentations',
        lessons: [
          L('en:b2:u2:l1', 'Conditionals 2 & 3 + Mixed', 'grammar', 'I can hypothesise about present and past.', ['If I had known…', 'would have', 'could have been', 'had it not been for', 'in hindsight', 'regrets'], 'Third & mixed conditionals', 'Voice: analyse a past decision with 3 conditionals.'),
          L('en:b2:u2:l2', 'Reports & Proposals', 'writing', 'I can structure a business report.', ['executive summary', 'findings', 'recommendations', 'background', 'scope', 'conclusion'], 'Formal report register', 'Write a 150-word mini-report with recommendations.'),
          L('en:b2:u2:l3', 'Negotiation Language', 'speaking', 'I can negotiate terms diplomatically.', ['trade-off', 'bottom line', 'meet halfway', 'contingent on', 'win-win', 'walk away'], 'Hedging: somewhat / to some extent', 'Roleplay: negotiate a project scope with your tutor.'),
          L('en:b2:u2:l4', 'Presenting with Impact', 'speaking', 'I can deliver a structured presentation.', ['signpost', 'hand over', 'to illustrate', 'key takeaway', 'in a nutshell', 'any questions'], 'Presentation signposting', 'Give a 2-minute mini-presentation; get feedback.'),
          L('en:b2:u2:l5', 'Small Talk & Rapport', 'speaking', 'I can build professional rapport naturally.', ['breaking the ice', 'how’s it going', 'catch up', 'mutual', 'by the way', 'keep in touch'], 'Question tags & echo questions', 'Roleplay: conference networking, 3 conversations.'),
        ],
      },
      {
        id: 'en:b2:u3', title: 'Culture & Identity', theme: 'Cross-cultural fluency, idioms',
        lessons: [
          L('en:b2:u3:l1', 'Relative Clauses Mastered', 'grammar', 'I can join ideas with precision.', ['whose', 'whereby', 'in which', 'of which', 'non-defining', 'which refers to'], 'Defining vs non-defining', 'Describe 3 concepts with layered relative clauses.'),
          L('en:b2:u3:l2', 'Idioms in Context', 'vocabulary', 'I can use 12 high-frequency idioms.', ['over the moon', 'once in a while', 'the bottom line', 'cut corners', 'on the same page', 'food for thought'], 'Idiomatic collocations', 'Story swap: use 5 idioms naturally; tutor checks tone.'),
          L('en:b2:u3:l3', 'Cross-Cultural Communication', 'speaking', 'I can discuss cultural differences sensitively.', ['norms', 'taboo', 'directness', 'hierarchy', 'etiquette', 'misunderstanding'], 'Generalising: tend to / be prone to', 'Compare 2 workplace cultures you know.'),
          L('en:b2:u3:l4', 'Paraphrasing & Summarising', 'writing', 'I can restate ideas in my own words.', ['in other words', 'put differently', 'to put it simply', 'essentially', 'boils down to', 'the gist'], 'Synonym shift + structure change', 'Paraphrase 3 paragraphs your tutor provides.'),
          L('en:b2:u3:l5', 'Identity & Values', 'speaking', 'I can discuss values and identity fluently.', ['upbringing', 'heritage', 'values', 'belong', 'perspective', 'diverse'], 'Abstract noun phrases', 'Voice essay: “What shaped who you are?” 2 minutes.'),
        ],
      },
      {
        id: 'en:b2:u4', title: 'Persuasion & Media Literacy', theme: 'Reported speech, arguments, essays',
        lessons: [
          L('en:b2:u4:l1', 'Reported Speech', 'grammar', 'I can report speech and claims accurately.', ['claimed that', 'denied -ing', 'warned', 'allegedly', 'according to sources', 'backshift'], 'Reported statements & questions', 'Report a conversation and a news claim.'),
          L('en:b2:u4:l2', 'Analysing Arguments', 'reading', 'I can spot claims, evidence and fallacies.', ['premise', 'evidence', 'fallacy', 'bias', 'credibility', 'anecdotal'], 'Evaluative language', 'Critique a short opinion piece aloud with your tutor.'),
          L('en:b2:u4:l3', 'Hedging & Asserting', 'grammar', 'I can calibrate how strongly I claim.', ['arguably', 'to a large extent', 'it appears that', 'undoubtedly', 'somewhat', 'broadly speaking'], 'Hedges vs boosters', 'Rewrite 5 blunt claims with the right strength.'),
          L('en:b2:u4:l4', 'Opinion Essay', 'writing', 'I can write a structured argument essay.', ['thesis', 'body paragraph', 'moreover', 'nevertheless', 'in light of', 'to conclude'], 'Essay architecture', 'Write a 180-word essay; tutor grades and coaches.'),
          L('en:b2:u4:l5', 'Fake News & Trust', 'speaking', 'I can discuss media trust issues.', ['misinformation', 'deepfake', 'verify', 'echo chamber', 'discern', 'sensational'], 'Speculation about sources', 'Debate: “Social media platforms must verify users.”'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ C1 ------------------------------------------------ */
  {
    id: 'C1', name: 'Advanced', descriptor: 'Use English flexibly for social, academic and professional purposes.',
    units: [
      {
        id: 'en:c1:u1', title: 'Precision & Nuance', theme: 'Advanced structures, collocation, register',
        lessons: [
          L('en:c1:u1:l1', 'Inversion & Cleft Sentences', 'grammar', 'I can emphasise with advanced structures.', ['Not only… but also', 'Rarely do we', 'It was X that…', 'What strikes me is', 'Under no circumstances', 'So compelling was…'], 'Inversion & cleft focus', 'Rewrite 6 sentences for emphasis; keep meaning.'),
          L('en:c1:u1:l2', 'Advanced Collocations', 'vocabulary', 'I can use precise word partnerships.', ['utterly devoted', 'broadly consistent', 'heavy-handed', 'widely regarded', 'acutely aware', 'stark contrast'], 'Adjective + noun / verb + adverb pairs', 'Produce 10 precise collocations in context aloud.'),
          L('en:c1:u1:l3', 'Register Switching', 'speaking', 'I can move between formal and informal registers.', ['to put it bluntly', 'with reference to', 'kind of', 'whereas', 'albeit', 'off the record'], 'Register-marking devices', 'Say the same message 3 ways: chat, email, speech.'),
          L('en:c1:u1:l4', 'Academic Writing Core', 'writing', 'I can write academic-style paragraphs.', ['hypothesis', 'methodology', 'implication', 'notwithstanding', 'in terms of', 'parity'], 'Nominalisation', 'Transform 3 casual claims into academic prose.'),
          L('en:c1:u1:l5', 'Ambiguity & Precision', 'reading', 'I can detect and resolve ambiguity.', ['ambiguous', 'scope', 'interpretation', 'implicit', 'contingent', 'precision'], 'Precision modifiers', 'Rewrite 5 ambiguous statements unambiguously.'),
        ],
      },
      {
        id: 'en:c1:u2', title: 'Leadership & Negotiation', theme: 'Diplomatic language, facilitation',
        lessons: [
          L('en:c1:u2:l1', 'Diplomatic Language', 'speaking', 'I can deliver hard messages diplomatically.', ['frame', 'soften', 'with respect', 'I wonder if', 'there may be scope', 'sandwich feedback'], 'Modal softening + downtoners', 'Roleplay: give difficult feedback to a colleague.'),
          L('en:c1:u2:l2', 'Facilitating Meetings', 'speaking', 'I can chair a complex meeting.', ['convene', 'dominating the floor', 'table this', 'park it', 'circle back', 'align on'], 'Facilitation phrases', 'Chair a 4-agenda-point meeting with your tutor.'),
          L('en:c1:u2:l3', 'High-Stakes Negotiation', 'speaking', 'I can negotiate complex, multi-party deals.', ['leverage', 'concession', 'red line', 'BATNA', 'contingency', 'ratify'], 'Conditional bargaining structures', 'Negotiate a 3-issue deal; debrief strategy.'),
          L('en:c1:u2:l4', 'Crisis Communication', 'speaking', 'I can communicate calmly under pressure.', ['contain', 'stakeholder', 'mitigate', 'on the record', 'reassure', 'triage'], 'Passive distancing in crisis talk', 'Handle a mock crisis call; tutor plays the press.'),
          L('en:c1:u2:l5', 'Performance Reviews', 'writing', 'I can write fair, actionable reviews.', ['consistently', 'demonstrates', 'growth area', 'exceed expectations', 'trajectory', 'actionable'], 'Evidence-based appraisal language', 'Write a 150-word review section; coach edits.'),
        ],
      },
      {
        id: 'en:c1:u3', title: 'Research & Argument', theme: 'Sources, synthesis, critique',
        lessons: [
          L('en:c1:u3:l1', 'Citation & Attribution', 'writing', 'I can attribute and cite elegantly.', ['as X argues', 'per Y’s findings', 'concur', 'diverge', 'seminal', 'corroborate'], 'Reporting verbs spectrum', 'Synthesise 3 sources into one paragraph.'),
          L('en:c1:u3:l2', 'Critical Response', 'speaking', 'I can respond to research critically.', ['methodological', 'sample size', 'confound', 'replicable', 'overstates', 'robust'], 'Critical evaluation frames', 'Critique a study summary; defend your critique.'),
          L('en:c1:u3:l3', 'Synthesis Writing', 'writing', 'I can merge multiple viewpoints coherently.', ['converge', 'diverge', 'synthesize', 'on balance', 'the weight of evidence', 'nuance'], 'Contrastive synthesis structures', 'Write a 200-word synthesis; tutor reviews.'),
          L('en:c1:u3:l4', 'Data-Driven Argument', 'grammar', 'I can build arguments from data.', ['correlates with', 'outlier', 'confidence interval', 'trend', 'disparity', 'attributable to'], 'Data commentary language', 'Present a data-backed case in 2 minutes.'),
          L('en:c1:u3:l5', 'Q&A Mastery', 'speaking', 'I can handle hostile questions.', ['that’s a fair challenge', 'to clarify', 'the caveat is', 'I’d push back on', 'let me be precise', 'happy to follow up'], 'Bridging & flagging', 'Survive a 3-question hostile Q&A round.'),
        ],
      },
      {
        id: 'en:c1:u4', title: 'Fluency & Style', theme: 'Metaphor, humour, storytelling',
        lessons: [
          L('en:c1:u4:l1', 'Metaphor & Imagery', 'vocabulary', 'I can use metaphor deliberately.', ['a watershed moment', 'navigate', 'grapple with', 'a double-edged sword', ' foothold', 'ripple effect'], 'Metaphor families', 'Describe your career as a journey — 90 seconds.'),
          L('en:c1:u4:l2', 'Discourse Markers Elite', 'grammar', 'I can guide listeners smoothly.', ['that said', 'by the same token', 'granted', 'in fairness', 'to be clear', 'all told'], 'High-level connectives', 'Explain a complex topic using 8 markers.'),
          L('en:c1:u4:l3', 'Humour & Irony', 'speaking', 'I can use irony and light humour safely.', ['deadpan', 'tongue-in-cheek', 'pun', 'sarcastic', 'understatement', 'quip'], 'Irony markers & tone', 'Tell a 60-second anecdote with a punchline.'),
          L('en:c1:u4:l4', 'Storytelling Mastery', 'speaking', 'I can captivate with structure.', ['hook', 'tension', 'turning point', 'vivid', 'punchline', 'takeaway'], 'Story arcs & tense play', 'Perform a 2-minute story; tutor scores structure.'),
          L('en:c1:u4:l5', 'Editing Your Own Prose', 'writing', 'I can self-edit to publication quality.', ['redundancy', 'concision', 'flow', 'cohesion', 'restructure', 'polish'], 'Editing passes method', 'Edit your earlier C1 essay live with the tutor.'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ C2 ------------------------------------------------ */
  {
    id: 'C2', name: 'Mastery', descriptor: 'Express yourself spontaneously, very fluently and precisely.',
    units: [
      {
        id: 'en:c2:u1', title: 'Rhetoric & Public Address', theme: 'Speeches, delivery, impromptu',
        lessons: [
          L('en:c2:u1:l1', 'Rhetorical Devices', 'speaking', 'I can deploy rhetoric deliberately.', ['anaphora', 'tricolon', 'antithesis', 'rhetorical question', 'allusion', 'cadence'], 'Device + effect analysis', 'Deliver a 60-second speech with 3 devices.'),
          L('en:c2:u1:l2', 'Speech Architecture', 'writing', 'I can architect a persuasive speech.', ['proposition', 'roadmap', 'fulcrum', 'callback', 'peroration', 'applause line'], 'Speech outline design', 'Draft and deliver a 3-minute persuasive speech.'),
          L('en:c2:u1:l3', 'Impromptu Speaking', 'speaking', 'I can speak fluently with zero preparation.', ['spur of the moment', 'tentative framing', 'buy time', 'pivot', 'land the point', 'off the cuff'], 'Impromptu frameworks (PREP, What-Why-How)', 'Four 45-second impromptu rounds with your tutor.'),
          L('en:c2:u1:l4', 'Debate Championship', 'speaking', 'I can rebut at competition level.', ['burden of proof', 'turn', 'extend', 'clash point', 'adjudicate', 'strategic concession'], 'Rebuttal structures', 'Full competitive debate round; scored debrief.'),
          L('en:c2:u1:l5', 'Accent & Intelligibility', 'listening', 'I can optimise clarity across accents.', ['stress-timing', 'connected speech', 'schwa', 'intonation contour', 'chunking', 'clarity'], 'Prosody training', 'Read a passage; get prosody corrections.'),
        ],
      },
      {
        id: 'en:c2:u2', title: 'Specialist Discourse', theme: 'Registers, terminology, editing',
        lessons: [
          L('en:c2:u2:l1', 'Registers Across Fields', 'vocabulary', 'I can switch specialist registers.', ['legal', 'clinical', 'commercial', 'technical', 'editorial', 'legalese'], 'Field-specific phraseology', 'Explain one topic in 3 specialist registers.'),
          L('en:c2:u2:l2', 'Precision Vocabulary', 'vocabulary', 'I can find the exact word.', ['nuanced', 'nuance vs connotation', 'denotation', 'granular', 'salient', 'aptness'], 'Semantic fields & near-synonyms', 'Choose between near-synonyms in 8 contexts.'),
          L('en:c2:u2:l3', 'Professional Editing', 'writing', 'I can edit any document to standard.', ['style guide', 'house style', 'redline', 'track changes', 'concision pass', 'fact-check'], 'Multi-pass editing method', 'Edit a flawed 200-word brief to professional grade.'),
          L('en:c2:u2:l4', 'Complex Documents', 'writing', 'I can produce complex real documents.', ['SLA', 'memorandum', 'terms of reference', 'annex', 'stipulate', 'binding'], 'Document conventions', 'Draft a terms-of-reference document section.'),
          L('en:c2:u2:l5', 'Translation Nuance', 'speaking', 'I can bridge languages without loss.', ['untranslatable', 'calque', 'false friend', 'register mismatch', 'domestication', 'equivalence'], 'Translation strategies', 'Explain 3 untranslatable words from your language.'),
        ],
      },
      {
        id: 'en:c2:u3', title: 'Interpretation & Critique', theme: 'Subtext, analysis, reviews',
        lessons: [
          L('en:c2:u3:l1', 'Reading Between the Lines', 'reading', 'I can extract subtext and implication.', ['subtext', 'innuendo', 'implicit', 'intertextual', 'coded', 'insinuate'], 'Implicature language', 'Analyse a dialogue’s hidden meanings with your tutor.'),
          L('en:c2:u3:l2', 'Literary Analysis', 'speaking', 'I can analyse literary technique.', ['motif', 'foreshadow', 'unreliable narrator', 'juxtapose', 'allegory', 'tone'], 'Analytical essay language', 'Analyse a short passage in 2 minutes.'),
          L('en:c2:u3:l3', 'Critique & Review Elite', 'writing', 'I can write publication-grade reviews.', ['oeuvre', 'derivative', 'avant-garde', 'tour de force', 'misfire', 'panache'], 'Review register & stance', 'Write a 200-word critique of any artwork.'),
          L('en:c2:u3:l4', 'Ethics & Philosophy Talk', 'speaking', 'I can debate abstract principles.', ['moral imperative', 'utilitarian', 'caveat', 'paradox', 'duty', 'consent'], 'Abstract argument structures', 'Debate a classic ethical dilemma for 5 minutes.'),
          L('en:c2:u3:l5', 'Live Interpretation', 'listening', 'I can summarise speech in real time.', ['gist', 'paraphrase on the fly', 'note-taking', 'acronym', 'recall', 'consecutive'], 'Consecutive summarising', 'Summarise a 2-minute talk back to your tutor.'),
        ],
      },
      {
        id: 'en:c2:u4', title: 'Near-Native Performance', theme: 'Integration, range, polish',
        lessons: [
          L('en:c2:u4:l1', 'Idiomatic Range Max', 'vocabulary', 'I can sound natural in any register.', ['ballpark', 'take with a grain of salt', 'jump the gun', 'read the room', 'move the needle', 'back to square one'], 'Idiom + register fit', 'Use 10 idioms in a natural business conversation.'),
          L('en:c2:u4:l2', 'Emotional Intelligence Talk', 'speaking', 'I can navigate emotional conversations.', ['validate', 'empathise', 'de-escalate', 'vulnerable', 'reassure', 'boundary'], 'Affective language', 'Roleplay: support a distressed colleague skilfully.'),
          L('en:c2:u4:l3', 'Media Performance', 'speaking', 'I can perform in interviews and panels.', ['soundbite', 'bridging', 'flagging', 'mandate', 'spin', 'clip'], 'Media training structures', 'Mock panel: answer 4 tough questions on camera-style.'),
          L('en:c2:u4:l4', 'Capstone Project', 'writing', 'I can produce a signature long-form piece.', ['abstract', 'draft', 'iterate', 'peer review', 'redraft', 'finalize'], 'Full writing cycle', 'Write a 400-word feature; two coached revisions.'),
          L('en:c2:u4:l5', 'Mastery Assessment', 'speaking', 'I can demonstrate near-native command.', ['fluency', 'range', 'accuracy', 'coherence', 'pronunciation', 'interaction'], 'All outcomes integrated', 'Full mock C2 assessment with scored feedback.'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ BUSINESS ENGLISH ---------------------------------- */
  {
    id: 'BUS', name: 'Business English', descriptor: 'Workplace English for meetings, writing, pitching and networking.',
    units: [
      {
        id: 'en:bus:u1', title: 'Professional Foundations', theme: 'Emails, calls, introductions',
        lessons: [
          L('en:bus:u1:l1', 'Emails That Get Replies', 'writing', 'I can write concise, effective work emails.', ['subject line', 'purpose up front', 'action items', 'cc / bcc', 'EOD', 'kind regards'], 'Email structure patterns', 'Write 2 emails: a request and an update.'),
          L('en:bus:u1:l2', 'Introducing Yourself at Work', 'speaking', 'I can introduce myself in professional settings.', ['role', 'based in', 'report to', 'in charge of', 'background', 'looking forward'], 'Present simple professional patterns', 'Record a 45-second self-introduction.'),
          L('en:bus:u1:l3', 'Phone & Video Calls', 'speaking', 'I can handle calls smoothly.', ['schedule a call', 'you’re breaking up', 'share screen', 'mute', 'put on hold', 'recap'], 'Call-management phrases', 'Roleplay: a client video call with 2 issues.'),
          L('en:bus:u1:l4', 'Small Talk with Clients', 'speaking', 'I can open and close conversations warmly.', ['how was your weekend', 'travelling much?', 'icebreaker', 'rapport', 'follow up on', 'great catching up'], 'Echo questions & reactions', 'Roleplay: 2 minutes of client small talk.'),
          L('en:bus:u1:l5', 'Arrangements & Calendar', 'grammar', 'I can schedule, reschedule and confirm.', ['availability', 'reschedule', 'slot', 'RSVP', 'out of office', 'time zone'], 'Present continuous for arrangements', 'Negotiate a 3-way meeting time with your tutor.'),
        ],
      },
      {
        id: 'en:bus:u2', title: 'Meetings & Negotiation', theme: 'Discussions, minutes, deals',
        lessons: [
          L('en:bus:u2:l1', 'Running Effective Meetings', 'speaking', 'I can chair and contribute to meetings.', ['agenda item', 'timebox', 'park that', 'action items', 'to summarise', 'AOB'], 'Chairing phrases', 'Chair a mock stand-up meeting; keep it to 5 minutes.'),
          L('en:bus:u2:l2', 'Minutes & Follow-Ups', 'writing', 'I can write clear minutes and actions.', ['as agreed', 'owner', 'due date', 'carried over', 'parked', 'decisions'], 'Nominalisation in minutes', 'Write minutes from a call your tutor role-plays.'),
          L('en:bus:u2:l3', 'Disagreeing Politely', 'speaking', 'I can push back without conflict.', ['I see it slightly differently', 'with respect', 'the data suggests', 'let’s stress-test', 'concede', 'middle ground'], 'Diplomatic disagreement frames', 'Debate a budget cut; keep rapport intact.'),
          L('en:bus:u2:l4', 'Negotiating Terms', 'speaking', 'I can negotiate scope, price and timelines.', ['quotations', 'terms', 'discount', 'compromise', 'milestones', 'sign-off'], 'Conditional offers: if… will', 'Negotiate a 3-point contract with your tutor.'),
          L('en:bus:u2:l5', 'Status Updates', 'writing', 'I can report progress crisply.', ['on track', 'at risk', 'blocked', 'impediment', 'ETA', 'baseline'], 'Update sentence patterns', 'Write a 5-line status update from bullet notes.'),
        ],
      },
      {
        id: 'en:bus:u3', title: 'Career Assets', theme: 'Reports, CVs, pitching, networking',
        lessons: [
          L('en:bus:u3:l1', 'Short Reports & Proposals', 'writing', 'I can produce persuasive one-pagers.', ['purpose', 'recommendation', 'justification', 'risks', 'next steps', 'appendix'], 'Proposal structure', 'Write a 150-word proposal; tutor reviews as manager.'),
          L('en:bus:u3:l2', 'CV & Cover Letter', 'writing', 'I can tailor application documents.', ['achievement verbs', 'quantify', 'tailor', 'recruiter', 'ATS', 'reference'], 'Past simple for achievements', 'Rewrite 3 CV bullets with metrics.'),
          L('en:bus:u3:l3', 'The Perfect Pitch', 'speaking', 'I can pitch an idea in 90 seconds.', ['elevator pitch', 'hook', 'value proposition', 'demo', 'traction', 'the ask'], 'Pitch architecture', 'Deliver your pitch; get scored and coached.'),
          L('en:bus:u3:l4', 'Presenting Numbers', 'grammar', 'I can present data to executives.', ['revenue', 'headcount', 'YoY', 'forecast', 'margin', 'uptake'], 'Trend language + approximations', 'Explain 4 KPIs to your “CEO” tutor.'),
          L('en:bus:u3:l5', 'Networking & Follow-Up', 'speaking', 'I can network with purpose.', ['mutual connection', 'exchange contacts', 'nurture', 'referral', 'touch base', 'catch up properly'], 'Follow-up email formulas', 'Roleplay an event; then write the follow-up email.'),
        ],
      },
    ],
  },

  /* ------------------------------------------------ EXAM PREP ------------------------------------------ */
  {
    id: 'EXAM', name: 'Exam Prep (IELTS / TOEFL)', descriptor: 'Strategy, timing and band-maximising practice for international exams.',
    units: [
      {
        id: 'en:exam:u1', title: 'Exam Foundations', theme: 'Format, listening, reading',
        lessons: [
          L('en:exam:u1:l1', 'Know Your Exam', 'reading', 'I can map the exam format and scoring.', ['band descriptor', 'task response', 'cohesion', 'raw score', 'conversion', 'rubric'], 'Exam vocabulary', 'Explain your target exam back to your tutor.'),
          L('en:exam:u1:l2', 'Listening Strategies', 'listening', 'I can catch paraphrase and distractors.', ['distractor', 'paraphrase', 'signposting words', 'prediction', 'note completion', 'spelling out'], 'Anticipation techniques', 'Practice set: 6 tricky listening questions, reviewed.'),
          L('en:exam:u1:l3', 'Reading: Skim & Scan', 'reading', 'I can locate answers fast.', ['skim', 'scan', 'keyword', 'True/False/Not Given', 'heading match', 'time budget'], 'Locating vs understanding', 'Timed reading set: 3 passages, strategy debrief.'),
          L('en:exam:u1:l4', 'Vocabulary for Band 7+', 'vocabulary', 'I can deploy less-common vocabulary aptly.', ['lexis', 'collocation', 'precision', 'natural', 'flexibility', 'register'], 'Topic lexis clusters', 'Upgrade 10 basic sentences to band-7 lexis.'),
          L('en:exam:u1:l5', 'Grammar for the Grade', 'grammar', 'I can showcase range AND accuracy.', ['complex sentences', 'error density', 'relative clauses', 'conditionals', 'passives', 'modality'], 'Range vs accuracy balance', 'Grammar transformation workout: 12 items.'),
        ],
      },
      {
        id: 'en:exam:u2', title: 'Speaking & Writing Max', theme: 'Tasks, templates, timing',
        lessons: [
          L('en:exam:u2:l1', 'Speaking Part 1–2', 'speaking', 'I can extend answers naturally.', ['extend', 'elaborate', 'anecdote', 'filler-free', 'fluency markers', 'self-correct'], 'Answer expansion formula', 'Mock speaking part 1-2 with band feedback.'),
          L('en:exam:u2:l2', 'Speaking Part 3 Discussion', 'speaking', 'I can discuss abstract questions.', ['speculate', 'weigh up', 'on balance', 'devil’s advocate', 'concede', 'conclude'], 'Abstract discussion frames', 'Mock part 3: 6 abstract questions.'),
          L('en:exam:u2:l3', 'Task 1 / Integrated Writing', 'writing', 'I can describe data precisely.', ['overview', 'category', 'proportion', 'whereas', 'respectively', 'overall'], 'Data description structures', 'Write Task 1 in 18 minutes; band-scored.'),
          L('en:exam:u2:l4', 'Task 2 Essay', 'writing', 'I can argue a clear position.', ['position', 'thesis', 'topic sentence', 'cohesion device', 'example', 'conclude'], 'Four-paragraph model', 'Write Task 2 in 38 minutes; band-scored.'),
          L('en:exam:u2:l5', 'Full Mock & Debrief', 'speaking', 'I can perform under real exam conditions.', ['timing', 'stamina', 'transfer', 'check', 'review', 'band 8'], 'Everything integrated', 'Full timed mock: all sections + strategy debrief.'),
        ],
      },
    ],
  },
];


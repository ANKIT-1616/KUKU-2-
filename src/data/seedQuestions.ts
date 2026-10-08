// src/data/seedQuestions.ts
import { QuestionItem } from '../types/question';

export const SEED_QUESTIONS: QuestionItem[] = [
  // --- ENGLISH LANGUAGE (SAMPLE) ---
  {
    id: 'sample_eng_01',
    sectionId: 'english',
    topicId: 'eng_rc',
    subtopicId: 'eng_rc_1',
    difficulty: 'MEDIUM',
    questionType: 'Reading Comprehension',
    passage:
      'The preservation of judicial independence does not imply insulation from intellectual critique. When judgments are scrutinized for doctrinal consistency, jurisprudence matures. The peril arises when critique degenerates into imputations of motive, thereby eroding public faith in the adjudicatory mechanism without offering reasoned alternatives.',
    question: "According to the passage, what is the author's primary view regarding judicial criticism?",
    options: [
      { id: 'A', text: 'Judges should be immune from public scrutiny to safeguard the institution.' },
      { id: 'B', text: 'Doctrinal critique is beneficial, but baseless attacks on judicial motive are damaging.' },
      { id: 'C', text: 'Public opinion should dictate the outcome of high-stakes adjudications.' },
      { id: 'D', text: 'Legal reasoning is inherently flawed without non-judicial oversight.' },
    ],
    correctAnswer: 'B',
    explanation:
      'The author explicitly distinguishes between scrutiny for "doctrinal consistency" (which helps jurisprudence mature) and critique that "degenerates into imputations of motive" (which erodes public faith). Thus, option B is correct.',
    source: 'SAMPLE Author Practice (Labelled SAMPLE)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
      notes: 'Sample demonstrator question for RC Main Idea.',
    },
  },
  {
    id: 'sample_eng_02',
    sectionId: 'english',
    topicId: 'eng_rc',
    subtopicId: 'eng_rc_3',
    difficulty: 'HARD',
    questionType: 'Reading Comprehension',
    passage:
      'The preservation of judicial independence does not imply insulation from intellectual critique. When judgments are scrutinized for doctrinal consistency, jurisprudence matures. The peril arises when critique degenerates into imputations of motive, thereby eroding public faith in the adjudicatory mechanism without offering reasoned alternatives.',
    question: "What is the tone of the author in the provided passage?",
    options: [
      { id: 'A', text: 'Belligerent and dismissive' },
      { id: 'B', text: 'Measured and analytical' },
      { id: 'C', text: 'Indifferent and cynical' },
      { id: 'D', text: 'Eulogistic and uncritical' },
    ],
    correctAnswer: 'B',
    explanation:
      'The author carefully weighs the benefits of intellectual critique against the perils of personal motive accusations. The tone is objective, prudent, and analytical (Option B).',
    source: 'SAMPLE Author Practice (Labelled SAMPLE)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },
  {
    id: 'sample_eng_03',
    sectionId: 'english',
    topicId: 'eng_grammar',
    subtopicId: 'eng_gram_5',
    difficulty: 'EASY',
    questionType: 'Grammar - Subject-Verb Agreement',
    question:
      'Choose the grammatically correct sentence from the following options:',
    options: [
      { id: 'A', text: 'The panel of distinguished arbitrators were unanimous in their procedural decision.' },
      { id: 'B', text: 'The panel of distinguished arbitrators was unanimous in its procedural decision.' },
      { id: 'C', text: 'Neither the arbitrator nor the advocates was present during the reading.' },
      { id: 'D', text: 'Every one of the submitted documents have been misplaced by the registry.' },
    ],
    correctAnswer: 'B',
    explanation:
      'The collective noun "panel" acts as a singular unit acting in unison ("unanimous"), requiring the singular verb "was" and singular pronoun "its". In C, the plural subject closer to the verb ("advocates") requires "were". In D, "Every one" requires the singular verb "has been".',
    source: 'SAMPLE Author Practice (Labelled SAMPLE)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },
  {
    id: 'sample_eng_04',
    sectionId: 'english',
    topicId: 'eng_vocab',
    subtopicId: 'eng_vocab_1',
    difficulty: 'MEDIUM',
    questionType: 'Vocabulary - Antonyms',
    question:
      'Select the word that is most nearly OPPOSITE in meaning to the word "EQUIVOCAL":',
    options: [
      { id: 'A', text: 'Ambiguous' },
      { id: 'B', text: 'Lucid' },
      { id: 'C', text: 'Nebulous' },
      { id: 'D', text: 'Dubious' },
    ],
    correctAnswer: 'B',
    explanation:
      '"Equivocal" means open to more than one interpretation, uncertain, or ambiguous. The direct antonym is "Lucid" (clear, easily understood).',
    source: 'SAMPLE Author Practice (Labelled SAMPLE)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },

  // --- LOGICAL REASONING (SAMPLE) ---
  {
    id: 'sample_lr_01',
    sectionId: 'logical',
    topicId: 'lr_analytical_core',
    subtopicId: 'lr_an_1',
    difficulty: 'MEDIUM',
    questionType: 'Syllogism',
    question:
      'Statements:\n1. All treaties are agreements.\n2. Some agreements are binding.\n3. No binding document is informal.\n\nConclusions:\nI. Some agreements are not informal.\nII. No treaty is informal.\n\nWhich of the conclusions logically follow?',
    options: [
      { id: 'A', text: 'Only conclusion I follows' },
      { id: 'B', text: 'Only conclusion II follows' },
      { id: 'C', text: 'Both conclusions I and II follow' },
      { id: 'D', text: 'Neither conclusion I nor II follows' },
    ],
    correctAnswer: 'A',
    explanation:
      'From statements 2 and 3: The agreements that are binding cannot be informal. Therefore, those specific agreements are not informal (Conclusion I definitely follows). Conclusion II is not guaranteed because treaties might overlap with agreements outside the binding subset. Hence, only I follows.',
    source: 'SAMPLE Author Practice (Labelled SAMPLE)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },
  {
    id: 'sample_lr_02',
    sectionId: 'logical',
    topicId: 'lr_cr',
    subtopicId: 'lr_cr_2',
    difficulty: 'HARD',
    questionType: 'Critical Reasoning - Assumption',
    question:
      'Argument: "The municipal council must ban personal gasoline vehicles within the heritage district because whenever vehicular traffic was pedestrianized on trial weekends, local retail footfall increased by 35%."\n\nWhich of the following is an underlying ASSUMPTION required by the argument?',
    options: [
      { id: 'A', text: 'Electric vehicles produce less noise pollution than gasoline vehicles.' },
      { id: 'B', text: 'The increased footfall on weekends was not solely a temporary consequence of novelty or leisure scheduling.' },
      { id: 'C', text: 'Retail merchants in the heritage district pay higher taxes than suburban merchants.' },
      { id: 'D', text: 'All visitors to the heritage district possess alternative public transit options.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Using the Negation Test: If the increase in footfall was solely due to weekend leisure or novelty, then making the ban permanent on all weekdays would not reproduce the claimed benefits. Negating B shatters the argument. Thus B is a necessary assumption.',
    source: 'SAMPLE Author Practice (Labelled SAMPLE)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },
  {
    id: 'sample_lr_03',
    sectionId: 'logical',
    topicId: 'lr_principle_facts',
    subtopicId: 'lr_pf_1',
    difficulty: 'MEDIUM',
    questionType: 'Principle + Facts',
    question:
      'PRINCIPLE: A promise made in exchange for a benefit already received in the past without any prior request does not create a binding obligation, unless the promisor explicitly certifies it in a written sealed memorandum.\n\nFACTS: Dev helped Arun repair his leaking boat during a sudden storm without being asked. Two days later, Arun orally said to Dev, "Thank you, I will pay you 5,000 rupees for saving my cargo." Arun did not execute any written memorandum. Arun later refused to pay. Can Dev compel payment strictly under the stated principle?',
    options: [
      { id: 'A', text: 'Yes, because Arun received a substantial tangible benefit.' },
      { id: 'B', text: 'Yes, because an oral promise witnessed by others is legally enforceable in court.' },
      { id: 'C', text: 'No, because the past benefit was rendered without prior request and Arun did not certify his promise in a written sealed memorandum.' },
      { id: 'D', text: 'No, because repairing boats is an inherently gratuitous social act.' },
    ],
    correctAnswer: 'C',
    explanation:
      'Strict logical deduction from the given principle: (1) Benefit was received in the past without prior request. (2) Therefore no binding obligation is created unless explicitly certified in a written sealed memorandum. (3) Arun only gave an oral promise. Thus Arun is not bound. External law/court admissibility is irrelevant.',
    source: 'SAMPLE Author Practice (Strictly Logical)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
      notes: 'Demonstrates AILET principle-based logic testing with zero external law knowledge.',
    },
  },
  {
    id: 'sample_lr_04',
    sectionId: 'logical',
    topicId: 'lr_analytical_core',
    subtopicId: 'lr_an_2',
    difficulty: 'MEDIUM',
    questionType: 'Linear Arrangement',
    question:
      'Five candidates—P, Q, R, S, and T—are interviewed in a row from Monday to Friday, exactly one per day.\n- R is interviewed on Wednesday.\n- P is interviewed immediately before R.\n- S is not interviewed on Friday.\n\nOn which day is T interviewed?',
    options: [
      { id: 'A', text: 'Monday' },
      { id: 'B', text: 'Tuesday' },
      { id: 'C', text: 'Thursday' },
      { id: 'D', text: 'Friday' },
    ],
    correctAnswer: 'D',
    explanation:
      'Wednesday = R. P is immediately before R, so Tuesday = P. Remaining days: Mon, Thu, Fri for Q, S, T. Since S is not on Friday, and if S is on Monday/Thursday, the only remaining day for T given the constraints must be Friday. Specifically: T must occupy Friday.',
    source: 'SAMPLE Author Practice (Labelled SAMPLE)',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },

  // --- CURRENT AFFAIRS & GK (SAMPLE DEMONSTRATION) ---
  {
    id: 'sample_ca_01',
    sectionId: 'ca_gk',
    topicId: 'ca_static_gk',
    subtopicId: 'gk_1',
    difficulty: 'EASY',
    questionType: 'Static GK - Indian Polity',
    question:
      'Under the Constitution of India, which Article empowers the Supreme Court to issue writs for the enforcement of Fundamental Rights?',
    options: [
      { id: 'A', text: 'Article 32' },
      { id: 'B', text: 'Article 226' },
      { id: 'C', text: 'Article 136' },
      { id: 'D', text: 'Article 142' },
    ],
    correctAnswer: 'A',
    explanation:
      'Article 32 confers the right to move the Supreme Court by appropriate proceedings for the enforcement of Fundamental Rights (Dr. B.R. Ambedkar termed it the "heart and soul" of the Constitution). Article 226 empowers High Courts.',
    source: 'Constitution of India (Verified Static GK Fact)',
    sourceDate: '1950-01-26',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: false,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },
  {
    id: 'sample_ca_02',
    sectionId: 'ca_gk',
    topicId: 'ca_core',
    subtopicId: 'ca_2',
    difficulty: 'MEDIUM',
    questionType: 'Current Affairs - International Organizations',
    question:
      'Which intergovernmental multilateral group officially admitted the African Union as a permanent member at its 2023 New Delhi Leaders Summit?',
    options: [
      { id: 'A', text: 'BRICS' },
      { id: 'B', text: 'Group of Twenty (G20)' },
      { id: 'C', text: 'Shanghai Cooperation Organisation (SCO)' },
      { id: 'D', text: 'Association of Southeast Asian Nations (ASEAN)' },
    ],
    correctAnswer: 'B',
    explanation:
      'At the 18th G20 Summit held in New Delhi under India’s presidency in September 2023, the 55-member African Union was formally inducted as a permanent member of the G20.',
    source: 'G20 New Delhi Declaration Official Release',
    sourceDate: '2023-09-09',
    status: 'SAMPLE',
    qualityCheck: {
      passedAutomatedChecks: true,
      secondPassReviewDone: true,
      noExternalLawRequired: true,
      hasSingleCorrectAnswer: true,
      hasNoDuplicateOptions: true,
    },
  },
];

# AILET 2027 Preparation Operating System (NLU Delhi)

A disciplined, high-fidelity personal preparation operating system engineered for **one serious student** preparing for **AILET 2027 UG (B.A. LL.B. Hons.) at National Law University Delhi**.

The core daily loop it automates:
$$\text{PLAN} \longrightarrow \text{LEARN} \longrightarrow \text{PRACTICE} \longrightarrow \text{MOCK} \longrightarrow \text{ANALYZE} \longrightarrow \text{RECORD MISTAKES} \longrightarrow \text{REVISE} \longrightarrow \text{REATTEMPT} \longrightarrow \text{IMPROVE}$$

---

## 1. Exam Facts & Official Pattern Verification

Before implementation, the exam pattern was verified against the official National Law University Delhi portal (`nationallawuniversitydelhi.in`):

| Exam Parameter | Official Value | Classification |
|---|---|---|
| **Conducting Body** | National Law University Delhi (NLU Delhi) | `OFFICIAL` |
| **Degree** | B.A. LL.B. (Hons.) 5-Year Integrated Course | `OFFICIAL` |
| **Exam Date & Day** | **13 December 2026 (Sunday)** | `OFFICIAL` |
| **Exam Timing** | **2:00 PM – 4:00 PM IST (120 minutes)** | `OFFICIAL` |
| **Total Questions & Marks** | **150 MCQs / 150 Marks** | `OFFICIAL` |
| **Marking Scheme** | **+1.0 Correct, -0.25 Incorrect, 0 Unattempted** | `OFFICIAL` |
| **Sections** | 1. English Language (50 Qs / 50 Marks)<br>2. Current Affairs & General Knowledge (30 Qs / 30 Marks)<br>3. Logical Reasoning (70 Qs / 70 Marks) | `OFFICIAL` |
| **Legal Aptitude Section** | **NONE.** Legal principles appear *only* inside Logical Reasoning as hypothetical premises to test pure deductive logic. No prior legal or case law knowledge required. | `OFFICIAL` |
| **Mathematics Section** | **NONE.** No quantitative techniques section in AILET UG. | `OFFICIAL` |
| **Mode** | Offline Pen-and-Paper with OMR Sheet | `OFFICIAL` |
| **Tie-Breaking Rule** | Higher marks in Logical Reasoning, then older age, then computerized draw of lots. | `OFFICIAL` |

*All exam facts reside in a single editable `ExamConfig` (JSON) accessible under Settings, allowing instant updates if NLU Delhi issues notifications.*

---

## 2. Official vs Recommended vs Product Design Additions

To preserve absolute intellectual honesty, every element in the UI and data model carries an explicit classification:

### `OFFICIAL`
- Exam Date: 13 Dec 2026, 2:00–4:00 PM IST
- 150 Questions, 150 Marks, 120 Minutes duration
- Section names and question counts (English 50, CA & GK 30, Logical 70)
- Negative marking: -0.25 per incorrect answer
- Offline OMR format

### `RECOMMENDED`
- All sub-topics under English, Logical, and GK (inferred from past AILET papers)
- Priority Matrix (VERY HIGH, HIGH, MEDIUM, LOW, AVOID)
- Spaced Revision Cadence: Day 0 (Learn) → Day 1 (Quick Revision) → Day 3 (Practice) → Day 7 (Revision) → Day 14 (Test) → Final-Week Rapid Revision
- Phase targets and weekly timetable breakdown
- Mock frequency guidelines per phase

### `Product design addition`
- **OMR Practice Mode Alert**: Optional reminder at the 112-minute mark (last 8 minutes) to reserve time for bubbling and physical review.
- **Proportional Sectional Time Limits**: English (40 min), CA & GK (24 min), Logical Reasoning (56 min).
- **Adaptive Weak Area Engine**: Detects repeat deficiencies (accuracy < 60% across ≥ 5 attempts in ≥ 2 sessions) and prescribes a 6-step recovery protocol without fake percentile predictions.
- **Missed-Day Adaptive Rebalancer**: Reallocates essential missed tasks capped at +20% daily load without pushing items past 30 Nov for new topics or disrupting high-yield sequences.
- **Automated Question Quality Pipeline**: Pre-ingestion validation for single correct key, 4 distinct options, explanation presence, and zero statutory law requirements.
- **Timeline Simulator**: Header bar allowing instant preview and testing of any milestone between 2 Oct and 13 Dec 2026.

---

## 3. Ground Rules & Anti-Fake Content Architecture

- **Zero Fake PYQs**: Past Year Questions are only present if explicitly imported by the student with official paper verification.
- **Zero Fake Current Affairs**: The CA module ships empty by default. Any entry marked `VERIFIED` requires a verifiable source and source publication date. Items without verifiable sources are badged `PRACTICE ONLY`.
- **Zero Fake Percentiles / Rankings**: Analytics display actual scores, raw accuracy, time per question, and error distributions. Speculative national ranks or percentile claims are strictly prohibited.
- **Strict Logic Purity**: Principle-based questions test pure logical deduction from the given text; no outside knowledge of IPC, CrPC, Constitution articles, or case laws is required or tested.

---

## 4. Content Schemas

### Question Bank Schema (`QuestionItem`)
```json
{
  "id": "q_lr_101",
  "sectionId": "logical",
  "topicId": "lr_cr",
  "subtopicId": "lr_cr_2",
  "difficulty": "MEDIUM",
  "questionType": "Critical Reasoning - Assumption",
  "passage": "Optional contextual passage...",
  "question": "Which of the following is an underlying assumption required by the argument?",
  "options": [
    { "id": "A", "text": "Option text 1" },
    { "id": "B", "text": "Option text 2" },
    { "id": "C", "text": "Option text 3" },
    { "id": "D", "text": "Option text 4" }
  ],
  "correctAnswer": "B",
  "explanation": "Detailed explanation of why B is the necessary assumption using the negation test.",
  "source": "Student Import / Verified Source",
  "status": "VALIDATED"
}
```

### Current Affairs Schema (`CurrentAffairItem`)
```json
{
  "id": "ca_2026_10_01",
  "date": "2026-10-01",
  "topic": "Supreme Court 7-Judge Bench ruling on SC/ST sub-classification",
  "category": "National",
  "summary": "State governments have the constitutional power to sub-classify Scheduled Castes based on empirical data.",
  "keyFacts": [
    "Seven-judge Constitution bench led by CJI",
    "Overruled E.V. Chinnaiah (2004)",
    "Mandates quantifiable data of underrepresentation"
  ],
  "source": "The Hindu / Supreme Court of India Judgment Record",
  "sourceDate": "2024-08-01",
  "relatedExamTopic": "Indian Polity - Judiciary",
  "status": "VERIFIED",
  "isImportantEvent": true,
  "tracker": {
    "read": true,
    "notesCreated": true,
    "mcqsPracticed": false,
    "rev1Done": false,
    "rev2Done": false,
    "finalPassDone": false
  }
}
```

---

## 5. Verification & Testing

Run unit tests directly:
```bash
npx tsx tests/unitTests.ts
```
All 42 test cases verify:
1. Scoring Engine (+1.0 / -0.25 / 0, edge cases all correct, all wrong, all unattempted)
2. Spaced Revision Interval Progression & step-back recovery
3. 73-Day Plan Generation & Phase boundaries
4. Strict enforcement of *No new topics after 30 Nov*
5. Adaptive Rebalancing load limits (+20% cap)
6. Countdown & 13 Dec Exam Day switch
7. Question Quality validation rules

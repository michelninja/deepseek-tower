// The narrative. Analogy only — no spec column.
// Voice rules: actors are people; places are rooms. A floor never wants anything.
// Naming: architect (lab) + named tower + type + year plaque. Never "the 2022 tower".
//
// Each act carries `floor` (0–40) so the camera can pin the tower to the story,
// and `ninja` — the NinjaTech case file walked through the same building.

export const acts = [
  {
    id: "arrival",
    eyebrow: "Act I · The lobby",
    title: "A case file arrives",
    plaque: "Mailroom",
    floor: 0,
    story: [
      "The building has one job: read enormous case files — up to a million words, pictures included — and write back an answer, one word at a time.",
      "Your question walks in the door and the mailroom gets to work. It slices what you wrote into sub-words. Not ideas, not sentences — sub-words, taken from an official dictionary of 129,280 entries.",
      "Each slice becomes a person. Every token is an Investigator, and they all walk into the lobby together.",
      "A long case file means a very crowded lobby. A million-word file sends a million Investigators through the door at once — which is precisely why the rest of this building is designed the way it is.",
    ],
    ninja:
      "Your case file today is a Ninja agent reading a ~400-page client corpus — contracts, emails, a scanned org chart, one photograph of a whiteboard. In sub-words, that is roughly half a million Investigators queueing at the door for a single question.",
    whoElse:
      "Every tower in the skyline does this, and has since the original Transformer tower (Google, 2017). The dictionary is the same idea everywhere; only its size changes.",
  },
  {
    id: "dossier",
    eyebrow: "Act I · Reception",
    title: "The 5,120-number dossier",
    plaque: "Reception desk",
    floor: 0,
    story: [
      "At reception each Investigator is handed a clipboard holding 5,120 numbers. That is their dossier — everything the building will ever know about them.",
      "On the ground floor the dossier is deliberately vague. The Investigator for “apple” does not yet know whether it is a fruit or a company. That ignorance is the point: meaning is not handed out at the door, it is earned on the way up.",
      "If you attached a picture, a separate annex handles it. The Foreign Media Desk cuts the image into patches and translates each one into the same 5,120-number dossier, so picture Investigators and text Investigators can ride the tower together.",
    ],
    ninja:
      "The whiteboard photograph is cut into patches at the Foreign Media Desk and joins the queue as ordinary Investigators. Nothing downstream needs to know it was ever an image.",
    whoElse:
      "Most towers call this the embedding table and leave it at that. The DeepSeek-V4.1-Flash tower (DeepSeek, 2026) also runs a dedicated vision annex so pictures join the queue as equals.",
  },
  {
    id: "elevator",
    eyebrow: "Act II · The climb",
    title: "Four elevators, not one",
    plaque: "The express shafts",
    floor: 3,
    story: [
      "Most buildings run a single escalator. Every Investigator rides it, and at each floor the staff they meet add notes to their clipboard. Nothing is ever erased — the notes simply pile up as they climb.",
      "The DeepSeek-V4.1-Flash tower (DeepSeek, 2026) runs four escalators side by side, and posts a switchboard clerk between floors whose only job is to reshuffle which Investigators ride which shaft.",
      "The clerk used to be slow. To decide how to reshuffle, he first had to read every clipboard — so the building made three separate trips to the filing cabinet before anyone could move up a floor. On this floor he simply reuses last floor's settings, which lets one fused shift do the whole reshuffle: read once, mix, write back once.",
      "Four shafts cost the same as one, because the building is built narrow and tall rather than wide. That choice — depth over width — is what frees up the budget for everything the upper floors do.",
    ],
    ninja:
      "Four shafts is why a Ninja agent can keep half a million Investigators on the payroll and still answer in seconds. A single-escalator building of the same size would have to be far wider, and far slower to walk.",
    whoElse:
      "One escalator is the default in every dense tower — the GPT-3 tower, the Llama-3-70B tower (Meta, 2024). Four shafts is DeepSeek's alone.",
  },
  {
    id: "attention",
    eyebrow: "Act III · Floor work",
    title: "The conference room",
    plaque: "64 microphones",
    floor: 8,
    story: [
      "Every floor has a conference room, and this is where the actual thinking happens.",
      "Each Investigator stands up and asks a question. Not of the whole room — of the colleagues who came in before them. Nobody may question the future, so the conversation can only ever look backwards.",
      "Sixty-four microphones hang from the ceiling. Every Investigator speaks into all of them at once, and each microphone listens for a different kind of relevance: who is the subject, who is the verb, what is being referred to, what came before.",
      "The answers are tallied, and the Investigator writes a single new line on their clipboard: what the room just told them. Then everyone moves up a floor and does it again — forty times, a different conversation on each.",
    ],
    ninja:
      "This is the room where “the party in clause 4” finally gets attached to “the counterparty in the signature block”, forty pages apart in the client corpus. Distance is not an obstacle here; only floor count is.",
    whoElse:
      "The 64-microphone conference room is standard-issue in every tower — it is the original Transformer's great invention (Google, 2017). What changes between buildings is how many microphones, and how the answers are filed.",
  },
  {
    id: "clinic",
    eyebrow: "Act III · Floor work",
    title: "The specialist clinic",
    plaque: "384 specialists",
    floor: 14,
    story: [
      "Down the corridor is a clinic with 384 Specialists, one per discipline, and a General Practitioner every Investigator must see.",
      "The Triage Nurse meets each Investigator at the door and reads their clipboard. She does not send them to all 384 — that would take all day and cost a fortune. She picks six who look most useful for this particular Investigator, on this particular floor.",
      "Each Specialist is a genuine expert, but a narrow one. The General Practitioner is the opposite: broad, shallow, and always right about the basics. Everyone sees the GP; only six see a specialist.",
      "That is the trick — the building is enormous on paper and small in practice. It owns staff worth 552 billion facts, and puts barely a third of them to work on any given Investigator.",
    ],
    ninja:
      "The contract-clause Investigator gets sent to the six Specialists who handle indemnity, jurisdiction, term, liability, governing law and defined terms. The email-thread Investigator gets six entirely different ones, on the same floor, at the same time.",
    whoElse:
      "Other towers do hire specialists — the Mixtral tower (Mistral, 2023) is the well-known example. Very few hire 384 per floor and keep the General Practitioner permanent.",
  },
  {
    id: "engram",
    eyebrow: "Act IV · The machines",
    title: "The walls of lockers",
    plaque: "Floors 2 and 15",
    floor: 15,
    story: [
      "On two floors — the second and the fifteenth — the corridor is lined with vending machines. Two long walls of them, and no other tower in the skyline has this room at all.",
      "Each locker holds a ready-made note. When an Investigator's clipboard matches a pattern the building has seen a million times before, they do not need to think about it — they just open the locker and take the note.",
      "This is the building's memory of the obvious. Idioms, common phrases, the way a name is spelled, the shape of a date. Things no one should have to reason out from scratch every single time.",
      "Memory as furniture rather than memory as staff: 196 billion notes, stored flat, costing almost nothing to keep and nothing at all to read.",
    ],
    ninja:
      "When the corpus says “pursuant to Section 4.2 hereof”, the Investigator does not deduce what that means. It opens a locker. The hard questions stay in the conference room; the obvious ones get collected on the way past.",
    whoElse:
      "Every other tower learns these patterns the slow way, in its staff's heads, where they take up room that could have been used for thinking. Lockers are the DeepSeek tower's own idea.",
  },
  {
    id: "archive",
    eyebrow: "Act V · The Archive",
    title: "Throw the questions away",
    plaque: "The Archive",
    floor: 18,
    story: [
      "Once an Investigator has asked their question, the question is dead weight. Investigator #500 will never need to know what Investigator #5 asked — only what #5 was, and what #5 knew.",
      "So the Archive keeps the name tags and the briefing notes, and throws the questions away. That single decision is the whole revolution.",
      "It is also why this tower can hold a million Investigators when the Llama-3-70B tower (Meta, 2024) cannot: that tower files a full-colour, 16-bit dossier for every Investigator who ever entered — 330 KB each, 43 GB for a single 128K case file. This tower files one ZIP per Investigator: 890 bytes.",
      "The saving compounds with length. A four-times-longer case file costs this building four times as much to store, not four times twice over. That is the difference between a tower that can read a whole contract archive and one that has to stop at a chapter.",
    ],
    ninja:
      "The ~400-page corpus files into the Archive at 890 bytes per Investigator. At 128K tokens that is roughly 114 MB in the other tower's system and under 900 KB here — the difference between a file an agent can resume between tool calls and one it has to reload from scratch.",
    whoElse:
      "The Llama towers shrink the archive by sharing name tags between heads. This tower compresses each Investigator to a single sealed latent — an idea introduced by the DeepSeek-V2 tower.",
  },
  {
    id: "library",
    eyebrow: "Act V · The Archive",
    title: "The local desk and the library",
    plaque: "Floor 21",
    floor: 21,
    story: [
      "Even a compressed archive is too large to read whole. So the reading on every floor is split in two.",
      "First the local desk: each Investigator reads the exact, uncompressed dossiers of the last 128 colleagues who walked in. This is the near neighbourhood — enough to keep the grammar straight and the pronouns pointed at the right person.",
      "Then the central library. A Librarian scores a short search tag attached to every archived dossier and pulls only the 512 most relevant from the million behind them.",
      "At full context an Investigator reads 640 files and never more — 128 close neighbours, 512 chosen strangers. The cost of a conversation stays flat even when the conversation is a million words long.",
    ],
    ninja:
      "When the agent is asked “what did we agree about renewal?”, the Librarian pulls the renewal clause, the amendment, and the two emails that changed it — out of half a million archived Investigators. The local desk keeps the sentence readable; the library keeps the answer correct.",
    whoElse:
      "Most long-context towers read everything and pay for it. Sparse retrieval at this scale is the DeepSeek tower's signature.",
  },
  {
    id: "blockade",
    eyebrow: "Act VI · The blockade",
    title: "The staircase ends at floor 20",
    plaque: "Floor 20",
    floor: 20,
    story: [
      "Here the building splits. The bottom 20 floors read; the top 20 write. That boundary is not decoration — it is a locked door.",
      "Prompt Investigators stop at floor 20. Everything the upper floors need travels up a pneumatic tube instead, projected straight from the floor-20 state. Only the last 128 Investigators are allowed to keep climbing, up the fire escape, so the first words written have something to look at.",
      "The saving is brutal and simple: reading a 100,000-token case file costs 2.0026 million floor-passes instead of 4 million. Half the building's work, gone.",
      "And the door only closes one way. Every word the building writes walks back down to the lobby and up again as an ordinary Investigator — so the case file does not stop growing just because it has been read once.",
    ],
    ninja:
      "This is why a Ninja agent can hold a long tool call open without the bill running away. Reading the corpus is one cost; each new word of the answer is charged at the cheap rate, because the expensive half of the building is no longer involved.",
    whoElse:
      "No other tower blockades its own staircase. Splitting reading from writing is the CED idea, and it belongs to the DeepSeek-V4.1-Flash tower.",
  },
  {
    id: "roof",
    eyebrow: "Act VII · The roof",
    title: "The press conference",
    plaque: "Floor 40",
    floor: 40,
    story: [
      "An Investigator who reaches the roof has climbed all 40 floors. Their dossier is now scored against all 129,280 words in the dictionary, turned into probabilities, and one word is chosen.",
      "That word streams to your screen — and immediately walks back into the lobby as the newest member of the Archive, ready to be read by everyone behind it.",
      "On the roof sits the Eager Intern. He drafts five words at once, guesses how confident he is in each, and hands the best run to the main tower to verify in a single pass. On average 3.51 of his drafts survive.",
      "Behind a one-way mirror the Wiretap Inspector reads the model's private scratchpad as it is written. If he sees malicious planning twice in a row, he throws the breaker — before a single harmful word reaches your screen.",
    ],
    ninja:
      "The Intern is what makes the answer feel live: five words drafted, one pass to check them, then streamed. The Inspector behind the mirror is NinjaTech's own addition — the tower does not police itself, the operator does.",
    whoElse:
      "Drafting ahead is common; the intern's specific shape is DeepSeek's. The streaming inspector is NinjaTech's addition, not the tower's.",
  },
];

// The narrative. Analogy only — no spec column.
// Voice rules: actors are people; places are rooms. A floor never wants anything.
// Naming: architect (lab) + named tower + type + year plaque. Never "the 2022 tower".
//
// Each act carries `floor` (0–40) so the camera can pin the tower to the story,
// and `example` — one prompt walked through the building, step by step, act by act.
// The prompt never changes: "What is NinjaTech?" — and the answer's first word.

export const acts = [
  {
    id: "arrival",
    eyebrow: "Act I · The lobby",
    title: "Your question arrives",
    plaque: "Mailroom",
    floor: 0,
    story: [
      "The building has one job: read what you typed, and write back an answer — one word at a time.",
      "Your question walks in the door and the mailroom gets to work. It slices what you wrote into the smallest pieces of words it knows, taken from an official dictionary of 129,280 entries.",
      "Each slice becomes a person. Every token is an Investigator, and they all walk into the lobby together.",
      "A long question means a crowded lobby. A million-word document sends a million Investigators through the door at once — which is precisely why the rest of this building is designed the way it is.",
    ],
    example:
      "You type: What is NinjaTech? The mailroom splits it into five pieces — “What”, “is”, “Ninja”, “Tech”, “?” — so five Investigators walk in. Small lobby, five people. That is the whole crowd for this question.",
    whoElse:
      "Every tower in the skyline does this, and has since the original Transformer tower (Google, 2017). The dictionary is the same idea everywhere; only its size changes.",
  },
  {
    id: "dossier",
    eyebrow: "Act II · Reception",
    title: "The 5,120-number dossier",
    plaque: "Reception desk",
    floor: 0,
    story: [
      "At reception each Investigator is handed a clipboard holding 5,120 numbers. That is their dossier — everything the building will ever know about them.",
      "On the ground floor the dossier is deliberately vague. The Investigator for “apple” does not yet know whether it is a fruit or a company. That ignorance is the point: meaning is not handed out at the door, it is earned on the way up.",
      "If you attached a picture, a separate annex handles it. The Foreign Media Desk cuts the image into patches and translates each one into the same 5,120-number dossier, so picture Investigators and text Investigators can ride the tower together.",
    ],
    example:
      "Five clipboards are handed out. The “Ninja” Investigator and the “Tech” Investigator get two completely different dossiers — and neither has been told they belong together, or that a company by that name exists. Nobody has told anyone what the question is about.",
    whoElse:
      "Most towers call this the embedding table and leave it at that. The DeepSeek-V4.1-Flash tower (DeepSeek, 2026) also runs a dedicated vision annex so pictures join the queue as equals.",
  },
  {
    id: "elevator",
    eyebrow: "Act III · The climb",
    title: "Four elevators, not one",
    plaque: "The express shafts",
    floor: 3,
    story: [
      "Most buildings run a single elevator. Every Investigator rides it, and at each floor the staff they meet add notes to their clipboard. Nothing is ever erased — the notes simply pile up as they climb.",
      "The DeepSeek-V4.1-Flash tower (DeepSeek, 2026) runs four shafts side by side, and posts a switchboard clerk on every landing whose only job is to reshuffle which Investigators ride which car.",
      "The clerk used to be slow. To decide how to reshuffle, he first had to read every clipboard — so the building made three separate trips to the filing cabinet before anyone could move up a floor. On this floor he simply reuses last floor's settings, which lets one fused shift do the whole reshuffle: read once, mix, write back once.",
      "Four shafts cost the same as one, because the building is built narrow and tall rather than wide. That choice — depth over width — is what frees up the budget for everything the upper floors do.",
    ],
    example:
      "Five Investigators, four shafts. The clerk puts “What” and “is” in one car and “Ninja”, “Tech”, “?” in another, because they will have the most to say to each other on the way up. Nobody leaves the building; they just change cars.",
    whoElse:
      "One elevator is the default in every dense tower — the GPT-3 tower, the Llama-3-70B tower (Meta, 2024). Four shafts is DeepSeek's alone.",
  },
  {
    id: "attention",
    eyebrow: "Act IV · Floor work",
    title: "The conference room",
    plaque: "64 microphones",
    floor: 8,
    story: [
      "Every floor has a conference room. This is where the work happens, on every floor, the same way.",
      "Each Investigator stands up and asks a question. Not of the whole room — of the colleagues who came in before them. Nobody may question the future, so the conversation can only ever look backwards.",
      "Sixty-four microphones hang from the ceiling. Every Investigator speaks into all of them at once, and each microphone listens for a different kind of relevance: who is the subject, who is the verb, what is being referred to, what came before.",
      "The answers are tallied, and the Investigator writes a single new line on their clipboard: what the room just told them. Then everyone moves up a floor and does it again — forty times, a different conversation on each.",
    ],
    example:
      "“Tech” asks the room about itself and the only colleague behind it is “Ninja”, so it hears about “Ninja” and nothing else. “Ninja” asks and hears “is”. “What” asks first and hears nobody at all. Each of the five now carries one new line on their clipboard.",
    whoElse:
      "The 64-microphone conference room is standard-issue in every tower — it is the original Transformer's great invention (Google, 2017). What changes between buildings is how many microphones, and how the answers are filed.",
  },
  {
    id: "clinic",
    eyebrow: "Act V · Floor work",
    title: "The specialist clinic",
    plaque: "384 specialists",
    floor: 14,
    story: [
      "Down the corridor is a clinic with 384 Specialists, one per discipline, and a General Practitioner every Investigator must see.",
      "The Triage Nurse meets each Investigator at the door and reads their clipboard. She does not send them to all 384 — that would take all day and cost a fortune. She picks six who look most useful for this particular Investigator, on this particular floor.",
      "Each Specialist is a genuine expert, but a narrow one. The General Practitioner is the opposite: broad, shallow, and always right about the basics. Everyone sees the GP; only six see a specialist.",
      "That is the trick — the building is enormous on paper and small in practice. It owns staff worth 552 billion facts, and puts barely a third of them to work on any given Investigator.",
    ],
    example:
      "The “Tech” Investigator is sent to six specialists: technology, companies, proper names, brand spelling, capital letters, and the word that usually follows a company name. The “?” Investigator is sent to six completely different ones. Same corridor, same minute, different experts.",
    whoElse:
      "Other towers do hire specialists — the Mixtral tower (Mistral, 2023) is the well-known example. Very few hire 384 per floor and keep the General Practitioner permanent.",
  },
  {
    id: "engram",
    eyebrow: "Act VI · Memory",
    title: "The walls of lockers",
    plaque: "Floors 2 and 15",
    floor: 15,
    story: [
      "On two floors — the second and the fifteenth — the corridor is lined with lockers. Two long walls of them, and no other tower in the skyline has this room at all.",
      "Each locker holds a ready-made note. When an Investigator's clipboard matches a pattern the building has seen a million times before, they do not need to think about it — they just open the locker and take the note.",
      "This is the building's memory of the obvious. Idioms, common phrases, the way a name is spelled, the shape of a date. Things no one should have to reason out from scratch every single time.",
      "Memory as furniture rather than memory as staff: 196 billion notes, stored flat, costing almost nothing to keep and nothing at all to read.",
    ],
    example:
      "The “Tech” Investigator recognises the shape of a company name — capital letter, one word, no space, stuck to a question mark — and takes the note that says so. The “?” Investigator collects a note about questions that expect a short answer. Two notes on the way past, no thinking required.",
    whoElse:
      "Every other tower learns these patterns the slow way, in its staff's heads, where they take up room that could have been used for thinking. Lockers are the DeepSeek tower's own idea.",
  },
  {
    id: "archive",
    eyebrow: "Act VII · The Archive",
    title: "Throw the questions away",
    plaque: "The Archive",
    floor: 18,
    story: [
      "Once an Investigator has asked their question, the question is dead weight. Investigator #500 will never need to know what Investigator #5 asked — only what #5 was, and what #5 knew.",
      "So the Archive keeps the name tags and the briefing notes, and throws the questions away. That single decision is the whole revolution.",
      "It is also why this tower can hold a million Investigators when the Llama-3-70B tower (Meta, 2024) cannot: that tower files a full-colour, 16-bit dossier for every Investigator who ever entered — 330 KB each, 43 GB for a single 128K case file. This tower files one sealed envelope per Investigator: 890 bytes.",
      "The saving compounds with length. A four-times-longer case file costs this building four times as much to store, not four times twice over. That is the difference between a tower that can read a whole contract archive and one that has to stop at a chapter.",
    ],
    example:
      "The Archive files five envelopes — what each of “What”, “is”, “Ninja”, “Tech”, “?” is, and what each one knows — and shreds the five questions. When the answer starts coming back, only those five envelopes are on file.",
    whoElse:
      "The Llama towers shrink the archive by sharing name tags between heads. This tower compresses each Investigator to a single sealed latent — an idea introduced by the DeepSeek-V2 tower.",
  },
  {
    id: "blockade",
    eyebrow: "Act VIII · The blockade",
    title: "The staircase ends at floor 20",
    plaque: "Floor 20",
    floor: 20,
    story: [
      "Here the building splits. The bottom 20 floors read; the top 20 write. That boundary is not decoration — it is a locked door.",
      "Prompt Investigators stop at floor 20. Everything the upper floors need travels up a pneumatic tube instead, projected straight from the floor-20 state. Only the last 128 Investigators are allowed to keep climbing, up the fire escape, so the first words written have something to look at.",
      "The saving is brutal and simple: reading a 100,000-token case file costs 2.0026 million floor-passes instead of 4 million. Half the building's work, gone.",
      "And the door only closes one way. Every word the building writes walks back down to the lobby and up again as an ordinary Investigator — so the case file does not stop growing just because it has been read once.",
    ],
    example:
      "All five Investigators queue at the door on floor 20. The fire escape allows the last 128, and they are only five, so all five keep climbing. From here on the building stops reading and starts writing: no more questions, only answers.",
    whoElse:
      "No other tower blockades its own staircase. Splitting reading from writing is the CED idea, and it belongs to the DeepSeek-V4.1-Flash tower.",
  },
  {
    id: "library",
    eyebrow: "Act IX · Reading",
    title: "The local desk and the library",
    plaque: "Floor 21",
    floor: 21,
    story: [
      "Even a compressed archive is too large to read whole. So the reading on every floor is split in two.",
      "First the local desk: each Investigator reads the exact, uncompressed dossiers of the last 128 colleagues who walked in. This is the near neighbourhood — enough to keep the grammar straight and the pronouns pointed at the right person.",
      "Then the central library. A Librarian scores a short search tag attached to every archived dossier and pulls only the 512 most relevant from the million behind them.",
      "At full context an Investigator reads 640 files and never more — 128 close neighbours, 512 chosen strangers. The cost of a conversation stays flat even when the conversation is a million words long.",
    ],
    example:
      "This is where a short question and a long document part ways. At the local desk, “Tech” reads the four colleagues in front of it and is done — there are no 128, and no million. Ask the same thing of a 400-page contract and the Librarian has to go and fetch 512 dossiers out of half a million.",
    whoElse:
      "Most long-context towers read everything and pay for it. Sparse retrieval at this scale is the DeepSeek tower's signature.",
  },
  {
    id: "roof",
    eyebrow: "Act X · The roof",
    title: "The press conference",
    plaque: "Floor 40",
    floor: 40,
    story: [
      "An Investigator who reaches the roof has climbed all 40 floors. Their dossier is now scored against all 129,280 words in the dictionary, turned into probabilities, and one word is chosen.",
      "That word streams to your screen — and immediately walks back into the lobby as the newest member of the Archive, ready to be read by everyone behind it.",
      "On the roof sits the Eager Intern. He drafts five words at once, guesses how confident he is in each, and hands the best run to the main tower to verify in a single pass. On average 3.51 of his drafts survive.",
      "Behind a one-way mirror the Wiretap Inspector reads the model's private scratchpad as it is written. If he sees malicious planning twice in a row, he throws the breaker — before a single harmful word reaches your screen.",
    ],
    example:
      "Five candidates are scored: “NinjaTech”, “It”, “A”, “Ninja”, “Them”. “NinjaTech” wins — four of the five Investigators are pointing at a company name nobody ever explained. That word streams to your screen, then walks back down to the lobby as a sixth Investigator. Next trip up writes “is”.",
    whoElse:
      "Drafting ahead is common; the intern's specific shape is DeepSeek's. The streaming inspector is NinjaTech's addition, not the tower's.",
  },
];

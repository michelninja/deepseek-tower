// The narrative. Analogy only — no spec column.
// Voice rules: actors are people; places are rooms. A floor never wants anything.
// Naming: architect (lab) + named tower + type + year plaque. Never "the 2022 tower".

export const acts = [
  {
    id: "arrival",
    eyebrow: "Act I · The lobby",
    title: "A case file arrives",
    plaque: "The Investigation Tower",
    story: [
      "The building has one job: read enormous case files — up to a million words, images included — and write back an answer, one word at a time.",
      "Your question walks in the door and the mailroom gets to work. It slices what you wrote into sub-words. Not ideas, not sentences — sub-words, from an official dictionary of 129,280 entries.",
      "Each slice becomes a person. Every token is an Investigator, and they all walk into the lobby together.",
    ],
    whoElse:
      "Every tower in the skyline does this, and has since the original Transformer tower (Google, 2017). The dictionary is the same idea everywhere; only its size changes.",
  },
  {
    id: "dossier",
    eyebrow: "Act I · Reception",
    title: "The 5,120-number dossier",
    plaque: "Reception desk",
    story: [
      "At reception each Investigator is handed a clipboard holding 5,120 numbers. That is their dossier — everything the building will ever know about them.",
      "At the ground floor the dossier is deliberately vague. The Investigator for “apple” does not yet know whether it is a fruit or a company. That ignorance is the point: meaning is not handed out at the door, it is earned on the way up.",
      "If you attached a picture, a separate annex handles it. The Foreign Media Desk cuts the image into patches and translates each one into the same 5,120-number dossier, so image Investigators and text Investigators can ride the tower together.",
    ],
    whoElse:
      "Most towers call this the embedding table and leave it at that. The DeepSeek-V4.1-Flash tower (DeepSeek, 2026) also runs a dedicated vision annex so pictures join the queue as equals.",
  },
  {
    id: "elevator",
    eyebrow: "Act II · The climb",
    title: "Four elevators, not one",
    plaque: "The express shafts",
    story: [
      "Most buildings run a single escalator. Every Investigator rides it, and at each floor the staff they meet add notes to their clipboard. Nothing is ever erased — the notes simply pile up as they climb.",
      "The DeepSeek-V4.1-Flash tower (DeepSeek, 2026) runs four escalators side by side, and posts a switchboard clerk between floors whose only job is to reshuffle which Investigators ride which shaft.",
      "The clerk used to be slow. To decide how to reshuffle, he first had to read every clipboard — so the building made three separate trips to the filing cabinet before anyone could move up a floor. In this tower the clerk simply reuses last floor's settings, which lets one fused shift do the whole reshuffle: read once, mix, write back once.",
    ],
    whoElse:
      "One escalator is the default in every dense tower — the GPT-3 tower, the Llama-3-70B tower (Meta, 2024). Four shafts is DeepSeek's alone.",
  },
  {
    id: "archive",
    eyebrow: "Act V · The Archive",
    title: "Throw the questions away",
    plaque: "The Archive",
    story: [
      "Once an Investigator has asked their question, the question is dead weight. Investigator #500 will never need to know what Investigator #5 asked — only what #5 was, and what #5 knew.",
      "So the Archive keeps the name tags and the briefing notes, and throws the questions away. That single decision is the whole revolution.",
      "It is also why this tower can hold a million Investigators when the Llama-3-70B tower (Meta, 2024) cannot: that tower files a full-colour, 16-bit dossier for every Investigator who ever entered — 330 KB each, 43 GB for a single 128K case file. This tower files one ZIP per Investigator: 890 bytes.",
    ],
    whoElse:
      "The Llama towers shrink the archive by sharing name tags between heads. This tower compresses each Investigator to a single sealed latent — an idea introduced by the DeepSeek-V2 tower.",
  },
  {
    id: "library",
    eyebrow: "Act V · The Archive",
    title: "The local desk and the library",
    plaque: "Floor 21",
    story: [
      "Even a compressed archive is too large to read whole. So the conference room on every floor is split in two.",
      "First the local desk: each Investigator reads the exact, uncompressed dossiers of the last 128 colleagues who walked in — enough to keep the grammar straight.",
      "Then the central library. A Librarian scores a short search tag attached to every archived dossier and pulls only the 512 most relevant from the million behind them. At full context, an Investigator reads 640 files, never more.",
    ],
    whoElse:
      "Most long-context towers read everything and pay for it. Sparse retrieval at this scale is the DeepSeek tower's signature.",
  },
  {
    id: "blockade",
    eyebrow: "Act VI · The blockade",
    title: "The staircase ends at floor 20",
    plaque: "Floor 20",
    story: [
      "Here the building splits. The bottom 20 floors read; the top 20 write. That boundary is not decoration — it is a locked door.",
      "Prompt Investigators stop at floor 20. Everything the upper floors need travels up a pneumatic tube instead, projected straight from the floor-20 state. Only the last 128 Investigators are allowed to keep climbing, up the fire escape, so the first words generated have something to look at.",
      "The saving is brutal and simple: reading a 100,000-token case file costs 2.0026 million floor-passes instead of 4 million. Half the building's work, gone.",
    ],
    whoElse:
      "No other tower blockades its own staircase. Splitting reading from writing is the CED idea, and it belongs to the DeepSeek-V4.1-Flash tower.",
  },
  {
    id: "roof",
    eyebrow: "Act VII · The roof",
    title: "The press conference",
    plaque: "Floor 40",
    story: [
      "An Investigator who reaches the roof has climbed all 40 floors. Their dossier is now scored against all 129,280 words in the dictionary, turned into probabilities, and one word is chosen.",
      "That word streams to your screen — and immediately walks back into the lobby as the newest member of the Archive, ready to be read by everyone behind it.",
      "On the roof sits the Eager Intern. He drafts five words at once, guesses how confident he is in each, and hands the best run to the main tower to verify in a single pass. On average 3.51 of his drafts survive.",
      "And behind a one-way mirror, the Wiretap Inspector reads the model's private scratchpad as it is written. If he sees malicious planning twice in a row, he throws the breaker — before a single harmful word reaches your screen.",
    ],
    whoElse:
      "Drafting ahead is common; the intern's specific shape is DeepSeek's. The streaming inspector is NinjaTech's addition, not the tower's.",
  },
];

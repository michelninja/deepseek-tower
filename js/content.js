// The narrative. Analogy only.
// Voice rules: actors are people; places are rooms. A floor never wants anything.
// ML terms are introduced one at a time, after the plain word has already done the work.
//
// Each act carries `floor` (0–40) so the camera can pin the tower to the story.
// **double asterisks** mark what you can actually watch happen on the 3D screen.
//
// The prompt never changes. It is the NinjaTech about page, followed by the question:
//   "Expand Humanity's Productivity by Collapsing the Distance Between Idea and Impact.
//    What is NinjaTech?"
// Eighteen Investigators walk through the door because of it.

export const acts = [
  {
    id: "arrival",
    eyebrow: "Act I · The lobby",
    focus: "lobby",
    title: "Your question arrives",
    floor: 0,
    story: [
      "The building has one job: read what you sent, and write back an answer one word at a time.",
      "What you sent is not a sentence to this building. It is a queue. Your question comes in through the **entrance**, and just past the door stands the **mailroom sorting table**. The mailroom keeps an official dictionary of 129,280 entries, and it cuts everything you sent down to exactly those entries. Some entries are whole words. Many are only fragments of words, because a dictionary that size cannot hold every word ever written and does not try. Those cut pieces are **tokens**, and from here on we can call them that: the unit the whole building is built out of.",
      "Each token becomes a person. Every token is an Investigator, and they **walk through the door and queue in the lobby** together, one body per piece, standing in four loose lines and waiting their turn.",
      "Send a short question and the lobby is nearly empty. Send a long document and a million Investigators come through the door at once, which is exactly why the rest of this building is shaped the way it is.",
      "Our prompt today is a real one. It is the **NinjaTech about page**, followed by the question: *Expand Humanity’s Productivity by Collapsing the Distance Between Idea and Impact. What is NinjaTech?* Watch the mailroom work on it. Most of it cuts on word edges, and one cut lands in the middle of a word: *Humanity’s* comes apart into **Humanity** and **’s**. **Expand · Humanity · ’s · Productivity · by · Collapsing · the · Distance · Between · Idea · and · Impact · .** is thirteen tokens. **What · is · Ninja · Tech · ?** is five more. Eighteen people walk in, and every one of them you can see crossing the lobby is one of those pieces. A longer document would split into far more fragments than words.",
    ],
  },
  {
    id: "dossier",
    eyebrow: "Act II · Reception",
    focus: "reception",
    title: "The 5,120-number dossier",
    floor: 0,
    story: [
      "From the sorting table each Investigator **walks across the lobby in a line and queues at reception**, where the clerk **hands them a clipboard holding 5,120 numbers**. That is their dossier, and it is everything this building will ever know about that one piece of a word.",
      "The clerk is deliberately vague. The Investigator for “apple” is not told whether it is a fruit or a company. That ignorance is the point. Meaning is not handed out at the door, it is earned on the way up. The 5,120 numbers are called an **embedding**, and every tower in the skyline hands out the same kind of clipboard.",
      "If you attached a picture, a separate annex handles it. The Foreign Media Desk cuts the image into patches and turns each one into the same 5,120-number dossier, so picture Investigators and word Investigators can ride the tower together.",
      "Watch the counter with our eighteen. Each clipboard is a list of 5,120 numbers, but the numbers are not a code with meanings written in them. They are a position, and positions that sit close together mean pieces that are used alike. So **Humanity** and **Humanity’s** are handed nearly the same position, because in real text the one is almost always followed by the other. **Ninja** and **Tech** land near each other for the same reason. Nothing on either clipboard says *these belong together*. The numbers themselves carry that likeness, and the Investigator has no idea what it means yet.",
    ],
  },
  {
    id: "elevator",
    eyebrow: "Act III · The climb",
    focus: "elevators",
    title: "Four elevators, not one",
    floor: 3,
    story: [
      "Most buildings run a single elevator. Every Investigator rides it, and at each floor the staff they meet add notes to the clipboard they are carrying. Nothing is ever erased. The notes simply pile up as they climb, and the pile is called the **residual stream**.",
      "This tower runs **four shafts side by side**, and posts a switchboard clerk on every landing whose only job is to **reshuffle which Investigators ride which car**. The reshuffle is what lets different Investigators hear different colleagues on the next floor.",
      "The clerk used to be slow. To decide how to reshuffle, he first had to read every clipboard, so the building made three separate trips to the filing cabinet before anyone could move up. Now he simply reuses last floor’s settings, which lets one fused shift do the whole reshuffle: read once, mix, write back once.",
      "Four shafts cost about the same as one, because the building is built narrow and tall rather than wide. Depth instead of width is what frees up the budget for everything the upper floors do.",
      "In the lobby you can see the clerk at work. **He sorts our eighteen by what they are about rather than by when they arrived.** The about page’s words ride one car. The question’s five ride another. **Humanity · Humanity’s · Productivity** end up side by side because they are the same kind of thing, and **Ninja · Tech** share a car so they can compare clipboards. Nothing is thrown away. The cars change and the people do not.",
    ],
  },
  {
    id: "attention",
    eyebrow: "Act IV · Floor work",
    focus: "conference",
    title: "The conference room",
    floor: 8,
    story: [
      "Every floor has a conference room, and this is where the work actually happens. The same work, the same way, on all forty.",
      "**Each Investigator stands up and asks the room a question**, and they may ask it of the colleagues who came in before them. Nobody is allowed to question the future, so the conversation only ever looks backwards. This is **attention**, and it is the single invention the whole building is arranged around.",
      "Sixty-four microphones hang from the ceiling. Every Investigator **speaks into all of them at once**, and each microphone listens for a different kind of relevance: who is the subject, who is the verb, what is being referred to, what came before. Sixty-four of them at once is a **head**, and this tower runs sixty-four heads per floor.",
      "The answers are tallied, and the Investigator **writes one new line on their clipboard**: what the room just told them. Then everyone moves up and does it again. Forty floors, forty conversations, each one able to see everything the last one wrote.",
      "Watch what our eighteen actually ask. **Productivity** stands up and hears **Collapsing**, which is the verb it belongs to, and **by**, which is the little word in front of it. **Tech** asks about itself and hears only **Ninja**, the one colleague behind it. The **.** before *What* hears nothing worth writing, because punctuation has very little to say about a question. Then something useful happens without anyone being told it: **Ninja** at the end of the page and **Ninja** inside the question find each other, and so do the two **Tech**s. The building has started to notice that this page and this question are talking about the same thing.",
    ],
  },
  {
    id: "clinic",
    eyebrow: "Act V · Routing",
    focus: "clinic",
    title: "The specialist clinic",
    floor: 14,
    story: [
      "Down the corridor is a clinic with 384 specialists, one per discipline, plus a general practitioner that every Investigator must see.",
      "The triage nurse **meets each Investigator at the door and reads their clipboard**. She does not send them to all 384, which would take all day and cost a fortune. **She picks six** who look most useful for this particular Investigator on this particular floor. This is **routing**, and it is why the building can be enormous on paper and small in practice: it owns staff worth 552 billion facts and keeps barely a third of them on duty.",
      "Each specialist is a genuine expert but a narrow one. The general practitioner is the opposite, broad and shallow and always right about the basics. Everyone sees the GP. Only six see a specialist.",
      "Watch the nurse send ours out. **Humanity’s** is sent to the possessive specialist, the punctuation specialist, and four who recognise nouns that belong to somebody. **Collapsing** is sent to the verbs. **Tech** gets technology, companies, proper names, brand spelling, capital letters, and whatever usually follows a company name. Eighteen Investigators, **one hundred and eight specialist visits**, all in the same corridor at the same minute.",
    ],
  },
  {
    id: "engram",
    eyebrow: "Act VI · Memory",
    focus: "lockers",
    floors: [2, 15],
    title: "The walls of lockers",
    floor: 15,
    story: [
      "On two floors, the second and the fifteenth, the corridor is lined with lockers. A long wall of them across the whole width, and no other tower in the skyline has this room at all.",
      "**Each locker holds a ready-made note.** When an Investigator’s clipboard matches a pattern the building has seen a million times before, **they open the locker and take the note** instead of thinking it out. The notes are called **Engram**, and they are how the building remembers the obvious: idioms, common phrases, the shape of a date, the way a name is normally spelled.",
      "This is memory kept as furniture rather than memory kept as staff. 196 billion notes, stored flat, costing almost nothing to hold and nothing at all to read.",
      "Ours are settled in seconds. **Humanity’s** opens a locker because of its shape, a word stuck to an apostrophe and an s, and takes the note that says *this belongs to somebody*. **Ninja** and **Tech** find a locker each, because a capital letter followed by a small one and no space at all is what a brand name looks like. **?** takes the note that says *a question is being asked*, and **.** takes the note that says *this page is finished*. Half of our eighteen are settled before they reach floor sixteen, purely by recognising a shape.",
    ],
  },
  {
    id: "archive",
    eyebrow: "Act VII · The Archive",
    focus: "archive",
    floors: [18],
    title: "Throw the questions away",
    floor: 18,
    story: [
      "Once an Investigator has asked their question, **the question is dead weight**. Investigator #500 will never need to know what Investigator #5 asked. Only what #5 was, and what #5 now knows.",
      "So the archive **keeps the name tags and the briefing notes and throws the questions away**. That single decision is the whole revolution. Each Investigator is filed as one sealed envelope: what they are, plus what they learned, and nothing about how they got there.",
      "It is also why this tower can hold a million Investigators while the Llama-3-70B tower (Meta, 2024) cannot. That tower files a full-colour sixteen-bit dossier for every Investigator who ever entered, 330 KB each, 43 GB for a single 128K case file. This tower files 890 bytes, and the saving compounds with length, which is the difference between reading a whole contract archive and stopping at a chapter.",
      "Watch the eighteen go in. They queue at the drawers, **hand over the envelope, and drop the question into the shredder** on the way past. When they are through, **the drawer holds eighteen envelopes and is 12 KB.** The same prompt in the Llama tower’s archive would be 4.6 MB.",
    ],
  },
  {
    id: "blockade",
    eyebrow: "Act VIII · The blockade",
    focus: "seam",
    floors: [20],
    title: "The staircase ends at floor 20",
    floor: 20,
    story: [
      "Here the building splits in two. The bottom twenty floors read and the top twenty write. **That boundary is a locked door**, and it is the reason this tower costs half what its size suggests.",
      "Prompt Investigators **stop at floor 20**. Everything the upper floors need travels up a pneumatic tube instead, projected straight from the state they finished in. **Only the last 128 Investigators** are allowed to keep climbing, up the fire escape, so that the first word written has something to look at.",
      "The saving is brutal and simple. Reading a 100,000-token case file costs 2.0026 million floor-passes instead of 4 million. Half the building’s work, gone.",
      "And the door only closes one way. Every word the building writes **walks back down to the lobby** and up again as an ordinary Investigator, so the case file keeps growing even after it has been read once.",
      "Our eighteen are well under the limit, so **all of them keep climbing**. That is worth noticing: a short prompt does not need the blockade at all. Its cost only shows up when the document is long enough to hit 128 Investigators, and then the fire escape becomes the most valuable staircase in the building.",
    ],
  },
  {
    id: "library",
    eyebrow: "Act IX · Reading",
    focus: "reading",
    title: "The local desk and the library",
    floor: 21,
    story: [
      "Even a compressed archive is too large to read whole, so the reading on every floor is split in two.",
      "First the local desk. Each Investigator **reads the last 128 colleagues who walked in**, which is the near neighbourhood: enough to keep the grammar straight and the pronouns pointed at the right person.",
      "Then the central library. A librarian **scores a short search tag attached to every archived dossier and pulls only the 512 most relevant** from the million behind them. This is **sparse retrieval**, and it is the tower’s signature.",
      "At full length an Investigator reads 640 files and never more, 128 close neighbours and 512 chosen strangers. The cost of a conversation stays flat even when the conversation is a million words long.",
      "Our eighteen barely touch the library. **The local desk is enough**: each reads the seventeen in front of them and stops, nowhere near 128 and nowhere near a trip downstairs. Ask the same question of a 400-page contract and the librarian would have to fetch **512 dossiers out of half a million**. Same question, very different bill.",
    ],
  },
  {
    id: "roof",
    eyebrow: "Act X · The roof",
    focus: "roof",
    floors: [40],
    title: "The press conference",
    floor: 40,
    story: [
      "An Investigator who reaches the roof has climbed all forty floors. Their dossier is **scored against all 129,280 words in the dictionary**, turned into probabilities, and **one word is chosen**. Those probabilities are the answer, and there is nothing else in the building.",
      "That word **streams to your screen** and then walks back down to the lobby as the newest Investigator, ready to be read by everyone behind it. This is how the building writes: one word, then another, each one asked as a fresh question.",
      "On the roof sits the eager intern. He **drafts five words at once**, guesses how confident he is in each, and hands the best run to the main tower to check in a single pass. On average 3.51 of his drafts survive. Behind the one-way mirror the wiretap inspector reads the model’s private scratchpad as it is written, and if he sees malicious planning twice in a row he throws the breaker before a single harmful word reaches your screen.",
      "Watch the eighteen vote. Eighteen dossiers are scored against the whole dictionary and five candidates come out: **NinjaTech**, *Ninja Tech*, *It*, *A*, *Them*. **NinjaTech wins**, because the page’s two words, the question’s two words and the locker note that said *brand name* all point the same way. It **streams to your screen** and walks back down as the nineteenth Investigator. The next trip up writes *is*.",
    ],
  },
];

# The 40-Story Investigation Tower — build plan

An interactive, scroll-driven 3D visualisation of the analogy in Notion page
*"The 40-Story Investigation Tower: A Complete Analogy for Transformers &
DeepSeek-V4.1-Flash"*, told start to finish, with a real NinjaTech workload
walked through it.

Live target: GitHub Pages (branch `gh-pages`, or `main` + Actions).

---

## 1. The one rule everything hangs on

**Stay in the roleplay.** The tower is a *building*. The tokens are *people*
called **Investigators**, each carrying a 5,120-number dossier. Rooms are
places Investigators walk through. A floor never "wants" anything, never
"holds" a clipboard, never "writes" — only a worker does.

| Actors (people) | Places (rooms, floors) |
|---|---|
| Investigators — one per token | Mailroom & reception |
| Switchboard clerk — mHC mixing | 4-lane express elevator |
| Triage Nurse — MoE router | Conference room (attention) |
| 384 Specialists + 1 GP — experts | Specialist clinic (MoE) |
| Librarian — sparse indexer | Local desk (SWA) / Central library (CSA2) |
| Archivist — KV writer | The Archive |
| Eager Intern — DSpark drafter | Roof / rooftop press conference |
| Wiretap Inspector — guardrail | Basement vault (SSD) |

## 2. Voice: three beats per section, no fourth

1. **In the tower** — the story. Plain, vivid, easy. This is the primary text.
2. **Who else** — one short line: "the Llama-3-70B tower (Meta, 2024) does X;
   this tower does Y."
3. **Year plaque** — architect + year as a property, never as a name.

**No real-world/spec column.** The author explicitly rejected it: it made the
story harder to understand. Technical detail lives in the prototype and the
glossary only, and is disclosed on demand — never in the main reading path.

### Naming grammar (canonical)
- **Architect** = the lab: DeepSeek, Anthropic, Meta, Google DeepMind, Alibaba, Moonshot.
- **Tower** = one specific named model: *the DeepSeek-V4.1-Flash tower*, *the
  Llama-3-70B tower*. Never a year. There is no "2022 tower".
- **Year of construction** = a façade plaque: "(DeepSeek, 2026)".
- **Type** = architectural class: single-escalator dense / specialist-clinic MoE
  / storing-everything / microfilm / blockaded.

### Writing test for every paragraph
Read it aloud. If it contains a symbol, a number larger than the story needs, or
a sentence where a *room* does something a *person* should be doing — rewrite it.

## 3. Content map — 40 floors, 7 acts

| Act | Floors | Story |
|---|---|---|
| I. Arrival | lobby | Mailroom slices the case file into Investigators; reception hands out the 5,120-number dossier (deliberately vague — "apple" doesn't know yet if it's a fruit). Foreign Media Desk for images. |
| II. The climb | 1–40 | 4-lane express elevator. Most buildings run one escalator; this one runs four shafts and a switchboard clerk between floors. |
| III. Two rooms per floor | 1–40 | Conference room: Investigators ask earlier Investigators questions (64 microphones). Clinic: the Triage Nurse sends each Investigator to 6 of 384 Specialists, plus the GP everyone sees. |
| IV. The vending machines | 2, 15 | Engram: two walls of 196B lookup lockers. No other tower has this room. |
| V. The Archive | 1–40 | The revolution. Badges and briefings kept, questions thrown away. One ZIP per Investigator instead of 64 photocopies. Local desk (last 128 colleagues) + Central Library (Librarian pulls 512 best ancient files). 4 floors own a photocopier, 4 re-search, 30 just borrow. |
| VI. The blockade | 20 → roof | Prompt Investigators stop at floor 20; the upper archives arrive by pneumatic tube. Only the last 128 walk up (fire escape). Generated Investigators climb all 40. |
| VII. The roof | 40 | Press conference: 129,280 words scored, one sampled and streamed out, then sent back down as the newest Archive member. The Eager Intern drafts 5 words ahead. The Wiretap Inspector watches the private scratchpad with a 2-strike circuit breaker. |

**NinjaTech example**, threaded through all seven acts: a Ninja agent
ingesting a ~400-page client corpus at 1M context — Investigators arriving by
the hundred-thousand, the Archive staying at 890 bytes each, cache resume
between tool calls.

## 4. Technical shape

- **Three.js / WebGL2**, no framework. Vanilla ES modules, no build step.
- `index.html` + `css/` + `js/`.
- **Scroll = the climb.** The camera rises past 40 real floors; each act pins a
  floor and swaps the narrative panel. `IntersectionObserver` drives section
  entry; a single rAF loop drives camera/geometry.
- **Fallback**: `prefers-reduced-motion` and no-WebGL both get a static
  illustrated version — the story must be readable without 3D.
- **Performance**: instanced geometry for Investigators and floors; max 2 lights
  + baked ambient; DPR capped at 2; target 60fps on integrated graphics.
- Accessibility: all narrative text in semantic HTML, not canvas; keyboard
  scroll; alt text on every illustration.

## 5. Milestones

1. **Slice 1 (review gate)** — lobby + 4-lane elevator + one Archive floor, in
   final voice, deployed to Pages. Get a reaction before scaling.
2. **Slice 2** — all 7 acts, placeholder geometry.
3. **Slice 3** — the NinjaTech example threaded through.
4. **Slice 4** — polish: motion, typography, reduced-motion path, mobile.

## 6. Source of truth

Notion page `1ebd734a-ee56-83f8-9909-812f5c7e1885` (readable via the Pipedream
Notion integration) and the annotated tech report
`400d734a-ee56-8152-a528-caa3f1cf772b`.

Key numbers to keep consistent: 40 layers, d=5120, 64 Q heads, 552B total /
196B Engram, 129,280-token vocab, 1M context, 890 B/token, ~370x smaller than
Llama-3-70B's 330 KB, 8B active prefill vs 16B decode.

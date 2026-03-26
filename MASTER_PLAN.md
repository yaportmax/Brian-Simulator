I now have a comprehensive understanding of all existing materials. Let me synthesize everything into the master game design document.

---

# LIFE OF BRIAN: MASTER GAME DESIGN DOCUMENT
## A Roguelike Deckbuilder Browser Game

---

## 1. GAME IDENTITY AND PITCH

### Elevator Pitch
Life of Brian is a single-player roguelike deckbuilder played in a single HTML file where you guide Brian through the absurd gauntlet of modern life -- from high school pop quizzes to existential confrontations with mortality itself. Instead of choosing a class, Brian's identity emerges from the cards he collects: go full Athlete and bench-press your problems, become a Crypto Chud who literally buys victory, or stack Guilt as a Jewish Mother archetype until enemies destroy themselves from shame. Each run spans 30 "days" representing ages 14 through 50+, with the humor escalating from observational comedy to surreal philosophical horror. It is Slay the Spire meets a quarter-life crisis.

### Core Loop
```
┌─────────────────────────────────────────────────────────────┐
│                        DAY START                            │
│         (View map, see encounters, check deck)              │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
┌─────────────────────────────────────────────────────────────┐
│                     MAP NAVIGATION                          │
│         (Choose path: combat / event / shop / rest)         │
└───────────────┬─────────────────────────────────────────────┘
                │
      ┌─────────┼──────────┬───────────┐
      v         v          v           v
  [COMBAT]   [EVENT]    [SHOP]     [REST]
  Play cards  Make a     Buy/sell   Heal HP
  Beat enemy  choice     Upgrade    Upgrade
      │         │          │        a card
      v         v          v           │
┌─────────────────────────────────────────────────────────────┐
│                    REWARD SCREEN                            │
│     (Pick 1 of 3 cards, collect XP/Money/Rep)              │
└───────────────┬─────────────────────────────────────────────┘
                │
                v  (repeat for remaining nodes)
┌─────────────────────────────────────────────────────────────┐
│                      DAY END                                │
│         Investment screen: spend XP, Money, Rep             │
│         Level up, buy relics, unlock archetypes             │
│         Brian ages, milestone checks                        │
└───────────────┬─────────────────────────────────────────────┘
                │
                v
          [NEXT DAY]  ───────>  (loop)
```

### What Makes This Different from Slay the Spire
1. **No class selection.** Brian starts neutral. Your archetype emerges organically from card choices. The game detects your build and offers themed content accordingly.
2. **Life narrative arc.** Each run tells the story of a life. Day 1 is high school; Day 30 is confronting mortality. Enemies shift from "Pop Quiz" to "The Person You Could Have Been." The comedy-to-existential-dread pipeline IS the game.
3. **10 archetypes, not 4.** With 2000+ archetype cards plus cross-archetype synergies, the build space is enormous. Athlete/DJ "Mosh Pit" plays completely differently from Nerd/Jew "Neurotic Intellectual."
4. **Meta-progression across days within a run.** XP upgrades, relics, and reputation unlocks persist between days. A single run IS the roguelike loop (30 days), not a single combat.
5. **Humor as a design pillar.** Every card has flavor text. Every enemy has a comedy premise. The game is funny first, mechanically deep second.

### Target Audience
Players who enjoy Slay the Spire, Balatro, Inscryption, and dry/absurdist humor. Ages 20-40 (the demographic that relates to Brian's life stages). Browser-game-friendly: no install, shareable via URL, playable in a lunch break or a 90-minute session.

### Tone and Humor Style
Dry, self-deprecating, observational. Think Monty Python meets millennial burnout memes. The game earnestly empathizes with Brian while finding the comedy in universal experiences. Later stages become genuinely moving (the final boss "The Person Brian Could Have Been" can end with "You did okay") while remaining structurally absurd.

---

## 2. COMPLETE GAME FLOW

### What Happens Across a Full Run

**Day 1 (Age 14) -- Tutorial:** Brian wakes up. The game introduces combat via a Pop Quiz encounter. Only basic attack/block cards. No shop. No events. Inner monologue explains mechanics. After the single encounter, Brian receives a card reward (3 choices, all from different archetypes -- this is the first identity-shaping moment). Day ends with minimal investment options (first XP upgrade available).

**Day 5 (Age 18) -- Boss Day:** Brian faces "Final Exam Week" or "The Principal." By now the player has 15-20 cards, likely "Dabbling" in 1-2 archetypes. The boss drops a guaranteed Rare card and a relic choice. Defeating the boss unlocks the Social stage.

**Day 15 (Age 29) -- Mid-Game Peak:** Brian has 25-35 cards. Likely "Committed" (6+ cards) in one archetype and "Dabbling" in a second. Cross-archetype cards are appearing. Relics are shaping strategy. The player has made meaningful investment choices. Career-stage enemies test whether the build can handle complex mechanics (Living Spreadsheet, Unnecessary Meeting).

**Day 25 (Age 39) -- Late Game:** Brian is "Specialized" or "Master" in his primary archetype. The deck is refined (cards have been removed and upgraded). Enemies are abstract concepts (Nostalgia, The Concept of Mortality). The tone has shifted from comedy to comedy-horror. The player is executing a refined strategy.

**Day 30 (Age 50) -- Final Boss:** "The Person Brian Could Have Been" (500 HP, mirrors your build as its inverse). Multiple endings possible: defeat it, survive 20 turns for peaceful ending, or accept the "merge" offer. Defeating it unlocks Prestige and Endless mode.

### A Typical 60-90 Minute Run
- Days 1-5 (School): ~15 minutes. Learning, building foundation.
- Days 6-12 (Social): ~20 minutes. Build takes shape, encounters get interesting.
- Days 13-20 (Career): ~20 minutes. Peak complexity, hardest decisions.
- Days 21-30 (Late Game): ~25 minutes. Payoff, narrative climax, final boss.

### Win Condition
Survive all 30 days and defeat the final boss of the Late Game/Existential stage.

### Lose Condition
Brian's HP hits 0 during any encounter. The day ends immediately with partial rewards (50% of accumulated XP/Money/Rep for that day). Brian's permanent progression (level, relics, unlocks) is preserved. The run continues from the next day -- Brian does not die permanently. However, losing 3 days total triggers "Brian's Breakdown" (a penalty: -5 max HP permanent until prestige). Losing 5 days ends the run entirely.

### What "Losing a Day" Means Mechanically
- Current encounter ends immediately
- Brian receives 50% of rewards accumulated so far that day
- No card reward from the failed encounter
- No remaining encounters or shops for that day
- Brian heals to full HP for the next day (fresh start)
- A "Bad Day" counter increments (3 = permanent debuff, 5 = game over)
- Narrative text: Brian's inner monologue reflects on the failure with self-deprecating humor

---

## 3. THE DAY STRUCTURE (Detailed)

### Encounters Per Day
- **Normal days:** 5 nodes total (see Map System below for composition)
- **Boss days (every 5th day):** 6 nodes, with the final node always being the boss

### Day Difficulty Scaling Formula
```javascript
function scaleStat(baseStat, dayNumber) {
  return Math.floor(baseStat * (1 + 0.08 * dayNumber));
}
// Day 1: x1.08 | Day 10: x1.80 | Day 20: x2.60 | Day 30: x3.40
```

Additional scaling: enemy pattern lengths increase in later stages (more complex AI), and elite encounter frequency rises from 20% on Day 1 to 40% by Day 25.

### Boss Days vs Normal Days

| Day | Type | Stage Transition |
|-----|------|-----------------|
| 5 | Boss (School) | Unlocks Social stage |
| 10 | Boss (Social) | -- |
| 12 | Boss (Social) | Unlocks Career stage |
| 15 | Boss (Career) | -- |
| 20 | Boss (Career) | Unlocks Late Game stage |
| 25 | Boss (Late Game) | -- |
| 30 | FINAL BOSS | Unlocks Prestige / Endless |

---

## 4. MAP SYSTEM

### Branching Path Map (Slay the Spire Style)

Each day presents a branching map with 4 rows of nodes. The player starts at the bottom and must reach the top, choosing one node per row.

```
   DAY 7 — Brian is 20 (Social Stage)
   ═══════════════════════════════════

   Row 4:  [ELITE]────[EVENT]────[SHOP]
              \         / \        /
   Row 3:  [COMBAT]──[COMBAT]──[REST]
              \       / \       /
   Row 2:  [EVENT]───[COMBAT]──[COMBAT]
              \       / \       /
   Row 1:  [COMBAT]──[COMBAT]──[EVENT]
                  \    |    /
                 [START]
```

### Node Types and Icons

| Node Type | Icon | Frequency | Description |
|-----------|------|-----------|-------------|
| Combat (Normal) | Crossed swords | 40% | Standard encounter from current stage pool |
| Combat (Elite) | Flaming skull | 12% | Harder encounter, better rewards |
| Event | Question mark (?) | 20% | Non-combat choice encounter |
| Shop | Dollar sign ($) | 12% | Buy cards, remove cards, upgrade cards |
| Rest | Campfire | 10% | Heal 30% HP OR upgrade a card |
| Boss | Crown | Fixed (final row on boss days) | Stage boss encounter |
| Unknown | Spiral (?) | 6% | Random: could be any of the above |

### Map Generation Rules
1. Row 1 always has 3 nodes
2. Rows 2-3 have 3 nodes each
3. Row 4 has 3 nodes (or 4 on boss days, with boss as mandatory final node)
4. At least 1 combat node per row
5. At least 1 shop per day
6. At least 1 event per day (except Day 1)
7. Rest nodes appear starting Day 3
8. Each node connects to 1-2 nodes in the row above (no dead ends)
9. Boss node on boss days connects from ALL row 3 nodes (mandatory)

### How the Player Chooses
The player clicks a node to navigate to it. Connected paths are highlighted. Once a node is visited, the row is complete and the next row's choices appear. This gives the player 3-4 meaningful path decisions per day.

---

## 5. BUILD EMERGENCE (No Class Selection)

### Starting Deck (Exact Cards)
Every run begins with exactly 10 cards:
- 4x **Basic Punch** (1 energy, Deal 6 damage) -- Neutral, Common
- 3x **Basic Block** (1 energy, Gain 5 Block) -- Neutral, Common
- 1x **Procrastinate** (0 energy, Draw 1 card, Gain 1 Block) -- Neutral, Common
- 1x **Awkward Wave** (1 energy, Deal 6 damage) -- Neutral, Common
- 1x **Deep Breath** (0 energy, Gain 1 Energy) -- Neutral, Common

### Card Reward Pool Logic
After each combat encounter, Brian chooses 1 of 3 offered cards (or skips):

```javascript
function generateCardRewards(brian) {
  const deckArchetypes = countArchetypesInDeck(brian.deck);
  const cards = [];

  // Card 1: Weighted toward existing archetypes (build commitment)
  if (deckArchetypes.length > 0) {
    cards.push(randomCardFrom(weightedByExisting(deckArchetypes)));
  } else {
    cards.push(randomCardFrom(allArchetypes));
  }

  // Card 2: Any archetype (discovery)
  cards.push(randomCardFrom(allArchetypes));

  // Card 3: Least-used archetype OR Neutral (pivot option)
  const leastUsed = getLeastUsedArchetype(deckArchetypes);
  if (Math.random() < 0.4) {
    cards.push(randomNeutralCard());
  } else {
    cards.push(randomCardFrom(leastUsed));
  }

  // Cross-archetype cards if eligible (3+ cards from BOTH archetypes)
  const eligibleCross = getCrossArchetypeCards(deckArchetypes);
  if (eligibleCross.length > 0 && Math.random() < 0.25) {
    cards[1] = randomFrom(eligibleCross);
  }

  return cards;
}
```

### Rarity in Rewards (Scaling by Day and Source)

| Source | Common | Uncommon | Rare | Legendary | Mythic |
|--------|--------|----------|------|-----------|--------|
| Normal (Day 1-5) | 70% | 25% | 5% | 0% | 0% |
| Normal (Day 6-15) | 50% | 35% | 12% | 3% | 0% |
| Normal (Day 16+) | 30% | 40% | 22% | 7% | 1% |
| Elite | 20% | 35% | 30% | 13% | 2% |
| Boss | 0% | 20% | 40% | 30% | 10% |
| Shop | 40% | 30% | 20% | 8% | 2% |

### Archetype Identity Thresholds and Passive Bonuses

| Cards in Deck | Status | Bonus |
|---------------|--------|-------|
| 3+ of one archetype | "Dabbling" | No mechanical bonus. Visual indicator: archetype icon appears on deck screen |
| 6+ of one archetype | "Committed" | Unlock archetype passive trigger (e.g., Athlete "Gains" -- at 10+ Strength, gain 5 Block/turn) |
| 10+ of one archetype | "Specialized" | Archetype-specific relics appear in shops |
| 15+ of one archetype | "Master" | All cards of that archetype cost 1 less (minimum 0) |
| 6+ of TWO archetypes | "Hybrid" | Cross-archetype cards appear 2x more frequently in rewards |

### How the Game Teaches Players About Archetypes
1. **Day 1 card reward:** All 3 offered cards are from different archetypes. Each card's border color matches its archetype. Tooltip shows "Athlete archetype -- Builds Strength for escalating damage."
2. **Day 2-3:** Card rewards begin weighting toward the archetype the player already picked. The inner monologue says things like "Brian's been going to the gym... maybe more of that?" when Athlete cards are offered.
3. **Day 4+:** When "Dabbling" threshold is reached, a brief popup: "Brian is Dabbling in [Archetype]! Collect 3 more to unlock the [Passive Name]."
4. **Archetype color coding** on all cards, relics, and UI elements ensures visual clarity without explicit class selection.

### Cross-Archetype Card Eligibility
Cross-archetype cards (60 total, covering all viable two-archetype pairs) only appear in card rewards and shops if Brian has 3+ cards from BOTH required archetypes. This ensures the player has intentionally invested before cross-archetype options open up.

---

## 6. COMPLETE META-PROGRESSION SYSTEM

### What Persists Between Days
- Level (from XP)
- Money balance
- Reputation balance
- Purchased permanent upgrades (Vitality, Endurance, etc.)
- Unlocked archetypes
- Relics (passive items)
- Starting deck modifications (cards added/removed permanently)
- Life milestones achieved
- Unlocked stages
- Bad Day counter

### What Resets Each Day
- HP (healed to max)
- All combat status effects
- Combat-only currencies (Cash, Combo, Followers, etc.)
- Hand/draw/discard piles
- Encounter progress
- Shop inventory (fresh each day)

### XP System and Level-Ups
Level N requires N x 100 XP to reach (Level 2 = 200 XP, Level 10 = 1000 XP cumulative).

On each level-up, Brian chooses 1 of 3 offered cards from his unlocked archetype pools. This is a primary deckbuilding vector alongside post-combat rewards.

### XP Upgrades (Permanent Stat Increases)

| Upgrade | Cost (per level) | Max Level | Effect per Level |
|---------|-----------------|-----------|-----------------|
| Vitality | 50 / 100 / 200 / 400 | 4 | +5 Max HP |
| Endurance | 100 / 300 | 2 | +1 Max Energy |
| Quick Learner | 75 / 150 / 300 | 3 | +1 Card Draw per turn |
| Thick Skin | 60 / 120 / 240 | 3 | Start combat with 3/6/10 Block |
| Fast Start | 80 / 160 | 2 | Draw 1/2 extra cards on turn 1 |
| Archetype Unlock | 100 each | 9 | Unlock one archetype's card pool |
| Deck Mastery | 150 / 300 / 500 | 3 | Card rewards offer 4/5/6 choices instead of 3 |

### Money Spending Between Days

| Item | Cost | Effect |
|------|------|--------|
| Remove a Card | $60 | Remove one card from deck permanently |
| Upgrade a Card | $100 | Enhance one card (see Upgrade System) |
| Card Pack (Archetype) | $75 | Add a random card from unlocked archetype |
| Card Pack (Rare) | $150 | Add a random Rare card from unlocked archetypes |
| Relic Slot Expansion | $200 | Carry 4 relics instead of 3 (one-time) |

### Reputation Unlocks

| Unlock | Rep Cost | Effect |
|--------|----------|--------|
| Networking | 30 | +10% XP from all encounters |
| Social Butterfly | 60 | Shops have 1 additional card for sale |
| Relationship Events | 80 | Unlock special high-reward event encounters |
| Prestige Contacts | 120 | Rare cards appear more often in rewards |
| Inner Circle | 200 | Elite encounters drop double rewards |
| Legacy | 500 | Unlock Prestige mode |

### Life Stages and Mechanical Effects

| Age Range | Stage | Day Range | Unlock Trigger | Mechanical Change |
|-----------|-------|-----------|----------------|-------------------|
| 14-18 | School | 1-5 | Start of game | Base stats. 1 archetype unlocked (Athlete). |
| 16 | -- | Day 3 | Milestone | Car-related encounters and travel events available |
| 18 | -- | Day 5 | Beat School Boss | Social stage encounters. Druggie archetype access. |
| 19-25 | Social | 6-12 | -- | Party/dating encounter pool. 2nd archetype slot encouraged. |
| 21 | -- | Day 8 | Milestone | Bar encounters. Druggie/DJ archetype cards more common. |
| 25 | -- | Day 12 | Beat Social Boss | Career stage. Money generation +50%. |
| 26-35 | Career | 13-20 | -- | Workplace encounters. Cross-archetype cards appear. |
| 30 | -- | Day 17 | Milestone | +1 permanent Energy. Quarter-Life Crisis preview boss. |
| 35 | -- | Day 20 | Beat Career Boss | Late Game stage. All archetypes unlocked. |
| 36-50 | Late Game | 21-30 | -- | Existential encounters. Max HP starts slowly decreasing (-1/day). |
| 40 | -- | Day 25 | Milestone | Prestige system hint. "Brian feels old." |
| 50 | -- | Day 30 | Beat Final Boss | Endless mode. Prestige available. |

---

## 7. RELIC SYSTEM (Detailed)

### How Relics Work
Relics are passive items that provide permanent bonuses during combat. They are displayed in the top bar of every screen. Hovering shows a tooltip with the relic's effect. Relics persist across days within a run.

### Relic Slots
- Default: 3 slots
- Expandable to 4 with the $200 "Relic Slot Expansion" purchase
- Expandable to 5 via Prestige level 3

### When You Get Relics
- **Boss kill:** Choose 1 of 3 boss relics (guaranteed)
- **Day-end relic shop:** 2-3 relics available for purchase each day (rotating)
- **Events:** Some events grant relics as rewards
- **Achievement unlocks:** Specific relics tied to achievements

### Full Relic List (50 Relics)

#### Starter Relics (Choose 1 at game start on Day 1)
These gently nudge toward an archetype without locking you in.

| # | Relic | Effect | Archetype Hint |
|---|-------|--------|----------------|
| 1 | Gym Membership Card | Start each combat with 2 Strength | Athlete |
| 2 | Battered Controller | Start each combat: apply 2 Poison to enemy | Gamer |
| 3 | Vintage Turntable | Start combat with 1 random Common Record | Hipster |
| 4 | Aux Cable | Draw 1 extra card on turn 1 | DJ |
| 5 | Hardware Wallet | Start each combat with 8 Cash | Crypto Chud |
| 6 | Library Card (Gold) | Start each combat with 2 Insight | Nerd |
| 7 | Rolling Papers | Start each combat with 2 High | Druggie |
| 8 | Cracked Phone Screen | Start each combat with 3 Followers | Influencer |
| 9 | Chef's Knife | Start each combat with 3 Flavor | Chef |
| 10 | Guilt Complex | Start each combat: apply 2 Guilt to enemy | Jew |

#### General Relics (Purchasable / Event Drops)

| # | Relic | Cost | Effect |
|---|-------|------|--------|
| 11 | Coffee Mug | $100 | +1 Energy on turn 1 only |
| 12 | Podcast Subscription | $100 | +1 Card Draw each turn |
| 13 | Noise-Canceling Headphones | $150 | All debuffs applied to Brian are 1 stack weaker |
| 14 | Therapist's Card | $200 | Heal 3 HP at end of each combat |
| 15 | Emergency Savings | $200 | If HP drops below 10, heal 15 HP once per combat |
| 16 | Lucky Penny | $100 | 15% chance to draw an extra card each turn |
| 17 | Weighted Blanket | $180 | Start each combat with 8 Block |
| 18 | Spite | $120 | When Brian takes unblocked damage, apply 1 Guilt to attacker |
| 19 | Comfort Hoodie | $80 | Heal 2 HP at the start of each turn |
| 20 | Meal Prep Containers | $130 | Start combat with 3 Flavor |
| 21 | External Monitor | $100 | +2 Insight at start of combat |
| 22 | Pill Organizer | $150 | Withdrawal deals 0 damage and does not reduce Energy |
| 23 | Trust Fund | $250 | Start each combat with 10 Cash |
| 24 | Participation Trophy | $80 | Gain 2 Rep per encounter (even if you lose) |
| 25 | Stress Ball | $100 | The first card played each turn costs 0 |
| 26 | Expired Coupon | $60 | All shop prices reduced by 15% |
| 27 | Dead Phone | $120 | Immune to the first debuff each combat |
| 28 | Duct Tape | $90 | Start each combat with 5 Block; gain 2 Block each time you play a 0-cost card |
| 29 | Broken Clock | $110 | Twice per combat, gain 1 extra Energy at start of turn (triggers on turns 1 and 5) |
| 30 | Fortune Cookie | $70 | At the start of each combat, see the enemy's next 3 intents |

#### Archetype Relics (Only appear in shops when "Specialized" -- 10+ cards in archetype)

| # | Relic | Cost | Archetype | Effect |
|---|-------|------|-----------|--------|
| 31 | Championship Belt | $200 | Athlete | Strength cannot be reduced below 2 |
| 32 | RGB Keyboard | $180 | Gamer | Poison applied is increased by 1 (all sources) |
| 33 | First Pressing (Signed) | $220 | Hipster | Records trigger twice at end of turn |
| 34 | Gold-Plated Headphones | $200 | DJ | Combo does not reset between turns; instead decays by 2 |
| 35 | Cold Wallet | $250 | Crypto Chud | Cash conversion rate is 40% instead of 20% |
| 36 | PhD Certificate | $200 | Nerd | At 5+ Insight, draw 2 extra cards instead of choosing draws |
| 37 | Medical Marijuana Card | $180 | Druggie | High decays by 1 every other turn instead of every turn |
| 38 | Verified Badge | $220 | Influencer | Follower thresholds reduced by 5 (5+ for Block, 15+ for Draw, 25+ for Damage) |
| 39 | Michelin Guide | $200 | Chef | Flavor max increased to 30. Flavor heals 2 HP per stack at 20+ |
| 40 | Ancestral Guilt | $180 | Jew | Guilt thresholds reduced by 3 (7+ for damage reduction, 17+ for attack skipping) |

#### Boss Relics (Choose 1 of 3 after defeating a boss)

| # | Relic | Boss Source | Effect |
|---|-------|------------|--------|
| 41 | Diploma | School Boss | +5 Max HP. Card rewards offer 1 extra choice. |
| 42 | Fake ID | Social Boss | Once per day, re-roll a card reward (see 3 new cards). |
| 43 | Corner Office Key | Career Boss | +1 Max Energy permanently. |
| 44 | Reading Glasses | Late Game Boss | All card upgrades grant an additional +1 to their primary effect. |
| 45 | Philosopher's Stone | Existential Boss | At the start of each combat, choose 1 of 3 random buffs (3 Strength, 5 Block, 2 Energy). |

#### Event-Only Relics (Cannot be purchased)

| # | Relic | Source Event | Effect |
|---|-------|-------------|--------|
| 46 | Brian's Journal | "Quiet Moment" event | Track all cards played this run. At 500+, gain +1 to all stats permanently. |
| 47 | Dog-Eared Novel | "Bookstore" event | Once per combat, when hand is empty, draw 3 cards. |
| 48 | Friendship Bracelet | "Old Friend" event | Heal 5 HP at the start of each day. |
| 49 | Faded Photograph | "Nostalgia" event | Starter deck cards deal +3 damage and grant +3 block. |
| 50 | "You Did Okay" Note | Beat final boss peacefully (20-turn survive) | All damage taken reduced by 1. All damage dealt increased by 1. |

---

## 8. EVENT SYSTEM

### How Events Work
Events are non-combat encounters that present Brian with a narrative scenario and 2-3 choices. Each choice has different mechanical outcomes. Events appear as "?" nodes on the map.

### 25 Events

**Event 1: The Fortune Teller**
- Stage: Any
- Narrative: "A woman with too many rings and not enough evidence beckons from a purple tent."
- Choice A: "Hear your fortune" -- See the next 3 encounters on the map (reveals Unknown nodes). Costs $10.
- Choice B: "This is nonsense" -- Gain 5 Rep (self-confidence). Leave.
- Choice C: "Ask about love" -- 50% chance: gain a random Influencer card. 50% chance: gain "Heartbreak" curse card (0 cost, unplayable, sits in hand for 3 combats).

**Event 2: Found a Wallet**
- Stage: Any
- Narrative: "There's a wallet on the ground. It has $50 in it. There's a driver's license. The photo looks sad."
- Choice A: "Keep it" -- Gain $50. Lose 10 Rep.
- Choice B: "Return it" -- Gain 15 Rep. The owner gives you a random Uncommon card.
- Choice C: "Take the cash, mail the wallet" -- Gain $30. No Rep change.

**Event 3: Gym Bro Encounter**
- Stage: School/Social
- Narrative: "A massive human being approaches you in the gym. 'Bro. You need a spot?' He is not asking."
- Choice A: "Accept the spot" -- Gain a random Athlete card. Take 3 damage (he pushed you too hard).
- Choice B: "Decline politely" -- Gain 5 Block for next combat.
- Choice C: "Challenge him to arm wrestling" -- If you have 3+ Athlete cards: win, gain "Gym Buddy" relic (start combat with 1 Strength). Otherwise: lose, take 8 damage.

**Event 4: Dumpster Behind the Record Store**
- Stage: Any
- Narrative: "There are crates of vinyl records in the dumpster. Some look valuable. Most look terrible."
- Choice A: "Dig through them" -- Gain 2 random Hipster cards. One of them might be cursed (20% chance of "Scratched Record" -- 0 cost, unplayable junk).
- Choice B: "Walk away" -- Gain 3 Rep. "Brian has standards."
- If 5+ Hipster cards: Choice C appears: "Curate carefully" -- Choose 1 of 3 Hipster cards (guaranteed Uncommon+).

**Event 5: The Therapist**
- Stage: Social/Career/Late Game
- Narrative: "The waiting room smells like lavender and student loan dread. 'How are you feeling, Brian?'"
- Choice A: "I'm fine" -- Remove 1 random debuff-inflicting card from your deck.
- Choice B: "Actually, terrible" -- Heal 20 HP. Gain 1 random Neutral card.
- Choice C: "Can we talk about my mother?" -- If Jew archetype 3+: remove 2 cards from deck. Otherwise: gain a Guilt Trip card.

**Event 6: Suspicious Email**
- Stage: Career/Late Game
- Narrative: "'Congratulations! You've won!' Brian's finger hovers over the link."
- Choice A: "Click it" -- 40% chance: gain $100 and a random Rare card. 60% chance: lose $30 and add 2 "Malware" curse cards to deck (unplayable, clutter).
- Choice B: "Mark as spam" -- Nothing happens. "Brian makes a responsible decision for once."
- Choice C: "Forward to IT" -- Gain 5 Rep. If Nerd archetype 3+: gain a random Nerd card.

**Event 7: Street Performer**
- Stage: Any
- Narrative: "He's playing guitar badly but with immense confidence. The case has $3 in it."
- Choice A: "Tip generously" ($15) -- Gain a random DJ or Hipster card (Uncommon+).
- Choice B: "Heckle" -- Gain 3 Rep. Take 5 damage (he threw the guitar).
- Choice C: "Join in" -- If DJ archetype 3+: gain "Street Cred" (temporary relic: +2 Combo at start of combat for 3 combats). Otherwise: lose 5 Rep.

**Event 8: Quiet Moment**
- Stage: Late Game/Existential
- Narrative: "Brian sits on a park bench. Nobody needs anything from him. The sun is warm. He breathes."
- Choice A: "Just sit" -- Heal to full HP. "Sometimes the bravest thing is doing nothing."
- Choice B: "Think about life" -- Gain "Brian's Journal" event relic.
- Choice C: "Call someone" -- Heal 10 HP. Gain 10 Rep. "It was a good call."

**Event 9: Yard Sale**
- Stage: Any
- Narrative: "Everything is $1. The selection is... eclectic."
- Effect: See 5 random Common cards from any archetype. Buy any number for $5 each. Leave when done.

**Event 10: Old Friend**
- Stage: Social/Career
- Narrative: "Brian! Is that you? It's [random name]! From [random life stage]! You look... exactly the same. That's not a compliment."
- Choice A: "Catch up" -- Gain 10 Rep. Gain "Friendship Bracelet" event relic (if not already owned).
- Choice B: "Pretend you don't see them" -- Gain $15 (saved on buying them a drink). Lose 5 Rep.
- Choice C: "Invite them along" -- Next 3 combats: gain 3 Block at start of each turn (friend is helping).

**Event 11: The Bookstore**
- Stage: Any
- Narrative: "It smells like old paper and poor financial decisions. Brian could spend hours here."
- Choice A: "Browse self-help" -- Remove 1 card from deck. Gain 2 Insight for next combat.
- Choice B: "Browse fiction" -- Gain "Dog-Eared Novel" event relic (if not owned). Otherwise gain a random Nerd card.
- Choice C: "Buy a cookbook" -- If Chef archetype 3+: gain a random Rare Chef card. Otherwise: gain a random Common Chef card.

**Event 12: Food Truck**
- Stage: Any
- Narrative: "The line is 45 minutes long. It had better be worth it."
- Choice A: "Wait in line" -- Heal 15 HP. Gain 2 Flavor for next combat. Costs $10.
- Choice B: "Skip it" -- Gain 1 Energy for next combat (saved time).
- Choice C: "Start a food truck" -- If Chef archetype 6+: Gain $50 and a random Rare Chef card. Otherwise: lose $20 (the permits alone...).

**Event 13: Online Argument**
- Stage: Any
- Narrative: "Someone is wrong on the internet. Brian has opinions."
- Choice A: "Engage" -- Gain 3 random cards from any archetype. Take 5 damage (stress).
- Choice B: "Touch grass" -- Heal 10 HP. "Brian makes a healthy choice."
- Choice C: "Subtweet" -- If Influencer archetype 3+: gain 5 Followers for next combat. Otherwise: lose 3 Rep.

**Event 14: Crypto Conference**
- Stage: Career/Late Game
- Narrative: "Free snacks. Free t-shirts. Free advice that will cost you everything."
- Choice A: "Attend a panel" -- Gain a random Crypto Chud card.
- Choice B: "Network" -- Gain $30 and 5 Rep.
- Choice C: "Invest" ($50) -- 50% chance: gain $150. 50% chance: lose your $50. "It's not gambling if you call it investing."

**Event 15: Nostalgia Trap**
- Stage: Late Game/Existential
- Narrative: "Brian finds a box of old things. Report cards. Photos. A letter he never sent."
- Choice A: "Open it" -- Gain "Faded Photograph" event relic (if not owned). Take 5 damage (emotional).
- Choice B: "Throw it away" -- Remove 2 cards from deck (letting go).
- Choice C: "Read the letter" -- Gain 15 Rep. "It was beautiful, Brian."

**Event 16: The Deal**
- Stage: Any
- Narrative: "A figure in a trench coat opens it to reveal... relics."
- Effect: Choose 1 of 3 random relics at a 30% discount. Or leave.

**Event 17: Abandoned Arcade**
- Stage: Social/Career
- Narrative: "The machines still work. One of them has Brian's initials at #1 from 15 years ago."
- Choice A: "Play" -- If Gamer archetype 3+: gain a random Rare Gamer card. Otherwise: gain a random Common Gamer card.
- Choice B: "Smash the machine" -- Gain 5 Rep. "Brian is processing something."
- Choice C: "Try to beat your old score" -- Gain $10. If Gamer archetype 6+: also gain a Legendary Gamer card.

**Event 18: Wedding Invitation**
- Stage: Social/Career/Late Game
- Narrative: "You barely know these people. The RSVP deadline was last week."
- Choice A: "Attend" (costs $20) -- Gain 15 Rep. Heal 10 HP (the food was good).
- Choice B: "Decline" -- Gain $20 (gift money saved). Lose 5 Rep.
- Choice C: "Go to the open bar" -- Gain a random Druggie card. Take 3 damage. Gain 5 Rep.

**Event 19: Mysterious Stranger**
- Stage: Any (after Day 10)
- Narrative: "He looks like Brian but older. Or younger. Or sideways. 'I have something for you.'"
- Choice A: "Accept" -- Transform a random card in your deck into its upgraded version.
- Choice B: "Refuse" -- Gain 10 Block for next combat. "Trust nobody, not even yourself."
- Choice C: "Ask who he is" -- He says nothing and gives you a random relic. Then vanishes.

**Event 20: The Dream**
- Stage: Late Game/Existential
- Narrative: "Brian dreams he can fly. Then he dreams he's at work. Then he dreams he's flying at work."
- Choice A: "Lucid dream" -- Choose any card from your entire unlocked pool to add to your deck.
- Choice B: "Wake up" -- Gain 1 Energy permanently. "Brian is well-rested for once."
- Choice C: "Stay in the dream" -- Heal to full HP. But lose 1 card draw permanently (reality is hazy).

**Event 21: Tax Season**
- Stage: Career/Late Game
- Narrative: "It's that time of year. Brian has a shoebox full of receipts."
- Choice A: "Do taxes honestly" -- Lose $30. Gain 10 Rep.
- Choice B: "Get creative with deductions" -- Gain $50. 30% chance: encounter "Tax Audit" as next combat.
- Choice C: "Hire an accountant" -- Lose $50. Remove 1 "junk" card from deck if any exist.

**Event 22: Garage Sale of the Damned**
- Stage: Late Game/Existential
- Narrative: "The items for sale include: a sense of purpose, lost time, the feeling you get when you remember something embarrassing."
- Choice A: "Buy a sense of purpose" ($30) -- Gain a random Legendary card.
- Choice B: "Buy lost time" ($20) -- Skip the next encounter on the map (auto-win, no rewards).
- Choice C: "Sell something" -- Remove a card from your deck. Gain $20 per rarity tier (Common $20, Uncommon $40, Rare $60).

**Event 23: Brian's Birthday**
- Triggers automatically on milestone age days (18, 21, 25, 30, 40, 50)
- Narrative: "Happy birthday, Brian. You are now [age]. This is fine."
- Effect: Heal to full HP. Gain $20 x (age / 10) as birthday money. Gain 1 card from a special "birthday" pool (fun, slightly overpowered cards with flavor text about aging).

**Event 24: The Crossroads**
- Stage: Any (after Day 15, once per run)
- Narrative: "Two paths diverge. One is well-lit and boring. One is dark and interesting."
- Choice A: "Well-lit path" -- Next 3 days: all encounters are 20% easier. No Elite encounters.
- Choice B: "Dark path" -- Next 3 days: all encounters are 20% harder. But all rewards are doubled.
- Choice C: "Sit down at the crossroads" -- Gain a cross-archetype card of your choice (from eligible pairs).

**Event 25: The Mirror**
- Stage: Existential (Day 25+)
- Narrative: "Brian looks in the mirror and the mirror looks back. It seems disappointed."
- Choice A: "Accept yourself" -- Permanently remove all "junk" and "curse" cards from your deck. Heal 10 HP.
- Choice B: "Break the mirror" -- Gain 7 years bad luck (next 7 encounters: enemies have +1 Strength). But gain a Mythic card.
- Choice C: "Wink" -- Brian winks at himself. Gain 10 Rep. "Confidence is a hell of a drug."

---

## 9. CARD UPGRADE SYSTEM

### How Upgrades Work Mechanically
Any card can be upgraded exactly once. Upgraded cards display a "+" suffix (e.g., "Punch" becomes "Punch+") and have a golden glow border effect.

### Upgrade Rules by Card Type

| Card Type | Upgrade Effect |
|-----------|---------------|
| Attack (deals X damage) | +3 damage |
| Multi-hit attack (X damage, N times) | +1 extra hit |
| Block (gain X Block) | +3 Block |
| Status application (apply X Poison/Guilt/etc.) | +1 stack |
| Draw cards (draw X) | +1 draw |
| Heal (heal X) | +3 heal |
| 0-cost cards | Gain an additional minor effect (+2 Block, or Draw 1, or +1 to keyword) |
| Exhaust cards | Keep Exhaust; add "Draw 1 card" or +2 to primary effect |
| Cost 2+ cards | -1 cost OR the standard upgrade for the card type (player chooses) |
| Power/engine cards (ongoing effects) | +1 to the ongoing value |

### Where You Can Upgrade
1. **Shop** (during map navigation): $100 per upgrade (between-day shop: also $100)
2. **Rest nodes**: Choose between Heal 30% HP OR Upgrade 1 card
3. **Events**: Several events offer upgrades as rewards
4. **Boss relics**: "Reading Glasses" relic makes all upgrades grant +1 additional to primary effect
5. **Day-end investment screen**: $100 per upgrade

### Visual Indicator of Upgraded Cards
- Card name appended with "+"
- Border color shifts from archetype color to a gold-tinted version
- A subtle shimmer animation on the card art area
- Upgraded stats shown in gold text instead of white

---

## 10. PRESTIGE / NEW GAME+ SYSTEM

### What Triggers Prestige
Defeating the Day 30 final boss ("The Person Brian Could Have Been" or "Mortality" depending on which encounter set is used) AND having accumulated 500+ Rep. The option appears on the victory screen.

### What Carries Over
- All unlocked archetypes
- Relic slot expansions
- 1 chosen relic (player picks their favorite to keep)
- All Reputation unlocks
- Achievement progress

### What Resets
- Day counter (back to Day 1)
- Level and XP (back to 0)
- Money (back to 0)
- Deck (back to starter deck)
- All other relics
- Life stage (back to School)
- Bad Day counter

### Prestige Bonuses

| Prestige Level | Bonus | Difficulty Modifier |
|----------------|-------|-------------------|
| Star I | "Wisdom I": +2 to all base stats (HP, Block, etc.) | Enemies: +10% HP, +1 Strength |
| Star II | "Wisdom II": +4 to all base stats. Start with 2 archetype unlocks. | Enemies: +20% HP, +2 Strength |
| Star III | "Wisdom III": +6 to all base stats. 5 relic slots. Start with $50. | Enemies: +35% HP, +3 Strength, new attack patterns |
| Star IV | "Wisdom IV": +8 to all base stats. Keep 2 relics. Card rewards offer Rare+ on Day 1. | Enemies: +50% HP, +4 Strength, elite frequency +50% |
| Star V | "Wisdom V": +10 to all base stats. Keep 3 relics. Start with 2 extra cards of choice. | Enemies: +75% HP, +5 Strength, bosses have new phases |

### Unique NG+ Content
- **Prestige-only encounters:** "Brian From a Parallel Universe" (copies your deck), "The Algorithm" (tracks your most-played card type), "Time Itself" (plays its pattern forward and backward simultaneously)
- **Prestige-only events:** "The Crossroads" upgrades to "The Multiverse" (choose from 5 paths instead of 3). "Mysterious Stranger" guarantees a Legendary relic.
- **Prestige-only relics:** "Scar Tissue" (start each combat with 1 Resilience per prestige level), "Hindsight" (see all enemy intents for the entire combat)
- **Prestige-only cards:** 10 "Mastery" cards (1 per archetype) that are extremely powerful but only available at Prestige 3+

---

## 11. TUTORIAL / ONBOARDING

### First Run Experience (Day 1)

**Before Combat:**
Inner monologue (displayed as typewriter text at top of screen):
> "Brian is 14. Brian has a backpack, a vague sense of dread, and absolutely no idea what he's doing. So... pretty standard."

The game shows the map with only 1 node available (a Combat node). Tutorial tooltip: "Click a node to travel there."

**During First Combat (Pop Quiz):**
- Turn 1: "These are your cards. Each costs Energy (the circles in the top-left corner). You have 3 Energy per turn. Click a card to play it." -- Only attack cards are highlighted.
- After playing first attack: "Nice. The enemy lost HP. Now play a Block card to protect yourself." -- Block cards highlighted.
- End of Turn 1: "Click 'End Turn' when you're done. The enemy will act next." -- End Turn button pulses.
- Enemy turn: "The enemy is attacking for 8. Your Block absorbs it first. Anything left over hits your HP."
- Turn 2: No new prompts. Let player experiment.
- Turn 3+: No prompts. Full freedom.

**After First Combat:**
"You won! Pick a card to add to your deck. Each card belongs to an archetype -- hover to learn more."
- Tooltip on each offered card explains the archetype briefly.
- Skip button tooltip: "You don't HAVE to take a card. Sometimes a lean deck is better."

### Gradual System Unlocking

| Day | New System Introduced | Tutorial Text |
|-----|----------------------|---------------|
| 1 | Combat only | "Just survive, Brian." |
| 2 | Card rewards, 2nd combat encounter | "Pick wisely. Or don't. Brian rarely does." |
| 3 | Shop nodes appear on map | "Money can solve most problems. Not Brian's, but most." |
| 4 | Event nodes appear | "Life is full of choices. Most of Brian's are bad." |
| 5 | Rest nodes, Boss encounter, Day-end investment | "The first boss. Brian is not ready. Brian is never ready." |
| 6 | Archetype passives (if threshold met) | "Brian is becoming something. The game isn't sure what yet." |
| 8 | Card upgrades available | "Cards can be improved. Unlike Brian's posture." |
| 10 | Cross-archetype cards | "Two archetypes? Bold. Confused, but bold." |
| 15 | Relic shop at day-end | "Relics are permanent. Like regret, but useful." |

---

## 12. UI/UX DESIGN

### Complete Screen Layouts

#### Title Screen
```
+═══════════════════════════════════════════════════════+
║                                                       ║
║            ╔══════════════════════════╗                ║
║            ║    LIFE OF BRIAN         ║                ║
║            ║   A Deckbuilding Life    ║                ║
║            ╚══════════════════════════╝                ║
║                                                       ║
║              [  🧠  ASCII Brian  🧠  ]               ║
║                                                       ║
║              [    NEW  GAME    ]                       ║
║              [    CONTINUE     ]                       ║
║              [   COLLECTION    ]                       ║
║              [   STATISTICS    ]                       ║
║              [    SETTINGS     ]                       ║
║                                                       ║
║         Best Run: Day 22  |  Prestige: ★★             ║
║                                                       ║
║   "He's not the messiah, he's a very naughty boy."    ║
+═══════════════════════════════════════════════════════+
```

#### Map Screen (Day Start)
```
+═══════════════════════════════════════════════════════+
║ Day 7 — Brian is 20 (Social)   HP: 65/65   $120     ║
║ Relics: [☕][🎮][💿]   Level: 5   Energy: 3         ║
+═══════════════════════════════════════════════════════+
║                                                       ║
║  Row 4:   [💀 ELITE]────[? EVENT]────[$ SHOP]        ║
║               \          / \          /               ║
║  Row 3:   [⚔ COMBAT]──[⚔ COMBAT]──[🔥 REST]        ║
║               \        / \        /                   ║
║  Row 2:   [? EVENT]───[⚔ COMBAT]──[⚔ COMBAT]        ║
║               \        / \        /                   ║
║  Row 1:   [⚔ COMBAT]──[⚔ COMBAT]──[? EVENT]         ║
║                   \     |     /                       ║
║                    [ ▶ START ]                        ║
║                                                       ║
║  [View Deck (24 cards)]  [View Relics]  [Stats]      ║
+═══════════════════════════════════════════════════════+
```

#### Combat Screen (Main Gameplay)
```
+═══════════════════════════════════════════════════════+
║ Day 7 | Turn 3 | Pop Quiz                            ║
║ Relics: [☕][🎮][💿]                                ║
+═══════════════════════════════════════════════════════+
║                                                       ║
║               ┌──────────────────┐                    ║
║               │   POP QUIZ  📝  │                    ║
║               │ HP: [████░░] 24/40                   ║
║               │ Block: 5 🛡️                          ║
║               │ Intent: ⚔ Attack 8                   ║
║               │ Status: ☠️3  😰1                     ║
║               └──────────────────┘                    ║
║                                                       ║
║  ─────────────────────────────────────────────────    ║
║                                                       ║
║  Brian  HP: [████████░░] 42/50   Block: 5 🛡️        ║
║  Energy: ●●○ (2/3)   Strength: 2  Combo: 3          ║
║                                                       ║
║  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      ║
║  │①    │ │①    │ │②    │ │⓪    │ │①    │      ║
║  │Punch │ │Block │ │Heavy │ │Deep  │ │Gamer │      ║
║  │      │ │      │ │ Bag  │ │Breath│ │Fuel  │      ║
║  │6 dmg │ │5 blk │ │12dmg │ │+1 nrg│ │6 blk │      ║
║  │      │ │      │ │      │ │      │ │+1 psn│      ║
║  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      ║
║                                                       ║
║  Draw: 12  Discard: 5  Exhaust: 1    [END TURN]     ║
+═══════════════════════════════════════════════════════+
```

#### Card Visual Layout
```
┌─────────────────────┐
│ ①        UNCOMMON   │  ← Energy cost (circle), Rarity label
│                     │
│    [ EMOJI ART ]    │  ← Archetype-colored background
│    [   AREA    ]    │     with large emoji as "art"
│                     │
│  ──── PUNCH+ ────   │  ← Card name (+ if upgraded)
│                     │
│  Deal 9 damage.     │  ← Effect text
│                     │
│  "The foundation    │  ← Flavor text (italic, gray)
│   of every great    │
│   man: violence."   │
│                     │
│  ⚔ ATHLETE         │  ← Archetype tag and icon
└─────────────────────┘

Border colors by archetype:
  Athlete:    #e74c3c (red)
  Gamer:      #2ecc71 (green)
  Hipster:    #9b59b6 (purple)
  DJ:         #f39c12 (orange)
  Crypto:     #f1c40f (gold)
  Nerd:       #3498db (blue)
  Druggie:    #1abc9c (teal)
  Influencer: #e91e63 (pink)
  Chef:       #ff5722 (deep orange)
  Jew:        #607d8b (blue-gray)
  Neutral:    #95a5a6 (gray)

Rarity border styles:
  Common:     solid 1px
  Uncommon:   solid 2px
  Rare:       solid 2px + subtle glow
  Legendary:  solid 3px + pulsing glow
  Mythic:     double border + rainbow shimmer animation
```

#### Reward Screen
```
+═══════════════════════════════════════════════════════+
║              ENCOUNTER COMPLETE!                      ║
║                                                       ║
║      Rewards: +15 XP   +$20   +5 Rep                ║
║                                                       ║
║      Choose a card to add to your deck:              ║
║                                                       ║
║   ┌──────────┐  ┌──────────┐  ┌──────────┐          ║
║   │ Warm Up  │  │ Toxic DM │  │ Curate   │          ║
║   │ Athlete  │  │  Gamer   │  │ Hipster  │          ║
║   │ 1E: +2   │  │ 1E: 4psn│  │ 1E: Draw │          ║
║   │ Strength │  │          │  │  2, Disc │          ║
║   │          │  │          │  │  1       │          ║
║   └──────────┘  └──────────┘  └──────────┘          ║
║                                                       ║
║              [  SKIP  ]                              ║
║                                                       ║
║  "Decisions, decisions. Brian is bad at these."      ║
+═══════════════════════════════════════════════════════+
```

#### Shop Screen
```
+═══════════════════════════════════════════════════════+
║  BRIAN'S CORNER STORE              Money: $120       ║
+═══════════════════════════════════════════════════════+
║                                                       ║
║  CARDS FOR SALE:                                     ║
║  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       ║
║  │Punch+  │ │Podcast │ │Weed    │ │Side    │       ║
║  │$50     │ │$35     │ │$75     │ │Hustle  │       ║
║  │        │ │        │ │        │ │$40     │       ║
║  └────────┘ └────────┘ └────────┘ └────────┘       ║
║                                                       ║
║  SERVICES:                                           ║
║  [ Remove a Card — $60 ]                             ║
║  [ Upgrade a Card — $100 ]                           ║
║  [ Heal 30% HP — $30 ]                              ║
║                                                       ║
║                   [ LEAVE SHOP ]                     ║
+═══════════════════════════════════════════════════════+
```

#### Day-End Investment Screen
```
+═══════════════════════════════════════════════════════+
║  END OF DAY 7 — Brian is 20                          ║
+═══════════════════════════════════════════════════════+
║  Today's Earnings:  XP: 85  $210  Rep: 45           ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  LEVEL UP! (5 → 6)  Choose a card:                   ║
║  [Protein Shake]  [Bug Exploit]  [Knife Skills]      ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║  XP UPGRADES:                    Available: 340 XP   ║
║  [+5 Max HP — 100 XP]  [+1 Draw — 150 XP]          ║
║  [Unlock Chef — 100 XP]                             ║
╠═══════════════════════════════════════════════════════╣
║  MONEY SHOP:                     Available: $210     ║
║  [Remove Card — $60]  [Upgrade Card — $100]         ║
║  [Relic: Coffee Mug — $100]                         ║
╠═══════════════════════════════════════════════════════╣
║  REP UNLOCKS:                    Available: 120 Rep  ║
║  [Prestige Contacts — 120 Rep] ← AFFORDABLE         ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║                  [ NEXT DAY → ]                      ║
+═══════════════════════════════════════════════════════+
```

### Combat Animations (CSS-only)
- **Card play:** Card slides from hand to center, scales up briefly, then fades. 300ms transition.
- **Damage dealt:** Enemy shakes (CSS `transform: translate` keyframe, 100ms). Red flash overlay. Floating "-X" number rises and fades.
- **Block gained:** Blue pulse on Brian's HP bar. "+X" in blue floats up.
- **Healing:** Green pulse. "+X" in green floats up.
- **Status applied:** Icon bounces into status bar area. Brief scale-up animation.
- **Card draw:** Cards slide in from the left (draw pile area) to hand. 200ms stagger between cards.
- **End turn:** Hand cards slide down and fade. Enemy intent resolves. Brief pause, then new turn draws.

### Tooltip System
- Hover over any card: enlarged card view appears above cursor
- Hover over status icons: tooltip with name, current stacks, and description
- Hover over relics: tooltip with name and full effect
- Hover over draw/discard/exhaust pile counts: full list of cards in that pile
- Hover over enemy intent: description of what the enemy will do
- Tooltips appear after 200ms delay, dismiss immediately on mouseout
- Mobile: long-press to show tooltip, tap elsewhere to dismiss

### Responsive Design
- Desktop (1200px+): Full 3-column layout for investment screen, wide card hand
- Tablet (768-1199px): 2-column investment, cards slightly smaller
- Mobile (below 768px): Single column, cards as horizontal scrollable strip, combat UI stacked vertically
- Card hand on mobile: horizontal scroll with snap-to-card behavior
- Enemy area fixed at top, hand at bottom, status in middle

---

## 13. AUDIO DESIGN (Stretch Goal)

### Web Audio API Implementation
All sounds generated procedurally via Web Audio API oscillators. No external audio files needed.

### Sound Effect Triggers

| Action | Sound Description | Implementation |
|--------|------------------|----------------|
| Card play | Short "whoosh" + click | White noise burst (50ms) + square wave blip (1200Hz, 30ms) |
| Card draw | Soft "shff" | Filtered white noise (100ms, low-pass at 2000Hz) |
| Damage dealt | Impact "thud" | Sine wave (80Hz, 100ms) + noise burst |
| Damage taken | "Oof" thud + lower tone | Sine wave (60Hz, 150ms) + descending pitch |
| Block gained | Metallic "clink" | Square wave (2000Hz, 50ms) + harmonic at 4000Hz |
| Heal | Rising chime | Ascending sine sweep (400Hz to 800Hz, 200ms) |
| Status applied | Bubble "bloop" | Sine wave (600Hz, 100ms) with quick pitch bend |
| Turn end | Low "whomp" | Triangle wave (200Hz, 200ms, fade out) |
| Level up | Triumphant ascending tones | Three ascending sine notes (C5, E5, G5, 100ms each) |
| Enemy death | Descending crash | White noise (300ms) with descending filter sweep |
| Card upgrade | Sparkle | Three rapid high sine notes (1000-2000-3000Hz, 50ms each) |
| Boss appear | Ominous low drone | Sawtooth wave (50Hz, 1000ms, slow volume ramp) |

### Music Concept
Procedural lo-fi background: a looping pattern of soft sine wave "notes" following a simple chord progression (Am - F - C - G), with random note timing variation. Volume very low. Different chord progressions per life stage:
- School: Major key, faster tempo
- Social: Minor key, medium tempo
- Career: Diminished chords, steady rhythm
- Late Game: Sparse, slow, lots of silence between notes
- Existential: Single sustained note with overtones

Toggle on/off via Settings.

---

## 14. SAVE SYSTEM

### What Gets Saved
The entire `GameState.permanent` object plus `GameState.day` metadata:
- Brian's level, XP, Money, Rep
- All purchased upgrades
- All unlocked archetypes
- All relics
- Starting deck modifications
- Current day number and life stage
- Map state (which nodes visited this day)
- Current deck composition
- Milestones and achievements
- Prestige level
- Bad Day counter
- Statistics (see section 15)
- Settings (volume, animation speed)

Combat state is NOT saved. If the player closes mid-combat, they restart the current encounter when they return.

### Auto-Save Triggers
- At the start of each day (before map is shown)
- After each encounter completion (reward collected)
- After each shop visit
- After each investment/day-end screen interaction
- When navigating to a new map node

### Export/Import (Shareable Save Codes)
```javascript
function exportSave() {
  const state = getSaveableState();
  const json = JSON.stringify(state);
  const compressed = btoa(json); // Base64 encode
  return compressed;
}

function importSave(code) {
  try {
    const json = atob(code); // Base64 decode
    const state = JSON.parse(json);
    if (validateSave(state)) {
      loadState(state);
      return true;
    }
  } catch (e) { return false; }
}
```

The Settings screen has "Export Save" (copies code to clipboard) and "Import Save" (paste code into text input) buttons. Save codes are shareable URLs: `#save=BASE64STRING` appended to the game URL.

### Save Slots
3 save slots. The title screen shows:
```
[ Slot 1: Brian, Day 14, Level 8, Athlete/Gamer, ★★ ]
[ Slot 2: Brian, Day 3, Level 2, (New Run)           ]
[ Slot 3: Empty — New Game                            ]
```

---

## 15. STATISTICS AND ACHIEVEMENT SYSTEM

### Statistics Tracked

| Category | Stats |
|----------|-------|
| Run Stats | Days survived, Encounters won, Encounters lost, Cards played, Damage dealt, Damage taken, HP healed, Money earned, Money spent, Cards collected, Cards removed |
| Combat Stats | Most damage in one turn, Most damage in one card, Most cards played in one turn, Most Poison applied, Most Guilt stacked, Highest Combo, Most Followers, Highest Cash, Most records simultaneously |
| Meta Stats | Total runs, Total days across all runs, Total prestige levels, Total achievements, Total unique cards seen, Total relics collected |
| Per-Archetype | Cards collected (per archetype), Times "Committed" threshold reached, Times "Master" threshold reached |

### Achievement List (30 Achievements)

| # | Achievement | Condition | Reward |
|---|------------|-----------|--------|
| 1 | First Day | Complete Day 1 | Unlock "Participation Trophy" relic in shop |
| 2 | Graduate | Complete School stage (Day 5 boss) | +5 starting Money on future runs |
| 3 | Adulting | Complete Social stage (Day 12 boss) | Unlock "Comfort Hoodie" relic |
| 4 | Career Day | Complete Career stage (Day 20 boss) | +1 card reward choice permanently |
| 5 | Over the Hill | Reach Late Game stage (Day 21) | Unlock "Reading Glasses" relic |
| 6 | The Full Brian | Complete a run (Day 30 boss) | Unlock Prestige mode |
| 7 | Specialist | Reach "Master" (15+ cards) in any archetype | Unlock that archetype's Mastery card |
| 8 | Renaissance Man | Have 6+ cards in 3+ archetypes simultaneously | Unlock "Jack of All Trades" relic |
| 9 | Poison Master | Apply 50+ Poison in a single combat | Unlock "Toxic Avenger" card |
| 10 | Guilt Trip Champion | Stack 30+ Guilt on a single enemy | Unlock "Ancestral Guilt" relic |
| 11 | Swole | Reach 15+ Strength in a single combat | Unlock "Championship Belt" relic |
| 12 | Viral | Reach 40+ Followers in a single combat | Unlock "Verified Badge" relic |
| 13 | To The Moon | Accumulate 50+ Cash in a single combat | Unlock "Cold Wallet" relic |
| 14 | Combo Breaker | Reach Combo 10+ in a single turn | Unlock "Gold-Plated Headphones" relic |
| 15 | Full Discography | Have 5 Records simultaneously | Unlock "First Pressing" relic |
| 16 | Beautiful Mind | Reach 10+ Insight | Unlock "PhD Certificate" relic |
| 17 | Ego Death | Reach 10+ High | Unlock "Medical Marijuana Card" relic |
| 18 | Chef's Kiss | Reach 20 Flavor | Unlock "Michelin Guide" relic |
| 19 | Speed Run | Complete Day 1-5 in under 15 minutes | Unlock "Aux Cable" relic |
| 20 | Pacifist (Almost) | Win an encounter by only using status effects (0 direct damage cards played) | "Passive Aggressive" title |
| 21 | Glass Cannon | Win an encounter with 1 HP remaining | "Lucky" title |
| 22 | Overkill | Deal 100+ damage in a single turn | "Brian Smash" title |
| 23 | Minimalist | Win an encounter with 10 or fewer cards in deck | "Less is More" title |
| 24 | Hoarder | Have 40+ cards in deck | "More is More" title |
| 25 | You Did Okay | Beat the final boss via the peaceful 20-turn survive method | Unlock "You Did Okay" event relic |
| 26 | The Merge | Accept the merge offer from the final boss | Unique "Merged Brian" card for future runs |
| 27 | Prestige I-V | Reach each prestige level (5 achievements) | Star icons on title screen |
| 28 | Completionist | See all 70 encounters at least once | "Been There" title |
| 29 | Cardographer | Collect all 200 cards from at least one archetype | "Collector" title |
| 30 | Brian | Reach Prestige V and complete a full run | Secret ending screen |

### Stats Screen Layout
```
+═══════════════════════════════════════════════════════+
║  BRIAN'S STATISTICS                                   ║
+═══════════════════════════════════════════════════════+
║  CURRENT RUN:              ALL TIME:                  ║
║  Day: 14                   Total Runs: 7              ║
║  Level: 8                  Total Days: 142            ║
║  Encounters Won: 38        Encounters Won: 234        ║
║  Cards Played: 412         Prestige: ★★              ║
║  Damage Dealt: 2,847       Achievements: 14/30        ║
║  Money Earned: $1,240                                 ║
║                                                       ║
║  RECORDS:                                             ║
║  Most Damage (1 turn): 67                             ║
║  Most Cards (1 turn): 11                              ║
║  Highest Combo: 8                                     ║
║  Most Poison Applied: 34                              ║
║                                                       ║
║  ARCHETYPES:                                          ║
║  Athlete: ████████░░ 42 cards collected              ║
║  Gamer:   ██████░░░░ 31 cards collected              ║
║  Hipster: ██░░░░░░░░ 12 cards collected              ║
║  ...                                                  ║
+═══════════════════════════════════════════════════════+
```

### Brian's Journal (Narrative Run Log)
A scrollable log that records key events in narrative form:
- "Day 1: Brian faced a Pop Quiz and survived. Barely."
- "Day 3: Brian picked up a guitar. He's terrible at it. (Acquired: Beatmatch)"
- "Day 7: Brian lost to The Landlord. The deposit is gone."
- "Day 15: Brian became a Committed Athlete. His muscles have muscles."
- "Day 22: Brian confronted his Receding Hairline. He accepted it. (Gained 8 Rep)"

Each entry is generated from game events with template strings and humor.

---

## 16. BALANCE FRAMEWORK

### Damage Curve by Day

| Day | Expected Player Damage/Turn | Expected Enemy HP | Expected Enemy Damage/Turn | Expected Player HP |
|-----|---------------------------|-------------------|---------------------------|-------------------|
| 1 | 8-12 | 30-45 | 6-10 | 50 |
| 5 | 15-22 | 60-120 (boss) | 10-15 | 55-65 |
| 10 | 25-35 | 80-160 (boss) | 14-20 | 65-75 |
| 15 | 35-50 | 100-220 (boss) | 18-28 | 70-85 |
| 20 | 45-70 | 130-250 (boss) | 22-35 | 75-95 |
| 25 | 60-100 | 160-350 (boss) | 28-45 | 80-100 |
| 30 | 80-150 | 200-500 (final) | 35-60 | 85-110 |

### Expected Player Power Curve
- **Days 1-5:** Linear growth. Adding 1-2 archetype cards per day. Starter deck dominant.
- **Days 6-12:** Exponential ramp. Archetype keywords activate. Synergies emerge. Starter cards being removed.
- **Days 13-20:** Peak growth rate. Cross-archetype cards online. Relics compounding. 25-35 card deck.
- **Days 21-30:** Plateau with optimization. Removing weak cards, upgrading key cards. Power comes from deck quality, not quantity.

### Key Balance Levers (Tuning Dials)

| Lever | Current Value | What It Controls |
|-------|--------------|-----------------|
| `ENEMY_HP_SCALE_PER_DAY` | 0.08 (8%) | How quickly enemies get tougher |
| `CARD_REWARD_COUNT` | 3 | Number of card choices after combat |
| `SHOP_CARD_COUNT` | 4 | Number of cards for sale in shops |
| `SHOP_CARD_COST_MULTIPLIER` | 1.0 | How expensive shop cards are |
| `XP_PER_LEVEL_SCALE` | 100 per level | How fast Brian levels up |
| `STARTING_HP` | 50 | Brian's base HP |
| `STARTING_ENERGY` | 3 | Brian's base energy per turn |
| `STARTING_DRAW` | 5 | Cards drawn per turn |
| `ARCHETYPE_THRESHOLD_COMMITTED` | 6 | Cards needed for passive unlock |
| `ARCHETYPE_THRESHOLD_MASTER` | 15 | Cards needed for cost reduction |
| `RARITY_WEIGHTS` | [70,25,5,0,0] for Day 1 | How common each rarity is |
| `REST_HEAL_PERCENT` | 0.30 | How much rest nodes heal |
| `SHOP_UPGRADE_COST` | 100 | Cost to upgrade a card |
| `SHOP_REMOVE_COST` | 60 | Cost to remove a card |

### How to Tune Without Redesigning Cards
1. Adjust `ENEMY_HP_SCALE_PER_DAY` up/down by 0.01 increments. This is the single most impactful lever.
2. Modify rarity weight tables to shift how quickly players access powerful cards.
3. Adjust shop prices to control deck quality velocity.
4. Modify archetype thresholds to make passives easier/harder to unlock.
5. Adjust XP-per-level to control upgrade pacing.
6. Change base enemy stats in the encounter data without touching card data.
7. Modify the `scaleStat` function to use a different curve (linear, logarithmic, etc.).

---

## 17. TECHNICAL ARCHITECTURE

### File Structure Within Single HTML
```
brian.html
├── <!DOCTYPE html>
├── <html>
├── <head>
│   ├── <meta> tags (charset, viewport)
│   ├── <title>Life of Brian</title>
│   ├── <link rel="icon"> (data URI favicon)
│   └── <style> ──────────── ~1200 lines CSS
│       ├── Reset & base styles
│       ├── Title screen styles
│       ├── Map screen styles
│       ├── Combat screen styles
│       ├── Card component styles
│       ├── Shop/reward/investment screen styles
│       ├── Tooltip styles
│       ├── Animation keyframes
│       └── Responsive media queries
├── <body>
│   └── <div id="app"> ──── ~300 lines HTML shell
│       ├── <div id="screen-title">
│       ├── <div id="screen-map">
│       ├── <div id="screen-combat">
│       ├── <div id="screen-reward">
│       ├── <div id="screen-shop">
│       ├── <div id="screen-event">
│       ├── <div id="screen-rest">
│       ├── <div id="screen-invest">
│       ├── <div id="screen-stats">
│       ├── <div id="screen-settings">
│       ├── <div id="screen-collection">
│       ├── <div id="tooltip-container">
│       └── <div id="overlay-container">
└── <script> ────────────── ~8000-10000 lines JS
    ├── // ═══ SECTION 1: CONSTANTS ═══ (~2500 lines)
    │   ├── CARD_DATA[]           (all 2000+ cards as objects)
    │   ├── ENCOUNTER_DATA[]      (all 70 encounters)
    │   ├── RELIC_DATA[]          (all 50 relics)
    │   ├── EVENT_DATA[]          (all 25 events)
    │   ├── UPGRADE_DATA[]        (XP upgrade definitions)
    │   ├── ACHIEVEMENT_DATA[]    (all 30 achievements)
    │   └── BALANCE_CONSTANTS     (all tuning knobs)
    │
    ├── // ═══ SECTION 2: GAME STATE ═══ (~100 lines)
    │   └── GameState = { ... }
    │
    ├── // ═══ SECTION 3: SAVE SYSTEM ═══ (~150 lines)
    │   ├── save()
    │   ├── load()
    │   ├── exportSave()
    │   ├── importSave()
    │   └── validateSave()
    │
    ├── // ═══ SECTION 4: COMBAT ENGINE ═══ (~1500 lines)
    │   ├── startCombat(encounterId)
    │   ├── startPlayerTurn()
    │   ├── playCard(cardIndex)
    │   ├── resolveCardEffect(card)
    │   ├── endPlayerTurn()
    │   ├── executeEnemyTurn()
    │   ├── resolveEnemyIntent(intent)
    │   ├── dealDamage(target, amount, source)
    │   ├── gainBlock(target, amount)
    │   ├── applyStatus(target, status, stacks)
    │   ├── tickStatuses()
    │   ├── checkCombatEnd()
    │   └── endCombat(result)
    │
    ├── // ═══ SECTION 5: CARD SYSTEM ═══ (~600 lines)
    │   ├── drawCards(count)
    │   ├── discardCard(cardIndex)
    │   ├── exhaustCard(cardIndex)
    │   ├── shuffleDiscardIntoDraw()
    │   ├── addCardToDeck(cardId)
    │   ├── removeCardFromDeck(cardIndex)
    │   ├── upgradeCard(cardIndex)
    │   ├── generateCardRewards()
    │   └── getEligibleCards(filters)
    │
    ├── // ═══ SECTION 6: MAP SYSTEM ═══ (~400 lines)
    │   ├── generateMap(dayNumber, stage)
    │   ├── navigateToNode(nodeIndex)
    │   ├── getConnectedNodes(nodeIndex)
    │   └── renderMap()
    │
    ├── // ═══ SECTION 7: ENCOUNTER SYSTEM ═══ (~500 lines)
    │   ├── getEnemyIntent(enemy)
    │   ├── advanceEnemyPattern(enemy)
    │   ├── resolveSpecialMechanic(enemy, trigger)
    │   ├── spawnMinion(minionDef)
    │   └── scaleEncounter(encounter, dayNumber)
    │
    ├── // ═══ SECTION 8: SHOP & INVESTMENT ═══ (~400 lines)
    │   ├── generateShopInventory()
    │   ├── buyCard(shopIndex)
    │   ├── buyRelic(relicId)
    │   ├── purchaseUpgrade(upgradeId)
    │   ├── spendRep(unlockId)
    │   └── levelUp()
    │
    ├── // ═══ SECTION 9: EVENT SYSTEM ═══ (~300 lines)
    │   ├── triggerEvent(eventId)
    │   ├── resolveEventChoice(eventId, choiceIndex)
    │   └── getAvailableEvents(stage)
    │
    ├── // ═══ SECTION 10: META PROGRESSION ═══ (~300 lines)
    │   ├── startDay()
    │   ├── endDay()
    │   ├── checkMilestones()
    │   ├── checkAchievements()
    │   ├── advanceLifeStage()
    │   ├── applyPrestige()
    │   └── updateStatistics()
    │
    ├── // ═══ SECTION 11: RELIC SYSTEM ═══ (~250 lines)
    │   ├── applyRelicEffects(trigger)
    │   ├── checkRelicConditions()
    │   └── gainRelic(relicId)
    │
    ├── // ═══ SECTION 12: RENDERER ═══ (~1500 lines)
    │   ├── render()
    │   ├── renderTitle()
    │   ├── renderMap()
    │   ├── renderCombat()
    │   ├── renderReward()
    │   ├── renderShop()
    │   ├── renderEvent()
    │   ├── renderRest()
    │   ├── renderInvest()
    │   ├── renderStats()
    │   ├── renderCard(card, container)
    │   ├── renderEnemy(enemy)
    │   ├── renderStatusBar()
    │   ├── renderTooltip(target, content)
    │   └── renderJournal()
    │
    ├── // ═══ SECTION 13: ANIMATION QUEUE ═══ (~200 lines)
    │   ├── queueAnimation(type, data)
    │   ├── processAnimationQueue()
    │   ├── animateCardPlay(cardEl)
    │   ├── animateDamage(targetEl, amount)
    │   ├── animateHeal(targetEl, amount)
    │   └── animateFloat(text, x, y, color)
    │
    ├── // ═══ SECTION 14: AUDIO (optional) ═══ (~200 lines)
    │   ├── initAudio()
    │   ├── playSound(soundId)
    │   └── Sound definitions
    │
    └── // ═══ SECTION 15: INIT ═══ (~100 lines)
        ├── document.addEventListener('DOMContentLoaded', init)
        ├── init()
        ├── setupEventListeners()
        └── checkForSave()
```

### Complete Game State Object
```javascript
const GameState = {
  version: "1.0.0",
  saveSlot: 0,

  // ── PERMANENT (persists across days within a run) ──
  permanent: {
    brianAge: 14,
    lifeStage: "school",    // school | social | career | lategame | existential
    totalDaysPlayed: 0,
    badDayCount: 0,
    level: 1,
    xpTotal: 0,
    xpToNextLevel: 100,
    moneyTotal: 0,
    repTotal: 0,
    maxHP: 50,
    maxEnergy: 3,
    startingDraw: 5,
    relics: [],              // Array of relic IDs
    relicSlots: 3,
    unlockedArchetypes: ["athlete"],
    unlockedStages: ["school"],
    purchasedUpgrades: {},   // { upgradeId: level }
    repUnlocks: [],          // Array of unlock IDs
    startingDeckMods: {
      added: [],             // Card IDs added permanently
      removed: [],           // Card IDs removed permanently
      upgraded: [],          // Card IDs that start upgraded
    },
    milestones: [],          // Completed milestone IDs
    achievements: [],        // Completed achievement IDs
    prestigeLevel: 0,
    prestigeBonuses: {},
    journal: [],             // Array of { day, text } entries
    statistics: {
      encountersWon: 0,
      encountersLost: 0,
      cardsPlayed: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      totalHPHealed: 0,
      totalMoneyEarned: 0,
      totalMoneySpent: 0,
      totalCardsCollected: 0,
      totalCardsRemoved: 0,
      mostDamageOneTurn: 0,
      mostDamageOneCard: 0,
      mostCardsOneTurn: 0,
      highestPoison: 0,
      highestGuilt: 0,
      highestCombo: 0,
      highestFollowers: 0,
      highestCash: 0,
      highestInsight: 0,
      highestStrength: 0,
      highestFlavor: 0,
      highestHigh: 0,
      mostRecords: 0,
      encountersSeen: {},    // { encounterId: timesDefeated }
      cardsSeen: {},         // { cardId: true }
      archetypeCards: {},    // { archetype: count }
    },
  },

  // ── CURRENT DAY (reset each day start) ──
  day: {
    number: 0,
    map: {
      nodes: [],             // Array of { id, row, type, encounter?, connections[], visited }
      currentNode: null,
    },
    deck: [],                // Array of card objects (full deck for this day)
    rewardsToday: { xp: 0, money: 0, rep: 0 },
    shopInventory: null,
    eventsTriggered: [],
    encounterResults: [],    // Array of { encounterId, result, rewards }
  },

  // ── COMBAT (active during encounter only) ──
  combat: {
    active: false,
    phase: "idle",           // idle | playerTurn | enemyTurn | animating | reward | gameover
    turn: 0,
    brian: {
      hp: 50,
      maxHp: 50,
      energy: 3,
      maxEnergy: 3,
      block: 0,
      statuses: {
        strength: 0,
        dexterity: 0,
        vigor: 0,
        regen: 0,
        thorns: 0,
        fortify: 0,
        retain: 0,
        focus: 0,
        momentum: 0,
        dodge: 0,
        lifesteal: 0,
        intangible: 0,
        rage: 0,
        platedArmor: 0,
        resilience: 0,
        amplify: 0,
        enrage: 0,
        // Debuffs
        weak: 0,
        vulnerable: 0,
        frail: 0,
        confused: 0,
        burn: 0,
        exhaustion: 0,
        drawDown: 0,
        shame: 0,
        anxiety: 0,
        constrict: 0,
        hex: 0,
        doom: 0,
      },
      // Archetype keywords (active during combat)
      combo: 0,
      cash: 0,
      insight: 0,
      high: 0,
      followers: 0,
      flavor: 0,
      records: [],           // Array of { id, effect, stacks }
    },
    enemies: [{              // Array to support multi-enemy fights
      id: "",
      name: "",
      hp: 0,
      maxHp: 0,
      block: 0,
      intent: null,          // { type, value, count? }
      patternIndex: 0,
      pattern: [],
      statuses: { weak: 0, vulnerable: 0, poison: 0, guilt: 0, slow: 0, mark: 0, bleed: 0 },
      specialState: {},      // Encounter-specific mechanics
      isBoss: false,
      phase: 1,
    }],
    hand: [],                // Array of card objects
    drawPile: [],
    discardPile: [],
    exhaustPile: [],
    cardsPlayedThisTurn: 0,
    cardsPlayedThisCombat: 0,
    cardTypesPlayedThisTurn: [], // For tracking play patterns
    damageDealtThisTurn: 0,
    animationQueue: [],
  },

  // ── UI STATE ──
  ui: {
    screen: "title",         // title | map | combat | reward | shop | event | rest | invest | stats | settings | collection
    selectedCard: null,
    hoveredCard: null,
    tooltipTarget: null,
    animating: false,
    tutorialStep: 0,
    tutorialActive: true,
    settings: {
      animationSpeed: 1.0,   // 0.5x, 1x, 2x
      soundEnabled: true,
      musicEnabled: false,
      showDamageNumbers: true,
      autoEndTurn: false,
    },
  },
};
```

### Render Pipeline
```
User Action (click/hover)
    │
    v
Event Handler (e.g., onCardClick)
    │
    v
State Mutation (modify GameState)
    │
    v
Animation Queue (if visual effects needed)
    │
    v
render() ──> checks GameState.ui.screen
    │
    v
Screen-specific renderer (e.g., renderCombat())
    │
    v
DOM Updates (getElementById, innerHTML, classList)
    │
    v
CSS Transitions trigger automatically
```

The render function is NOT called every frame. It is called explicitly after state mutations. There is no requestAnimationFrame loop unless animations are playing.

### Event System
Simple pub/sub for game events:
```javascript
const Events = {
  listeners: {},
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },
  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data));
  }
};

// Usage:
Events.on('cardPlayed', (data) => { applyRelicEffects('onCardPlayed', data); });
Events.on('damageDealt', (data) => { checkAchievements('damageDealt', data); });
Events.on('turnEnd', (data) => { tickStatuses(); });
```

### Animation Queue
```javascript
const AnimationQueue = {
  queue: [],
  processing: false,

  add(animation) {
    // animation = { type, target, value, duration }
    this.queue.push(animation);
    if (!this.processing) this.process();
  },

  async process() {
    this.processing = true;
    GameState.ui.animating = true;

    while (this.queue.length > 0) {
      const anim = this.queue.shift();
      await this.execute(anim);
    }

    this.processing = false;
    GameState.ui.animating = false;
    render();
  },

  execute(anim) {
    return new Promise(resolve => {
      // Apply CSS class/transform based on anim.type
      // setTimeout(resolve, anim.duration / GameState.ui.settings.animationSpeed)
    });
  }
};
```

### Performance Considerations
1. **Card data:** 2000+ card objects in memory is fine (~500KB). Store as flat array, look up by index. Do NOT create DOM elements for all cards upfront.
2. **DOM updates:** Only update elements that changed. Use `data-` attributes to track which element represents which game object. Avoid `innerHTML` for the entire combat screen on every render.
3. **Hand rendering:** Maximum 10 cards in hand = 10 DOM elements. Reuse elements when possible (update content rather than destroy/recreate).
4. **Map rendering:** Pre-render the map once per day start. Only update visited/highlighted states.
5. **Save compression:** Use `JSON.stringify` with replacer to exclude runtime-only fields. Save is typically 5-15KB.
6. **Tooltips:** Create tooltip element once, reposition and update content on hover. No tooltip creation/destruction per hover.

---

## 18. IMPLEMENTATION PRIORITY

### Phase 1: Playable Prototype (MVP)
**Goal:** One combat encounter, one reward screen, one day. Approximately 2500-3000 lines.

1. HTML shell with all screen divs (hidden by default)
2. CSS for combat screen, card rendering, basic layout
3. `GameState` object (simplified)
4. Starter deck (10 cards)
5. 20 cards total (Athlete 5, Gamer 5, Neutral 10 -- just enough for rewards)
6. 3 encounters (Pop Quiz, Homework Pile, School Bully)
7. Combat state machine (draw, play, end turn, enemy turn)
8. Basic card play (click to play, energy check, resolve effect)
9. Damage resolution (Block absorbs, then HP)
10. Enemy intent display and pattern cycling
11. Poison and Strength as first two keyword systems
12. Card reward screen (pick 1 of 3 after combat)
13. Day structure (3 encounters in sequence)
14. Basic render() function for combat screen
15. Win/lose detection
16. **Estimated: ~2500 lines JS, ~400 lines CSS, ~100 lines HTML**

### Phase 2: Core Systems
**Goal:** Full day loop with map, shop, events. Approximately 2000 additional lines.

17. Map generation and navigation
18. Shop screen (buy cards, remove cards, upgrade)
19. Rest node (heal or upgrade)
20. Event system (5 events to start)
21. Day-end investment screen (XP upgrades)
22. Level-up system
23. All 10 archetype keyword systems
24. 50 cards per archetype (500 total)
25. 15 encounters (3 per stage for first 3 stages)
26. Save/load via localStorage
27. Card upgrade system
28. **Estimated: ~2000 lines JS, ~300 lines CSS**

### Phase 3: Content and Polish
**Goal:** Full game content, animations, balance. Approximately 3000 additional lines.

29. All 2000+ cards loaded from data
30. All 70 encounters
31. All 50 relics
32. All 25 events
33. All 30 achievements
34. Combat animations (card play, damage, heal, status)
35. Floating damage numbers
36. Tooltip system (complete)
37. Prestige system
38. Statistics tracking
39. Brian's Journal
40. Responsive design (mobile support)
41. Tutorial sequence
42. **Estimated: ~3000 lines JS, ~500 lines CSS**

### Phase 4: Stretch Goals
43. Audio system (Web Audio API)
44. Export/import save codes
45. Collection screen (all cards ever seen)
46. Settings screen (animation speed, sound toggle)
47. Endless mode (Day 31+ scaling)
48. Prestige-exclusive content
49. **Estimated: ~1000 lines JS**

### Total Estimated Size
- **HTML:** ~300 lines
- **CSS:** ~1500 lines
- **JS:** ~8500-10000 lines
- **Total single file:** ~10000-12000 lines

---

### Critical Files for Implementation
List of the 5 most critical existing files that an engineer must reference:

- `/Users/myaport/brian-simulator/STATUS_EFFECTS.md` - Defines all combat resources, 10 archetype keywords, all buffs/debuffs, triggered statuses, junk cards, cleansing mechanics, encounter-specific mechanics, build emergence system including starting deck, card reward pool logic, archetype thresholds, and rarity tables. This is the mechanical bible.
- `/Users/myaport/brian-simulator/encounters.md` - Contains all 70 encounters across 6 stages with full HP, patterns, special mechanics, flavor text, and drop tables. This is the complete enemy content reference.
- `/Users/myaport/brian-simulator/GAME_PLAN.md` - Contains the existing game plan with UI layouts, day structure, meta-progression, all 215 original cards (10 archetypes x 20 + 15 neutral), 35 simplified encounters, relic list, hybrid synergies, upgrade system, prestige system, and implementation phasing. This is the structural foundation.
- `/Users/myaport/brian-simulator/cards_athlete_200.md` - Template for the expanded 200-card archetype format (80 Common, 60 Uncommon, 35 Rare, 20 Legendary, 5 Mythic with cost distribution). All `cards_*.md` files follow this pattern and must be ingested as card data.
- `/Users/myaport/brian-simulator/index.html` - The existing 2304-line implementation (appears to be a different game -- a life simulator, not the deckbuilder). Contains CSS patterns, DOM structure conventions, and UI styling that establishes the visual language (dark theme, monospace font, panel-based layout) which the deckbuilder should match.
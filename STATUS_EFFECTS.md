# Brian Simulator — Status Effects & Game Systems

## Core Combat Resources

### Brian's Resources (per encounter)
- **HP** — Brian's health. Starts at max each day. Hits 0 = encounter lost, day ends with partial rewards.
- **Energy** — Spend to play cards. Starts at 3/turn, refills each turn. Can be temporarily increased/decreased.
- **Block** — Absorbs incoming damage. Resets to 0 at start of Brian's turn (unless modified by Fortify).
- **Hand** — Cards drawn each turn. Default: draw 5. Max hand size: 10.

### Enemy Resources
- **HP** — Hits 0 = encounter won.
- **Block** — Absorbs damage, resets each enemy turn.
- **Intent** — Shows what the enemy will do next turn (attack value, buff, debuff, etc.)

---

## Archetype Keywords

These are the 10 core mechanics tied to archetypes. Brian doesn't choose a class — he starts with neutral cards and collects archetype cards as he plays, with his build emerging organically.

| Keyword | Archetype | Type | Behavior |
|---------|-----------|------|----------|
| Strength | Athlete | Buff (Brian) | Each stack adds +1 damage to ALL attack cards. Permanent for encounter. |
| Poison | Gamer | Debuff (Enemy) | Enemy takes damage = stacks at end of their turn. Decays by 1 per tick. |
| Records | Hipster | Mechanic (Brian) | Vinyl records in collection zone (max 5). Each triggers passive effect at end of Brian's turn. Permanent for encounter. |
| Combo | DJ | Counter (Brian) | Resets to 0 each turn. +1 per card played. Cards scale with Combo count. |
| Cash | Crypto Chud | Resource (Brian) | Combat-only currency. Earn and spend via cards. 20% of leftover converts to Money post-combat. |
| Insight | Nerd | Buff (Brian) | Stacking. At 5+, Brian chooses draws instead of random. Permanent for encounter. |
| High | Druggie | Buff (Brian) | +50% damage (multiplicative). Decays by 1 per turn. At 0, triggers Withdrawal. |
| Followers | Influencer | Counter (Brian) | Never decreases in encounter. Thresholds: 10+ = +2 Block/turn, 20+ = +1 draw/turn, 30+ = +3 damage to all attacks. |
| Flavor | Chef | Buff (Brian) | Heals Brian for 1 HP per stack at end of turn. No decay. Max 20 (can be raised). |
| Guilt | Jew | Debuff (Enemy) | Enemy takes damage = stacks at end of their turn. Does NOT decay. Thresholds: 10+ = enemy -20% damage, 20+ = enemy skips every other attack. |

---

## General Buffs (on Brian)

| Status | Icon | Behavior | Duration | Source |
|--------|------|----------|----------|--------|
| Block | 🛡️ | Absorbs incoming damage before HP | Resets each turn | Cards, relics |
| Strength | 💪 | +1 damage per stack to all attacks | Permanent (encounter) | Athlete cards |
| Vigor | ⚡ | Next attack deals +X damage, then consumed | Until used | Various cards |
| Regen | 💚 | Heal X HP at end of turn. Decays by 1/turn | Until 0 | Cards, relics |
| Thorns | 🌹 | Deal X damage back to enemy when Brian takes damage | Permanent (encounter) | Cards, relics |
| Fortify | 🏰 | Retain 50% of Block between turns (rounded down) | X turns | Rare cards |
| Retain | 🤚 | Keep X chosen cards in hand between turns | X turns | Cards |
| Focus | 🎯 | Draw +1 card per turn | X turns | Cards |
| Momentum | 🏃 | All cards cost 1 less this turn (minimum 0) | 1 turn | Cards |
| Dodge | 💨 | X% chance to completely avoid next attack | Until triggered or X turns | Rare cards |
| Lifesteal | 🩸 | Heal for X% of attack damage dealt | X turns | Rare cards |
| Intangible | 👻 | ALL incoming damage reduced to 1 | X turns (usually 1) | Mythic/Legendary only |
| Rage | 🔥 | +X damage to all attacks, but take X damage at end of turn | X turns | Cards |
| Plated Armor | 🔩 | Gain X Block at end of each turn. Lose 1 stack when taking unblocked damage | Until 0 stacks | Relics, rare cards |
| Resilience | 🧱 | Reduce all incoming damage by X (flat reduction, stacks) | Permanent (encounter) | Very rare |
| Dexterity | 🤸 | +X Block from all Block-granting cards | Permanent (encounter) | Cards |
| Amplify | 📢 | Next skill card's effect is doubled | Until used | Cards |
| Enrage | 😤 | Gain 1 Strength each time Brian takes unblocked damage | Permanent (encounter) | Build-around cards |

---

## General Debuffs (on Brian, applied by enemies)

| Status | Icon | Behavior | Duration | Cleanse? |
|--------|------|----------|----------|----------|
| Weak | 😰 | Deal 25% less damage | X turns (decays) | Yes |
| Vulnerable | 😱 | Take 50% more damage | X turns (decays) | Yes |
| Frail | 🦴 | Gain 25% less Block from cards | X turns (decays) | Yes |
| Confused | 😵 | Card costs randomized (0-3) each turn | X turns (decays) | Yes |
| Burn | 🔥 | Take X damage at start of Brian's turn. Does NOT decay. | Until cleansed | Must be cleansed |
| Exhaustion | 😩 | Max Energy -1 per turn | X turns (decays) | Yes |
| Draw Down | 📉 | Draw 1 fewer card per turn | X turns (decays) | Yes |
| Shame | 😳 | Cannot play the same card name twice in one turn | X turns (decays) | Yes |
| Anxiety | 😰 | At end of turn, take 1 damage per unplayed card in hand | X turns (decays) | Yes |
| Daze | 💫 | Daze cards added to hand (0-cost, unplayable, exhaust at end of turn, take up hand space) | Cards persist until exhausted | Remove Daze cards |
| Constrict | 🐍 | Take X damage at end of each turn. Does not decay. | Until encounter ends | Must be cleansed |
| Hex | 🧿 | Whenever Brian plays a card that costs 0, add a Daze to draw pile | X turns (decays) | Yes |
| Entangle | 🌿 | Cannot play attack cards this turn | 1 turn | Auto-expires |
| Silence | 🤐 | Cannot play skill cards this turn | 1 turn | Auto-expires |
| Lock | 🔒 | Cannot play power cards this turn | 1 turn | Auto-expires |
| Doom | 💀 | After X turns, take 99 damage. Counter ticks down each turn. | X turns (countdown) | Can be cleansed to remove |

---

## Debuffs Brian Can Apply to Enemies

| Status | Icon | Behavior | Duration |
|--------|------|----------|----------|
| Weak | 😰 | Enemy deals 25% less damage | X turns (decays) |
| Vulnerable | 😱 | Enemy takes 50% more damage | X turns (decays) |
| Poison | ☠️ | Take damage = stacks, decay by 1/turn | Until 0 |
| Guilt | 😔 | Take damage = stacks, NO decay. Thresholds at 10/20 | Permanent |
| Slow | 🐢 | Enemy loses 1 from all attack values | X turns (decays) |
| Stun | ⭐ | Enemy skips next action entirely | 1 action (consumed) |
| Mark | 🎯 | Next hit deals +X bonus damage, then consumed | Until triggered |
| Disarm | ✋ | Enemy's next attack deals 0 damage | 1 attack (consumed) |
| Shatter | 💥 | Enemy loses ALL current Block | Instant |
| Expose | 👁️ | Enemy takes 1 extra damage from EVERY source for X turns | X turns (decays) |
| Fear | 😨 | Enemy deals 15% less damage, stacks with Weak | X turns (decays) |
| Taunt | 🗯️ | Enemy targets Brian (relevant in multi-enemy fights, forces aggro) | X turns |
| Bleed | 🩸 | Take X damage when enemy attacks. X decays by 1/turn. | Until 0 |
| Confuse | 🌀 | Enemy's next action is randomized from its pattern | 1 action |

---

## Triggered / Conditional Statuses

These trigger when specific conditions are met:

| Status | Trigger | Effect | Source |
|--------|---------|--------|--------|
| Withdrawal | High reaches 0 | -1 Energy next turn, take 3 damage | Druggie keyword |
| Contact High | Play 3+ Druggie cards in 1 turn | Gain 1 High | Passive (if Brian has 5+ Druggie cards in deck) |
| Crowd Energy | Combo reaches 5+ | Deal 2 damage to all enemies at end of turn | DJ passive (if Brian has 5+ DJ cards) |
| Viral | Followers double in 1 turn | All cards gain +2 damage this turn | Influencer passive |
| Umami | Flavor reaches max (20) | Next attack deals double damage, consume 5 Flavor | Chef passive |
| Chosen | Guilt on enemy reaches 30+ | Brian takes 30% less damage | Jew passive |
| Gains | Strength reaches 10+ | Gain 5 Block at start of each turn | Athlete passive |
| Full Stack | Insight reaches 10+ | Draw 1 extra card per turn | Nerd passive |
| Portfolio Growth | End turn with 15+ Cash | Gain 3 Cash at start of next turn | Crypto passive |
| Curated | Have 5 Records | Records trigger effects 50% stronger (rounded up) | Hipster passive |

---

## Junk Cards (Crypto Chud penalty system)

| Card | Cost | Behavior |
|------|------|----------|
| Gas Fee | 0 (Unplayable) | Sits in hand. Cannot be played. If discarded by any effect, Brian takes 2 damage. Exhausts at end of encounter. |
| Rug Pull | 0 (Unplayable) | Sits in hand. At end of turn, exhausts itself and deals 3 damage to Brian. |
| Worthless JPEG | 0 (Unplayable) | Sits in hand. Can be manually exhausted during your turn for 1 Cash. Otherwise clogs hand. |
| Dead Coin | 0 (Unplayable) | Sits in hand. At end of combat, lose 5 Money (meta-resource). Can be exhausted by spending 3 Cash. |
| Audit Notice | 0 (Unplayable) | Added by specific encounters/cards. Sits in hand. After 3 turns, if not removed, lose 10% of all Cash. Exhausted by playing 2 cards costing 2+ in one turn. |

---

## Cleansing and Removal

Debuffs can be removed by:
1. **Artifact** (relic) — prevents next debuff applied
2. **Cleanse cards** — specific cards that remove debuffs (e.g., "Therapy Session", "Foam Roller")
3. **Chicken Soup** (Jew) — removes 1 debuff + heals
4. **Sober Up** (Druggie) — removes all debuffs but sets High to 0
5. **Certain relics** — auto-cleanse at combat start, or cleanse after X turns
6. **Waiting** — most debuffs decay naturally over X turns

---

## Encounter-Specific Mechanics

These are NOT general statuses — they're unique to specific encounters and don't appear elsewhere:

| Mechanic | Encounter | Behavior |
|----------|-----------|----------|
| Detention Counter | Vice Principal | Increases when Brian plays 0-cost cards. At 3: lose a turn. At 5: take 15 damage. |
| Boredom Meter | Unnecessary Meeting | Fills by 1/turn, decreased by cards played. Meeting ends at 10 Boredom. |
| Traffic Level | The Commute | Multiplies enemy attack. Decreased by aggression, increased by passivity. |
| Violation Stacks | HOA | Each reduces Brian's max HP by 3. Removed by playing 0-cost cards. |
| Wistful Stacks | Nostalgia | Brian loses at 15 stacks. Removed by dealing 10+ damage in one card. |
| Progress Bar | Software Update | Enemy powers up at 100%. Race to kill before it finishes. |
| Search History | Google Search History | Reveals embarrassing searches that apply unique debuffs. |
| Difficulty Level | The Years Themselves | All enemy stats scale +1 per level. Increases each turn. |
| Sections | SAT Exam | 4 phases with unique mechanics, destroyed sequentially. |

---

## Build Emergence System (No Class Selection)

Brian does NOT pick an archetype. His build emerges from card choices.

### Starting Deck (10 cards)
- 4x **Basic Punch** (1 cost, deal 6 damage) — Common Neutral
- 3x **Basic Block** (1 cost, gain 5 Block) — Common Neutral
- 1x **Procrastinate** (0 cost, draw 1, gain 1 Block) — Common Neutral
- 1x **Awkward Wave** (1 cost, deal 6 damage) — Common Neutral
- 1x **Deep Breath** (0 cost, gain 1 Energy) — Common Neutral

### Card Reward Pool Logic
After each encounter, Brian chooses 1 of 3 offered cards (or skips):

```
function generateCardRewards(brian) {
  const deckArchetypes = countArchetypesInDeck(brian.deck);
  const cards = [];

  // Card 1: Weighted toward existing archetypes (build commitment)
  if (deckArchetypes.length > 0) {
    cards.push(randomCardFrom(weightedByExisting(deckArchetypes)));
  } else {
    cards.push(randomCardFrom(allArchetypes)); // early game = anything
  }

  // Card 2: Any archetype (discovery)
  cards.push(randomCardFrom(allArchetypes));

  // Card 3: Archetype Brian has LEAST of, or Neutral (pivot option)
  const leastUsed = getLeastUsedArchetype(deckArchetypes);
  if (Math.random() < 0.4) {
    cards.push(randomNeutralCard());
  } else {
    cards.push(randomCardFrom(leastUsed));
  }

  // Cross-archetype cards only offered if Brian has 3+ cards from BOTH archetypes
  // Replace one offering with cross-archetype if eligible
  const eligibleCross = getCrossArchetypeCards(deckArchetypes);
  if (eligibleCross.length > 0 && Math.random() < 0.25) {
    cards[1] = randomFrom(eligibleCross);
  }

  return cards;
}
```

### Archetype Identity Thresholds
Your deck composition determines your "identity" for passive bonuses:

| Cards in Deck | Status | Bonus |
|---------------|--------|-------|
| 3+ of one archetype | "Dabbling" | No passive bonus yet |
| 6+ of one archetype | "Committed" | Unlock archetype passive trigger (see Triggered Statuses above) |
| 10+ of one archetype | "Specialized" | Archetype-specific relic offered in shops |
| 15+ of one archetype | "Master" | All cards of that archetype cost 1 less (minimum 0) |
| 6+ of TWO archetypes | "Hybrid" | Cross-archetype cards appear more frequently in rewards |

### Shop Card Offerings
- 3 random cards from any archetype (weighted toward Brian's existing build)
- 1 Neutral card always available
- 1 Cross-archetype card if eligible
- Card removal service (remove a card from deck permanently)
- Card upgrade service (improve a card's stats)

### Rarity in Rewards
Rarity of offered cards scales with day number and encounter type:

| Source | Common | Uncommon | Rare | Legendary | Mythic |
|--------|--------|----------|------|-----------|--------|
| Normal encounter (Day 1-5) | 70% | 25% | 5% | 0% | 0% |
| Normal encounter (Day 6-15) | 50% | 35% | 12% | 3% | 0% |
| Normal encounter (Day 16+) | 30% | 40% | 22% | 7% | 1% |
| Elite encounter | 20% | 35% | 30% | 13% | 2% |
| Boss encounter | 0% | 20% | 40% | 30% | 10% |
| Shop | 40% | 30% | 20% | 8% | 2% |

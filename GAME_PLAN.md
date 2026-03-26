

I'll start by exploring the working directory to understand the context, then design this comprehensive plan.

Let me dive straight into designing the complete implementation plan. This is a substantial game design document, so I'll be thorough and specific across all requested dimensions.

---

# Brian Simulator — Complete Implementation Plan

## 1. Technical Architecture

### 1.1 File Structure

Single HTML file with embedded CSS and JS. Logical sections via comments:

```
brian-simulator.html
├── <style> — All CSS (~800 lines)
├── <div id="app"> — HTML shell (~200 lines)
└── <script> — All JS (~6000+ lines)
    ├── // === CONSTANTS === (card defs, encounter defs, upgrade defs)
    ├── // === GAME STATE === (single state object)
    ├── // === SAVE SYSTEM === (localStorage)
    ├── // === COMBAT ENGINE === (state machine)
    ├── // === CARD SYSTEM === (play, draw, discard, shuffle)
    ├── // === ENCOUNTER SYSTEM === (AI patterns, rewards)
    ├── // === SHOP/INVESTMENT === (between-combat screens)
    ├── // === META PROGRESSION === (day transitions, aging)
    ├── // === RENDERER === (DOM manipulation)
    └── // === INIT === (boot, event listeners)
```

### 1.2 Game State Shape

```js
const GameState = {
  // Meta
  version: "1.0.0",
  totalDaysPlayed: 0,
  brianAge: 14, // starts at 14, each "day" = ~1 year thematically
  lifeStage: "school", // school | social | career | lategame
  
  // Permanent (persists across days)
  permanent: {
    xpTotal: 0,
    moneyTotal: 0,
    repTotal: 0,
    level: 1,
    unlockedArchetypes: ["athlete"], // start with 1, unlock rest
    unlockedCards: [], // card IDs available in shops/rewards
    upgrades: {}, // upgradeId -> level
    maxHP: 50,
    maxEnergy: 3,
    startingDraw: 5,
    relics: [], // passive items
    // Life milestones
    milestones: [],
    // Unlocked encounter pools
    unlockedStages: ["school"],
  },
  
  // Current Day (reset each day)
  day: {
    number: 0,
    encounters: [], // planned encounter sequence
    currentEncounterIndex: 0,
    deck: [], // full deck for this day
    rewards: { xp: 0, money: 0, rep: 0 },
    shopVisits: 0,
    eventsTriggered: [],
  },
  
  // Combat (active during encounter)
  combat: {
    phase: "idle", // idle | playerTurn | enemyTurn | reward | gameOver
    turn: 0,
    brian: {
      hp: 50,
      maxHp: 50,
      energy: 3,
      maxEnergy: 3,
      block: 0,
      // Status effects
      strength: 0,
      poison: 0,
      high: 0,
      followers: 0,
      insight: 0,
      combo: 0,
      cash: 0,
      guilt: 0, // on enemy
      flavor: 0,
      records: [], // array of active record effects
    },
    enemy: {
      id: "",
      hp: 0,
      maxHp: 0,
      block: 0,
      intent: null, // { type: "attack", value: 12 }
      patternIndex: 0,
      statusEffects: {},
      poison: 0,
      guilt: 0,
    },
    hand: [],
    drawPile: [],
    discardPile: [],
    exhaustPile: [],
    cardsPlayedThisTurn: 0,
    cardsPlayedThisCombat: 0,
    animationQueue: [],
  },
  
  // UI state
  ui: {
    screen: "title", // title | dayStart | combat | reward | shop | invest | dayEnd | gameOver
    selectedCard: null,
    tooltipTarget: null,
    animating: false,
  }
};
```

### 1.3 Combat Engine State Machine

```
IDLE -> DAY_START (pick encounters, view deck)
DAY_START -> ENCOUNTER_START (init enemy, shuffle deck)
ENCOUNTER_START -> PLAYER_TURN_START (draw cards, reset energy, tick statuses)
PLAYER_TURN_START -> PLAYER_ACTION (waiting for card play or end turn)
PLAYER_ACTION -> PLAYER_ACTION (play card, resolve, check enemy death)
PLAYER_ACTION -> ENEMY_TURN (end turn pressed)
PLAYER_ACTION -> ENCOUNTER_WIN (enemy HP <= 0)
ENEMY_TURN -> ENEMY_ACTION (resolve intent)
ENEMY_ACTION -> PLAYER_TURN_START (next turn)
ENEMY_ACTION -> ENCOUNTER_LOSE (brian HP <= 0)
ENCOUNTER_WIN -> REWARD_SCREEN (pick card rewards, collect resources)
REWARD_SCREEN -> SHOP_SCREEN (optional between encounters)
SHOP_SCREEN -> ENCOUNTER_START (next encounter)
SHOP_SCREEN -> DAY_END (last encounter done)
ENCOUNTER_LOSE -> DAY_END (partial rewards)
DAY_END -> INVEST_SCREEN (spend accumulated resources)
INVEST_SCREEN -> IDLE (save, next day)
```

### 1.4 Rendering Approach

Pure DOM manipulation. No canvas. The renderer uses a `render()` function that reads GameState and updates the DOM. No virtual DOM -- direct element updates via IDs and data attributes.

```js
function render() {
  switch (GameState.ui.screen) {
    case "title": renderTitle(); break;
    case "combat": renderCombat(); break;
    case "shop": renderShop(); break;
    case "invest": renderInvest(); break;
    // etc.
  }
}
```

Combat animations use CSS transitions/keyframes. Card play: translate + fade. Damage: shake + red flash. Healing: green pulse.

### 1.5 Save System

```js
function save() {
  localStorage.setItem("brian_save", JSON.stringify({
    ...GameState,
    combat: null // don't save mid-combat
  }));
}

function load() {
  const raw = localStorage.getItem("brian_save");
  if (raw) Object.assign(GameState, JSON.parse(raw));
}

// Auto-save at day end, invest screen, shop screen
// Manual save button on pause menu
```

---

## 2. UI Layout

### 2.1 Screen: Title

```
+------------------------------------------+
|         BRIAN SIMULATOR                    |
|         [pixel art Brian face]            |
|                                           |
|         [ New Game ]                      |
|         [ Continue ]                      |
|         [ Collection ] (view all cards)   |
|         Days Survived: 47                 |
+------------------------------------------+
```

### 2.2 Screen: Day Start

```
+------------------------------------------+
| Day 12 — Brian is 26 (Career Stage)      |
|------------------------------------------|
| Today's Encounters:                       |
| [1. Job Interview] [2. Traffic] [3. ???]  |
|                                           |
| Your Deck (22 cards): [View Deck]         |
| HP: 65/65  Energy: 4  Level: 8           |
|                                           |
| Active Relics: [Headband] [Coffee Mug]   |
|                                           |
|              [ Start Day ]                |
+------------------------------------------+
```

### 2.3 Screen: Combat (Main gameplay screen)

```
+------------------------------------------+
| ENCOUNTER: Pop Quiz          Turn: 3      |
|------------------------------------------|
|              [ENEMY AREA]                 |
|   Pop Quiz  HP: [====----] 24/40         |
|   Intent: Attack 8  |  Status: Poison 3  |
|                                           |
|   [BRIAN STATUS BAR]                      |
|   HP: [========--] 42/50  Block: 5       |
|   Energy: ●●○  (2/3)                     |
|   Strength: 2 | Combo: 3 | Cash: $15     |
|                                           |
|   [HAND - up to 10 cards]                |
|   [Punch][Study][Energy Drink][Block]     |
|   [Binge Watch]                           |
|                                           |
|   Draw: 12  |  Discard: 5  |  Exhaust: 1 |
|                                           |
|   [ END TURN ]                            |
+------------------------------------------+
```

Cards in hand are rendered as divs with:
- Name (top)
- Energy cost (top-left circle)
- Art placeholder (colored div with emoji)
- Effect text (bottom)
- Rarity border color (white/green/gold)

Hovering a card enlarges it. Clicking plays it (if affordable).

### 2.4 Screen: Reward

```
+------------------------------------------+
| ENCOUNTER COMPLETE!                       |
|                                           |
| Rewards: +15 XP  +$20  +5 Rep            |
|                                           |
| Choose a card to add to your deck:        |
| [Card A]  [Card B]  [Card C]             |
|                                           |
| [ Skip ]                                 |
+------------------------------------------+
```

### 2.5 Screen: Shop (between encounters)

```
+------------------------------------------+
| BRIAN'S CORNER STORE         Money: $120  |
|------------------------------------------|
| Cards For Sale:                           |
| [Heavy Bag $50] [Podcast $35] [Weed $75] |
|                                           |
| Services:                                 |
| [Remove a Card - $60]                     |
| [Heal 30% HP - $30]                      |
| [Upgrade a Card - $100]                   |
|                                           |
| [ Leave Shop ]                            |
+------------------------------------------+
```

### 2.6 Screen: Investment (end of day)

```
+------------------------------------------+
| END OF DAY 12 — Results                   |
|------------------------------------------|
| Resources Earned Today:                   |
| XP: 85   Money: $210   Rep: 45           |
|------------------------------------------|
| LEVEL UP! (Level 8 -> 9)                 |
| Choose: [Athlete Card] or [Nerd Card]    |
|------------------------------------------|
| UPGRADE TREE:          XP: 340 available |
| [+5 Max HP - 50xp]  [+1 Energy - 200xp] |
| [+1 Draw - 150xp]   [Unlock Chef - 100xp]|
|                                           |
| SHOP:                  Money: $210        |
| [Relic: Coffee Mug $150]                 |
| [Starting Deck Slot $100]                 |
|                                           |
| SOCIAL:                Rep: 120           |
| [Unlock Relationship Events - 80 rep]    |
| [Prestige Mode - 500 rep]                |
|                                           |
|            [ Next Day ]                   |
+------------------------------------------+
```

---

## 3. Day Structure & Scaling

### 3.1 Day Composition

Each day has 3 encounters + 1 optional elite/boss:

- **Encounter 1**: Normal (easiest of the stage)
- **Shop opportunity** (50% chance)
- **Encounter 2**: Normal (medium)
- **Shop opportunity** (50% chance)
- **Encounter 3**: Elite OR Normal (harder)
- **Boss** (every 5th day, mandatory)

On boss days: 2 normals + 1 elite + 1 boss = 4 encounters.

### 3.2 Life Stages

| Stage | Days | Brian's Age | Encounter Pool | Theme |
|-------|------|-------------|----------------|-------|
| School | 1-5 | 14-18 | School encounters | Homework, bullies, crushes |
| Social | 6-12 | 19-25 | Social encounters | Parties, dating, roommates |
| Career | 13-20 | 26-35 | Career encounters | Jobs, rent, networking |
| Late Game | 21-30 | 36-50 | Late Game encounters | Midlife crisis, legacy |
| Endless | 31+ | 50+ | All pools, scaled | Victory lap / score chase |

### 3.3 Difficulty Scaling

Base enemy HP and damage scale per day:

```js
function scaleStat(baseStat, dayNumber) {
  return Math.floor(baseStat * (1 + 0.08 * dayNumber));
}
```

Day 1: 1.08x, Day 10: 1.8x, Day 20: 2.6x, Day 30: 3.4x.

This means a 40 HP enemy on day 1 becomes 72 HP on day 10, 104 HP on day 20. Combined with player upgrades, this creates a satisfying power curve.

### 3.4 Encounter Selection

At day start, the game generates encounter options:

```js
function generateDay(dayNumber, lifeStage) {
  const pool = ENCOUNTERS.filter(e => e.stage === lifeStage && e.type === "normal");
  const elitePool = ENCOUNTERS.filter(e => e.stage === lifeStage && e.type === "elite");
  const bossPool = ENCOUNTERS.filter(e => e.stage === lifeStage && e.type === "boss");
  
  const encounters = [];
  encounters.push(weightedRandom(pool, "easy"));
  encounters.push(weightedRandom(pool, "medium"));
  
  if (dayNumber % 5 === 0) {
    encounters.push(weightedRandom(elitePool));
    encounters.push(weightedRandom(bossPool));
  } else {
    encounters.push(Math.random() < 0.4 ? weightedRandom(elitePool) : weightedRandom(pool, "hard"));
  }
  
  return encounters;
}
```

---

## 4. Meta-Progression Across Days

### 4.1 What Persists

- **Level** (from XP): Increases max HP, energy, draw
- **Purchased Upgrades**: Permanent stat boosts
- **Unlocked Archetypes**: Access to new card pools
- **Relics**: Passive items that provide bonuses every day
- **Starting Deck Modifications**: Cards added/removed from base deck
- **Milestones**: One-time unlocks from achievements

### 4.2 What Resets

- Current HP (healed to max)
- All status effects
- Combat-only currencies (Cash, Combo, etc.)
- Hand/draw/discard piles (deck is rebuilt fresh)
- Encounter progress

### 4.3 Level-Up System

Every 100 XP = 1 level (scaling: level N needs N*100 XP).

On level up, choose 1 of 3 offered cards from your unlocked archetype pools. This is the primary way to build your deck across days.

### 4.4 Aging & Milestones

Brian ages ~1 year per day (thematically). Key milestones:

| Age | Milestone | Unlock |
|-----|-----------|--------|
| 16 | Got Driver's License | Car-related encounters, travel events |
| 18 | Graduated High School | Social stage, Party encounters |
| 21 | Can Drink Legally | Bar encounters, Druggie archetype access |
| 25 | First Real Job | Career stage, Money generation +50% |
| 30 | Quarter-Life Crisis | Late Game preview boss, +1 Energy permanent |
| 35 | Bought a House | Career mastery, Late Game stage |
| 40 | Midlife Crisis | Unlock Prestige system |
| 50 | Half Century | Endless mode, all archetypes unlocked |

---

## 5. Complete Card List (215 Cards)

### Design Principles

- **0-cost cards**: Weak but free. 3-5 damage, minor effects.
- **1-cost cards**: Bread and butter. 6-9 damage or 5-8 block or meaningful effect.
- **2-cost cards**: Strong. 12-16 damage, big block, powerful effects.
- **3-cost cards**: Haymakers. 20+ damage, game-changing effects. Play 1 per turn usually.
- **Block**: Reduces incoming damage, resets at start of your turn (like Slay the Spire).
- **Exhaust**: Card is removed from play for the rest of this encounter (one-time powerful effects).

### 5.1 Athlete (Keyword: Strength)

Strength: Each point of Strength adds +1 damage to ALL attack cards played. Stacks permanently for the encounter.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Punch | 1 | Common | Deal 6 damage. | "The foundation of every great man: violence." |
| 2 | Push-Up | 1 | Common | Gain 1 Strength. | "One... is... plenty..." |
| 3 | Flex | 0 | Common | Gain 2 Strength. At end of turn, lose 2 Strength. | "Look at me. LOOK AT ME." |
| 4 | Protein Shake | 1 | Common | Gain 5 Block. Gain 1 Strength. | "It tastes like chalk and ambition." |
| 5 | Morning Jog | 1 | Common | Deal 4 damage. Draw 1 card. | "Brian pretends to enjoy this." |
| 6 | Heavy Bag | 2 | Common | Deal 12 damage. | "The bag never fights back. Unlike Kevin." |
| 7 | Bench Press | 2 | Common | Gain 2 Strength. Gain 3 Block. | "225 or we don't count it." |
| 8 | Leg Day | 1 | Common | Gain 8 Block. | "Nobody skips it. Brian especially doesn't skip it. (He skips it.)" |
| 9 | Cardio Burst | 1 | Uncommon | Deal 3 damage 3 times. (Each hit gets Strength bonus.) | "Rapid punches! Like a montage!" |
| 10 | Power Clean | 2 | Uncommon | Deal 8 damage. Gain 2 Strength. | "Form? What form?" |
| 11 | Pre-Workout | 0 | Uncommon | Gain 1 Energy. Gain 1 Strength. Exhaust. | "The tingle means it's working." |
| 12 | Gym Buddy | 1 | Uncommon | Gain 1 Strength. If you have 3+ Strength, gain 2 instead. | "Brian and Chad. Unstoppable." |
| 13 | Creatine Loading | 1 | Uncommon | Gain Strength equal to the number of Athlete cards in your discard pile (max 5). | "Is this cheating? It's not cheating." |
| 14 | Personal Record | 2 | Uncommon | Deal damage equal to 8 + (Strength x 3). | "New PR, bro! NEW PR!" |
| 15 | Intimidate | 1 | Uncommon | Enemy loses 2 Strength (reduces their attack by 2 this combat). Gain 4 Block. | "Brian's veins are very visible." |
| 16 | Deadlift | 3 | Rare | Deal 25 damage. If this kills the enemy, gain 3 permanent Strength for this day. | "Brian's back will never recover." |
| 17 | Hulk Out | 3 | Rare | Double your current Strength. | "BRIAN SMASH STUDENT LOANS." |
| 18 | Iron Body | 2 | Rare | Gain Block equal to Strength x 4. | "Built different. Literally." |
| 19 | Olympic Lift | 2 | Rare | Deal 10 damage. Gain 3 Strength. Exhaust. | "He trained for four years for this moment." |
| 20 | Peak Performance | 3 | Rare | Gain 5 Strength. Draw 2 cards. Gain 1 Energy. Exhaust. | "Brian has become the gym." |

### 5.2 Gamer (Keyword: Poison)

Poison: At the end of the enemy's turn, they take damage equal to their Poison stacks, then Poison decreases by 1. (So 5 Poison deals 5+4+3+2+1 = 15 total over time.)

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Trash Talk | 1 | Common | Apply 3 Poison. | "ur mom lol" |
| 2 | Rage Quit | 1 | Common | Deal 5 damage. Apply 2 Poison. | "Brian has disconnected." |
| 3 | All-Nighter | 1 | Common | Apply 4 Poison. Take 2 damage. | "It's 4 AM and Brian has work tomorrow." |
| 4 | Headset Slam | 1 | Common | Deal 7 damage. | "That's a $200 headset, Brian." |
| 5 | Lag Spike | 0 | Common | Apply 2 Poison. | "It's always the server's fault." |
| 6 | Gamer Fuel | 1 | Common | Gain 6 Block. Apply 1 Poison. | "Mountain Dew: the elixir of champions." |
| 7 | Spam Click | 1 | Common | Apply 1 Poison 3 times. (Effectively 3 Poison but triggers per-application effects.) | "Click click click click click." |
| 8 | Teabag | 0 | Common | Apply 1 Poison. Draw 1 card. | "Disrespectful. Effective." |
| 9 | DoS Attack | 2 | Uncommon | Apply 7 Poison. | "Brian learned this from a YouTube tutorial." |
| 10 | Toxic Community | 1 | Uncommon | Apply 2 Poison. If enemy has 5+ Poison, apply 4 instead. | "The toxicity compounds." |
| 11 | AFK Farm | 1 | Uncommon | Apply 3 Poison. Gain 3 Block. | "Brian is technically present." |
| 12 | Exploit Found | 2 | Uncommon | Double enemy's current Poison. | "This is a legitimate strategy." |
| 13 | Speedrun | 1 | Uncommon | Deal 4 damage. If played on turn 1, deal 12 instead. | "Any% no glitches." |
| 14 | Respawn | 1 | Uncommon | Gain 8 Block. If your HP is below 50%, gain 12 instead. | "Just one more life." |
| 15 | Camping | 2 | Uncommon | Gain 10 Block. Apply 3 Poison. | "Brian will not leave this corner." |
| 16 | Boss Strategy | 3 | Rare | Apply 12 Poison. | "He watched the guide. Three times." |
| 17 | Permadeath | 2 | Rare | Deal damage equal to enemy's current Poison x 2. Exhaust. | "Hardcore mode activated." |
| 18 | God Mode | 3 | Rare | Gain 20 Block. Apply 5 Poison. Exhaust. | "IDDQD" |
| 19 | Stream Snipe | 1 | Rare | Apply 3 Poison. Draw 2 cards. | "Technically not against TOS." |
| 20 | Uninstall | 2 | Rare | Apply Poison equal to enemy's missing HP / 5. | "Brian has had ENOUGH of this game." |

### 5.3 Hipster (Keyword: Records)

Records: Collectible vinyl records that sit in a "collection" zone. At end of each of your turns, each Record triggers its passive effect. Records persist for the whole encounter. You can have max 5 Records active.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Thrift Store Find | 1 | Common | Add a Record: "Deal 2 damage at end of turn." | "You've DEFINITELY never heard of this band." |
| 2 | Vintage Vinyl | 1 | Common | Add a Record: "Gain 2 Block at end of turn." | "First pressing. Very important." |
| 3 | Obscure EP | 1 | Common | Deal 5 damage. If you have 2+ Records, deal 8 instead. | "Released on cassette only in 1987." |
| 4 | Record Crate | 1 | Common | Add a Record: "Gain 1 Energy at end of turn." (Once, then this record is discarded.) | "Brian spent four hours digging for this." |
| 5 | Judgmental Stare | 0 | Common | Deal 3 damage for each Record you have. | "Brian can't believe your taste." |
| 6 | Coffee Shop Vibes | 1 | Common | Gain 6 Block. | "Artisanal, single-origin, condescending." |
| 7 | Fixed Gear | 1 | Common | Deal 6 damage. | "It has no brakes. Like Brian's opinions." |
| 8 | Curate | 1 | Common | Draw 2 cards. Discard 1 card. | "It's not hoarding, it's curating." |
| 9 | Liner Notes | 1 | Uncommon | Add a Record: "Draw 1 card at end of turn." | "Brian reads these to feel smart." |
| 10 | Deep Cut | 2 | Uncommon | Deal 4 damage per Record you have. | "Track 7, side B. The REAL single." |
| 11 | Record Fair | 2 | Uncommon | Add 2 random Common Records to your collection. | "Brian woke up at 5 AM for this." |
| 12 | Mixtape | 1 | Uncommon | Add a Record: "Apply 2 Poison at end of turn." | "Made this for you. Don't read into it." |
| 13 | Reissue | 0 | Uncommon | Copy one of your existing Records. Add a duplicate. | "Technically it's different mastering." |
| 14 | B-Side | 1 | Uncommon | Add a Record: "Deal 3 damage to enemy at end of turn." | "The better side, obviously." |
| 15 | Sold Out Show | 2 | Uncommon | Gain 3 Block per Record you have. Deal 3 damage per Record. | "Brian was here before it was cool." |
| 16 | Limited Edition | 2 | Rare | Add a Record: "ALL other Records trigger twice." | "Numbered. 47 of 300." |
| 17 | Full Discography | 3 | Rare | Add Records until you have 5 (random Common Records fill slots). | "Every album. Even the bad ones." |
| 18 | Rare Pressing | 2 | Rare | Add a Record: "Deal 5 damage and gain 3 Block at end of turn." | "Worth more than Brian's car." |
| 19 | Underground Legend | 1 | Rare | For each Record, deal 2 damage and apply 1 Poison. Exhaust. | "Their MySpace had 47 plays. All Brian." |
| 20 | Vinyl Collection | 3 | Rare | Add a Record: "At end of turn, gain 1 Strength, 1 Block, draw 1 card." Exhaust. | "This IS Brian's personality." |

### 5.4 DJ (Keyword: Combo)

Combo: Counter starts at 0 each turn. Each card played increases Combo by 1. Many DJ cards deal bonus damage or have bonus effects based on current Combo count.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Beatmatch | 0 | Common | Deal 3 damage. +1 damage per Combo. | "Sync button? Never heard of it." |
| 2 | Crossfade | 1 | Common | Deal 6 damage. Draw 1 if Combo >= 3. | "Smooth transition. Into violence." |
| 3 | Drop the Bass | 1 | Common | Deal 4 + Combo x 2 damage. | "BWAAAAAM." |
| 4 | Hype Up | 0 | Common | Gain Combo x 1 Block. Draw 1 card. | "EVERYBODY PUT YOUR HANDS UP." |
| 5 | Scratch | 0 | Common | Deal 4 damage. | "Wikki wikki." |
| 6 | EQ Adjust | 1 | Common | Gain 5 Block. +2 Block per Combo. | "More bass. Always more bass." |
| 7 | Turntable Spin | 1 | Common | Deal 3 damage. Play the top card of your draw pile for free if Combo >= 4. | "Let it ride." |
| 8 | Warm-Up Set | 1 | Common | Deal 5 damage. Gain 3 Block. | "Nobody cares about the opener." |
| 9 | Buildup | 1 | Uncommon | Gain 1 Energy. If Combo >= 3, gain 2 Energy instead. | "The tension is KILLING the crowd." |
| 10 | Crowd Pleaser | 1 | Uncommon | Deal 3 damage X times where X = Combo (min 1). | "They're going absolutely mental." |
| 11 | Remix | 1 | Uncommon | Copy the last card you played this turn. Play the copy for free. | "Same song, different version. Art." |
| 12 | Rapid Fire Set | 0 | Uncommon | Draw 2 cards. They cost 0 this turn. Exhaust. | "Three tracks in two minutes." |
| 13 | Reading the Room | 1 | Uncommon | Deal 8 damage. If Combo >= 5, apply 3 Poison. | "Brian knows what they want." |
| 14 | Four on the Floor | 1 | Uncommon | Deal 4 damage 4 times. (Each hit counts as separate for Combo-related effects.) | "Boots and cats and boots and cats." |
| 15 | Transition | 0 | Uncommon | Discard your hand. Draw that many cards +1. Retain Combo. | "Key change. Genre change. Life change." |
| 16 | Peak Time | 2 | Rare | Deal Combo x 5 damage. | "2 AM. This is the moment." |
| 17 | Encore | 2 | Rare | Replay ALL cards played this turn. Exhaust. | "ONE MORE SONG! ONE MORE SONG!" |
| 18 | Festival Headline | 3 | Rare | Gain 3 Energy. Draw 3 cards. All cards cost 0 this turn. Exhaust. | "50,000 people. All here for Brian." |
| 19 | Sound System | 2 | Rare | Deal 15 damage. If Combo >= 6, deal 30 instead. | "The speakers go to eleven." |
| 20 | Marathon Set | 1 | Rare | Set Combo to 5. Draw 2 cards. | "Six hours. No bathroom break." |

### 5.5 Crypto Chud (Keyword: Cash)

Cash: A combat-only currency. You earn it from cards and spend it on powerful effects. Some cards give Cash, others spend it. If you end combat with Cash, 20% converts to Money (meta-resource). Junk cards ("Rug Pull", "Gas Fee") get shuffled into your deck by some Crypto cards.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Buy the Dip | 1 | Common | Gain 8 Cash. | "It keeps dipping, Brian." |
| 2 | HODL | 1 | Common | Gain 6 Block. Gain 3 Cash. | "Diamond hands, paper brain." |
| 3 | Pump and Dump | 1 | Common | Deal 8 damage. Lose 3 Cash (if able). | "Sell sell sell!" |
| 4 | Shill | 0 | Common | Gain 4 Cash. Add a "Rug Pull" to your discard pile. | "Have you heard about BrianCoin?" |
| 5 | Moon Shot | 2 | Common | Deal damage equal to your Cash (max 20). | "To the moon! (It went to zero.)" |
| 6 | Gas Fee | 0 | Common | Unplayable. This card sits in your hand doing nothing. If discarded, lose 2 HP. | "The cost of doing business on the blockchain." |
| 7 | Rug Pull | 0 | Common | Unplayable junk card. Exhaust at end of turn, deal 3 damage to Brian. | "The devs have left the chat." |
| 8 | Mining Rig | 2 | Common | Gain 5 Cash at the start of each turn for the rest of combat. | "The electric bill is... significant." |
| 9 | Leverage Trade | 1 | Uncommon | Deal 15 damage. Lose half your Cash (rounded up). | "10x leverage. What could go wrong?" |
| 10 | NFT Flip | 1 | Uncommon | Spend 10 Cash. Deal 20 damage. | "Right-click saved? That's THEFT." |
| 11 | Whitepaper | 1 | Uncommon | Gain 5 Cash. Draw 2 cards. | "Fourteen pages. Zero substance." |
| 12 | DeFi Yield | 1 | Uncommon | Gain Cash equal to 50% of your current Cash (min 3). | "5,000% APY! Totally sustainable." |
| 13 | Liquidation | 2 | Uncommon | Spend ALL Cash. Deal that amount as damage. | "Margin call. Sell everything." |
| 14 | Airdrop | 0 | Uncommon | Gain 3 Cash. Draw 1 card. | "Free money! (There is no free money.)" |
| 15 | Smart Contract | 2 | Uncommon | Gain 10 Block. If you have 15+ Cash, gain 10 more. | "Code is law. Buggy, buggy law." |
| 16 | Whale Move | 3 | Rare | Spend 20 Cash. Deal 40 damage. Gain 15 Block. | "Brian moves markets now." |
| 17 | Ponzi Engine | 2 | Rare | Gain 3 Cash. At end of each turn, double your Cash gain from this card (3, 6, 12...). | "Mathematically proven! By Brian!" |
| 18 | Exit Scam | 2 | Rare | Spend all Cash. Gain that much Block. Deal that much damage. Exhaust. | "Goodbye, investors." |
| 19 | Diamond Hands | 1 | Rare | Gain 5 Cash. Gain 5 Block. If you have 20+ Cash, gain 3 Strength. | "Brian cannot feel his fingers." |
| 20 | Bitcoin Maxi | 3 | Rare | Gain 15 Cash. All Cash cards cost 1 less this turn. Exhaust. | "There's only one coin that matters." |

### 5.6 Nerd (Keyword: Insight)

Insight: Stacking buff. Each point of Insight lets you see 1 card deeper into your draw pile (visual aid) and at 5+ Insight, you can choose your draw instead of random. Nerd cards also excel at draw, cycling, and deck manipulation.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Study | 1 | Common | Draw 2 cards. Gain 1 Insight. | "Brian highlights his highlights." |
| 2 | Pop Quiz | 1 | Common | Deal 5 damage. If you have 3+ Insight, deal 10 instead. | "Brian actually studied for once." |
| 3 | Research | 1 | Common | Gain 2 Insight. Gain 4 Block. | "Wikipedia deep dive: 3 hours." |
| 4 | Overthink | 0 | Common | Gain 2 Insight. | "But what if the ANSWER has a question?" |
| 5 | Textbook Throw | 1 | Common | Deal 7 damage. | "Calculus: finally useful." |
| 6 | Cramming | 1 | Common | Draw 3 cards. Discard 2. | "Absorb, filter, panic." |
| 7 | Hypothesis | 1 | Common | Deal 3 damage + Insight damage. | "Brian posits that this will hurt." |
| 8 | Peer Review | 1 | Common | Gain 6 Block. Draw 1 card. | "Let me check your sources." |
| 9 | Library Card | 0 | Uncommon | Draw 2 cards. Exhaust. | "Brian's most powerful weapon." |
| 10 | Eureka | 1 | Uncommon | Gain 3 Insight. If you have 5+ Insight, gain 1 Energy. | "EUREKA! ...wait, that's taken." |
| 11 | Calculate | 1 | Uncommon | Deal damage equal to cards in hand x 3. | "Brian does the math." |
| 12 | Thesis Defense | 2 | Uncommon | Gain Insight x 2 Block. Deal Insight x 2 damage. | "Page 47 clearly states..." |
| 13 | Index | 0 | Uncommon | Look at top 3 cards. Put them back in any order. Gain 1 Insight. | "Organizing is Brian's love language." |
| 14 | Fact Check | 1 | Uncommon | Negate the enemy's next action. (Their intent does nothing.) Gain 2 Insight. | "Actually, that's misinformation." |
| 15 | Speed Read | 1 | Uncommon | Draw cards equal to Insight (max 4). | "Brian read War and Peace in a weekend. Retained nothing." |
| 16 | Master Plan | 2 | Rare | Gain 5 Insight. Draw 3 cards. | "Brian has a 47-step plan." |
| 17 | Omniscience | 3 | Rare | All cards cost 0 for the rest of this turn. Exhaust. | "Brian sees the ENTIRE board." |
| 18 | Paradigm Shift | 2 | Rare | Shuffle discard into draw pile. Draw 5 cards. Gain 3 Insight. Exhaust. | "Everything Brian knew was wrong. Now he knows better." |
| 19 | IQ Flex | 1 | Rare | Deal Insight x 4 damage. | "Brian mentions his IQ. Nobody asked." |
| 20 | Beautiful Mind | 3 | Rare | Set Insight to 10. For the rest of combat, draw 2 extra cards per turn. Exhaust. | "The equations... they're everywhere." |

### 5.7 Druggie (Keyword: High)

High: A decaying buff. When High > 0, Brian deals +50% damage (multiplicative). High decreases by 1 at the end of each turn. When High hits 0, Brian enters Withdrawal: -1 Energy next turn, takes 3 damage. Some cards add High, some prevent/mitigate Withdrawal.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Take a Hit | 1 | Common | Gain 3 High. | "Just to take the edge off." |
| 2 | Munchies | 1 | Common | Heal 5 HP. Gain 1 High. | "Brian ate an entire rotisserie chicken." |
| 3 | Paranoia | 1 | Common | Gain 8 Block. Gain 1 High. | "Is that a cop? IS THAT A COP?" |
| 4 | Sloppy Swing | 1 | Common | Deal 9 damage. If High > 0, deal 13 instead. | "Brian can barely see, but he connects." |
| 5 | Deep Breath | 0 | Common | Gain 1 High. | "Inhale... hold... hold... hold..." |
| 6 | Cough | 0 | Common | Deal 4 damage. | "Brian is not subtle about this." |
| 7 | Edible | 1 | Common | Gain 5 High. This takes effect NEXT turn. | "Brian ate it 2 hours ago and felt nothing. Then..." |
| 8 | Contact High | 1 | Common | Deal 6 damage. Gain 2 High. | "Everyone around Brian is a little buzzed." |
| 9 | Bad Trip | 2 | Uncommon | Deal 15 damage. Gain 4 High. Take 5 damage. | "The walls are BREATHING." |
| 10 | Hair of the Dog | 1 | Uncommon | Remove Withdrawal effect. Gain 2 High. | "The cure is more." |
| 11 | Dealer's Number | 0 | Uncommon | Draw 2 cards. Gain 2 High. Exhaust. | "Brian has him on speed dial." |
| 12 | Tolerance | 1 | Uncommon | Passive for encounter: Withdrawal deals 1 less damage (stacks). Gain 3 Block. | "Brian barely feels it anymore." |
| 13 | Binge | 2 | Uncommon | Gain 8 High. Take 3 damage. | "Three days. No sleep. Let's GO." |
| 14 | Lucid Moment | 1 | Uncommon | If High > 5, deal 20 damage. Otherwise deal 5. | "For one perfect second, everything is clear." |
| 15 | Stash | 1 | Uncommon | Gain 2 High. Gain 1 High at the start of your next 2 turns. | "Brian hid some for later. Smart Brian." |
| 16 | Ego Death | 3 | Rare | Set High to 10. Deal 10 damage. Gain 10 Block. | "Brian is the universe. The universe is Brian." |
| 17 | Intervention | 2 | Rare | Lose all High. Gain Block and deal damage equal to High lost x 3. | "Your friends are concerned, Brian." |
| 18 | Psychedelic Vision | 2 | Rare | If High >= 5: draw 4 cards, all cost 0 this turn. If High < 5: draw 1 card. | "The colors have MEANING." |
| 19 | Rehab | 2 | Rare | Exhaust. For the rest of combat, Withdrawal deals 0 damage and does not reduce Energy. | "28 days, Brian. You can do this." |
| 20 | Transcendence | 3 | Rare | Deal 30 damage. Gain 15 Block. Set High to 0. No Withdrawal this time. Exhaust. | "Brian has seen the other side. It was... fine." |

### 5.8 Influencer (Keyword: Followers)

Followers: Counter that starts at 0 and grows. Gain Followers from cards. Followers NEVER decrease (during encounter). Many cards scale with Follower count. At 10+ Followers, Brian gains 2 Block per turn automatically. At 20+ Followers, +1 draw per turn.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Post Selfie | 1 | Common | Gain 3 Followers. | "No filter. (Three filters.)" |
| 2 | Comment Back | 0 | Common | Gain 1 Follower. Deal 3 damage. | "Brian replies to EVERY comment." |
| 3 | Story Time | 1 | Common | Gain 2 Followers. Gain 4 Block. | "Swipe up for more!" |
| 4 | Like and Subscribe | 1 | Common | Gain 2 Followers. Draw 1 card. | "Hit that bell icon!" |
| 5 | Clout Chase | 1 | Common | Deal 4 + (Followers / 3) damage. | "Brian does it for the clout." |
| 6 | Brand Deal | 1 | Common | Gain 2 Followers. Gain 3 Cash. | "Use code BRIAN for 10% off." |
| 7 | Morning Routine | 1 | Common | Gain 5 Block. Gain 1 Follower. | "Step 1: Wake up. Step 2: Film waking up." |
| 8 | Ratio | 0 | Common | Deal damage equal to Followers (max 10). | "Brian ratio'd someone. Peak content." |
| 9 | Viral Post | 1 | Uncommon | Gain Followers equal to current Followers (double them, max +10). | "10 million views. Of Brian eating cereal." |
| 10 | Cancel Culture | 2 | Uncommon | Deal 8 damage. Apply 3 Poison. Gain 3 Followers. | "Twitter has decided your fate." |
| 11 | Collab | 1 | Uncommon | Gain 4 Followers. Gain 4 Block. | "Brian and another Brian. Content gold." |
| 12 | Merch Drop | 1 | Uncommon | Gain Cash equal to Followers / 2. Gain 2 Followers. | "Brian's face on a mug. Who buys this?" |
| 13 | Algorithm | 2 | Uncommon | Gain 5 Followers. Draw 2 cards. | "The algorithm has chosen Brian." |
| 14 | Hate Comment | 0 | Uncommon | Deal 2 damage. Gain 2 Followers. "All engagement is good engagement." | |
| 15 | Monetize | 2 | Uncommon | Gain Cash equal to Followers. Deal Followers / 2 damage. | "Brian has achieved his dream: passive income." |
| 16 | Going Live | 2 | Rare | Gain 8 Followers. All Influencer cards cost 1 less this turn. | "5... 4... 3... WE'RE LIVE!" |
| 17 | Platform Domination | 3 | Rare | Set Followers to 30 (if currently less). | "Brian IS the platform now." |
| 18 | Stan Army | 2 | Rare | Deal Followers x 2 damage. | "Brian's stans have been mobilized." |
| 19 | Main Character Energy | 1 | Rare | Gain 3 Followers. For this turn, every card played gains +1 Follower. | "The world revolves around Brian." |
| 20 | Influence | 3 | Rare | Deal Followers damage. Gain Followers Block. Draw Followers / 5 cards. Exhaust. | "Brian doesn't have power. Brian IS power." |

### 5.9 Chef (Keyword: Flavor)

Flavor: A stacking buff. Each point of Flavor heals Brian for 1 HP at end of turn. Flavor does NOT decay (persists for encounter). High Flavor also boosts some card effects. Max Flavor: 20.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Season | 1 | Common | Gain 3 Flavor. | "Salt. Pepper. That's it. That's the tweet." |
| 2 | Knife Skills | 1 | Common | Deal 7 damage. Gain 1 Flavor. | "Julienne, brunoise, destroy." |
| 3 | Comfort Food | 1 | Common | Heal 5 HP. Gain 2 Flavor. | "Mac and cheese solves everything." |
| 4 | Mise en Place | 0 | Common | Gain 2 Flavor. | "Everything in its place. Especially Brian." |
| 5 | Pan Sear | 1 | Common | Deal 6 damage. If Flavor >= 5, deal 9. | "Hot pan. Cold oil. Brian read that somewhere." |
| 6 | Thick Skin | 1 | Common | Gain 7 Block. Gain 1 Flavor. | "Years in a kitchen. Nothing hurts anymore." |
| 7 | Soup of the Day | 1 | Common | Heal 3 HP. Gain 3 Block. Gain 1 Flavor. | "It's always soup." |
| 8 | Taste Test | 0 | Common | Gain 1 Flavor. Draw 1 card. | "Needs more acid." |
| 9 | Slow Braise | 2 | Uncommon | Gain 6 Flavor. | "Low and slow. Like Brian's career." |
| 10 | Flambé | 2 | Uncommon | Deal 12 damage. Gain 2 Flavor. | "The eyebrows grow back." |
| 11 | Secret Ingredient | 1 | Uncommon | Gain 3 Flavor. If Flavor >= 8, gain 1 Energy. | "Love. The secret ingredient is love. (And butter.)" |
| 12 | Plate Presentation | 1 | Uncommon | Gain Block equal to Flavor. | "Eat with your eyes first." |
| 13 | Comfort Feast | 2 | Uncommon | Heal HP equal to Flavor. Gain 3 Flavor. | "Brian stress-eats professionally." |
| 14 | Kitchen Nightmare | 2 | Uncommon | Deal 10 damage. Gain 4 Flavor. | "Brian screams. The food improves." |
| 15 | Ferment | 1 | Uncommon | Gain 2 Flavor now. Gain 3 Flavor at the start of next turn. | "Good things take time. Bacteria helps." |
| 16 | Michelin Star | 3 | Rare | Gain 10 Flavor. Heal 10 HP. | "Brian weeps. It's just that beautiful." |
| 17 | Signature Dish | 2 | Rare | Deal Flavor x 2 damage. | "The dish Brian will be remembered for." |
| 18 | Feast | 3 | Rare | Heal to full HP. Set Flavor to 15. Exhaust. | "Enough food for twelve. Brian eats alone." |
| 19 | Umami Bomb | 1 | Rare | Deal 5 damage. Gain 3 Flavor. All Chef cards this turn cost 1 less. | "Flavor explosion." |
| 20 | Chef's Table | 2 | Rare | For the rest of combat, Flavor heals 2 HP per stack instead of 1. Exhaust. | "The tasting menu of a lifetime." |

### 5.10 Jew (Keyword: Guilt)

Guilt: Stacks applied to the enemy. At the end of each enemy turn, they take damage equal to their Guilt stacks. Guilt does NOT decay. (Like Poison but permanent.) Additionally, at 10+ Guilt, enemy deals 20% less damage. At 20+ Guilt, enemy skips every other attack.

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Guilt Trip | 1 | Common | Apply 3 Guilt. | "You know what you did." |
| 2 | Oy Vey | 0 | Common | Apply 2 Guilt. | "The sigh heard round the world." |
| 3 | Call Your Mother | 1 | Common | Apply 2 Guilt. Heal 3 HP. | "She worries. You never call." |
| 4 | Passive Aggression | 1 | Common | Apply 2 Guilt. Gain 4 Block. | "No, no, it's FINE." |
| 5 | Disapproving Look | 0 | Common | Apply 1 Guilt. Draw 1 card. | "Brian doesn't need words." |
| 6 | Kvetching | 1 | Common | Apply 3 Guilt. Take 2 damage. | "The complaining hurts Brian too." |
| 7 | Chicken Soup | 1 | Common | Heal 6 HP. Gain 3 Block. | "Cures everything. EVERYTHING." |
| 8 | Chosen People | 1 | Common | Deal 6 damage. Apply 1 Guilt. | "It's a responsibility, not a privilege." |
| 9 | Holiday Dinner | 2 | Uncommon | Apply 5 Guilt. Heal 4 HP. | "Your cousin is a doctor. Just saying." |
| 10 | Neurosis | 1 | Uncommon | Apply 2 Guilt. Gain 2 Insight. | "Brian has analyzed this from every angle." |
| 11 | Argument | 1 | Uncommon | Deal 5 damage. Apply Guilt equal to damage dealt / 2. | "Brian always gets the last word." |
| 12 | Family Obligation | 1 | Uncommon | Apply Guilt equal to number of cards in hand. | "You HAVE to come. Everyone's asking about you." |
| 13 | Persecution Complex | 2 | Uncommon | Gain 12 Block. Apply 3 Guilt. | "5,000 years of this." |
| 14 | Charitable Donation | 1 | Uncommon | Lose 5 Cash (or 5 HP if no Cash). Apply 5 Guilt. | "Brian is very generous. He'd like you to know that." |
| 15 | Seder Plate | 2 | Uncommon | Apply 4 Guilt. Gain 4 Block. Heal 4 HP. | "Why is this night different? The guilt, mostly." |
| 16 | Existential Dread | 2 | Rare | Apply 8 Guilt. | "Are we even SUPPOSED to be happy?" |
| 17 | Bar Mitzvah Speech | 3 | Rare | Apply 10 Guilt. Gain 5 Block. "Today I am a man. A very guilty man." | |
| 18 | Generational Trauma | 2 | Rare | Apply Guilt equal to enemy's current Guilt (double it). | "This was passed down for generations." |
| 19 | Tikkun Olam | 2 | Rare | Deal damage equal to enemy's Guilt x 2. Heal 5 HP. | "Repair the world. Starting with your face." |
| 20 | Wandering | 1 | Rare | Apply 4 Guilt. If enemy has 10+ Guilt, apply 4 more. If 20+, apply 4 more. | "40 years in the desert. Brian remembers." |

### 5.11 Neutral Cards (Available to all builds)

| # | Name | Cost | Rarity | Effect | Flavor |
|---|------|------|--------|--------|--------|
| 1 | Basic Attack | 1 | Starter | Deal 6 damage. | "Brian throws a life at his problems." |
| 2 | Basic Block | 1 | Starter | Gain 5 Block. | "Brian braces for the worst. As usual." |
| 3 | Panic | 0 | Common | Gain 3 Block. | "AAAAAA." |
| 4 | Nap | 1 | Common | Heal 4 HP. | "Twenty minutes of bliss." |
| 5 | Procrastinate | 0 | Common | Draw 1 card. Gain 1 Block. | "Brian will deal with it later." |
| 6 | Complain | 1 | Common | Deal 4 damage. Apply 1 Guilt and 1 Poison. | "Brian is VERY unhappy about this." |
| 7 | Awkward Silence | 0 | Common | Gain 4 Block. | "..." |
| 8 | Therapy Session | 2 | Uncommon | Heal 8 HP. Draw 2 cards. Exhaust. | "$200 well spent." |
| 9 | Side Hustle | 1 | Uncommon | Gain 5 Cash. Deal 4 damage. | "Brian drives Uber on weekends." |
| 10 | Second Wind | 1 | Uncommon | Gain 1 Energy. Draw 1 card. Exhaust. | "Brian finds reserves he didn't know he had." |
| 11 | Existential Crisis | 2 | Uncommon | Deal 15 damage. Take 5 damage. | "WHAT IS THE POINT OF ANYTHING?!" |
| 12 | Coffee | 0 | Uncommon | Draw 2 cards. Exhaust. | "Bean water. Life water." |
| 13 | Lucky Break | 1 | Rare | Deal 10 damage. Gain 10 Block. Draw 1 card. | "Sometimes the universe cuts Brian a break." |
| 14 | Midlife Clarity | 2 | Rare | Gain 3 Strength, 3 Insight, and 3 Flavor. Exhaust. | "At 35, Brian finally figures it out." |
| 15 | Brian's Theme Song | 3 | Rare | Gain 2 Energy. Draw 3 cards. Gain 5 Block. Exhaust. | "Epic orchestral swell. Brian is the protagonist." |

---

## 6. Encounter Designs (35 Encounters)

### Enemy Intent System

Each enemy has a **pattern** -- an array of intents they cycle through. Intent types:
- `attack(X)`: Deal X damage to Brian
- `block(X)`: Gain X Block
- `buff(stat, X)`: Gain a buff
- `debuff(stat, X)`: Apply debuff to Brian
- `heal(X)`: Heal X HP
- `summon(id)`: Summon an additional enemy (stretch goal)
- `multi(X, N)`: Attack N times for X damage each

### 6.1 School Stage (Days 1-5)

**1. Pop Quiz**
- Type: Normal | HP: 30 | Stage: School
- Pattern: `[attack(6), attack(8), block(5), attack(10)]` (cycles)
- Special: None
- Flavor: "You didn't study. You never study."
- Drops: 10 XP, $5, 3 Rep

**2. Homework Pile**
- Type: Normal | HP: 35 | Stage: School
- Pattern: `[block(8), attack(5), attack(5), attack(12)]`
- Special: Gains 1 Block per turn permanently (stacks)
- Flavor: "It reproduces. How does homework reproduce?"
- Drops: 12 XP, $5, 2 Rep

**3. School Bully**
- Type: Normal | HP: 40 | Stage: School
- Pattern: `[attack(8), attack(10), buff(strength, 1), attack(8)]`
- Special: Gains 1 Strength every 3rd turn
- Flavor: "Kevin. It's always Kevin."
- Drops: 15 XP, $10, 5 Rep

**4. Crush Rejection**
- Type: Normal | HP: 25 | Stage: School
- Pattern: `[debuff(weakness, 1), attack(5), attack(7), debuff(weakness, 1)]`
- Special: Weakness: Brian deals 25% less damage for 1 turn
- Flavor: "She said let's be friends. The cruelest words."
- Drops: 8 XP, $0, 8 Rep

**5. Gym Class**
- Type: Normal | HP: 45 | Stage: School
- Pattern: `[attack(6), attack(6), multi(3, 3), block(5)]`
- Special: None
- Flavor: "Dodgeball. Brian's Vietnam."
- Drops: 15 XP, $5, 5 Rep

**6. Standardized Test**
- Type: Elite | HP: 60 | Stage: School
- Pattern: `[debuff(weakness, 1), attack(10), attack(12), debuff(draw, -1), attack(15)]`
- Special: Every 3 turns, Brian loses 1 draw next turn (anxiety). At 50% HP, attacks increase by 3.
- Flavor: "This determines your ENTIRE future. No pressure."
- Drops: 30 XP, $15, 10 Rep

**7. Principal Hardcastle**
- Type: Boss | HP: 120 | Stage: School
- Pattern Phase 1 (above 50% HP): `[attack(8), buff(strength, 2), attack(10), block(10), attack(14)]`
- Pattern Phase 2 (below 50% HP): `[attack(14), attack(14), multi(5, 3), buff(strength, 2)]`
- Special: At 50% HP, says "That's a DETENTION" and gains 5 Block. Starts with 2 Strength.
- Flavor: "You're going NOWHERE, Brian."
- Drops: 60 XP, $30, 25 Rep, guaranteed Rare card choice

### 6.2 Social Stage (Days 6-12)

**8. Awkward Party**
- Type: Normal | HP: 40 | Stage: Social
- Pattern: `[debuff(weakness, 1), attack(7), attack(9), debuff(weakness, 1)]`
- Special: If Brian has 0 Block at start of enemy turn, attacks deal +3
- Flavor: "Brian is standing in the corner with a beer he doesn't like."
- Drops: 12 XP, $8, 8 Rep

**9. Bad Date**
- Type: Normal | HP: 35 | Stage: Social
- Pattern: `[attack(8), debuff(weakness, 1), attack(6), attack(10)]`
- Special: None
- Flavor: "She's been in the bathroom for 20 minutes. Brian is hopeful."
- Drops: 10 XP, $5, 10 Rep

**10. Toxic Roommate**
- Type: Normal | HP: 50 | Stage: Social
- Pattern: `[debuff(poison, 2), attack(6), attack(8), debuff(poison, 3)]`
- Special: Applies Poison to Brian (reverse poison -- Brian takes damage at end of turn, decays by 1)
- Flavor: "The dishes have been there for WEEKS."
- Drops: 15 XP, $10, 5 Rep

**11. Student Debt**
- Type: Normal | HP: 55 | Stage: Social
- Pattern: `[attack(5), attack(5), buff(strength, 1), attack(8), attack(10)]`
- Special: Gains 1 Strength each cycle through pattern. Immune to Cash-based damage.
- Flavor: "It's $87,000. At 6.8% interest. Brian is fine."
- Drops: 10 XP, $20, 3 Rep

**12. Bar Fight**
- Type: Normal | HP: 45 | Stage: Social
- Pattern: `[attack(10), attack(12), multi(4, 3)]`
- Special: High-damage, short cycle. Pure aggro check.
- Flavor: "Someone spilled Brian's drink. Brian spilled someone's face."
- Drops: 18 XP, $5, 8 Rep

**13. Ex at a Party**
- Type: Normal | HP: 35 | Stage: Social
- Pattern: `[debuff(guilt, 3), attack(7), debuff(weakness, 2), attack(9)]`
- Special: Applies Guilt to BRIAN (3 self-damage at end of Brian's turns, decays by 1). 
- Flavor: "Oh cool cool cool cool cool cool cool."
- Drops: 8 XP, $5, 15 Rep

**14. Frenemy Group**
- Type: Elite | HP: 75 | Stage: Social
- Pattern: `[debuff(weakness, 1), attack(9), buff(strength, 2), attack(12), multi(4, 3), heal(10)]`
- Special: Heals 10 every 6th turn. At 30% HP, gains 10 Block and 2 Strength.
- Flavor: "They're your friends. They are definitely your friends. Right?"
- Drops: 35 XP, $20, 15 Rep

**15. The Wedding of Someone You Barely Know**
- Type: Boss | HP: 160 | Stage: Social
- Pattern Phase 1: `[attack(10), debuff(weakness, 1), attack(12), buff(strength, 1), multi(5, 3)]`
- Pattern Phase 2 (below 50%): `[attack(15), attack(15), debuff(guilt, 4), multi(6, 3), buff(strength, 2)]`
- Special: At start of combat, Brian loses $20 (wedding gift). Every 4 turns, applies "Obligation" debuff (lose 1 energy next turn). Starts with 5 Block.
- Flavor: "You RSVP'd yes eight months ago. There's no escape now."
- Drops: 75 XP, $40, 35 Rep, guaranteed Rare card

### 6.3 Career Stage (Days 13-20)

**16. Job Interview**
- Type: Normal | HP: 50 | Stage: Career
- Pattern: `[debuff(weakness, 1), attack(8), attack(10), debuff(draw, -1)]`
- Special: If Brian plays 0 cards in a turn, takes 5 extra damage next enemy attack ("looked unprepared")
- Flavor: "Where do you see yourself in 5 years? Dead. Brian sees himself dead."
- Drops: 15 XP, $15, 10 Rep

**17. Micromanager Boss**
- Type: Normal | HP: 60 | Stage: Career
- Pattern: `[debuff(energy, -1), attack(8), attack(10), debuff(energy, -1), attack(12)]`
- Special: Removes 1 Energy from Brian every 3 turns
- Flavor: "Did you get my email? I sent it 30 seconds ago."
- Drops: 18 XP, $20, 8 Rep

**18. Commute**
- Type: Normal | HP: 45 | Stage: Career
- Pattern: `[attack(6), attack(6), attack(6), attack(6), attack(6)]`
- Special: Always attacks for 6. Gains 2 Block per turn. Tedious and inevitable.
- Flavor: "45 minutes. Each way. Five days a week. Forever."
- Drops: 10 XP, $10, 3 Rep

**19. Rent Increase**
- Type: Normal | HP: 55 | Stage: Career
- Pattern: `[attack(8), buff(strength, 1), attack(10), attack(12), buff(strength, 2)]`
- Special: Scales hard. Rush it or die.
- Flavor: "The landlord 'invested in improvements.' Brian sees no improvements."
- Drops: 12 XP, $25, 5 Rep

**20. Networking Event**
- Type: Normal | HP: 40 | Stage: Career
- Pattern: `[debuff(weakness, 1), debuff(guilt, 2), attack(7), attack(9)]`
- Special: Low HP but annoying debuffs. Rewards lots of Rep.
- Flavor: "Brian has given out 47 business cards. No one will call."
- Drops: 10 XP, $10, 20 Rep

**21. Office Politics**
- Type: Normal | HP: 65 | Stage: Career
- Pattern: `[debuff(poison, 2), attack(7), block(10), debuff(poison, 3), attack(10)]`
- Special: Gains 5 Block when it applies Poison. Indirect damage focus.
- Flavor: "Brian CCed the wrong person. Brian is finished."
- Drops: 20 XP, $15, 12 Rep

**22. Performance Review**
- Type: Elite | HP: 90 | Stage: Career
- Pattern: `[debuff(weakness, 2), attack(12), debuff(draw, -1), attack(15), buff(strength, 2), multi(6, 3)]`
- Special: If Brian ends any turn with full energy (didn't play enough cards), takes 8 damage ("looked lazy").
- Flavor: "Your work has been... adequate. Adequacy is not rewarded."
- Drops: 40 XP, $30, 20 Rep

**23. Corporate Restructuring**
- Type: Boss | HP: 200 | Stage: Career
- Pattern Phase 1: `[attack(10), buff(strength, 1), attack(12), block(15), multi(5, 4)]`
- Pattern Phase 2 (below 50%): `[attack(16), buff(strength, 2), multi(7, 3), debuff(energy, -1), attack(20)]`
- Special: Starts with 10 Block. Every 5 turns, "Lays off" -- removes a random card from Brian's hand permanently (exhausts it). At 25% HP, gains 15 Block and heals 20.
- Flavor: "We're not firing you. We're 'right-sizing.' Feel better?"
- Drops: 90 XP, $50, 40 Rep, guaranteed Rare card

### 6.4 Late Game Stage (Days 21-30)

**24. Midlife Crisis**
- Type: Normal | HP: 70 | Stage: Late Game
- Pattern: `[debuff(weakness, 2), attack(10), debuff(guilt, 3), attack(14), buff(strength, 2)]`
- Special: Brian starts combat with -1 Energy (costs one turn of energy). Hits hard with psychological damage.
- Flavor: "Is this it? Is this ALL there is? (Buys a sports car.)"
- Drops: 20 XP, $20, 10 Rep

**25. Health Scare**
- Type: Normal | HP: 50 | Stage: Late Game
- Pattern: `[debuff(poison, 3), attack(8), debuff(poison, 4), attack(10)]`
- Special: Applies heavy Poison to Brian. A race against time.
- Flavor: "WebMD says it's either nothing or everything."
- Drops: 25 XP, $10, 5 Rep

**26. Tax Audit**
- Type: Normal | HP: 80 | Stage: Late Game
- Pattern: `[debuff(cash, -5), attack(10), attack(10), debuff(cash, -10), block(15)]`
- Special: Drains Brian's Cash each cycle. Steals $5 then $10 per cycle. Has decent Block.
- Flavor: "Brian should have hired an accountant."
- Drops: 15 XP, $30, 8 Rep

**27. Aging Parents**
- Type: Normal | HP: 60 | Stage: Late Game
- Pattern: `[debuff(guilt, 4), heal(5), debuff(guilt, 3), attack(8)]`
- Special: Heals itself. Stacks Guilt on Brian (self-damage). Psychological encounter. Low direct damage.
- Flavor: "They're fine. They just want to hear your voice. (They're not fine.)"
- Drops: 15 XP, $5, 20 Rep

**28. Existential Void**
- Type: Normal | HP: 100 | Stage: Late Game
- Pattern: `[debuff(draw, -1), attack(8), debuff(weakness, 1), attack(12), debuff(energy, -1)]`
- Special: Strips resources. Gains 3 Block per turn.
- Flavor: "The void stares back. It looks disappointed."
- Drops: 25 XP, $15, 15 Rep

**29. Divorce Proceedings**
- Type: Elite | HP: 120 | Stage: Late Game
- Pattern: `[debuff(cash, -10), attack(12), debuff(guilt, 5), attack(15), debuff(cash, -15), multi(8, 3)]`
- Special: Drains all monetary resources. At 50% HP, "Takes half" -- Brian loses 50% of current Cash and takes 10 damage.
- Flavor: "She keeps the house. Brian keeps the regret."
- Drops: 50 XP, $50, 25 Rep

**30. The IRS**
- Type: Elite | HP: 100 | Stage: Late Game
- Pattern: `[block(15), debuff(cash, -10), attack(14), buff(strength, 2), attack(18)]`
- Special: Starts with 15 Block. Immune to Guilt. Cannot be Poisoned. Pure stat check.
- Flavor: "Inevitable. Inescapable. Implacable."
- Drops: 45 XP, $40, 15 Rep

**31. Mortality**
- Type: Boss | HP: 300 | Stage: Late Game
- Pattern Phase 1: `[attack(12), debuff(weakness, 1), buff(strength, 1), attack(14), debuff(guilt, 3), multi(6, 4)]`
- Pattern Phase 2 (below 60%): `[attack(18), debuff(draw, -1), buff(strength, 2), multi(8, 3), debuff(energy, -1), attack(22)]`
- Pattern Phase 3 (below 25%): `[attack(25), attack(25), multi(10, 3), debuff(everything, max)]`
- Special: Phase transitions add 10 Block. Phase 3 is a timer -- Brian needs to finish it fast. Immune to Poison (you can't poison death). Guilt works (death feels guilty).
- Flavor: "Everyone meets this encounter eventually. Brian is not ready."
- Drops: 120 XP, $60, 50 Rep, guaranteed Rare + Relic choice

### 6.5 Special / Bonus Encounters

**32. Brian's Inner Critic**
- Type: Elite (any stage) | HP: 70 | Stage: Any
- Pattern: `[debuff(guilt, 3), debuff(weakness, 2), attack(8), debuff(guilt, 4), attack(12)]`
- Special: Mirrors Brian -- has copies of Brian's last 3 played cards in its "deck" and uses them occasionally.
- Flavor: "You're not good enough, Brian. You know that, right?"
- Drops: 35 XP, $15, 15 Rep

**33. DMV Visit**
- Type: Normal (any stage) | HP: 80 | Stage: Any
- Pattern: `[block(10), block(10), block(10), attack(5)]`
- Special: Tons of Block. Very little damage. Takes forever. Meant to test engine builds.
- Flavor: "Take a number. Your number is 847. Now serving: 12."
- Drops: 10 XP, $5, 2 Rep

**34. IKEA Furniture Assembly**
- Type: Normal (any stage) | HP: 55 | Stage: Any
- Pattern: `[buff(block, 5), attack(7), debuff(weakness, 1), attack(9), heal(8)]`
- Special: Heals every 5th turn (you reread the instructions). If you deal 15+ damage in one turn, skip its next Block (you found the right piece).
- Flavor: "Step 1 of 47. There are extra screws. This is ominous."
- Drops: 12 XP, $10, 5 Rep

**35. Brian From a Parallel Universe**
- Type: Boss (Endless) | HP: 250 | Stage: Endless
- Pattern: Copies Brian's current deck. Plays 2 random cards from Brian's deck each turn, targeting Brian.
- Special: Has all of Brian's stats. Mirror match. Whatever Brian is, this is too.
- Flavor: "He's everything you could have been. He's doing better."
- Drops: 100 XP, $80, 60 Rep

---

## 7. Between-Encounter Investment System

### 7.1 XP Upgrades (Permanent stat increases)

| Upgrade | Cost (scales per level) | Max Level | Effect per Level |
|---------|------------------------|-----------|-----------------|
| Vitality | 50 / 100 / 200 / 400 | 4 | +5 Max HP |
| Endurance | 100 / 300 | 2 | +1 Energy |
| Quick Learner | 75 / 150 / 300 | 3 | +1 Card Draw per turn |
| Thick Skin | 60 / 120 / 240 | 3 | Start combat with 3/6/10 Block |
| Fast Start | 80 / 160 | 2 | Draw 1/2 extra cards on turn 1 |
| Archetype Unlock | 100 each | 9 | Unlock one archetype's card pool |
| Deck Mastery | 150 / 300 / 500 | 3 | Card rewards offer 4/5/6 choices instead of 3 |

### 7.2 Money Shop (Permanent purchases)

| Item | Cost | Effect |
|------|------|--------|
| Remove a Card | $60 | Remove one card from starting deck permanently |
| Upgrade a Card | $100 | Enhance one card (+3 damage, +2 block, -1 cost, etc.) |
| Card Pack (Archetype) | $75 | Add a random card from unlocked archetype |
| Card Pack (Rare) | $150 | Add a random Rare card from unlocked archetypes |
| Heal Pack | $30 | Start next day at full HP (usually do anyway, but matters if "injury" system is added) |
| Relic Slot | $200 | First purchase only. Allows carrying 4 relics instead of 3. |

### 7.3 Relic Shop (Special persistent items)

Relics cost $100-300. Max 3 (4 with upgrade). Available pool rotates each day.

| Relic | Cost | Effect |
|-------|------|--------|
| Coffee Mug | $100 | +1 Energy on turn 1 only |
| Gym Membership | $120 | Start each combat with 2 Strength |
| Podcast Subscription | $100 | +1 Card Draw each turn |
| Noise-Canceling Headphones | $150 | Debuffs applied to Brian are 1 stack weaker |
| Vintage Turntable | $150 | Start combat with a random Common Record |
| Therapist's Card | $200 | Heal 3 HP at end of each combat |
| Trust Fund | $250 | Start each combat with 10 Cash |
| Cracked Phone Screen | $80 | +2 Followers at start of combat |
| Pill Organizer | $150 | Withdrawal deals 0 damage |
| Emergency Savings | $200 | If HP drops below 10, heal 15 HP once per combat |
| Lucky Penny | $100 | 15% chance to draw an extra card each turn |
| Spite | $120 | When Brian takes damage, apply 1 Guilt to attacker |
| Meal Prep Containers | $130 | Start combat with 3 Flavor |
| External Monitor | $100 | +2 Insight at start of combat |
| Weighted Blanket | $180 | Start each combat with 8 Block |

### 7.4 Reputation Unlocks

| Unlock | Cost | Effect |
|--------|------|--------|
| Networking | 30 Rep | +10% XP from all encounters |
| Social Butterfly | 60 Rep | Shop has 1 additional card for sale |
| Relationship Events | 80 Rep | Unlock special encounters that give big rewards |
| Prestige Contacts | 120 Rep | Rare cards appear more often in rewards |
| Inner Circle | 200 Rep | Unlock Elite encounters that drop double rewards |
| Legacy | 500 Rep | Unlock Prestige mode (restart with bonuses) |

---

## 8. Hybrid Build Synergies (12 Cross-Archetype Combos)

### 8.1 Athlete + DJ: "Mosh Pit"
Strength buffs apply to every hit of multi-hit Combo cards. DJ's Crowd Pleaser (deal 3 x Combo) with 5 Strength becomes (3+5) x Combo. Explosive burst turns with Strength stacking.

### 8.2 Gamer + Nerd: "Tryhard"
Nerd's draw/cycling finds Poison cards faster. Insight lets you see upcoming draws to plan Poison application. Speed Read + Toxic Community = apply massive Poison while cycling through deck. Exploit Found (double Poison) is easier to find with draw power.

### 8.3 Hipster + Chef: "Farm to Table"
Records that trigger each turn + Flavor that heals each turn = passive engine that heals and deals damage while Brian does nothing. Vintage Vinyl (2 Block/turn) + Flavor healing = incredible sustain. Deep Cut scales with Records while Flavor keeps you alive.

### 8.4 DJ + Druggie: "Rave"
High's +50% damage multiplier applies to all the rapid cards DJ plays in Combo turns. Drop the Bass with High active = huge damage. Festival Headline (all cards cost 0) + High = play your entire hand for massive Combo + boosted damage.

### 8.5 Crypto Chud + Influencer: "Scam Empire"
Followers generate Cash (Brand Deal, Merch Drop). Cash funds big attacks (Moon Shot, Whale Move). Followers grow each turn, Cash income scales with them. Monetize converts Followers directly to Cash and damage. The junk cards from Crypto are offset by Influencer's draw power at high Follower counts.

### 8.6 Nerd + Jew: "Neurotic Intellectual"
Nerd's Insight + Jewish Neurosis (gives Insight + Guilt). Stack Guilt while maintaining card advantage. Fact Check negates enemy turns while Guilt does passive damage. Thesis Defense + Guilt = enemy takes damage from Guilt while Brian draws through deck to find more Guilt cards.

### 8.7 Athlete + Chef: "Bulk and Cut"
Strength for damage, Flavor for healing. Brian becomes a tank who hits hard and outheals damage. Comfort Feast heals equal to Flavor. Personal Record deals damage based on Strength. Sustainable aggression -- never need to worry about HP while building Strength.

### 8.8 Gamer + Druggie: "Degenerate"
Poison applies inevitable damage. High boosts direct damage for burst. All-Nighter (4 Poison, 2 self-damage) + High (50% more damage on attacks) pairs fast application with burst finishers. Use Poison for sustained damage, High for finishing blows. Permadeath (deal Poison x 2) with High active = lethal.

### 8.9 Hipster + Influencer: "Indie Famous"
Records as passive engine + Followers as scaling stat. Each Record trigger could generate Followers (via cards like Liner Notes drawing Influencer cards). Sold Out Show scales with Records; Followers boost subsequent Influencer plays. Both want long fights -- Records accumulate, Followers grow.

### 8.10 Crypto Chud + Jew: "Guilt Money"
Guilt stacks deal free damage, Cash funds expensive attacks. Charitable Donation (lose Cash, gain Guilt) is the bridge card. Stack Guilt for passive damage, use Cash for burst. Guilt at 10+ reduces enemy damage by 20%, making Cash-heavy decks safer since they're inconsistent.

### 8.11 Chef + Jew: "Jewish Mother"
Chicken Soup appears in both archetypes' themes. Flavor heals, Guilt punishes. The ultimate sustain build -- Flavor heals every turn, Guilt damages enemy every turn. Stack both passives and wait. Tikkun Olam (Guilt x 2 damage + heal) is the finisher.

### 8.12 DJ + Nerd: "Calculated Chaos"
Nerd draws cards. DJ rewards playing many cards. Insight at 5+ lets you choose draws, guaranteeing 0-cost Combo enablers. Calculate (hand size x 3 damage) + DJ's massive draws = enormous single-turn burst. Beautiful Mind (+2 draw/turn forever) fuels infinite Combo turns.

---

## 9. Starting Deck

Every run, Brian starts with:
- 5x Basic Attack (1 energy, 6 damage)
- 4x Basic Block (1 energy, 5 block)
- 1x Procrastinate (0 energy, draw 1, gain 1 block)

Total: 10 cards. Reliable but weak. Goal is to thin/replace these with archetype cards ASAP.

---

## 10. Card Upgrade System

Any card can be upgraded once. Upgraded cards get a + suffix and a visual glow. General upgrade rules:

- **Attack cards**: +3 damage OR +1 extra hit on multi-hit
- **Block cards**: +3 block
- **Status application cards**: +1 stack (Poison, Guilt, Flavor, etc.)
- **Draw cards**: +1 draw
- **0-cost cards**: Gain an additional minor effect (e.g., +2 Block)
- **Exhaust cards**: Keep the Exhaust but add "Draw 1" or a minor bonus
- **Cost 2+ cards**: -1 cost OR the standard upgrade for the card type

This is done at shops for $100 or via specific events.

---

## 11. Prestige System (Late Meta-Progression)

After completing Day 30 (defeating Mortality), Brian can "Prestige":
- Reset to Day 1
- Keep: Unlocked archetypes, relic slots, 1 chosen relic
- Gain: "Wisdom" permanent buff (+1 to all stats per prestige level)
- Unlock: Harder encounters, new cards, Endless mode

Prestige level shown as a star icon. Max prestige: 5 (represented as Star I through Star V).

---

## 12. Detailed Implementation Sequence

### Phase 1: Core Engine (Estimated: 1500 lines JS)
1. HTML shell with all screens as hidden divs
2. CSS for card rendering, combat layout, animations
3. GameState object
4. Card data structure and all 215 cards as a const array
5. Encounter data structure and all 35 encounters
6. Combat state machine (phase transitions)
7. Basic card play: drag/click, energy check, resolve effect
8. Enemy AI: pattern cycling, intent display
9. Damage resolution: Block first, then HP
10. Status effect processing (Poison, Strength, etc.)
11. Turn cycling: draw, play, end turn, enemy turn, repeat

### Phase 2: Card Keywords (Estimated: 800 lines JS)
12. Strength system
13. Poison system (tick + decay)
14. Records system (collection zone, end-of-turn triggers)
15. Combo counter (reset each turn, cards reference it)
16. Cash system (earn/spend/convert)
17. Insight system (draw pile visibility, controlled draw at 5+)
18. High system (buff + decay + withdrawal)
19. Followers system (permanent growth, threshold bonuses)
20. Flavor system (heal per stack per turn)
21. Guilt system (enemy self-damage, threshold debuffs)

### Phase 3: Meta-Progression (Estimated: 600 lines JS)
22. Day structure: encounter sequence generation
23. Reward screen: card choices after encounter
24. Shop screen: buy cards, remove cards, upgrade cards
25. Investment screen: XP upgrades, Money shop, Rep unlocks
26. Relic system: passive effects that modify combat
27. Level-up system: XP thresholds, archetype card offerings
28. Life stage progression: Day count triggers stage changes
29. Save/Load via localStorage

### Phase 4: Polish (Estimated: 400 lines JS + 300 lines CSS)
30. Card animations (play, draw, discard, exhaust)
31. Damage numbers (floating text)
32. Screen transitions (fade/slide)
33. Enemy intent icons
34. Status effect tooltips
35. Deck viewer (sort/filter)
36. Sound effects (optional, Web Audio API for beeps/boops)
37. Prestige system
38. Endless mode scaling

### Phase 5: Balance & Content
39. Playtesting numbers adjustment
40. Encounter difficulty curve tuning
41. Card cost/effect balance pass
42. Add card descriptions and flavor text
43. Tutorial sequence (first 2 encounters guided)

---

## 13. Key Constants for Balance Reference

```js
const BALANCE = {
  BRIAN_BASE_HP: 50,
  BRIAN_BASE_ENERGY: 3,
  BRIAN_BASE_DRAW: 5,
  MAX_HAND_SIZE: 10,
  MAX_RECORDS: 5,
  MAX_FLAVOR: 20,
  STARTING_DECK_SIZE: 10,
  
  // Damage scaling
  ENEMY_HP_SCALE_PER_DAY: 0.08,    // +8% per day
  ENEMY_DMG_SCALE_PER_DAY: 0.06,   // +6% per day (slightly less than HP scale)
  
  // Economy
  CARD_REMOVE_COST: 60,
  CARD_UPGRADE_COST: 100,
  CARD_PACK_COST: 75,
  RARE_PACK_COST: 150,
  XP_PER_LEVEL: 100,               // Level N needs N * 100 XP
  CASH_TO_MONEY_RATIO: 0.2,        // 20% of leftover Cash becomes Money
  
  // Shop
  COMMON_CARD_PRICE: 40,
  UNCOMMON_CARD_PRICE: 75,
  RARE_CARD_PRICE: 150,
  
  // Status Effects
  POISON_DECAY: 1,                  // -1 per tick
  HIGH_DECAY: 1,                    // -1 per turn
  HIGH_DAMAGE_BONUS: 0.5,           // +50% damage
  WITHDRAWAL_DAMAGE: 3,
  WITHDRAWAL_ENERGY_PENALTY: 1,
  GUILT_DAMAGE_REDUCTION_THRESHOLD: 10,
  GUILT_DAMAGE_REDUCTION: 0.2,      // -20% enemy damage at 10+ Guilt
  GUILT_SKIP_THRESHOLD: 20,         // enemy skips attacks at 20+ Guilt
  FOLLOWER_BLOCK_THRESHOLD: 10,     // +2 Block/turn at 10+ Followers
  FOLLOWER_DRAW_THRESHOLD: 20,      // +1 Draw/turn at 20+ Followers
  INSIGHT_CHOOSE_THRESHOLD: 5,      // Can choose draws at 5+ Insight
};
```

---

## 14. Rendering Implementation Details

### Card Rendering

```js
function renderCard(card, index) {
  // Returns a DOM element (div.card)
  // Structure:
  // div.card[data-index][data-rarity]
  //   span.card-cost (top-left circle, colored by energy cost)
  //   div.card-name
  //   div.card-art (emoji or colored rectangle based on archetype)
  //   div.card-text (effect text with keyword highlighting)
  //   div.card-type (archetype name, bottom)
  //
  // Colors by archetype:
  //   Athlete: red, Gamer: green, Hipster: amber,
  //   DJ: purple, Crypto: gold, Nerd: blue,
  //   Druggie: magenta, Influencer: pink,
  //   Chef: orange, Jew: white/silver, Neutral: gray
  //
  // Rarity borders:
  //   Common: gray, Uncommon: green, Rare: gold/glowing
  //   Upgraded: shimmering border (CSS animation)
}
```

### Combat Screen Layout (CSS Grid)

```css
#combat-screen {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  /* Row 1: Header (encounter name, turn counter) */
  /* Row 2: Battlefield (enemy + brian status) */
  /* Row 3: Hand zone (cards) */
  /* Row 4: Footer (draw/discard counts, end turn) */
}

.hand-zone {
  display: flex;
  justify-content: center;
  gap: -20px; /* Cards overlap slightly */
  /* Cards fan out, hover raises them */
}

.card:hover {
  transform: translateY(-30px) scale(1.15);
  z-index: 100;
}
```

### Animation Approach

All animations via CSS transitions and `@keyframes`. JS adds/removes classes.

```css
@keyframes damage-shake { /* enemy hit */ }
@keyframes float-up { /* damage numbers */ }
@keyframes card-play { /* card from hand to battlefield */ }
@keyframes draw-card { /* card from pile to hand */ }
@keyframes pulse-heal { /* green glow on heal */ }
```

The JS animation queue ensures animations play sequentially:

```js
async function playAnimation(type, target, value) {
  return new Promise(resolve => {
    target.classList.add(`anim-${type}`);
    target.addEventListener('animationend', () => {
      target.classList.remove(`anim-${type}`);
      resolve();
    }, { once: true });
  });
}
```

---

## 15. Save Data Migration Strategy

Version the save data. On load, check version and migrate:

```js
function migrateSave(data) {
  if (data.version === "1.0.0") {
    // No migration needed
  }
  // Future: if (data.version === "1.0.0") { migrate to 1.1.0 }
  return data;
}
```

Save triggers: End of each day, after shop purchases, after investment. Auto-save indicator in corner.

---

### Critical Files for Implementation

Since this is a single-file game, the "files" are logical sections within `brian-simulator.html`:

- **brian-simulator.html** (the single file) - Contains all HTML, CSS, and JS. Estimated 8000-10000 lines total.
- **Section: CONSTANTS (cards.js logic)** - The 215 card definitions as a `const CARDS = [...]` array. This is the largest data section (~1200 lines) and the foundation every other system reads from.
- **Section: ENCOUNTERS (encounters.js logic)** - The 35 encounter definitions including pattern arrays, special mechanics, phase transitions. (~500 lines) Critical for combat engine to consume.
- **Section: COMBAT ENGINE (combat.js logic)** - The state machine, card resolution, status effect processing, enemy AI. (~1500 lines) The most algorithmically complex section.
- **Section: META PROGRESSION (meta.js logic)** - Day structure, leveling, shop, investment, relics, prestige. (~800 lines) The system that ties individual combats into a compelling loop.

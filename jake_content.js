(function () {
  const JAKE_CONTENT = {
    version: 1,
    campaignId: "jake",
    displayName: "Jake",
    tagline: "A second life, louder and riskier than the first.",

    phaseNames: {
      1: "Phase 1: Small-Time Jake",
      2: "Phase 2: The Circuit",
      3: "Phase 3: The Underworld",
      4: "Phase 4: The Machine",
      5: "Phase 5: The Crown"
    },

    phaseSubtitles: {
      1: "scraping by and talking big",
      2: "building a name out of noise",
      3: "running with wolves",
      4: "turning chaos into systems",
      5: "deciding what power is for"
    },

    mechanics: [
      {
        id: "gambling",
        name: "Gambling",
        type: "minigame",
        unlockPhase: 2,
        desc: "High-risk bets, streak tracking, and gambler's luck. Designed to swing hard and tempt overextension.",
        hooks: ["luck", "streaks", "payoutMultipliers", "riskMeter"]
      },
      {
        id: "auto_battler",
        name: "Auto Battler",
        type: "minigame",
        unlockPhase: 3,
        desc: "Assemble a crew, equip traits, and let Jake's crew fight through shifting encounters.",
        hooks: ["roster", "traits", "loadouts", "roundBasedRewards"]
      },
      {
        id: "scavenging",
        name: "Scavenging",
        type: "system",
        unlockPhase: 1,
        desc: "Short side hustles and street runs that trade time for materials, cash, and rumors.",
        hooks: ["sideHustles", "resourceDrops", "repeatableRuns"]
      },
      {
        id: "heist_planning",
        name: "Heist Planning",
        type: "system",
        unlockPhase: 4,
        desc: "Branching prep chains that build toward large score events with multiple failure and escape states.",
        hooks: ["prepTree", "crewAssignment", "escapeRoutes", "heatLevel"]
      },
      {
        id: "street_legends",
        name: "Street Legends",
        type: "meta",
        unlockPhase: 5,
        desc: "Permanent reputation feats that reshape later runs and unlock alternate endgame scenes.",
        hooks: ["legacyPerks", "codaChoices", "campaignCrossovers"]
      }
    ],

    actions: [
      { id: "show_up", phase: 1, name: "Show Up", energyCost: 1, cashGain: 1, repGain: 0, unlockTotalCash: 0, desc: "Be present. That is the whole trick at first." },
      { id: "deliver_flyers", phase: 1, name: "Deliver Flyers", energyCost: 3, cashGain: 4, repGain: 0, unlockTotalCash: 10, desc: "Low status, low margin, suspiciously effective." },
      { id: "late_shift", phase: 1, name: "Late Shift", energyCost: 6, cashGain: 10, repGain: 1, unlockTotalCash: 50, desc: "Jake learns the city after dark." },
      { id: "scrap_run", phase: 1, name: "Scrap Run", energyCost: 5, cashGain: 7, materialsGain: 2, unlockTotalCash: 75, desc: "Pull useful junk from dead places." },
      { id: "pawn_off", phase: 1, name: "Pawn Off Loot", energyCost: 4, cashGain: 9, unlockTotalCash: 120, desc: "Turn debris into liquidity." },
      { id: "borrow_trouble", phase: 1, name: "Borrow Trouble", energyCost: 8, cashGain: 15, repGain: 2, unlockTotalCash: 250, desc: "Jake makes a promise with a deadline attached." },
      { id: "run_numbers", phase: 2, name: "Run Numbers", energyCost: 10, cashGain: 18, repGain: 3, unlockTotalCash: 500, desc: "Be the person who knows what everybody owes." },
      { id: "play_dice", phase: 2, name: "Play Dice", energyCost: 6, cashGain: 0, unlockTotalCash: 900, desc: "Simple game, complicated consequences. Feeds the gambling system." },
      { id: "muscle_up", phase: 2, name: "Muscle Up", energyCost: 14, cashGain: 20, repGain: 6, unlockTotalCash: 1400, desc: "Jake starts looking like a problem." },
      { id: "court_contact", phase: 2, name: "Court a Contact", energyCost: 9, cashGain: 12, repGain: 8, unlockTotalCash: 2200, desc: "A social action with business consequences." },
      { id: "street_clean", phase: 2, name: "Street Clean", energyCost: 11, cashGain: 16, materialsGain: 4, unlockTotalCash: 3200, desc: "Sweep the neighborhood, learn the map." },
      { id: "book_job", phase: 3, name: "Book a Job", energyCost: 15, cashGain: 28, repGain: 10, unlockTotalCash: 5000, desc: "Formalize the hustle without losing the edge." },
      { id: "deep_cover", phase: 3, name: "Deep Cover", energyCost: 18, cashGain: 30, repGain: 14, unlockTotalCash: 8000, desc: "Jake works three angles at once." },
      { id: "crew_call", phase: 3, name: "Call the Crew", energyCost: 12, cashGain: 20, repGain: 18, unlockTotalCash: 11000, desc: "The network answers when it counts." },
      { id: "pressure_point", phase: 3, name: "Pressure Point", energyCost: 20, cashGain: 38, repGain: 22, unlockTotalCash: 15000, desc: "Find the weak seam and press." },
      { id: "dirty_deal", phase: 4, name: "Dirty Deal", energyCost: 22, cashGain: 42, repGain: 25, unlockTotalCash: 21000, desc: "Money now. Consequences later." },
      { id: "organize_op", phase: 4, name: "Organize the Op", energyCost: 25, cashGain: 50, repGain: 30, unlockTotalCash: 28000, desc: "Convert instinct into logistics." },
      { id: "split_the_take", phase: 4, name: "Split the Take", energyCost: 18, cashGain: 35, materialsGain: 8, unlockTotalCash: 35000, desc: "Keep the crew loyal by paying them." },
      { id: "public_face", phase: 5, name: "Public Face", energyCost: 24, cashGain: 55, repGain: 40, unlockTotalCash: 50000, desc: "Jake learns how to look legitimate." },
      { id: "final_hand", phase: 5, name: "Final Hand", energyCost: 30, cashGain: 80, repGain: 60, unlockTotalCash: 65000, desc: "The city holds its breath and Jake calls it." }
    ],

    upgrades: [
      { id: "j1_boots", phase: 1, cost: 20, currency: "cash", name: "Broken-In Boots", desc: "+20 max energy", unlockTotalCash: 20, effect: "maxEnergy += 20" },
      { id: "j1_maps", phase: 1, cost: 40, currency: "cash", name: "City Maps", desc: "Scavenging gives more materials", unlockTotalCash: 40, effect: "scavengingYield += 1" },
      { id: "j1_swagger", phase: 1, cost: 80, currency: "cash", name: "Swagger", desc: "Rep gains +1", unlockTotalCash: 80, effect: "repBonus += 1" },
      { id: "j1_patchwork", phase: 1, cost: 120, currency: "cash", name: "Patchwork Routine", desc: "Late Shift and Scrap Run are cheaper", unlockTotalCash: 120, effect: "routineCostMult *= 0.9" },
      { id: "j1_scavenger", phase: 1, cost: 180, currency: "cash", name: "Scavenger", desc: "Unlock a second scavenging route", unlockTotalCash: 180, effect: "scavengingRoutes += 1" },
      { id: "j2_lucky_coin", phase: 2, cost: 250, currency: "cash", name: "Lucky Coin", desc: "Gambling swings are less brutal", unlockPhase: 2, effect: "gamblingVolatility *= 0.85" },
      { id: "j2_house_edge", phase: 2, cost: 350, currency: "cash", name: "House Edge", desc: "Gambling wins scale a little harder", unlockPhase: 2, effect: "gamblingWinMult += 0.1" },
      { id: "j2_brawler", phase: 2, cost: 500, currency: "cash", name: "Brawler", desc: "Muscle Up gives more rep", unlockPhase: 2, effect: "muscleRepBonus += 4" },
      { id: "j2_bet_slider", phase: 2, cost: 650, currency: "cash", name: "Bet Slider", desc: "Unlock bet sizing control", unlockPhase: 2, effect: "gamblingControls += 1" },
      { id: "j2_streetwise", phase: 2, cost: 900, currency: "cash", name: "Streetwise", desc: "Contact actions are more efficient", unlockPhase: 2, effect: "contactCostMult *= 0.85" },
      { id: "j3_roster", phase: 3, cost: 1100, currency: "cash", name: "Crew Roster", desc: "Unlock auto battler roster management", unlockPhase: 3, effect: "autoBattlerSlots += 1" },
      { id: "j3_trait_1", phase: 3, cost: 1500, currency: "cash", name: "Dirty Fighter", desc: "Auto battler front-liners hit harder", unlockPhase: 3, effect: "battleFrontlineMult += 0.15" },
      { id: "j3_trait_2", phase: 3, cost: 1800, currency: "cash", name: "Fast Talker", desc: "Auto battler support gains more tempo", unlockPhase: 3, effect: "battleTempo += 1" },
      { id: "j3_holdout", phase: 3, cost: 2400, currency: "cash", name: "Holdout", desc: "Raise the floor on failed runs", unlockPhase: 3, effect: "battleLossRefund += 0.25" },
      { id: "j4_safehouse", phase: 4, cost: 3200, currency: "cash", name: "Safehouse", desc: "Heist planning starts unlocked", unlockPhase: 4, effect: "heistPrep += 1" },
      { id: "j4_blueprints", phase: 4, cost: 4200, currency: "cash", name: "Blueprints", desc: "Heist planning gives more payout", unlockPhase: 4, effect: "heistPayoutMult += 0.2" },
      { id: "j4_backchannel", phase: 4, cost: 5200, currency: "cash", name: "Back Channel", desc: "Heat rises slower", unlockPhase: 4, effect: "heatGainMult *= 0.8" },
      { id: "j4_disguise", phase: 4, cost: 6800, currency: "cash", name: "Disguise Kit", desc: "Escape routes become more reliable", unlockPhase: 4, effect: "escapeReliability += 1" },
      { id: "j5_legacy", phase: 5, cost: 9000, currency: "cash", name: "Legacy", desc: "Street Legends unlock", unlockPhase: 5, effect: "legacyPerks += 1" },
      { id: "j5_crown", phase: 5, cost: 12000, currency: "cash", name: "The Crown", desc: "Endgame choices branch wider", unlockPhase: 5, effect: "endingBranches += 1" }
    ],

    projects: [
      {
        id: 1,
        phase: 1,
        unlockTotalCash: 200,
        a: {
          name: "Fixer",
          desc: "Cash gains +25%, rep gains -10%",
          effect: "cashMult *= 1.25"
        },
        b: {
          name: "Ghost",
          desc: "Scavenging becomes quieter and safer",
          effect: "scavengingRisk *= 0.8"
        }
      },
      {
        id: 2,
        phase: 2,
        unlockTotalCash: 1500,
        a: {
          name: "The Dice Table",
          desc: "Gambling payout +20%, volatility +10%",
          effect: "gamblingWinMult *= 1.2"
        },
        b: {
          name: "The Quiet Table",
          desc: "Lower highs, lower lows, better long-term survival",
          effect: "gamblingVolatility *= 0.9"
        }
      },
      {
        id: 3,
        phase: 2,
        unlockTotalCash: 4000,
        a: {
          name: "Street Cred",
          desc: "Contacts and rep actions scale faster",
          effect: "repMult *= 1.25"
        },
        b: {
          name: "Street Muscle",
          desc: "Physical actions and battler units scale faster",
          effect: "battlePowerMult *= 1.25"
        }
      },
      {
        id: 4,
        phase: 3,
        unlockTotalCash: 12000,
        a: {
          name: "Pack Leader",
          desc: "Auto battler starts with an extra support unit",
          effect: "autoBattlerSlots += 1"
        },
        b: {
          name: "Pit Boss",
          desc: "Gambling returns a little of the loss as momentum",
          effect: "gamblingLossRefund += 0.1"
        }
      },
      {
        id: 5,
        phase: 4,
        unlockTotalCash: 25000,
        a: {
          name: "Clean Exit",
          desc: "Heists pay less, but heat decays faster",
          effect: "heatGainMult *= 0.9"
        },
        b: {
          name: "Big Exit",
          desc: "Heists pay more, but the city remembers",
          effect: "heistPayoutMult *= 1.3"
        }
      },
      {
        id: 6,
        phase: 5,
        unlockTotalCash: 60000,
        a: {
          name: "Kingmaker",
          desc: "Legacy perks are stronger and cheaper",
          effect: "legacyDiscount += 0.2"
        },
        b: {
          name: "Burn the Throne",
          desc: "The ending opens a harder, stranger epilogue",
          effect: "endingBranches += 1"
        }
      }
    ],

    minigames: [
      {
        id: "roulette_row",
        name: "Roulette Row",
        unlockPhase: 2,
        unlockTotalCash: 1200,
        summary: "Choose a side of the city and ride short odds for cash or rep.",
        rewards: ["cash", "rep", "heat"],
        riskProfile: "high",
        uiHint: "Bet size slider, streak meter, and a heat warning banner."
      },
      {
        id: "street_brawl",
        name: "Street Brawl",
        unlockPhase: 3,
        unlockTotalCash: 6000,
        summary: "An auto battler ladder with crew traits, counters, and round loot.",
        rewards: ["cash", "materials", "crew_xp"],
        riskProfile: "medium",
        uiHint: "Three-slot crew board with frontline/support positioning."
      },
      {
        id: "salvage_bay",
        name: "Salvage Bay",
        unlockPhase: 1,
        unlockTotalCash: 50,
        summary: "Scavenge timed loads from dead zones and sell the haul.",
        rewards: ["cash", "materials", "rumors"],
        riskProfile: "low",
        uiHint: "Route selection, timed returns, and inventory capacity."
      },
      {
        id: "heist_grid",
        name: "Heist Grid",
        unlockPhase: 4,
        unlockTotalCash: 20000,
        summary: "Plan routes, allocate crew, and decide whether to cut clean or cut hard.",
        rewards: ["cash", "rep", "legacy"],
        riskProfile: "variable",
        uiHint: "Prep cards, crew assignments, and exit routes."
      },
      {
        id: "king_of_the_block",
        name: "King of the Block",
        unlockPhase: 5,
        unlockTotalCash: 50000,
        summary: "A campaign-scale meta contest that converts dominance into permanent bonuses.",
        rewards: ["legacy", "prestige", "alternate_endings"],
        riskProfile: "endgame",
        uiHint: "Territory, influence, and rival challenge tiers."
      }
    ],

    thoughts: [
      { id: "j1_wake", phase: 1, text: "Jake wakes up owing money and planning to be someone else by nightfall." },
      { id: "j1_flyers", phase: 1, text: "Flyers in one hand, a future in the other. Both feel flimsy." },
      { id: "j1_scrap", phase: 1, text: "Scrap becomes survival when you know how to see value in junk." },
      { id: "j1_late_shift", phase: 1, text: "Late work teaches Jake the rhythm of the city after it forgets to be polite." },
      { id: "j1_first_contact", phase: 1, text: "The first contact doesn't look important. That usually means it is." },
      { id: "j2_dice", phase: 2, text: "The dice table is not a game. It's a tax on optimism." },
      { id: "j2_luck", phase: 2, text: "Jake learns the difference between luck and variance by losing enough to care." },
      { id: "j2_contacts", phase: 2, text: "Every contact is a door. Every door wants a key or a favor." },
      { id: "j2_muscle", phase: 2, text: "The body changes first. Confidence follows if Jake can keep it." },
      { id: "j2_sidehustles", phase: 2, text: "Scavenging stops being side work when it starts funding the next move." },
      { id: "j3_crew", phase: 3, text: "A crew is just a promise with a payroll attached." },
      { id: "j3_battler", phase: 3, text: "Fight enough times and you stop asking if the crew is loyal. You ask whether they can adapt." },
      { id: "j3_heat", phase: 3, text: "Heat is a memory the city keeps for you." },
      { id: "j3_underworld", phase: 3, text: "The underworld is organized, which means it can be negotiated with." },
      { id: "j3_rules", phase: 3, text: "Jake is starting to understand that power is mostly rules other people agree to fear." },
      { id: "j4_heist", phase: 4, text: "The heist plan looks clean on paper. Paper does not scream." },
      { id: "j4_blueprints", phase: 4, text: "Blueprints are just lies you can draw in straight lines." },
      { id: "j4_disguise", phase: 4, text: "Disguise is not about hiding. It's about arriving as an explanation." },
      { id: "j4_machine", phase: 4, text: "Once the system starts paying itself, the city becomes a machine Jake can hear breathing." },
      { id: "j4_exit", phase: 4, text: "There is always an exit. The trick is deciding who gets out first." },
      { id: "j5_crown", phase: 5, text: "The crown fits badly. That may be the point." },
      { id: "j5_legacy", phase: 5, text: "Legacy is just the name people give the parts of you they keep." },
      { id: "j5_king", phase: 5, text: "Jake doesn't want the city to remember him kindly. He wants it to remember him accurately." },
      { id: "j5_choice", phase: 5, text: "At the end, Jake can become a myth, a manager, or a warning." },
      { id: "j5_last", phase: 5, text: "The last choice is never about winning. It is about what survives the win." }
    ],

    endings: [
      {
        id: "ending_a",
        title: "The Hustler's Exit",
        unlock: "phase5_cash_end",
        summary: "Jake leaves with the money, the contacts, and no desire to be owned by the city.",
        epilogue: [
          "He does not vanish. He simply becomes hard to pin down.",
          "The city keeps his number. He keeps his distance."
        ]
      },
      {
        id: "ending_b",
        title: "The Boss Seat",
        unlock: "phase5_power_end",
        summary: "Jake takes the throne and turns chaos into policy.",
        epilogue: [
          "The crews settle. The routes stabilize. The money keeps moving.",
          "Nobody calls it peace, but the streets get quieter."
        ]
      },
      {
        id: "ending_c",
        title: "The Burn",
        unlock: "phase5_burn_end",
        summary: "Jake burns the network down and walks away from the crown.",
        epilogue: [
          "What was built can be rebuilt. What was cut cannot be uncut.",
          "Some stories end by disappearing. Others end by changing shape."
        ]
      },
      {
        id: "ending_d",
        title: "Jake Forever",
        unlock: "phase5_legacy_end",
        summary: "Jake keeps playing, but the game itself becomes the legacy.",
        epilogue: [
          "Every choice becomes a mechanic. Every mechanic becomes a lesson.",
          "The city names a generation after him. He refuses the plaque."
        ]
      }
    ],

    branchChoices: [
      {
        id: "b1",
        phase: 1,
        title: "Work Honest / Work Dirty",
        prompt: "Start with steady money or faster money with more risk.",
        options: [
          { id: "honest", name: "Work Honest", effect: "cashMult *= 1.1; heatMult *= 0.9" },
          { id: "dirty", name: "Work Dirty", effect: "cashMult *= 1.3; heatMult *= 1.15" }
        ]
      },
      {
        id: "b2",
        phase: 2,
        title: "Dice / Data",
        prompt: "Lean into gambling intuition or build a statistical edge.",
        options: [
          { id: "dice", name: "Dice", effect: "gamblingLuck += 1" },
          { id: "data", name: "Data", effect: "gamblingVolatility *= 0.9" }
        ]
      },
      {
        id: "b3",
        phase: 3,
        title: "Crew / Solo",
        prompt: "Run with people or make the whole machine answer to Jake.",
        options: [
          { id: "crew", name: "Crew", effect: "crewSynergy += 1" },
          { id: "solo", name: "Solo", effect: "soloPower += 1" }
        ]
      },
      {
        id: "b4",
        phase: 4,
        title: "Quiet / Loud",
        prompt: "Keep the heat down or turn the city into a stage.",
        options: [
          { id: "quiet", name: "Quiet", effect: "heatGainMult *= 0.85" },
          { id: "loud", name: "Loud", effect: "repMult *= 1.2" }
        ]
      },
      {
        id: "b5",
        phase: 5,
        title: "Rule / Refuse",
        prompt: "Take the crown or make the crown meaningless.",
        options: [
          { id: "rule", name: "Rule", effect: "endingBranches += 1" },
          { id: "refuse", name: "Refuse", effect: "legacyPerks += 1" }
        ]
      }
    ]
  };

  if (typeof window !== "undefined") {
    window.JAKE_CONTENT = JAKE_CONTENT;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = JAKE_CONTENT;
  }
})();

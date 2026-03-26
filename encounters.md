

# BRIAN SIMULATOR — ENCOUNTER DESIGN DOCUMENT

## 70 Total Encounters

---

# STAGE 1: SCHOOL (Brian Age 14-18)

**1. Pop Quiz**
- Type: Normal | HP: 30 | Stage: School
- Pattern: `[attack(6), debuff(confidence, 2), attack(8), attack(6)]`
- Special: Each turn, reveals a "question" — if Brian plays a card costing 2+, the question is "answered" and Pop Quiz loses 1 attack power for the rest of the fight. If no 2+ card is played that turn, Pop Quiz gains +2 attack permanently. Rewards preparation.
- Flavor: "You didn't study. You never study. The questions are in a language you're pretty sure doesn't exist."
- Drops: 8 XP, 5 Money, 2 Rep

**2. Cafeteria Mystery Meat**
- Type: Normal | HP: 35 | Stage: School
- Pattern: `[attack(5), buff(strength, 1), attack(7), debuff(energy, 1)]`
- Special: Every 3 turns, Mystery Meat applies "Food Poisoning" — Brian loses 3 HP at the start of each of his turns for 2 turns. Playing a card that costs 0 "settles Brian's stomach" and removes the debuff early. Mystery Meat has 15% damage resistance that is removed entirely once it drops below half HP ("you finally identify the meat").
- Flavor: "It's gray. It pulses slightly. The lunch lady winks and says 'Eat up, sweetie.' You have never been less hungry."
- Drops: 6 XP, 4 Money, 1 Rep

**3. Gym Class Dodgeball**
- Type: Normal | HP: 40 | Stage: School
- Pattern: `[multi(4, 3), block(8), multi(3, 4), attack(10)]`
- Special: "Picked Last" — Brian starts with -1 Energy on turn 1 only. Each time Brian plays an attack card, one "dodgeball" is removed from the next multi-attack (minimum 1 hit). If Brian plays no attack cards in a turn, Dodgeball gains an extra hit on its next multi-attack. Encourages aggression.
- Flavor: "The gym teacher blows his whistle with the intensity of a man whose college football dreams died in 1987."
- Drops: 7 XP, 3 Money, 3 Rep

**4. Homework Pile**
- Type: Normal | HP: 45 | Stage: School
- Pattern: `[debuff(draw, 1), attack(5), debuff(draw, 1), attack(8)]`
- Special: "Procrastination" — Homework Pile starts at 45 HP but gains 5 HP at the end of every one of Brian's turns (represents accumulating assignments). Caps at 70 HP. However, any turn where Brian plays 4+ cards deals a bonus 5 damage to Homework Pile ("cramming session"). The fight is a race against growing HP.
- Flavor: "It started as a worksheet. Now it has chapters. You're pretty sure your math homework just cited your English essay."
- Drops: 9 XP, 5 Money, 1 Rep

**5. Hall Monitor**
- Type: Normal | HP: 35 | Stage: School
- Pattern: `[block(10), attack(7), debuff(confidence, 1), block(10)]`
- Special: "Hall Pass Check" — at the start of each of Brian's turns, Brian must "show a hall pass" by discarding 1 card. If Brian has no cards in hand (empty hand), the discard is skipped and Hall Monitor becomes "Confused," losing its block for the next turn. Playing exactly 3 cards in a turn makes Hall Monitor "Suspicious" — it switches to attack(12) next turn instead of its normal pattern.
- Flavor: "He's 14 and has a lanyard. The power has already gone to his head. He will peak in exactly 4 years."
- Drops: 6 XP, 6 Money, 2 Rep

**6. Crush's Boyfriend**
- Type: Normal | HP: 50 | Stage: School
- Pattern: `[attack(8), buff(strength, 1), attack(6), attack(10)]`
- Special: "Showing Off" — if Brian uses any block cards, Crush's Boyfriend gains +3 attack next turn (he interprets defense as weakness). If Brian uses only attack cards in a turn, Crush's Boyfriend flinches and loses his next attack (replaced with block(5)). Additionally, an invisible "Crush" is watching — the encounter gives bonus Rep drops if Brian wins in 5 turns or fewer.
- Flavor: "He drives a used Mustang and calls everyone 'bro.' Your crush says he's 'really mature.' He is not."
- Drops: 7 XP, 3 Money, 5 Rep

**7. Substitute Teacher**
- Type: Normal | HP: 30 | Stage: School
- Pattern: `[debuff(confidence, 1), attack(4), heal(5), attack(6)]`
- Special: "Movie Day Roulette" — each turn, there's a 40% chance the Sub puts on a movie, skipping their attack entirely and doing nothing (replaced with block(0)). However, if "Movie Day" triggers two turns in a row, the real teacher returns: Sub transforms into "Actual Teacher" with full HP reset to 30, +3 strength, and no more Movie Day chances. Low-threat encounter that can suddenly become urgent.
- Flavor: "She can't find the remote. She doesn't know your name. She will call you 'Sweetie' and 'Buddy' in alternating sentences."
- Drops: 5 XP, 4 Money, 1 Rep

**8. School Dance Rejection**
- Type: Elite | HP: 65 | Stage: School
- Pattern: `[debuff(confidence, 3), attack(10), debuff(draw, 1), multi(5, 3), heal(8)]`
- Special: "Slow Dance of Doom" — the encounter has two phases. Phase 1 (above 50% HP): normal pattern. Phase 2 (below 50%): "The DJ Plays Your Song" — Brian's cards cost 1 more energy unless they are attack cards (the embarrassment is paralyzing, but rage is free). Additionally, each turn in Phase 2, a "Bystander" appears with 8 HP that deals 3 damage/turn (people are watching). Max 3 Bystanders at once. Killing Bystanders gives no rewards but removes their damage.
- Flavor: "She said 'Ew.' Just 'Ew.' One syllable. It will echo in your brain at 2 AM for the next thirty years."
- Drops: 18 XP, 12 Money, 8 Rep

**9. SAT Exam**
- Type: Elite | HP: 75 | Stage: School
- Pattern: `[debuff(energy, 1), attack(8), debuff(confidence, 2), multi(4, 4), special]`
- Special: "Standardized Testing" — SAT has 4 "sections," each with ~19 HP. When a section is destroyed, SAT changes its pattern. Section 1 (Reading): debuffs only. Section 2 (Writing): copies the last card Brian played and uses it against him. Section 3 (Math): attacks scale with the number of cards in Brian's discard pile (1 damage per 3 cards). Section 4 (Essay): SAT becomes immune to damage for 1 turn and applies "Existential Dread" (Brian takes 2 damage per card played next turn). "Time Limit" — after 12 total turns, SAT deals 30 unavoidable damage ("pencils down").
- Flavor: "This test will determine your entire future. No pressure. The kid next to you is already on page 4. You're still writing your name."
- Drops: 22 XP, 15 Money, 5 Rep

**10. The Vice Principal**
- Type: Elite | HP: 80 | Stage: School
- Pattern: `[attack(9), buff(block, 12), debuff(confidence, 2), attack(12), special]`
- Special: "Permanent Record" — The Vice Principal has a "Detention Counter" that starts at 0. Each time Brian plays a card costing 0, the counter goes up by 1 ("acting out"). At 3 Detention, Brian loses a turn entirely. At 5 Detention, Brian takes 15 damage. Counter resets to 0 after triggering. Additionally, VP has "Authority" — 25% of all damage dealt to VP is reflected back to Brian. VP drops below 30% HP: enters "Phone Call Home" mode, healing 5/turn and doubling reflected damage.
- Flavor: "He says 'I'm not angry, I'm disappointed,' and somehow that's worse. His office smells like coffee and shattered dreams."
- Drops: 20 XP, 14 Money, 10 Rep

**11. Final Exam Week**
- Type: Boss | HP: 130 | Stage: School
- Pattern: `[multi(4, 5), debuff(draw, 2), attack(14), debuff(energy, 1), buff(strength, 2), special]`
- Special: "Five Subjects" — Final Exam Week is actually 5 mini-bosses that arrive sequentially: Math (30 HP, attacks scale with turn number), English (25 HP, copies Brian's attacks), Science (25 HP, applies "Confusion" — randomizes card order in hand), History (25 HP, resummons defeated subjects at 10 HP each if not killed within 2 turns), and PE (25 HP, takes double damage but deals double damage). Only the current subject attacks, but all alive subjects contribute 2 passive damage per turn. "All-Nighter" — Brian can sacrifice 10 HP at any time to gain +2 Energy that turn (cramming). "Sleep Deprivation" — after turn 8, Brian's max hand size decreases by 1 each turn (min 2).
- Flavor: "It's 3 AM. You've had six energy drinks. Your left eye is twitching. You just highlighted an entire textbook in yellow. All of it. Every word."
- Drops: 40 XP, 25 Money, 15 Rep

**12. The Principal**
- Type: Boss | HP: 150 | Stage: School
- Pattern: `[attack(12), buff(strength, 2), block(15), multi(6, 3), debuff(confidence, 3), special]`
- Special: "Bureaucratic Immunity" — The Principal takes 50% reduced damage from the first card played each turn (always leads with policy). "Assembly Mode" — every 4 turns, Principal calls an assembly: Brian cannot attack for 1 turn, but all debuffs are cleared (even the Principal gets bored during assemblies). "Expulsion Threat" — at 30% HP, The Principal enters rage: gains "Zero Tolerance" — every card Brian plays has a 20% chance to be "confiscated" (exhausted permanently for this fight). "Faculty Backup" — at 50% HP, summons "Coach" (20 HP, attacks 8/turn) and "Guidance Counselor" (15 HP, heals Principal 6/turn). Principal cannot be reduced below 1 HP while either backup is alive.
- Flavor: "He doesn't remember your name but he remembers every rule you've broken. His tie is a weapon. His disappointment is an area of effect."
- Drops: 50 XP, 35 Money, 20 Rep

---

# STAGE 2: SOCIAL (Brian Age 19-25)

**13. The Hangover**
- Type: Normal | HP: 40 | Stage: Social
- Pattern: `[debuff(draw, 1), attack(7), debuff(energy, 1), attack(9)]`
- Special: "Hair of the Dog" — The Hangover gets weaker each turn Brian survives without playing attack cards (it fades naturally, losing 2 strength per peaceful turn). But each attack card Brian plays represents "movement," and The Hangover gains +1 strength. If Brian plays 0 cards in a turn, The Hangover skips its next attack entirely ("sleeping it off"). Rewards patience over aggression.
- Flavor: "You wake up on a floor. It might be yours. Your mouth tastes like regret and someone else's cigarettes."
- Drops: 8 XP, 4 Money, 3 Rep

**14. Student Loan Officer**
- Type: Normal | HP: 55 | Stage: Social
- Pattern: `[attack(6), buff(strength, 1), attack(8), debuff(money, 5), attack(6)]`
- Special: "Compound Interest" — every turn, Student Loan Officer gains 1 permanent HP (the debt grows). "Minimum Payment" — Brian can spend 5 Money during the encounter to deal 15 direct damage (paying down the debt), bypassing block. If Brian has 0 Money, Loan Officer gains +3 attack ("collections"). Cannot be reduced below 1 HP on the same turn a minimum payment is made.
- Flavor: "She smiles warmly as she explains how you'll be paying this off until the sun explodes. She has pamphlets."
- Drops: 10 XP, 2 Money, 2 Rep

**15. Terrible Roommate**
- Type: Normal | HP: 45 | Stage: Social
- Pattern: `[attack(5), debuff(energy, 1), attack(7), special, attack(6)]`
- Special: "Passive Aggression" — Terrible Roommate never attacks directly at first. For the first 3 turns, all "attacks" are actually debuffs disguised as attacks (they deal damage but also apply "Annoyed" — Brian's next card costs +1). On turn 4, if Brian has any "Annoyed" stacks, Roommate does a mega-attack equal to 5x the Annoyed stacks. "Dishes" — each turn, Roommate adds a "Dirty Dish" to Brian's deck (0 cost, does nothing, clogs hand). Dishes are removed from deck after combat.
- Flavor: "He eats your food, labels his with passive-aggressive sticky notes, and practices drums at 1 AM. He says he's 'an empath.'"
- Drops: 8 XP, 6 Money, 4 Rep

**16. Ex at a Party**
- Type: Normal | HP: 50 | Stage: Social
- Pattern: `[debuff(confidence, 2), attack(8), block(10), debuff(confidence, 3), attack(10)]`
- Special: "Awkward Encounter" — at the start of combat, Brian chooses: "Engage" (normal fight) or "Avoid" (Ex gets +20 HP but Brian starts with +2 Energy for 2 turns). "Mutual Friends" — every 3 turns, a "Mutual Friend" (10 HP) spawns that heals Ex for 5/turn. Mutual Friends don't attack but if Brian kills one, Ex gains +5 attack for 2 turns ("you made it weird"). Ignoring Mutual Friends lets them stack healing.
- Flavor: "She looks great. She's laughing. She's definitely laughing louder because she saw you. Her new partner is inexplicably taller than you."
- Drops: 9 XP, 5 Money, 6 Rep

**17. Group Project Freeloader**
- Type: Normal | HP: 40 | Stage: Social
- Pattern: `[block(12), block(15), debuff(energy, 1), attack(4), block(12)]`
- Special: "Doing Nothing" — Freeloader has extremely high block but low attack. The catch: a hidden "Presentation Timer" counts down from 8 turns. If the Freeloader survives 8 turns, the "Professor" arrives and deals 25 damage to Brian ("you get a C"). Freeloader's block doubles on any turn Brian plays fewer than 3 cards (the Freeloader thrives on inaction). Playing 5 cards in a single turn breaks through all block that turn ("doing their work for them").
- Flavor: "He says 'I'll do the conclusion.' The conclusion is one sentence copied from the introduction. He gets the same grade as you."
- Drops: 7 XP, 3 Money, 2 Rep

**18. Tinder Date Gone Wrong**
- Type: Normal | HP: 45 | Stage: Social
- Pattern: `[attack(7), debuff(confidence, 2), special, attack(9), debuff(confidence, 1)]`
- Special: "Catfish Reveal" — the enemy's HP bar is hidden for the first 2 turns (you don't know what you're getting into). "Red Flags" — each turn, a random "Red Flag" appears that modifies the fight: "Talks About Their Ex" (+2 to all debuffs), "Chews With Mouth Open" (Brian loses 1 HP/turn from disgust), "MLM Pitch" (Brian must discard 1 card or take 5 damage), "Surprise They're Married" (spawns "Angry Spouse" with 20 HP). Only one Red Flag active at a time.
- Flavor: "Their profile said '6 foot.' Their personality said '6 feet under.' They brought their emotional support iguana."
- Drops: 8 XP, 7 Money, 5 Rep

**19. Bouncer**
- Type: Normal | HP: 60 | Stage: Social
- Pattern: `[block(15), attack(10), attack(12), block(20)]`
- Special: "ID Check" — at the start, Brian must "present ID" by playing a card. If the card costs 0 or 1, the ID is "fake" — Bouncer gains +5 strength permanently. If 2+, Brian passes. "Velvet Rope" — Bouncer has a permanent 5 damage shield (first 5 damage each turn is negated). "Call for Backup" — below 25% HP, Bouncer summons "Second Bouncer" (25 HP) with the same 5 damage shield.
- Flavor: "His neck is thicker than your torso. He looks at your ID like it personally insulted his mother. The line behind you is judging."
- Drops: 9 XP, 8 Money, 4 Rep

**20. Quarter-Life Crisis**
- Type: Elite | HP: 85 | Stage: Social
- Pattern: `[debuff(confidence, 3), attack(10), debuff(energy, 1), debuff(draw, 1), multi(5, 4), heal(10)]`
- Special: "What Am I Doing With My Life?" — Quarter-Life Crisis mirrors Brian's stats. If Brian has high confidence, QLC has high attack. If Brian has high block, QLC has high block. It's fighting yourself. "Comparison Trap" — each turn, QLC shows Brian a "peer" who's doing better: +2 to all debuff values for that turn. "Spiral" — if Brian has 3+ debuffs active simultaneously, QLC heals to full HP once (one-time trigger). "Breakthrough" — dealing 20+ damage in a single turn removes all active debuffs from Brian (moment of clarity).
- Flavor: "Everyone from high school is getting married. You're eating cereal at 4 PM in underwear you've had since sophomore year. This is fine."
- Drops: 22 XP, 15 Money, 12 Rep

**21. The Landlord**
- Type: Elite | HP: 90 | Stage: Social
- Pattern: `[attack(8), buff(strength, 2), debuff(money, 8), attack(12), block(18), special]`
- Special: "Rent Is Due" — every 3 turns, Brian must pay "rent" by either: spending 10 Money, discarding 2 cards, or taking 15 damage. "Security Deposit" — Landlord starts with a 20-point shield that can only be broken by playing 3+ cards in a single turn. "Maintenance Request Ignored" — each turn there's a 30% chance a "Broken Thing" appears (pipe leak: Brian takes 2 damage/turn, broken heater: Brian's cards cost +1, roach: Brian discards 1 random card/turn). Broken Things persist until Brian spends 1 Energy to "fix it himself."
- Flavor: "He hasn't fixed the sink in four months but texts you about rent at midnight on the 1st. His name is also Brian, which makes everything worse."
- Drops: 20 XP, 8 Money, 8 Rep

**22. Thesis Committee**
- Type: Elite | HP: 100 | Stage: Social
- Pattern: `[debuff(confidence, 2), attack(9), debuff(draw, 1), multi(6, 3), attack(14), special]`
- Special: "Three Judges" — Thesis Committee is actually 3 professors sharing one HP pool but each with different mechanics. Professor A (attacks when Brian plays attack cards), Professor B (debuffs when Brian plays skill cards), Professor C (heals the committee 8 HP when Brian plays power cards). Brian must choose card types carefully. "Tough Question" — every 3 turns, a random card in Brian's hand is "questioned" — it costs double until played. "Defense Successful" — if Brian deals 15+ damage in back-to-back turns, one professor is "convinced" and stops contributing (their mechanic is disabled).
- Flavor: "One of them is asleep. One hates your topic. One is your advisor and she looks more nervous than you do."
- Drops: 25 XP, 12 Money, 10 Rep

**23. Student Debt (Final Form)**
- Type: Boss | HP: 180 | Stage: Social
- Pattern: `[attack(10), buff(strength, 2), debuff(money, 10), multi(5, 4), debuff(energy, 1), attack(15), special]`
- Special: "Compound Interest" — Student Debt gains +1 max HP every turn (permanent, uncapped). "Grace Period" — for the first 2 turns, Student Debt doesn't attack (Brian's grace period). "Consolidation" — Brian can spend all his Energy in a turn (minimum 3) to deal massive damage equal to 8x Energy spent, but draws 0 cards next turn. "Default" — if Brian takes 3 consecutive turns without dealing damage, Student Debt doubles its strength. "IBR Plan" — a one-time option to halve Student Debt's current attack permanently, but the fight lasts 5 more turns minimum (new HP added). "Forgiveness?" — at 10% HP, Student Debt offers "forgiveness": Brian can end the fight but loses 50% of all Money earned this run. Refusing triggers a rage phase with +10 strength.
- Flavor: "It's been growing since you were 18. It has its own zip code now. It sends you letters addressed to 'Current Resident / Forever Debtor.'"
- Drops: 50 XP, 10 Money, 20 Rep

**24. Your Twenties**
- Type: Boss | HP: 200 | Stage: Social
- Pattern: `[multi(6, 4), debuff(confidence, 4), attack(14), debuff(draw, 2), buff(strength, 3), heal(15), special]`
- Special: "Time Flies" — this fight has a 15-turn hard limit. After 15 turns, the encounter ends regardless, and Brian's performance determines rewards (full rewards at 100% HP defeated, scaling down). "The Best Years of Your Life" — Your Twenties steals one of Brian's buffs each turn and uses it. If Brian has no buffs, it steals 1 Energy instead. "FOMO" — each turn, Your Twenties shows two actions and Brian picks which one it does (choose your poison). "Nostalgia" — below 30% HP, Your Twenties replays its strongest previous attack each turn in addition to its current one (you can't stop reliving it). "Wasted Potential" — any turn Brian plays only 1 card, Your Twenties heals 20 HP.
- Flavor: "They told you these would be the best years of your life. They were. That's the terrifying part."
- Drops: 55 XP, 30 Money, 25 Rep

---

# STAGE 3: CAREER (Brian Age 26-35)

**25. The Commute**
- Type: Normal | HP: 55 | Stage: Career
- Pattern: `[attack(7), debuff(energy, 1), attack(9), attack(7), debuff(draw, 1)]`
- Special: "Traffic" — The Commute has a "Traffic Level" starting at 1 that increases by 1 each turn (max 5). All of its attack values are multiplied by (Traffic Level / 3, rounded up). "Road Rage" — if Brian plays 3+ attack cards in one turn, Traffic Level decreases by 1 (aggressive driving works). "Carpool Lane" — if Brian plays exactly 2 cards in a turn, The Commute skips its next attack (smooth sailing). "Podcast" — once per fight, Brian can "put on a podcast" (play no cards for a turn) to gain +2 draw and +1 Energy next turn, but The Commute attacks normally.
- Flavor: "It's sentient now. It feeds on your frustration. Exit 42 has been 'under construction' since the Eisenhower administration."
- Drops: 10 XP, 8 Money, 3 Rep

**26. Reply All Email Chain**
- Type: Normal | HP: 50 | Stage: Career
- Pattern: `[debuff(draw, 1), attack(6), debuff(energy, 1), attack(8), special]`
- Special: "Infinite Thread" — every turn, Reply All adds a "CC" (5 HP minion that deals 2 damage/turn). CCs keep spawning every turn with no cap (the thread grows). Killing a CC has a 50% chance to spawn 2 more CCs ("someone replies to clarify"). "Unsubscribe" — playing 3 cards of the same type (all attacks, all skills, etc.) in one turn kills all current CCs. "Mute Thread" — Brian can skip his entire turn to remove himself from the chain for 2 turns (no CCs spawn, but Reply All itself still attacks).
- Flavor: "It started with 'Who left their lunch in the fridge?' It's now 47 emails long. Someone just replied 'Please remove me from this list.' To everyone."
- Drops: 9 XP, 7 Money, 2 Rep

**27. Imposter Syndrome**
- Type: Normal | HP: 60 | Stage: Career
- Pattern: `[debuff(confidence, 3), attack(8), debuff(confidence, 2), block(15), debuff(confidence, 4)]`
- Special: "They're Onto You" — Imposter Syndrome's attack power scales with the number of confidence debuffs currently on Brian (+2 per stack). "Fake It" — attack cards do double damage to Imposter Syndrome, but each attack card played adds 1 confidence debuff to Brian (proving yourself feels fake). "Til You Make It" — if Brian's confidence debuffs ever reach 10, Imposter Syndrome instantly heals to full HP. "Breakthrough" — reducing Imposter Syndrome to 0 HP removes all confidence debuffs.
- Flavor: "Everyone at work is smarter than you. They all know what they're doing. Any minute now someone will tap you on the shoulder and say 'We know.'"
- Drops: 11 XP, 9 Money, 5 Rep

**28. The Living Spreadsheet**
- Type: Normal | HP: 65 | Stage: Career
- Pattern: `[attack(7), buff(strength, 1), multi(3, 4), debuff(draw, 1), attack(10)]`
- Special: "Formulas" — The Spreadsheet tracks every card Brian plays by cost. After 5 turns, it calculates Brian's "average card cost" and adjusts: if average > 2, it attacks harder (+5 to all attacks). If average < 1, it blocks more (+10 to all blocks). If exactly between 1-2, it does nothing for a turn (balanced budget). "Circular Reference" — once per fight, Spreadsheet freezes for 1 turn (#REF! error), taking double damage. Triggered randomly. "Pivot Table" — at 50% HP, Spreadsheet rotates its pattern (reverses the order).
- Flavor: "Cell B7 just winked at you. The VLOOKUP is returning feelings. You're pretty sure the macro is sentient and it's filing its own TPS reports."
- Drops: 10 XP, 10 Money, 3 Rep

**29. LinkedIn Influencer**
- Type: Normal | HP: 50 | Stage: Career
- Pattern: `[buff(strength, 2), attack(9), debuff(confidence, 2), heal(8), attack(7)]`
- Special: "Agree?" — every turn, LinkedIn Influencer posts a "Hot Take." Brian can "Like" it (do nothing, Influencer gains +2 strength) or "Disagree" (play 3+ cards, Influencer takes 5 bonus damage but Brian loses 2 Rep for the encounter). "Networking" — Influencer heals 3 HP for every buff active on itself. "Humble Brag" — every time Influencer buffs itself, Brian gets a "Inspiration" debuff that deals 1 damage/turn (toxic positivity).
- Flavor: "He's 'thrilled to announce' something for the ninth time today. His profile says 'Thought Leader' without a trace of irony. He typed 'Agree?' unironically."
- Drops: 8 XP, 6 Money, 7 Rep

**30. Unnecessary Meeting**
- Type: Normal | HP: 55 | Stage: Career
- Pattern: `[debuff(energy, 1), debuff(draw, 1), attack(5), debuff(energy, 1), heal(10)]`
- Special: "Could've Been an Email" — Unnecessary Meeting cannot be killed by damage alone. It has a "Boredom Meter" that fills by 1 each turn. At 10 Boredom, the meeting ends (Brian wins). BUT playing cards REDUCES Boredom by 1 per card played (engaging with the meeting prolongs it). The optimal strategy is to play as few cards as possible while surviving. "Action Items" — every 3 turns, Brian receives an "Action Item" (useless card that clogs hand, costs 1 to discard). Meeting heals 10 HP/turn.
- Flavor: "The agenda says '30 minutes.' That was 90 minutes ago. Someone is sharing their screen and it's just their desktop wallpaper. Nobody has noticed."
- Drops: 7 XP, 8 Money, 2 Rep

**31. Open Floor Plan Office**
- Type: Normal | HP: 70 | Stage: Career
- Pattern: `[multi(3, 5), debuff(confidence, 1), attack(8), debuff(draw, 1), multi(2, 6)]`
- Special: "No Escape" — Brian cannot block more than 10 damage per turn (there are no walls). "Distractions" — each turn, a random card in Brian's hand is replaced with "Chat With Coworker" (costs 1, does nothing, returns original card next turn). "Noise Cancelling Headphones" — if Brian plays exactly 2 cards in a turn (focused), he gains 5 block and +1 draw next turn. Playing 4+ cards (making noise) causes Office to gain +3 attack next turn.
- Flavor: "You can hear Dave chewing. You can hear Janet's divorce proceedings. You can hear the quiet desperation of 40 people pretending this is 'collaborative.'"
- Drops: 11 XP, 9 Money, 4 Rep

**32. Performance Review**
- Type: Elite | HP: 100 | Stage: Career
- Pattern: `[debuff(confidence, 3), attack(12), debuff(energy, 1), multi(6, 3), buff(strength, 2), special]`
- Special: "Metrics" — Performance Review tracks Brian's performance across the entire fight. Every card Brian plays adds to a "Productivity Score." Attack cards = 2 points, Skill cards = 1 point, Power cards = 3 points. Every 15 points, Performance Review takes 10% more damage from all sources (stacking). Below 30 points at turn 5, Brian gets "PIP'd" — all enemies gain +3 attack for rest of encounter. "360 Review" — at 50% HP, Brian's own cards deal 50% reduced damage for 2 turns (self-doubt from feedback). "Exceeds Expectations" — killing Performance Review in under 6 turns doubles XP reward.
- Flavor: "Your manager is reading directly from a form. He checks a box that says 'Meets Expectations.' He says 'You're really killing it, sport.' He does not know what you do."
- Drops: 25 XP, 18 Money, 12 Rep

**33. Corporate Synergy**
- Type: Elite | HP: 110 | Stage: Career
- Pattern: `[buff(strength, 3), attack(10), block(20), debuff(draw, 2), multi(7, 3), heal(12)]`
- Special: "Buzzword Shield" — Corporate Synergy has a rotating shield that can only be broken by a specific card type each turn (announced at start of turn: "Attack Required" / "Skill Required" / "Power Required"). Playing the wrong type does 0 damage. Playing the right type does double damage. "Restructuring" — at 60% and 30% HP, Corporate Synergy "restructures": shuffles its pattern randomly and gains +2 strength. "Synergy" — if Brian plays 2+ cards of the same type in a turn, all damage that turn is tripled (actual synergy). "Leveraging Resources" — steals Brian's most recently gained buff each turn.
- Flavor: "It's not a meeting. It's a 'collaborative ideation sprint.' It's not a layoff. It's a 'strategic resource optimization.' It's not alive. Wait — yes it is."
- Drops: 28 XP, 20 Money, 10 Rep

**34. The Deadline**
- Type: Elite | HP: 120 | Stage: Career
- Pattern: `[attack(8), buff(strength, 2), attack(12), buff(strength, 3), multi(5, 5), attack(20)]`
- Special: "Approaching" — The Deadline gets +3 strength every turn automatically (it's getting closer). "Crunch Time" — Brian gains +1 Energy each turn (adrenaline), but takes 3 unavoidable damage each turn (stress). "Extension" — once per fight, Brian can "ask for an extension" by not attacking for a full turn. This resets Deadline's strength to 0 but heals it for 20 HP. "Shipped" — dealing 25+ damage in a single turn triggers "Just Ship It" — Deadline loses all buffs and takes double damage next turn. Race against exponentially scaling damage.
- Flavor: "It was supposed to be done last Friday. Then Monday. Now it's 'EOD today or else.' The 'or else' has teeth."
- Drops: 30 XP, 22 Money, 8 Rep

**35. Middle Management Hydra**
- Type: Boss | HP: 220 | Stage: Career
- Pattern: `[attack(12), buff(strength, 2), debuff(confidence, 3), multi(6, 4), block(25), heal(15), special]`
- Special: "Cut One Head" — when Middle Management Hydra drops below 75%, 50%, and 25% HP, it splits: a "Junior Manager" (30 HP, attacks 8/turn) spawns. If a Junior Manager survives 4 turns, it "gets promoted" and merges back into the Hydra, healing it for 40 HP and giving +3 permanent strength. "Delegation" — Hydra redirects 50% of all damage it receives to a Junior Manager (if any exist). "Micromanagement" — each turn, Hydra picks one card type that Brian cannot play next turn (rotates). "Annual Review" — every 5 turns, all living Junior Managers attack simultaneously for 8 damage each. "Reorganization" — at 25% HP, Hydra fully heals all Junior Managers and gains 15 block per living Junior Manager.
- Flavor: "You cut one manager and two more appear at the all-hands. They all have the same khakis. They're all named 'Mike.' The org chart looks like a Lovecraftian family tree."
- Drops: 55 XP, 35 Money, 20 Rep

**36. The Job That Defines You**
- Type: Boss | HP: 250 | Stage: Career
- Pattern: `[debuff(confidence, 4), attack(14), debuff(energy, 2), multi(8, 3), buff(strength, 3), block(30), special]`
- Special: "Identity Crisis" — The Job copies Brian's entire deck composition. If Brian has mostly attack cards, The Job has high attack. If Brian has mostly defense, The Job has high block. It literally becomes what you've become. "Work-Life Balance" — a bar tracks Brian's "balance." Attack cards move it toward "Work," skill cards toward "Life." If the bar maxes on either side, Brian takes 20 damage (burnout or complacency). Keeping it centered gives Brian +1 Energy/turn. "Golden Handcuffs" — Brian cannot flee this encounter. "Sunday Scaries" — every 4th turn, Brian's entire hand is replaced with "Dread" cards (0 cost, do 1 damage each, but there are 7 of them). "Retirement" — at 15% HP, The Job offers Brian a deal: end the fight, but permanently lose 1 max Energy for future encounters. Refusing gives The Job +5 strength for the rest of the fight.
- Flavor: "Someone asks what you do. You start to answer and realize you can't remember who you were before this. Your email signature is longer than your diary entries."
- Drops: 60 XP, 40 Money, 25 Rep

---

# STAGE 4: LATE GAME (Brian Age 36-50)

**37. Brian's Receding Hairline**
- Type: Normal | HP: 75 | Stage: Late Game
- Pattern: `[attack(8), debuff(confidence, 3), attack(10), buff(strength, 1), multi(4, 4)]`
- Special: "Denial" — for the first 3 turns, Brian cannot target Hairline directly (he's in denial). Brian can only damage it with indirect/AoE effects. After turn 3, denial breaks and normal attacks work. "Rogaine" — Brian can spend 10 Money at any point to reduce Hairline's attack by 5 permanently (topical solution). "Combover" — each confidence debuff on Brian gives Hairline +5 block (trying to cover it up makes it stronger). "Acceptance" — if Brian takes Hairline below 20% HP without spending any Money, bonus Rep awarded (self-acceptance).
- Flavor: "It started at the temples. Then the crown. Your barber started charging less. The wind is now your enemy."
- Drops: 14 XP, 8 Money, 8 Rep

**38. The Guilt Elemental (Aging Parents)**
- Type: Normal | HP: 80 | Stage: Late Game
- Pattern: `[debuff(confidence, 4), attack(7), debuff(energy, 1), heal(8), debuff(confidence, 3)]`
- Special: "You Never Call" — Guilt Elemental gains +2 strength for every turn Brian doesn't play a skill card (skill cards represent "calling home"). "Mother's Sighs" — instead of taking damage normally, 25% of all damage Brian deals to Guilt Elemental is converted into self-damage ("you're hurting them by fighting"). "Guilt Trip" — every 3 turns, Brian must discard his highest-cost card ("they sacrificed so much for you"). "Unconditional Love" — Guilt Elemental will not attack if Brian is below 10 HP. It just debuffs.
- Flavor: "It manifests as a phone that hasn't been answered and a refrigerator full of food 'just in case you visit.' It smells like your childhood home."
- Drops: 12 XP, 10 Money, 6 Rep

**39. Lower Back Pain**
- Type: Normal | HP: 90 | Stage: Late Game
- Pattern: `[attack(9), debuff(energy, 2), attack(11), debuff(draw, 1), multi(5, 3)]`
- Special: "Thrown Out" — at the start of combat, Brian's max Energy is reduced by 1 for the entire fight (back is out). "Chiropractor" — once per fight, Brian can "visit the chiropractor" by playing exactly 3 cards in ascending cost order (1, 2, 3 or 0, 1, 2, etc.) — this restores the lost Energy and deals 15 damage. "Ibuprofen" — Brian can play 2 cards face down (random cards from hand, removed for the turn) to ignore all damage this turn (painkillers). "Age-Appropriate Injury" — triggered by sleeping wrong. That's it. That's the mechanic. It just happened.
- Flavor: "You sneezed and something shifted. You picked up a sock and the universe punished you. You are a load-bearing structure and you have failed."
- Drops: 13 XP, 9 Money, 4 Rep

**40. The Midlife Crisis (Physical Manifestation)**
- Type: Normal | HP: 85 | Stage: Late Game
- Pattern: `[buff(strength, 3), attack(12), debuff(confidence, 2), special, multi(5, 4)]`
- Special: "Convertible" — Midlife Crisis drives a sports car. Each turn, it "revs the engine" — Brian must choose to "race" (play 4+ cards, dealing double damage but taking 8 self-damage) or "let it pass" (play 2 or fewer cards, Crisis gains +4 strength but Brian takes no extra damage). "Hair Dye" — Crisis changes its element/weakness each turn (odd turns: weak to attacks, even turns: weak to skills). Hitting the weakness does 1.5x damage. "Younger Woman" — at 50% HP, Crisis summons "Questionable Decision" (20 HP) that applies a random debuff each turn.
- Flavor: "It's wearing leather pants. It just bought a guitar. It wants you to know it's training for a half-marathon. It is you. It is the you that panics."
- Drops: 15 XP, 12 Money, 7 Rep

**41. The Tax Audit (Lovecraftian)**
- Type: Normal | HP: 95 | Stage: Late Game
- Pattern: `[attack(8), debuff(money, 15), attack(10), debuff(energy, 1), multi(4, 5)]`
- Special: "Incomprehensible Forms" — every turn, Brian receives a "Form" card in his hand. Forms cost 2 and do nothing when played, BUT if Brian accumulates 3 unplayed Forms, he takes 25 damage (audit failure). Playing a Form gives Tax Audit 5 block (paperwork is its armor). "Deductions" — every attack card Brian plays "deducts" 3 HP from Tax Audit, but every block card "raises a red flag" giving Tax Audit +1 strength. "The IRS Sees All" — Tax Audit's HP bar is always visible AND it can see Brian's hand (chooses the most punishing pattern based on Brian's cards).
- Flavor: "The forms aren't in English anymore. They're in a language that predates language. The auditor has too many eyes. She says you owe 'more than money.'"
- Drops: 14 XP, 5 Money, 5 Rep

**42. Nostalgia**
- Type: Normal | HP: 70 | Stage: Late Game
- Pattern: `[debuff(confidence, 2), heal(12), debuff(confidence, 3), block(20), heal(8)]`
- Special: "The Good Old Days" — Nostalgia heals instead of attacking and is entirely defensive. The threat: each heal also applies 2 stacks of "Wistful" to Brian. At 15 "Wistful" stacks, Brian loses the fight (consumed by the past). Wistful stacks can be removed by dealing 10+ damage in a single card play (snapping out of it removes 3 stacks). "Remember When..." — every 3 turns, Nostalgia replays the strongest card Brian has played this fight, targeting Brian. "Rose-Tinted" — Nostalgia takes 30% less damage from cards that have been upgraded (you can't improve the past).
- Flavor: "It's not trying to kill you. It's trying to keep you. That's worse."
- Drops: 11 XP, 8 Money, 10 Rep

**43. The Concept of Mortality**
- Type: Normal | HP: 100 | Stage: Late Game
- Pattern: `[debuff(confidence, 5), attack(6), debuff(draw, 2), attack(8), special]`
- Special: "Memento Mori" — Mortality cannot be killed. It can only be reduced to 1 HP, at which point it flees ("not today"). "Inevitability" — Mortality gains +1 attack permanently each turn, with no cap. The fight is always a race. "Cold Sweat" — every 4 turns, Brian wakes up at 3 AM (loses all block, Energy resets to 1 for that turn). "Doctor's Appointment" — Brian can spend 15 Money once to gain "Clean Bill of Health" (immune to debuffs for 3 turns). "The Talk" — at 50% HP, Mortality stops attacking for 1 turn and asks Brian a question. There's no gameplay effect. It just sits there.
- Flavor: "It doesn't speak. It just sits in the corner of your peripheral vision. You saw it at a funeral last year. It waved."
- Drops: 16 XP, 10 Money, 12 Rep

**44. Regret**
- Type: Elite | HP: 130 | Stage: Late Game
- Pattern: `[debuff(confidence, 4), attack(12), debuff(energy, 2), multi(6, 4), debuff(draw, 2), heal(15), special]`
- Special: "The Road Not Taken" — at the start of combat, Regret shows Brian the 3 most recently skipped card rewards from this run. Regret gains a buff for each one (+3 strength per skipped attack card, +10 block per skipped skill card, +15 heal per skipped power card). "If Only" — every time Brian plays a card that costs 3+, Regret says "you should have played that sooner" and the card costs +1 permanently for the rest of the run. "Hindsight" — Regret always counters the last card type Brian played (if Brian last played an attack, Regret blocks. If Brian last played a skill, Regret attacks). "Closure" — dealing 20+ damage in a single card play has a 25% chance to remove one of Regret's buffs permanently.
- Flavor: "It looks like every door you didn't walk through. It speaks in the voice of every person you didn't say 'I love you' to in time."
- Drops: 30 XP, 18 Money, 15 Rep

**45. The Homeowners Association**
- Type: Elite | HP: 140 | Stage: Late Game
- Pattern: `[debuff(money, 10), attack(10), buff(strength, 2), debuff(confidence, 3), multi(5, 5), block(25)]`
- Special: "Violation Notice" — every turn, Brian receives a "Violation" for a random thing (grass too long, wrong mailbox color, existing). Each Violation reduces Brian's max HP by 3 for the fight (stacking). Playing a 0-cost card "appeals" a Violation (removes one). "Committee Vote" — every 4 turns, the HOA "votes" — if Brian has more Violations than cards in hand, the HOA doubles its attack for 2 turns. "Karen" — at 50% HP, the HOA summons "The Head of the Committee" (40 HP) who copies every debuff the HOA applies and applies it a second time. "Fine" — the HOA applies a "fine" of 5 Money per Violation at end of combat.
- Flavor: "Your fence is 0.3 inches too tall. Your lawn has a dandelion. You exist in a way that violates Section 14, Subsection B. They have a clipboard."
- Drops: 32 XP, 10 Money, 14 Rep

**46. The Years Themselves**
- Type: Elite | HP: 160 | Stage: Late Game
- Pattern: `[attack(10), buff(strength, 1), debuff(draw, 1), attack(14), debuff(energy, 1), multi(5, 5), special]`
- Special: "Passage of Time" — this encounter starts at difficulty 1 and increases by 1 each turn. All enemy stats scale with difficulty (+1 to all values per difficulty level). "Fast Forward" — Brian can "skip ahead" by exhausting a card from his hand, reducing enemy HP by 10 but increasing difficulty by 2. "Slow Down" — playing only 1 card in a turn reduces difficulty by 1 (minimum 1). "Birthday" — every 5 turns, Brian ages a year: gains 5 max HP (wisdom) but permanently loses 1 card draw (slowing down). These effects persist for the rest of the run. "Memory" — every enemy Brian has fought this run appears as a 1 HP "echo" once during this fight, doing 1 damage each.
- Flavor: "Tuesday. Tuesday. Tuesday. Wait, it's March. Wait, it's November. When did you turn 43? Who authorized this?"
- Drops: 35 XP, 20 Money, 12 Rep

**47. Brian's Back (Final Form)**
- Type: Boss | HP: 280 | Stage: Late Game
- Pattern: `[multi(8, 4), debuff(energy, 2), attack(18), debuff(draw, 2), buff(strength, 3), block(30), special]`
- Special: "Spinal Column" — the boss is Brian's own spine. It has 5 "vertebrae" that act as phases (56 HP each). Destroying each vertebra changes the fight: V1 (Lumbar) — enemy does AoE damage. V2 (Thoracic) — enemy copies Brian's last played card. V3 (Cervical) — enemy debuffs are doubled. V4 (Sacral) — enemy heals 10/turn. V5 (Coccyx) — enemy has permanent 15 block. "Posture Check" — every 3 turns, Brian must play cards totaling exactly 5 cost (not more, not less) or take 20 damage (bad posture). "Heating Pad" — Brian can skip a turn to heal 10 HP and gain +1 Energy next turn. "Chiropractic Adjustment" — dealing exactly 15 damage in one hit bypasses current vertebra's special mechanic for 2 turns.
- Flavor: "It was loyal for 36 years. It asked for nothing. And you repaid it by sitting in an office chair designed by your enemies. This is its revenge."
- Drops: 65 XP, 35 Money, 25 Rep

**48. The Unlived Life**
- Type: Boss | HP: 300 | Stage: Late Game
- Pattern: `[debuff(confidence, 5), attack(15), debuff(draw, 3), multi(7, 5), debuff(energy, 2), heal(20), buff(strength, 4), special]`
- Special: "Parallel Brian" — The Unlived Life is the version of Brian who made every different choice. It has the inverse of Brian's current build: if Brian focused on attack cards, Unlived Life has high defense, and vice versa. It is always your opposite. "Paths" — at the start of each turn, two "paths" appear. Brian chooses one — each gives a different temporary buff but empowers a different aspect of the enemy. "What If?" — every 5 turns, Unlived Life shows Brian what his life "could have been" — all cards in Brian's hand are replaced with premium versions (upgraded, reduced cost) for one turn, then removed (they weren't real). "Acceptance" — the fight can only truly end when Brian is below 25% HP AND deals the killing blow (you have to be vulnerable to accept). If Brian kills it while above 25% HP, it revives at 30% HP. "Better Than You" — Unlived Life always has +5 more max HP than Brian's current HP (it's always slightly ahead).
- Flavor: "He has your face but better skin. He wrote that novel. He called his parents more. He is everything you were 'going to be.' He is so, so tired of being perfect."
- Drops: 70 XP, 40 Money, 30 Rep

---

# STAGE 5: EXISTENTIAL/ENDLESS (Brian Age 50+)

**49. The Algorithm**
- Type: Normal | HP: 110 | Stage: Existential
- Pattern: `[debuff(draw, 2), attack(8), buff(strength, 2), multi(4, 5), debuff(energy, 1)]`
- Special: "Personalized" — The Algorithm tracks every card Brian plays across the entire run. It knows Brian's most-played card type and is immune to it. Brian must use his least-played card type to deal full damage. "Engagement" — every turn, The Algorithm shows Brian a "recommended" card (added to hand, costs 0, does 3 damage but heals Algorithm for 6). Playing it is tempting but feeds it. "Infinite Scroll" — if Brian plays 5+ cards in a turn, he's "hooked" — draw 2 extra cards next turn but lose 1 Energy (doomscrolling). "Shadow Ban" — if Brian doesn't deal damage for 2 consecutive turns, Algorithm becomes invisible (can't be targeted) for 1 turn.
- Flavor: "It knows you better than you know yourself. It knows you'll click. It knows you'll scroll. It knows about that thing you searched at 2 AM. It always knows."
- Drops: 18 XP, 12 Money, 8 Rep

**50. Brian's Google Search History**
- Type: Normal | HP: 120 | Stage: Existential
- Pattern: `[debuff(confidence, 4), attack(10), debuff(confidence, 3), multi(5, 4), attack(12)]`
- Special: "Exposed" — Search History's attacks are themed around Brian's life stages. Every 2 turns, it "reveals" a search: "Am I normal?" (+3 attack), "How to talk to girls" (+confidence debuff), "Is it too late to change careers" (+energy debuff), "Symptoms of [anything]" (Brian takes 5 panic damage). "Incognito Mode" — once per fight, Brian can go "incognito" (all cards cost 0 for one turn but Brian's HP is visible to all future enemies in the run — +5% enemy damage permanently). "Clear History" — dealing 30+ damage in one turn "deletes" the current search and removes its debuff.
- Flavor: "3:47 AM: 'Can dogs be depressed or is he just vibing.' 3:48 AM: 'Average lifespan of a golden retriever.' 3:49 AM: 'Why am I crying about a hypothetical dog.'"
- Drops: 16 XP, 10 Money, 10 Rep

**51. A Younger Version of Brian**
- Type: Normal | HP: 100 | Stage: Existential
- Pattern: `[attack(12), buff(strength, 2), attack(14), buff(strength, 1), multi(6, 3)]`
- Special: "Potential" — Young Brian starts with very high attack but it decreases by 1 each turn (potential fading). "Mirror" — Brian cannot block in this fight. Block cards instead deal their block value as damage (confronting yourself). "Disappointment" — each time Brian takes damage, Young Brian says something that increases its attack by 1 ("I thought we'd be further along by now"). "Reconciliation" — if Brian reduces Young Brian to exactly 1 HP (not 0), the fight ends peacefully with double rewards. Overkilling gives normal rewards.
- Flavor: "He's 19 and invincible and has all his hair and a plan and doesn't know about taxes yet. You hate him. You love him. He has no idea."
- Drops: 15 XP, 14 Money, 12 Rep

**52. The Concept of Monday**
- Type: Normal | HP: 130 | Stage: Existential
- Pattern: `[debuff(energy, 2), attack(9), debuff(draw, 2), attack(9), debuff(energy, 2), attack(9)]`
- Special: "Recurring" — the Concept of Monday cannot die permanently. Reducing it to 0 HP only makes it "go away" until next turn, when it returns with 30% HP (but retains all debuffs). Brian must kill it 3 separate times to win ("Monday always comes back"). "Weekend" — after each "kill," Brian gains a "Weekend" turn where Energy is doubled and all cards cost 1 less (the brief respite). "Case of the Mondays" — every debuff on Brian heals Monday for 3 HP/turn. "Garfield Was Right" — if Brian has no debuffs when Monday returns, Monday returns at only 15% HP.
- Flavor: "It's not a day. It's a feeling. It's the alarm. It's the commute. It's the fluorescent lights and the cold coffee. It is eternal. It is inexorable. It is Monday."
- Drops: 17 XP, 11 Money, 6 Rep

**53. His Own Wikipedia Page**
- Type: Normal | HP: 115 | Stage: Existential
- Pattern: `[attack(8), debuff(confidence, 3), heal(10), attack(11), debuff(confidence, 4)]`
- Special: "Edit War" — the Wikipedia Page changes stats every 2 turns as it's "edited" by anonymous users. Stats randomly fluctuate by +/- 30%. "Citation Needed" — any of Brian's cards that deal more than 10 damage need "citation" — they deal half damage unless Brian plays a second card of the same type that turn (corroborating source). "Vandalism" — once per fight, the page is "vandalized" — enemy gains a random bizarre buff ("Brian is reportedly 47 feet tall": +20 HP, or "Brian invented the internet": +5 attack). "Deletion Vote" — at 25% HP, the page enters "Articles for Deletion." Brian has 3 turns to finish it or it deletes itself (Brian wins but gets 0 Rep reward).
- Flavor: "Under 'Early Life,' someone wrote 'Brian was born at a very young age.' The 'Legacy' section just says 'Pending.' The talk page is a warzone."
- Drops: 15 XP, 13 Money, 9 Rep

**54. The Void Where His Dreams Used to Be**
- Type: Normal | HP: 140 | Stage: Existential
- Pattern: `[debuff(draw, 3), debuff(energy, 1), attack(7), debuff(confidence, 5), heal(15)]`
- Special: "Emptiness" — The Void doesn't have a visible sprite. Just an absence. Brian's hand size is permanently reduced by 1 for this fight (the void consumes). "What Was It?" — each turn, a random card in Brian's deck is "forgotten" (removed from the fight, returned after). "Echo" — the Void occasionally plays back one of Brian's previously exhausted cards, targeting Brian. "Fill the Void" — Brian can play 5 cards in a single turn to "fill" it, dealing 20 bonus damage and restoring hand size. But next turn, hand size shrinks by 2 (the void is bigger now). "Acceptance" — playing 0 cards in a turn heals Brian for 8 (sitting with the emptiness).
- Flavor: "You were going to learn guitar. You were going to travel. You were going to write that book. This is where those things live now. It's very quiet here."
- Drops: 19 XP, 10 Money, 14 Rep

**55. The Heat Death of the Universe**
- Type: Normal | HP: 150 | Stage: Existential
- Pattern: `[attack(5), debuff(energy, 1), attack(5), debuff(draw, 1), attack(5), debuff(energy, 1)]`
- Special: "Entropy" — Heat Death does low, consistent damage that CANNOT be blocked, reduced, or prevented by any means. It's inevitable. "Cooling" — all of Brian's buffs lose 1 stack per turn (everything decays). "Thermodynamic Law" — Brian's Energy does not fully refresh each turn. Instead, unspent Energy carries over, but max Energy decreases by 1 every 4 turns (minimum 1). Conservation of energy — use it or lose capacity. "Last Light" — if Brian deals 50+ total damage in a single turn, time briefly reverses: restore 1 max Energy and all buffs refresh. But it can only happen twice (you can't beat entropy).
- Flavor: "In approximately 10^100 years, the last star will die. Brian thinks about this sometimes while eating breakfast. The cereal offers no comfort."
- Drops: 20 XP, 15 Money, 8 Rep

**56. Time Itself**
- Type: Elite | HP: 180 | Stage: Existential
- Pattern: `[attack(12), debuff(draw, 2), buff(strength, 2), multi(6, 5), debuff(energy, 2), attack(18), special]`
- Special: "Temporal Mechanics" — Time plays its pattern both forward AND backward simultaneously (first action and last action on turn 1, second and second-to-last on turn 2, etc. On the middle turn, it acts once but doubled). "Rewind" — every 3 turns, Time "rewinds" — Brian's HP, Energy, and hand return to the state they were in 2 turns ago (this can help or hurt). "Fast Forward" — Time can randomly skip Brian's next turn (25% chance each turn). "Paradox" — if Brian plays the same card twice in one turn, a "Paradox" occurs: the card is removed from the fight but Time takes 25 damage. "Grandfather Clause" — Time takes double damage from cards Brian has had since the start of the run (original deck cards).
- Flavor: "It doesn't attack you. You attack it. It just sits there and everything falls apart. It has been winning since the beginning and it has never tried."
- Drops: 40 XP, 25 Money, 18 Rep

**57. Brian's Legacy (Sentient)**
- Type: Elite | HP: 200 | Stage: Existential
- Pattern: `[debuff(confidence, 5), attack(14), debuff(draw, 2), multi(7, 4), heal(15), buff(strength, 3), special]`
- Special: "Judgment" — Legacy's strength is determined by Brian's total Rep earned across the entire run. High Rep = Legacy is weaker (it's satisfied). Low Rep = Legacy hits like a truck (it's angry). "What Will They Remember?" — Legacy has 3 "Aspects" that cycle: "Family" (heals when Brian blocks — defense is comfort), "Career" (gains strength when Brian attacks — aggression is ambition), "Who You Were" (does nothing but doubles next aspect's effect). Brian must manage which aspect is active. "Lasting Impact" — damage Brian deals to Legacy persists between encounters if Legacy isn't killed (it remembers). "Forgotten" — if Brian does nothing for 2 turns, Legacy starts to fade: -10 max HP permanently, but Brian takes 10 "grief" damage.
- Flavor: "It looks like your name on a building. Or a bench. Or a headstone. Or nothing at all. It keeps asking 'Was it enough?' and you keep not answering."
- Drops: 45 XP, 20 Money, 25 Rep

**58. The Anthropic Principle**
- Type: Elite | HP: 250 | Stage: Existential
- Pattern: `[buff(strength, 4), attack(15), debuff(confidence, 4), block(35), multi(8, 4), debuff(energy, 2), special]`
- Special: "Observer Effect" — The Anthropic Principle changes behavior based on whether Brian is "observing" it (playing cards) or not. When Brian plays cards, it attacks. When Brian plays no cards, it does nothing — but also heals to full. It only exists because Brian is looking at it. "Fine-Tuned" — every one of its stats is exactly calibrated to be slightly better than Brian's current stats (+1 to everything Brian has). "Why Is There Something Rather Than Nothing?" — once per fight, Brian can "stop existing" for a turn (skip turn entirely, become untargetable, but all buffs are cleared). This confuses the Principle, causing it to attack itself for 30 damage. "Participatory Universe" — Brian must play at least 1 card per turn or the encounter ends inconclusively (no rewards, no penalty — it's like it never happened).
- Flavor: "The universe is fine-tuned for your existence. Personally, you think it could have done a better job. You have lower back pain and a receding hairline."
- Drops: 48 XP, 22 Money, 20 Rep

**59. Everything Brian Has Ever Forgotten**
- Type: Boss | HP: 350 | Stage: Existential
- Pattern: `[multi(5, 7), debuff(confidence, 6), attack(18), debuff(draw, 3), buff(strength, 4), debuff(energy, 2), heal(25), special]`
- Special: "Total Recall" — this boss uses every card Brian has exhausted, removed, or not picked throughout the entire run. Each "forgotten" thing becomes an attack. More cards lost = more damage. "Where Did I Put My Keys?" — Brian's hand is shuffled every turn (card positions randomize, purely visual annoyance on purpose). "Tip of My Tongue" — each turn, one card in Brian's hand is "forgotten" — it becomes face-down and Brian must play it blind (could be great, could be terrible). "Proustian Rush" — playing a card from Brian's original starting deck triggers a "memory" — deals 15 bonus damage and heals Brian for 5 (nostalgia). "The Thing You Forgot to Tell Someone" — at 25% HP, the boss stops attacking for 2 turns. It just lists things. Then it comes back with +10 strength. "Forgiveness" — Brian can end the fight early by exhausting 5 cards permanently from his deck (letting go). This gives half rewards.
- Flavor: "Your first pet's name. Your locker combination. The thing your mother said that one time that made everything okay. It's all here. It's been waiting."
- Drops: 80 XP, 40 Money, 35 Rep

**60. The Person Brian Could Have Been**
- Type: Boss | HP: 500 | Stage: Existential
- Pattern: `[attack(20), buff(strength, 3), debuff(confidence, 6), multi(10, 4), block(40), debuff(energy, 3), heal(30), debuff(draw, 3), special]`
- Special: "Perfect" — this boss has exactly Brian's deck, but every card is the fully upgraded version. It plays optimally. "The Gap" — the difference between Brian's current HP and his max HP is added as bonus damage to every attack The Person makes (the gap between who you are and who you could've been). "Diminishing Returns" — The Person gets weaker each time Brian hits it for 20+ damage in one card play (its perfection cracks, -2 strength per big hit). "It's Not Too Late" — at 50% HP, The Person offers to "merge" — Brian can accept (fight ends, Brian gains a random permanent upgrade, but loses 20 max HP forever — you can't become them without giving up part of yourself) or refuse (The Person enters rage: double all stats for 3 turns, then reverts to normal). "Grace" — the fight can end peacefully if Brian survives for 20 turns without reducing The Person below 10% HP. The Person says "You did okay" and leaves. Full rewards, plus a unique relic. "Final Form" — below 10% HP, The Person becomes Brian. Same sprite, same stats, same everything. It does exactly what Brian does each turn, mirrored.
- Flavor: "He didn't waste that summer. He asked her out. He took the risk. He wrote the book. He looks at you not with contempt but with something worse: understanding."
- Drops: 100 XP, 50 Money, 50 Rep

---

# STAGE 6: SPECIAL ENCOUNTERS (Any Stage)

**61. DMV Visit**
- Type: Normal | HP: Scales (30 + 10 per stage) | Stage: Any
- Pattern: `[debuff(energy, 1), block(15), debuff(energy, 1), block(15), attack(5)]`
- Special: "Take a Number" — combat doesn't start for 2 turns. Brian draws cards and gains Energy but cannot act. The DMV cannot act. You're both just waiting. "Wrong Form" — every 3 turns, Brian's highest-cost card is replaced with "Wrong Form" (1 cost, does nothing, returns next turn). "Lunch Break" — at exactly 50% HP, the DMV takes a break. It heals 15% HP and skips its next turn. Brian also skips his next turn (the window closes). "Now Serving" — the DMV only takes damage from the first card played each turn (one window, one transaction). Additional cards do 0 damage to it.
- Flavor: "You've been here for three hours. Your number is 847. They just called 302. The clock on the wall has been stuck on 2:15 since the Clinton administration."
- Drops: 10 XP, 5 Money, 3 Rep (same regardless of stage)

**62. IKEA Assembly**
- Type: Normal | HP: Scales (35 + 10 per stage) | Stage: Any
- Pattern: `[attack(6), debuff(draw, 1), attack(8), debuff(confidence, 2), multi(3, 3)]`
- Special: "Instructions" — IKEA has 4 "phases" (legs, frame, shelves, hardware). Each phase requires Brian to play specific card sequences: Phase 1 — play 2 attacks (build structure). Phase 2 — play 2 skills (finesse). Phase 3 — play 1 of each type (everything together). Phase 4 — play any 4 cards (just force it). Completing a phase deals 25% of IKEA's HP in damage. Failing to complete the sequence within 2 turns adds an "Extra Piece" to Brian's deck (useless, persistent until IKEA is defeated). "Allen Wrench" — Brian's attack cards do 30% less damage (it's an Allen wrench, not a real tool). "Missing Piece" — at 25% HP, combat pauses. Brian must "find the piece" — skip a turn, then deal any damage to end the fight.
- Flavor: "The instructions show a happy cartoon man building it in four steps. You are on step two, day two. You have an extra screw. It was not included in the diagram. Fear."
- Drops: 12 XP, 3 Money, 2 Rep

**63. Jury Duty**
- Type: Normal | HP: Scales (40 + 10 per stage) | Stage: Any
- Pattern: `[debuff(energy, 1), attack(7), debuff(draw, 1), block(12), debuff(energy, 1)]`
- Special: "Civic Duty" — Brian cannot flee this encounter under any circumstances. "Deliberation" — every 2 turns, Brian must "vote" by playing either an attack card (guilty) or a skill card (not guilty). After 6 votes, if Brian played more attacks, the encounter takes 30 bonus damage (conviction). If more skills, Brian heals 20 HP (acquittal). Tie = nothing happens. "Sequestered" — Brian cannot use items or relics during this encounter (no outside influence). "Hung Jury" — if Brian doesn't vote for 2 consecutive voting rounds, the fight resets to 75% enemy HP.
- Flavor: "The defendant looks like your cousin. The prosecutor looks like your ex. The judge is asleep. You cannot leave. This is democracy."
- Drops: 8 XP, 15 Money, 5 Rep

**64. Flight Delay**
- Type: Normal | HP: Scales (45 + 10 per stage) | Stage: Any
- Pattern: `[debuff(energy, 2), block(20), debuff(draw, 1), heal(8), debuff(energy, 1)]`
- Special: "Delayed" — every turn, Flight Delay has a 30% chance to "update the departure time" — it heals 10% of max HP and all of Brian's buffs expire (reset). "Gate Change" — every 3 turns, the "gate changes" — Brian's entire hand is discarded and redrawn (you have to move to a new gate). "Middle Seat" — Brian's max hand size is reduced by 1 for this fight (cramped). "Standby" — Brian can skip his turn entirely to gain a "standby ticket" — next turn, all cards cost 0 (you finally boarded). Can only be used once. "Complimentary Peanuts" — once per fight, Brian heals 5 HP. Barely helps. That's the point.
- Flavor: "The board says 'On Time.' Then 'Delayed 30 min.' Then 'Delayed 2 hrs.' Then a symbol you don't recognize. A child is screaming. A different child is also screaming."
- Drops: 9 XP, 8 Money, 2 Rep

**65. Wedding of Someone You Barely Know**
- Type: Normal | HP: Scales (35 + 10 per stage) | Stage: Any
- Pattern: `[debuff(confidence, 2), attack(6), debuff(money, 10), debuff(confidence, 2), attack(8)]`
- Special: "Plus One?" — at the start, Brian chooses: bring a date (+3 max Energy but enemy has +20% HP, someone's watching) or go alone (-1 Energy but enemy has 20% less HP). "Open Bar" — each turn, Brian can "drink" (play 0 cards) to gain +2 Energy next turn but permanently lose 1 draw for the rest of the fight (the hangover follows). "Bouquet Toss" — at 50% HP, all players in the "area" (Brian + any summons) take 5 damage (scramble). "The Toast" — once per fight, the combat pauses for 1 turn (someone's giving a toast). No one acts. "Cash or Check" — encounter costs 10 Money to enter (the gift).
- Flavor: "You met the bride once at a barbecue in 2019. You are seated at Table 14, between a child and someone's recently divorced uncle. The DJ is playing 'Cha Cha Slide' like it's a cry for help."
- Drops: 6 XP, 2 Money, 8 Rep

**66. Surprise Birthday Party You Forgot About**
- Type: Normal | HP: Scales (40 + 10 per stage) | Stage: Any
- Pattern: `[multi(3, 4), debuff(confidence, 3), attack(8), debuff(confidence, 2), heal(5)]`
- Special: "SURPRISE!" — the first turn, Brian takes 10 unavoidable damage (shock) and all cards cost +1 for that turn (disoriented). "Whose Birthday?" — Brian doesn't know whose birthday it is. Each turn, a "guest" appears with a hint. After 3 hints, if Brian "guesses correctly" (plays a card costing exactly X, where X is revealed after the hints), he deals 30 bonus damage. Wrong guess: take 10 damage and confidence debuff. "No Gift" — Brian starts with -2 Rep for this encounter (he didn't bring anything). "Happy Birthday Song" — a 1-turn full stun occurs at a random point (everyone sings, you can't do anything). "Cake" — at 25% HP, Brian heals 15 HP. Even bad parties have cake.
- Flavor: "You walk in and forty people scream at you. You scream back. It's not your birthday. It's not anyone's birthday you remember. The cake says 'HAPYY BRITHDAY BIRAN.'"
- Drops: 10 XP, 5 Money, 6 Rep

**67. Phone Software Update**
- Type: Normal | HP: Scales (30 + 10 per stage) | Stage: Any
- Pattern: `[debuff(draw, 2), debuff(energy, 1), block(18), debuff(draw, 1), heal(10)]`
- Special: "Installing..." — Software Update has a "progress bar" starting at 0%. It goes up by 15% per turn. At 100%, it "installs" and gains +50% to all stats (the update makes it stronger, not better). Brian must kill it before it reaches 100% or face the powered-up version. "New Features" — at 30% and 60% progress, the Update gains a random new ability (new attack, new debuff, or a shield). "Restart Required" — at 50% HP, the fight "restarts" — Brian's hand is discarded and redrawn, Energy resets, but enemy HP does NOT reset (the restart was for Brian, not the update). "Terms and Conditions" — first turn, Brian must "accept" (play any card) or the fight cannot begin but the progress bar still ticks.
- Flavor: "It's been 'updating' for 40 minutes. The progress bar went backward. Your battery is at 3%. It says 'New features!' but won't say what they are. Trust the process."
- Drops: 7 XP, 4 Money, 1 Rep

**68. The Family Group Chat**
- Type: Elite | HP: Scales (70 + 15 per stage) | Stage: Any
- Pattern: `[multi(4, 5), debuff(confidence, 3), attack(10), debuff(energy, 1), heal(12), multi(3, 6)]`
- Special: "Notifications" — every turn, Brian receives 1-3 "Message" cards in his hand (cost 0, do nothing, take up hand space). Brian can "mute" by discarding 2 Messages, which prevents new Messages for 2 turns. "Uncle's Political Take" — every 4 turns, a "Hot Take" appears. Brian must respond (play an attack card, taking 5 self-damage from stress) or ignore it (Group Chat gains +4 strength for 2 turns from emboldening). "Mom's Forwarded Article" — once per fight, a "Article" card appears. Playing it heals Brian for 10 (she means well). Not playing it gives the Group Chat +3 attack (she noticed). "Meme from Dad" — a completely random effect occurs. Could heal Brian, could damage Brian, could buff the enemy, could do nothing. Pure chaos. Once per fight. "Seen" — if Brian doesn't play any card for a turn, Group Chat knows he's "leaving them on read" — all enemies gain +5 attack for 3 turns.
- Flavor: "Your aunt sent a minion meme. Your cousin replied 'lol' to the wrong message. Your mom typed for 10 minutes and sent 'Ok.' Your dad sent a YouTube link from 2009. You are in hell."
- Drops: 25 XP, 10 Money, 8 Rep

**69. The Printer**
- Type: Elite | HP: Scales (80 + 15 per stage) | Stage: Any
- Pattern: `[block(25), attack(12), debuff(draw, 2), attack(14), block(25), special]`
- Special: "PC LOAD LETTER" — every 2 turns, the Printer displays an incomprehensible error. Brian must "troubleshoot" by playing 3 different card types in one turn. Failing to troubleshoot means the Printer gains 20 permanent block (paper jam). "Low Ink" — the Printer's attacks get weaker over time (-1 per turn), BUT it compensates by blocking more (+3 per turn). "Wireless" — the Printer randomly "disconnects" (becomes untargetable for 1 turn, no damage taken). 25% chance each turn. "Office Space" — below 25% HP, Brian enters a rage: all attack cards do double damage for the rest of the fight (the catharsis of destroying a printer). "Collate" — if Brian plays cards in descending cost order (3, 2, 1, 0), the Printer takes 20 bonus damage (it actually listened to a command).
- Flavor: "It has ink. It has paper. It has power. It has a job. It has chosen violence. The queue shows 47 documents. You sent one. Who sent the others?"
- Drops: 28 XP, 15 Money, 6 Rep

**70. Hold Music**
- Type: Elite | HP: Scales (90 + 15 per stage) | Stage: Any
- Pattern: `[debuff(energy, 2), attack(8), debuff(confidence, 2), attack(8), debuff(draw, 2), heal(15)]`
- Special: "Please Stay on the Line" — Hold Music cannot be targeted by Brian's first card each turn (you have to wait). Only the 2nd+ card played deals damage. "Your Call Is Important to Us" — a lie. Every 3 turns, the "estimated wait time" increases by 1 turn and Hold Music heals 10% max HP. "Transfer" — at 50% HP, Hold Music "transfers" Brian — the fight resets to a new enemy with 50% of the original HP but different, stronger pattern and Brian keeps his current HP (you've been transferred to someone worse). "The Song" — an earworm. After the fight, Brian starts the next encounter with -1 draw (it's stuck in his head). "Hang Up" — Brian can forfeit at any time with no penalty except losing the rewards (just hang up and try again later, no HP loss).
- Flavor: "It's a smooth jazz version of 'Eleanor Rigby.' It's been 45 minutes. A voice said 'We'll be right with you' 11 minutes ago. You've started to enjoy the song. This is how they get you."
- Drops: 30 XP, 12 Money, 5 Rep

---

**TOTAL: 70 ENCOUNTERS**

**Summary by type:**
- Normal: 35
- Elite: 15
- Boss: 10
- Special Normal: 7
- Special Elite: 3

**Design Notes:**

- Stages 1-2 have grounded, recognizable enemies with straightforward-but-distinct mechanics. The humor is observational.
- Stage 3 transitions from real to surreal. The enemies are still workplace things, but they're alive and wrong. Mechanics start getting conceptually stranger (the meeting that can't die, the spreadsheet that judges your spending habits).
- Stage 4 goes full existential-dread-as-comedy. Abstract concepts become enemies, body parts rebel, and guilt becomes literal. Mechanics reflect the theme (Regret punishes past decisions, Mortality literally cannot die, Nostalgia heals itself while slowly consuming you).
- Stage 5 is pure unhinged abstraction. The enemies are philosophical concepts, temporal anomalies, and weaponized self-reflection. The final boss is the person Brian could have been, and the optimal strategy might be to just survive and hear it say "you did okay."
- Special encounters are mundane nightmares that transcend age. The DMV is the DMV at any stage of life. The Printer has always been your enemy. Hold Music will outlive us all.
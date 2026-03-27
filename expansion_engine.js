(function () {
  const JAKE = window.JAKE_CONTENT || {
    displayName: 'Jake',
    tagline: 'a second life',
    phaseNames: { 1: 'Phase 1: Jake', 2: 'Phase 2', 3: 'Phase 3', 4: 'Phase 4', 5: 'Phase 5' },
    phaseSubtitles: { 1: 'waking up', 2: 'gambling', 3: 'fighting', 4: 'planning', 5: 'choosing' },
    actions: [],
    upgrades: [],
    projects: [],
    branchChoices: [],
    thoughts: [],
    endings: [],
  };
  const ACTIVITY = window.ACTIVITY_CONTENT || { shared: { gambling: { slots: { tiers: [] }, blackjack: { tables: [] }, dice: { games: [] } }, autobattler: { roster: [], encounters: [] }, hustles: { jobs: [] } }, campaigns: {} };

  const baseGetDefaultState = getDefaultState;
  const baseUpdateUI = updateUI;
  const baseUpdatePhaseUI = updatePhaseUI;
  const baseUpdateProgressBar = updateProgressBar;
  const baseRenderMessages = renderMessages;
  const baseAddMsg = addMsg;
  const baseCheckThoughts = checkThoughts;
  const baseCheckPhaseTransitions = checkPhaseTransitions;
  const baseGameTick = gameTick;
  const baseTriggerEnding = triggerEnding;
  const baseShowEnding = showEnding;
  const baseCheckPanelUnlocks = checkPanelUnlocks;
  const baseRebuildDerivedState = rebuildDerivedState;
  const baseLoadGame = loadGame;

  const JAKE_CREW_TYPES = [
    { id: 'runners', name: 'Runner', baseCost: 40, growth: 1.18, cashPerSec: 0.4, repPerSec: 0.04, energyRegen: 0.08, battlePower: 2, heatDecay: 0 },
    { id: 'bruisers', name: 'Bruiser', baseCost: 90, growth: 1.24, cashPerSec: 0.25, repPerSec: 0.08, energyRegen: 0.03, battlePower: 5, heatDecay: 0 },
    { id: 'grifters', name: 'Grifter', baseCost: 140, growth: 1.28, cashPerSec: 0.6, repPerSec: 0.06, energyRegen: 0.05, battlePower: 3, heatDecay: 0 },
    { id: 'wheelmen', name: 'Wheelman', baseCost: 220, growth: 1.35, cashPerSec: 0.8, repPerSec: 0.1, energyRegen: 0.06, battlePower: 4, heatDecay: 0.06 },
  ];

  const JAKE_PHASE_THRESHOLDS = {
    1: { cash: 800 },
    2: { rep: 350, cash: 2200 },
    3: { rep: 2500, crew: 5 },
    4: { legend: 1500, safehouse: true },
    5: { legend: 5000, cash: 100000 },
  };

  let expansionLastTick = Date.now();

  function mergeDefaults(target, defaults) {
    for (const key of Object.keys(defaults)) {
      const current = target[key];
      const fallback = defaults[key];
      if (current === undefined) {
        target[key] = Array.isArray(fallback) ? fallback.slice() : (fallback && typeof fallback === 'object' ? JSON.parse(JSON.stringify(fallback)) : fallback);
      } else if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) {
        mergeDefaults(current, fallback);
      }
    }
    return target;
  }

  function createJakeState() {
    return {
      phase: 1,
      tick: 0,
      totalTicks: 0,
      cash: 0,
      totalCash: 0,
      rep: 0,
      totalRep: 0,
      materials: 0,
      heat: 0,
      legend: 0,
      totalLegend: 0,
      energy: 70,
      maxEnergy: 70,
      energyRegen: 0.9,
      cashMult: 1,
      repMult: 1,
      materialsMult: 1,
      energyCostMult: 1,
      heatGainMult: 1,
      gamblingVolatility: 1,
      gamblingWinMult: 1,
      heistPayoutMult: 1,
      battlePowerMult: 1,
      battleFrontlineMult: 1,
      battleTempo: 0,
      battleLossRefund: 0,
      repBonus: 0,
      scavengingYield: 0,
      autoBattlerSlots: 3,
      gamblingControls: 0,
      contactCostMult: 1,
      heatLossMult: 1,
      legacyPerks: 0,
      endingBranches: 0,
      crewSynergy: 0,
      soloPower: 0,
      heistPrep: 0,
      escapeReliability: 0,
      branches: {},
      upgrades: {},
      projects: {},
      crew: { runners: 0, bruisers: 0, grifters: 0, wheelmen: 0 },
      messages: [],
      thoughtFlags: {},
      flags: {
        endingReady: false,
        nextThoughtAt: 18,
      },
      stats: {
        actions: 0,
        totalTimePlayed: 0,
        gambles: 0,
        battles: 0,
        hustles: 0,
      },
    };
  }

  function createActivitiesState() {
    return {
      chips: 0,
      tickets: 0,
      marks: 0,
      gamblingStreak: 0,
      lastResult: '',
      autoBattler: {
        roster: {},
        wins: 0,
        losses: 0,
        rating: 0,
        xp: 0,
        lastBattle: '',
        auto: false,
        progress: 0,
      },
      hustle: {
        activeJobId: null,
        remaining: 0,
        lastJob: '',
        completed: 0,
      },
    };
  }

  function ensureExpansionState(state = game) {
    if (!state) return;
    if (!state.campaign) state.campaign = 'brian';
    if (!state.meta) {
      state.meta = {
        brianCompleted: false,
        jakeUnlocked: false,
        lastBrianEnding: null,
      };
    }
    if (!state.jake) state.jake = createJakeState();
    else mergeDefaults(state.jake, createJakeState());
    if (!state.activities) state.activities = createActivitiesState();
    else mergeDefaults(state.activities, createActivitiesState());
  }

  getDefaultState = window.getDefaultState = function () {
    const state = baseGetDefaultState();
    ensureExpansionState(state);
    return state;
  };

  ensureExpansionState(game);

  function isJakeCampaign() {
    return game.campaign === 'jake';
  }

  function getJakeState() {
    ensureExpansionState(game);
    return game.jake;
  }

  function getCurrentMessages() {
    return isJakeCampaign() ? getJakeState().messages : game.messages;
  }

  function getCurrentThoughtFlags() {
    return isJakeCampaign() ? getJakeState().thoughtFlags : game.thoughtFlags;
  }

  function addJakeMessage(text, type = 'thought') {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const state = getJakeState();
    state.messages.push({ text, type, time: timeStr });
    if (state.messages.length > 250) state.messages.shift();
  }

  addMsg = window.addMsg = function (text, type = 'thought') {
    ensureExpansionState(game);
    if (isJakeCampaign()) {
      addJakeMessage(text, type);
      renderMessages();
      return;
    }
    return baseAddMsg(text, type);
  };

  renderMessages = window.renderMessages = function () {
    if (!isJakeCampaign()) {
      return baseRenderMessages();
    }
    const log = document.getElementById('message-log');
    if (!log) return;
    let html = '';
    const msgs = getJakeState().messages.slice(-80);
    for (const m of msgs) {
      html += `<div class="msg msg-${m.type}"><span class="msg-time">${m.time || ''}</span>${m.text}</div>`;
    }
    log.innerHTML = html;
    log.scrollTop = log.scrollHeight;
  };

  function injectActivitiesPanel() {
    if (document.getElementById('panel-activities')) return;
    const panel = document.createElement('div');
    panel.className = 'panel panel-locked';
    panel.id = 'panel-activities';
    panel.innerHTML = '<h2>Activities</h2><div id="activities-display"></div>';
    const center = document.getElementById('col-center');
    const friendsPanel = document.getElementById('panel-friends');
    if (center && friendsPanel && friendsPanel.parentNode === center) {
      center.insertBefore(panel, friendsPanel.nextSibling);
    } else if (center) {
      center.appendChild(panel);
    }
  }

  function setPanelVisible(id, visible) {
    const el = document.getElementById(id);
    if (!el) return;
    if (visible) el.classList.remove('panel-locked');
    else el.classList.add('panel-locked');
  }

  function syncCampaignChrome() {
    const isJake = isJakeCampaign();
    const h1 = document.querySelector('#topbar h1');
    if (h1 && h1.firstChild) h1.firstChild.textContent = isJake ? 'Jake Simulator ' : 'Brian Simulator ';

    const titles = {
      'panel-status': isJake ? 'Jake Status' : 'Brian Status',
      'panel-friends': isJake ? 'Crew' : 'Friends',
      'panel-routines': isJake ? 'Street Systems' : 'Automation Modules',
      'panel-projects': isJake ? 'Jake Projects' : 'Brian Projects',
      'panel-thoughts': isJake ? "Jake's Thoughts" : "Brian's Thoughts",
      'panel-team': isJake ? 'Operations' : "Brian's Team",
      'panel-activities': isJake ? 'Jake Activities' : 'Brian Activities',
    };
    for (const [id, label] of Object.entries(titles)) {
      const h2 = document.querySelector(`#${id} h2`);
      if (h2) h2.textContent = label;
    }
  }

  function getCurrentPhase() {
    return isJakeCampaign() ? getJakeState().phase : game.phase;
  }

  function applyEffectString(target, effectString) {
    if (!effectString) return;
    for (const clause of effectString.split(';')) {
      const expr = clause.trim();
      if (!expr) continue;
      const match = expr.match(/^([a-zA-Z0-9_]+)\s*(\+=|\*=|-=|\/=)\s*([0-9.]+)$/);
      if (!match) continue;
      const [, key, op, rawValue] = match;
      const value = parseFloat(rawValue);
      if (!Number.isFinite(value)) continue;
      if (target[key] === undefined) target[key] = op.includes('*') || op.includes('/') ? 1 : 0;
      if (op === '+=') target[key] += value;
      if (op === '-=') target[key] -= value;
      if (op === '*=') target[key] *= value;
      if (op === '/=') target[key] /= value;
    }
  }

  function getJakeVisibleActions() {
    const state = getJakeState();
    return (JAKE.actions || []).filter(action => action.phase <= state.phase && state.totalCash >= (action.unlockTotalCash || action.unlockTotalCp || 0));
  }

  function getJakeProjectChoices() {
    const state = getJakeState();
    return (JAKE.projects || []).filter(project => project.phase <= state.phase && state.totalCash >= (project.unlockTotalCash || 0));
  }

  function getJakeBranchChoices() {
    const state = getJakeState();
    return (JAKE.branchChoices || []).filter(choice => choice.phase <= state.phase && !state.branches[choice.id]);
  }

  function getJakeUpgradeChoices() {
    const state = getJakeState();
    return (JAKE.upgrades || []).filter(upgrade => {
      if (state.upgrades[upgrade.id]) return false;
      if ((upgrade.unlockPhase || 0) > state.phase) return false;
      if (upgrade.unlockTotalCash && state.totalCash < upgrade.unlockTotalCash) return false;
      return true;
    });
  }

  function totalJakeCrew() {
    const crew = getJakeState().crew;
    return Object.values(crew).reduce((sum, count) => sum + count, 0);
  }

  function getJakeCrewCost(typeId) {
    const type = JAKE_CREW_TYPES.find(entry => entry.id === typeId);
    const count = getJakeState().crew[typeId] || 0;
    if (!type) return Infinity;
    return type.baseCost * Math.pow(type.growth, count);
  }

  function getJakeHeatPenalty() {
    const heat = getJakeState().heat;
    if (heat >= 90) return 0.55;
    if (heat >= 70) return 0.72;
    if (heat >= 50) return 0.86;
    return 1;
  }

  function gainJakeCash(amount) {
    const state = getJakeState();
    state.cash += amount;
    state.totalCash += amount;
  }

  function gainJakeRep(amount) {
    const state = getJakeState();
    state.rep += amount;
    state.totalRep += amount;
  }

  function gainJakeLegend(amount) {
    const state = getJakeState();
    state.legend += amount;
    state.totalLegend += amount;
  }

  function getActivitySpendInfo() {
    if (isJakeCampaign()) {
      return {
        label: 'Cash',
        current: getJakeState().cash,
        spend(amount) {
          const state = getJakeState();
          if (state.cash < amount) return false;
          state.cash -= amount;
          return true;
        },
      };
    }
    return {
      label: 'Charisma',
      current: game.cp,
      spend(amount) {
        if (game.cp < amount) return false;
        game.cp -= amount;
        return true;
      },
    };
  }

  function grantActivitySpoils(payload, source) {
    ensureExpansionState(game);
    const rewards = payload || {};
    const activities = game.activities;
    activities.chips += rewards.chips || 0;
    activities.tickets += rewards.tickets || 0;
    activities.marks += rewards.marks || 0;
    if (isJakeCampaign()) {
      const state = getJakeState();
      const cashGain = (rewards.chips || 0) * 0.9 + (rewards.xp || 0) * 0.6 + (rewards.reputation || 0);
      if (cashGain > 0) gainJakeCash(cashGain);
      if (rewards.reputation) gainJakeRep(rewards.reputation);
      if (rewards.xp || rewards.marks) gainJakeLegend((rewards.xp || 0) * 0.4 + (rewards.marks || 0) * 3);
      if (source === 'gambling') state.heat = Math.min(100, state.heat + 1.2 * state.heatGainMult);
      if (source === 'battle') state.heat = Math.min(100, state.heat + 0.8 * state.heatGainMult);
      if (source === 'hustle') state.materials += Math.max(1, Math.round((rewards.tickets || 0) * 0.8));
    } else {
      const cpGain = (rewards.chips || 0) * 0.8 + (rewards.xp || 0) * 0.4;
      if (cpGain > 0) {
        game.cp += cpGain;
        game.totalCp += cpGain;
      }
      if (game.phase >= 2 && rewards.reputation) {
        game.reputation += rewards.reputation;
        game.totalReputation += rewards.reputation;
      }
      if (game.phase >= 3 && rewards.xp) {
        const inf = rewards.xp * 0.25;
        game.influence += inf;
        game.totalInfluence += inf;
      }
      if (game.phase >= 4 && rewards.marks) {
        const wisdom = rewards.marks * 0.12;
        game.wisdom += wisdom;
        game.totalWisdom += wisdom;
      }
    }
  }

  function getBrianActivityAccess() {
    return {
      gambling: game.phase >= 2 && game.totalCp >= 5000,
      autobattler: game.phase >= 3 && game.influence >= 1000,
      hustles: game.phase >= 4 || game.phase === 5,
    };
  }

  function getJakeActivityAccess() {
    const state = getJakeState();
    return {
      gambling: state.phase >= 2,
      autobattler: state.phase >= 3,
      hustles: state.phase >= 1,
    };
  }

  function getActivityAccess() {
    return isJakeCampaign() ? getJakeActivityAccess() : getBrianActivityAccess();
  }

  function getAvailableSlots() {
    return (((ACTIVITY.shared || {}).gambling || {}).slots || {}).tiers || [];
  }

  function getAvailableTables() {
    return (((ACTIVITY.shared || {}).gambling || {}).blackjack || {}).tables || [];
  }

  function getAvailableDiceGames() {
    return (((ACTIVITY.shared || {}).gambling || {}).dice || {}).games || [];
  }

  function getBattlerRoster() {
    return (((ACTIVITY.shared || {}).autobattler || {}).roster || []);
  }

  function getBattlerEncounters() {
    return (((ACTIVITY.shared || {}).autobattler || {}).encounters || []);
  }

  function getHustleJobs() {
    return (((ACTIVITY.shared || {}).hustles || {}).jobs || []);
  }

  function getCurrentStakeBase() {
    return isJakeCampaign() ? Math.max(20, Math.floor(getJakeState().phase * 25)) : Math.max(20, Math.floor(game.phase * 30));
  }

  function playSlots(tierId, multiplier) {
    const tier = getAvailableSlots().find(entry => entry.id === tierId);
    if (!tier) return;
    const spend = getActivitySpendInfo();
    const stake = Math.max(10, Math.floor(getCurrentStakeBase() * (multiplier || 1) * tier.stakeTier));
    if (!spend.spend(stake)) return;
    const activities = game.activities;
    const volatility = isJakeCampaign() ? getJakeState().gamblingVolatility : 1;
    const jackpotChance = 0.12 / Math.max(0.6, volatility);
    const successChance = 0.58 / Math.max(0.75, volatility);
    let payout = 0;
    let label = `${tier.name}: the reels go cold.`;
    if (Math.random() < jackpotChance && tier.jackpots && tier.jackpots.length) {
      const jackpot = tier.jackpots[Math.floor(Math.random() * tier.jackpots.length)];
      payout = Math.floor(stake * jackpot.multiplier * (isJakeCampaign() ? getJakeState().gamblingWinMult : 1));
      activities.gamblingStreak += 2;
      label = `${tier.name}: JACKPOT - ${jackpot.name}.`;
      grantActivitySpoils({ chips: Math.floor(payout * 0.4), tickets: 2, marks: 1 }, 'gambling');
    } else if (Math.random() < successChance) {
      payout = Math.floor(stake * (1.2 + Math.random() * 1.5) * (isJakeCampaign() ? getJakeState().gamblingWinMult : 1));
      activities.gamblingStreak += 1;
      label = `${tier.name}: the machine pays out.`;
      grantActivitySpoils({ chips: Math.floor(payout * 0.2), tickets: 1 }, 'gambling');
    } else {
      activities.gamblingStreak = 0;
      label = `${tier.name}: the house takes the stake.`;
    }
    if (isJakeCampaign()) gainJakeCash(payout);
    else {
      game.cp += payout;
      game.totalCp += payout;
    }
    activities.lastResult = `${label} ${payout > 0 ? '+' + fmt(payout) : '-' + fmt(stake)} ${spend.label}.`;
    if (isJakeCampaign()) getJakeState().stats.gambles++;
    updateUI();
  }

  function playCardTable(tableId, multiplier) {
    const table = getAvailableTables().find(entry => entry.id === tableId);
    if (!table) return;
    const spend = getActivitySpendInfo();
    const stake = Math.max(table.minBet || 10, Math.floor(getCurrentStakeBase() * (multiplier || 1)));
    if (!spend.spend(stake)) return;
    const dealerBias = table.dealerBias === 'aggressive' ? 0.38 : table.dealerBias === 'balanced' ? 0.48 : 0.56;
    const win = Math.random() < dealerBias;
    let payout = 0;
    if (win) {
      payout = Math.floor(stake * (1.6 + Math.random()));
      if (isJakeCampaign()) gainJakeCash(payout);
      else {
        game.cp += payout;
        game.totalCp += payout;
      }
      grantActivitySpoils({ chips: Math.floor(payout * 0.25), tickets: 1 }, 'gambling');
      game.activities.lastResult = `${table.name}: Jake/Brain reads the table right. +${fmt(payout)} ${spend.label}.`;
    } else {
      game.activities.lastResult = `${table.name}: dealer shows the perfect card.`;
      game.activities.gamblingStreak = 0;
    }
    if (isJakeCampaign()) getJakeState().stats.gambles++;
    updateUI();
  }

  function playDiceGame(gameId, multiplier) {
    const diceGame = getAvailableDiceGames().find(entry => entry.id === gameId);
    if (!diceGame) return;
    const spend = getActivitySpendInfo();
    const stake = Math.max(8, Math.floor(getCurrentStakeBase() * 0.8 * (multiplier || 1)));
    if (!spend.spend(stake)) return;
    const dice = Array.from({ length: diceGame.dice || 2 }, () => 1 + Math.floor(Math.random() * 6));
    const total = dice.reduce((sum, die) => sum + die, 0);
    const success = total >= (dice.length * 4);
    let payout = 0;
    if (success) {
      payout = Math.floor(stake * (1.5 + Math.random() * 1.8));
      if (isJakeCampaign()) gainJakeCash(payout);
      else {
        game.cp += payout;
        game.totalCp += payout;
      }
      grantActivitySpoils({ chips: Math.floor(payout * 0.22), tickets: 1, marks: total >= dice.length * 5 ? 1 : 0 }, 'gambling');
    }
    game.activities.lastResult = `${diceGame.name}: rolled ${dice.join(', ')} (${total}). ${success ? '+' + fmt(payout) : 'No payout.'}`;
    if (isJakeCampaign()) getJakeState().stats.gambles++;
    updateUI();
  }

  function recruitBattlerUnit(unitId) {
    const unit = getBattlerRoster().find(entry => entry.id === unitId);
    if (!unit) return;
    const spend = getActivitySpendInfo();
    const cost = Math.max(40, unit.tier * 60 + ((game.activities.autoBattler.roster[unitId] || 0) * 25));
    if (!spend.spend(cost)) return;
    game.activities.autoBattler.roster[unitId] = (game.activities.autoBattler.roster[unitId] || 0) + 1;
    game.activities.lastResult = `Recruited ${unit.name} for the battler crew.`;
    updateUI();
  }

  function getPlayerBattlerPower() {
    let power = 0;
    for (const unit of getBattlerRoster()) {
      const count = game.activities.autoBattler.roster[unit.id] || 0;
      if (!count) continue;
      const stats = unit.stats || {};
      const unitPower = ((stats.hp || 0) * 0.35 + (stats.attack || 0) * 1.2 + (stats.speed || 0) * 0.8) * count;
      power += unitPower;
    }
    if (isJakeCampaign()) {
      const state = getJakeState();
      power *= state.battlePowerMult;
      power += totalJakeCrew() * 3 + state.battleTempo * 8 + state.crewSynergy * 12;
    } else {
      power += totalFriends(game) * 1.5 + game.teamSize * 4;
    }
    return power;
  }

  function fightEncounter(encounterId) {
    const encounter = getBattlerEncounters().find(entry => entry.id === encounterId);
    if (!encounter) return;
    const spend = getActivitySpendInfo();
    const entryCost = Math.max(25, encounter.tier * 40);
    if (!spend.spend(entryCost)) return;

    const playerPower = getPlayerBattlerPower();
    const enemyPower = 45 + encounter.tier * 38 + Math.random() * 35;
    const winChance = playerPower / Math.max(1, playerPower + enemyPower);
    const won = Math.random() < winChance;
    if (won) {
      grantActivitySpoils(encounter.reward || {}, 'battle');
      game.activities.autoBattler.wins++;
      game.activities.autoBattler.rating += encounter.tier * 18;
      game.activities.autoBattler.lastBattle = `${encounter.name}: won.`;
    } else {
      game.activities.autoBattler.losses++;
      if (isJakeCampaign() && getJakeState().battleLossRefund > 0) {
        gainJakeCash(entryCost * getJakeState().battleLossRefund);
      }
      game.activities.autoBattler.lastBattle = `${encounter.name}: lost.`;
    }
    if (isJakeCampaign()) getJakeState().stats.battles++;
    updateUI();
  }

  function startHustle(jobId) {
    const job = getHustleJobs().find(entry => entry.id === jobId);
    if (!job || game.activities.hustle.activeJobId) return;
    const spend = getActivitySpendInfo();
    const prepCost = Math.max(5, Math.floor((job.duration || 30) / 10));
    if (!spend.spend(prepCost)) return;
    game.activities.hustle.activeJobId = job.id;
    game.activities.hustle.remaining = job.duration || 30;
    game.activities.lastResult = `${job.name} is underway.`;
    updateUI();
  }

  function completeHustleJob() {
    const activeId = game.activities.hustle.activeJobId;
    const job = getHustleJobs().find(entry => entry.id === activeId);
    if (!job) return;
    const chipsRange = (job.reward || {}).chips || [10, 25];
    const repRange = (job.reward || {}).reputation || [0, 1];
    const chips = chipsRange[0] + Math.random() * (chipsRange[1] - chipsRange[0]);
    const reputation = repRange[0] + Math.random() * (repRange[1] - repRange[0]);
    grantActivitySpoils({ chips: Math.floor(chips), reputation: Math.round(reputation), tickets: 1 }, 'hustle');
    game.activities.hustle.lastJob = `${job.name} wrapped clean.`;
    game.activities.hustle.completed++;
    game.activities.hustle.activeJobId = null;
    game.activities.hustle.remaining = 0;
    if (isJakeCampaign()) getJakeState().stats.hustles++;
  }

  function renderSharedActivities() {
    injectActivitiesPanel();
    const panel = document.getElementById('panel-activities');
    const el = document.getElementById('activities-display');
    if (!panel || !el) return;
    const access = getActivityAccess();
    const unlocked = access.gambling || access.autobattler || access.hustles;
    setPanelVisible('panel-activities', unlocked);
    if (!unlocked) {
      el.innerHTML = '';
      return;
    }

    const spend = getActivitySpendInfo();
    const battler = game.activities.autoBattler;
    const hustle = game.activities.hustle;
    let html = `<div class="res-line"><span class="res-label">Activity Tokens:</span> <span class="res-val">${fmt(game.activities.chips)}</span> chips / <span class="res-val">${fmt(game.activities.tickets)}</span> tickets / <span class="res-val">${fmt(game.activities.marks)}</span> marks</div>`;
    if (game.activities.lastResult) {
      html += `<div class="automation-note" style="margin-bottom:6px;">${game.activities.lastResult}</div>`;
    }

    if (access.gambling) {
      html += `<div class="automation-box">
        <div class="automation-title"><span>Gambling</span><span class="automation-rate">Stake with ${spend.label}</span></div>
        <div class="automation-note">Slots, cards, and dice all pay out differently. Current streak: ${game.activities.gamblingStreak}</div>`;
      for (const tier of getAvailableSlots().slice(0, isJakeCampaign() ? 4 : 2)) {
        html += `<button class="routine-btn affordable" onclick="playSlots('${tier.id}',1)">
          <b>${tier.name}</b><span class="r-desc">Spin for ${fmt(Math.max(10, Math.floor(getCurrentStakeBase() * tier.stakeTier)))} ${spend.label}</span>
        </button>`;
      }
      for (const table of getAvailableTables().slice(0, isJakeCampaign() ? 2 : 1)) {
        html += `<button class="routine-btn" onclick="playCardTable('${table.id}',1)">
          <b>${table.name}</b><span class="r-desc">Play the table and push the edge.</span>
        </button>`;
      }
      for (const diceGame of getAvailableDiceGames().slice(0, isJakeCampaign() ? 2 : 1)) {
        html += `<button class="routine-btn" onclick="playDiceGame('${diceGame.id}',1)">
          <b>${diceGame.name}</b><span class="r-desc">Short odds, fast swings, noisy results.</span>
        </button>`;
      }
      html += `</div>`;
    }

    if (access.autobattler) {
      html += `<div class="automation-box">
        <div class="automation-title"><span>Auto Battler</span><span class="automation-rate">${battler.wins}W / ${battler.losses}L</span></div>
        <div class="automation-note">${battler.lastBattle || 'Recruit a roster and start a fight.'}</div>`;
      for (const unit of getBattlerRoster().slice(0, isJakeCampaign() ? 8 : 4)) {
        const count = battler.roster[unit.id] || 0;
        html += `<button class="routine-btn" onclick="recruitBattlerUnit('${unit.id}')">
          <b>${unit.name}</b> <span class="r-cost">[owned: ${count}]</span>
          <span class="r-desc">${unit.role} | tier ${unit.tier} | ${unit.passive}</span>
        </button>`;
      }
      for (const encounter of getBattlerEncounters().slice(0, isJakeCampaign() ? 5 : 3)) {
        html += `<button class="routine-btn affordable" onclick="fightEncounter('${encounter.id}')">
          <b>${encounter.name}</b><span class="r-desc">Tier ${encounter.tier} | enemy traits: ${(encounter.enemyTraits || []).join(', ')}</span>
        </button>`;
      }
      html += `</div>`;
    }

    if (access.hustles) {
      html += `<div class="automation-box">
        <div class="automation-title"><span>${isJakeCampaign() ? 'Hustles' : 'Side Jobs'}</span><span class="automation-rate">${hustle.completed} complete</span></div>
        <div class="automation-note">${hustle.activeJobId ? `Active: ${hustle.activeJobId} (${Math.ceil(hustle.remaining)}s left)` : (hustle.lastJob || 'Pick a job and let the timer run.')}</div>`;
      for (const job of getHustleJobs().slice(0, isJakeCampaign() ? 6 : 3)) {
        html += `<button class="routine-btn${hustle.activeJobId ? '' : ' affordable'}" onclick="startHustle('${job.id}')" ${hustle.activeJobId ? 'disabled' : ''}>
          <b>${job.name}</b><span class="r-desc">${job.duration}s | ${job.unlockCopy}</span>
        </button>`;
      }
      html += `</div>`;
    }

    el.innerHTML = html;
  }

  function renderJakeResources() {
    const el = document.getElementById('resource-display');
    const state = getJakeState();
    let html = '';
    const ePct = (state.energy / state.maxEnergy * 100).toFixed(0);
    const eColor = ePct > 50 ? '#4a4' : ePct > 20 ? '#aa4' : '#a44';
    html += `<div class="res-line"><span class="res-label">Energy:</span> <span class="res-val">${Math.floor(state.energy)}</span>/<span>${state.maxEnergy}</span> <span class="res-rate">(+${state.energyRegen.toFixed(1)}/s)</span></div>`;
    html += `<div class="energy-bar-wrap"><div class="energy-bar-fill" style="width:${ePct}%;background:${eColor};"></div></div>`;
    html += `<div class="res-line"><span class="res-label">Cash:</span> <span class="res-val">${fmt(state.cash)}</span></div>`;
    html += `<div class="res-line"><span class="res-label">Street Rep:</span> <span class="res-val">${fmt(state.rep)}</span></div>`;
    html += `<div class="res-line"><span class="res-label">Materials:</span> <span class="res-val">${fmt(state.materials)}</span></div>`;
    html += `<div class="res-line"><span class="res-label">Heat:</span> <span class="res-val">${fmt(state.heat)}</span> <span class="res-rate">(x${getJakeHeatPenalty().toFixed(2)} gains)</span></div>`;
    if (state.phase >= 4) {
      html += `<div class="res-line"><span class="res-label">Legend:</span> <span class="res-val">${fmt(state.legend)}</span></div>`;
    }
    html += `<div class="res-line" style="margin-top:4px;"><span class="res-label">Crew:</span> <span class="res-val">${fmt(totalJakeCrew())}</span></div>`;
    el.innerHTML = html;
  }

  function renderJakeActions() {
    const list = document.getElementById('actions-list');
    const state = getJakeState();
    let html = '';
    const visible = getJakeVisibleActions();
    visible.forEach((action, idx) => {
      const cost = Math.max(1, Math.ceil((action.energyCost || 1) * (state.energyCostMult || 1)));
      const canDo = state.energy >= cost;
      const keyHint = idx < ACTION_KEYS.length ? `<span class="key-hint">[${ACTION_KEYS[idx]}]</span>` : '';
      html += `<button class="action-btn" onclick="performJakeAction('${action.id}')" ${canDo ? '' : 'disabled'}>
        <b>${action.name}</b>${keyHint}
        <span class="cost"> [${cost} energy]</span>
        <span class="gain"> +${fmt((action.cashGain || 0) * state.cashMult)} Cash${action.repGain ? ` / +${fmt((action.repGain || 0) * state.repMult)} Rep` : ''}${action.materialsGain ? ` / +${fmt((action.materialsGain || 0) * state.materialsMult)} Materials` : ''}</span>
        <span style="color:#555;font-size:10px;display:block;">${action.desc}</span>
      </button>`;
    });
    if (state.phase >= 5 && state.flags.endingReady) {
      html += `<button class="transcend-btn" onclick="triggerJakeEnding()">Choose Jake's Fate</button>`;
    }
    list.innerHTML = html;
  }

  function renderJakeUpgrades() {
    const list = document.getElementById('upgrades-list');
    let html = '';
    for (const upgrade of getJakeUpgradeChoices()) {
      const affordable = getJakeState().cash >= upgrade.cost;
      html += `<button class="upgrade-btn${affordable ? ' affordable' : ''}" onclick="buyJakeUpgrade('${upgrade.id}')" ${affordable ? '' : 'disabled'}>
        <b>${upgrade.name}</b> <span class="u-cost">[${fmt(upgrade.cost)} Cash]</span>
        <span class="u-desc">${upgrade.desc}</span>
      </button>`;
    }
    if (!html) html = '<div style="color:#999;font-size:11px;padding:4px;">No Jake upgrades available right now.</div>';
    list.innerHTML = html;
  }

  function renderJakeOperations() {
    const list = document.getElementById('routines-list');
    const state = getJakeState();
    let html = `<div class="automation-box">
      <div class="automation-title"><span>Street Systems</span><span class="automation-rate">heat ${fmt(state.heat)}</span></div>
      <div class="automation-note">Crew, branches, and off-book systems shape how Jake scales.</div>
    </div>`;
    for (const choice of getJakeBranchChoices()) {
      html += `<div class="project-choice">
        <button class="project-btn" onclick="chooseJakeBranch('${choice.id}','${choice.options[0].id}')">
          <span class="p-name">${choice.options[0].name}</span><span class="p-desc">${choice.prompt}</span>
        </button>
        <button class="project-btn" onclick="chooseJakeBranch('${choice.id}','${choice.options[1].id}')">
          <span class="p-name">${choice.options[1].name}</span><span class="p-desc">${choice.prompt}</span>
        </button>
      </div>`;
    }
    if (!getJakeBranchChoices().length) {
      html += '<div style="color:#888;font-size:11px;">No branch decisions waiting right now.</div>';
    }
    list.innerHTML = html;
  }

  function renderJakeProjects() {
    const list = document.getElementById('projects-list');
    const state = getJakeState();
    let html = '';
    for (const project of getJakeProjectChoices()) {
      if (state.projects[project.id]) {
        const choiceId = state.projects[project.id];
        const choice = project[choiceId];
        html += `<div class="project-chosen">${project.id}: <b>${choice.name}</b></div>`;
        continue;
      }
      html += `<div class="project-choice">
        <button class="project-btn" onclick="chooseJakeProject(${project.id},'a')">
          <span class="p-name">${project.a.name}</span><span class="p-desc">${project.a.desc}</span>
        </button>
        <button class="project-btn" onclick="chooseJakeProject(${project.id},'b')">
          <span class="p-name">${project.b.name}</span><span class="p-desc">${project.b.desc}</span>
        </button>
      </div>`;
    }
    if (!html) html = '<div style="color:#888;font-size:11px;">Jake has not hit the next fork yet.</div>';
    list.innerHTML = html;
  }

  function renderJakeCrew() {
    const el = document.getElementById('friends-display');
    if (!el) return;
    let html = `<div class="res-line" style="font-size:14px;margin-bottom:4px;"><b>Total Crew: ${totalJakeCrew()}</b></div>`;
    JAKE_CREW_TYPES.forEach((type, idx) => {
      const count = getJakeState().crew[type.id] || 0;
      const cost = getJakeCrewCost(type.id);
      const affordable = getJakeState().cash >= cost;
      html += `<button class="friend-btn${affordable ? ' affordable' : ''}" onclick="buyJakeCrew('${type.id}')" ${affordable ? '' : 'disabled'}>
        ${type.name} [${fmt(cost)} Cash] ${idx < 4 ? `<span class="key-hint">[${idx + 1}]</span>` : ''}
      </button>
      <div style="color:#777;font-size:11px;padding-bottom:4px;">Owned: ${count} | +${type.cashPerSec.toFixed(2)} cash/s | +${type.repPerSec.toFixed(2)} rep/s | +${type.energyRegen.toFixed(2)} energy/s</div>`;
    });
    el.innerHTML = html;
  }

  function renderJakeStats() {
    const s = getJakeState();
    document.getElementById('stats-display').innerHTML = `
      <div>Total Cash earned: ${fmt(s.totalCash)}</div>
      <div>Total Rep earned: ${fmt(s.totalRep)}</div>
      <div>Total Legend earned: ${fmt(s.totalLegend)}</div>
      <div>Actions taken: ${fmt(s.stats.actions)}</div>
      <div>Gambles played: ${fmt(s.stats.gambles)}</div>
      <div>Battles fought: ${fmt(s.stats.battles)}</div>
      <div>Hustles completed: ${fmt(s.stats.hustles)}</div>
      <div>Crew size: ${fmt(totalJakeCrew())}</div>
      <div>Time played: ${fmtTime(s.stats.totalTimePlayed)}</div>
    `;
  }

  function buyJakeUpgrade(upgradeId) {
    const state = getJakeState();
    const upgrade = (JAKE.upgrades || []).find(entry => entry.id === upgradeId);
    if (!upgrade || state.upgrades[upgrade.id] || state.cash < upgrade.cost) return;
    state.cash -= upgrade.cost;
    state.upgrades[upgrade.id] = true;
    applyEffectString(state, upgrade.effect);
    addMsg(`Jake upgrade purchased: ${upgrade.name}`, 'event');
    updateUI();
  }

  function chooseJakeProject(projectId, branch) {
    const state = getJakeState();
    const project = (JAKE.projects || []).find(entry => entry.id === projectId);
    if (!project || state.projects[project.id]) return;
    state.projects[project.id] = branch;
    applyEffectString(state, project[branch].effect);
    addMsg(`Jake chose: ${project[branch].name}`, 'project');
    updateUI();
  }

  function chooseJakeBranch(choiceId, optionId) {
    const state = getJakeState();
    const choice = (JAKE.branchChoices || []).find(entry => entry.id === choiceId);
    if (!choice || state.branches[choice.id]) return;
    const option = (choice.options || []).find(entry => entry.id === optionId);
    if (!option) return;
    state.branches[choice.id] = optionId;
    applyEffectString(state, option.effect);
    addMsg(`Jake commits: ${option.name}`, 'event');
    updateUI();
  }

  function buyJakeCrew(typeId) {
    const type = JAKE_CREW_TYPES.find(entry => entry.id === typeId);
    const state = getJakeState();
    const cost = getJakeCrewCost(typeId);
    if (!type || state.cash < cost) return;
    state.cash -= cost;
    state.crew[typeId]++;
    updateUI();
  }

  function performJakeAction(actionId) {
    const state = getJakeState();
    const action = getJakeVisibleActions().find(entry => entry.id === actionId);
    if (!action) return;
    const cost = Math.max(1, Math.ceil((action.energyCost || 1) * state.energyCostMult));
    if (state.energy < cost) return;
    state.energy -= cost;
    const cashGain = ((action.cashGain || 0) + state.repBonus * 0.25) * state.cashMult * getJakeHeatPenalty();
    const repGain = ((action.repGain || 0) + state.repBonus) * state.repMult;
    const materialGain = ((action.materialsGain || 0) + state.scavengingYield) * state.materialsMult;
    gainJakeCash(cashGain);
    gainJakeRep(repGain);
    state.materials += materialGain;
    if (state.phase >= 4) gainJakeLegend((repGain + materialGain) * 0.1);
    if (/borrow|dirty|pressure|deep_cover|final_hand/.test(action.id)) {
      state.heat = Math.min(100, state.heat + 2.5 * state.heatGainMult);
    } else {
      state.heat = Math.min(100, state.heat + 0.8 * state.heatGainMult);
    }
    if (action.id === 'play_dice') {
      grantActivitySpoils({ chips: 10 + Math.floor(Math.random() * 16), tickets: 1 }, 'gambling');
    }
    state.stats.actions++;
    updateUI();
  }

  function tickJake(dt) {
    const state = getJakeState();
    state.tick++;
    state.totalTicks++;
    state.stats.totalTimePlayed += dt;

    let passiveCash = 0;
    let passiveRep = 0;
    let passiveEnergy = state.energyRegen;
    let heatDecay = 0.16 * state.heatLossMult;
    for (const type of JAKE_CREW_TYPES) {
      const count = state.crew[type.id] || 0;
      passiveCash += count * type.cashPerSec;
      passiveRep += count * type.repPerSec;
      passiveEnergy += count * type.energyRegen;
      heatDecay += count * type.heatDecay;
    }

    state.energy = Math.min(state.maxEnergy, state.energy + passiveEnergy * dt);
    if (passiveCash > 0) gainJakeCash(passiveCash * state.cashMult * getJakeHeatPenalty() * dt);
    if (passiveRep > 0) gainJakeRep(passiveRep * state.repMult * dt);
    state.heat = Math.max(0, state.heat - heatDecay * dt);

    if (game.activities.hustle.activeJobId) {
      game.activities.hustle.remaining -= dt;
      if (game.activities.hustle.remaining <= 0) {
        completeHustleJob();
      }
    }

    if (state.phase >= 4) {
      const legendPulse = (totalJakeCrew() * 0.05 + state.materials * 0.002 + game.activities.marks * 0.02) * dt;
      if (legendPulse > 0) gainJakeLegend(legendPulse);
    }

    if (state.phase === 1 && state.totalCash >= JAKE_PHASE_THRESHOLDS[1].cash) {
      state.phase = 2;
      addMsg('Jake stops surviving and starts playing the room.', 'event');
      updatePhaseUI();
      flashPhaseTransition();
    } else if (state.phase === 2 && state.rep >= JAKE_PHASE_THRESHOLDS[2].rep && state.totalCash >= JAKE_PHASE_THRESHOLDS[2].cash) {
      state.phase = 3;
      addMsg('Jake has a crew now, whether he likes the responsibility or not.', 'event');
      updatePhaseUI();
      flashPhaseTransition();
    } else if (state.phase === 3 && state.rep >= JAKE_PHASE_THRESHOLDS[3].rep && totalJakeCrew() >= JAKE_PHASE_THRESHOLDS[3].crew) {
      state.phase = 4;
      addMsg('The hustle turns into infrastructure. Jake starts thinking in systems.', 'event');
      updatePhaseUI();
      flashPhaseTransition();
    } else if (state.phase === 4 && state.legend >= JAKE_PHASE_THRESHOLDS[4].legend && state.upgrades.j4_safehouse) {
      state.phase = 5;
      addMsg('Jake stops asking for a seat and starts designing the room.', 'event');
      updatePhaseUI();
      flashPhaseTransition();
    }

    if (state.phase === 5 && !state.flags.endingReady && (state.legend >= JAKE_PHASE_THRESHOLDS[5].legend || state.totalCash >= JAKE_PHASE_THRESHOLDS[5].cash)) {
      state.flags.endingReady = true;
      addMsg("Jake's last choice is ready.", 'event');
    }

    if (state.stats.totalTimePlayed >= (state.flags.nextThoughtAt || 18)) {
      checkJakeThoughts();
      state.flags.nextThoughtAt = state.stats.totalTimePlayed + 18;
    }
  }

  function checkJakeThoughts() {
    const state = getJakeState();
    for (const thought of (JAKE.thoughts || [])) {
      if (state.thoughtFlags[thought.id]) continue;
      if ((thought.phase || 1) <= state.phase) {
        state.thoughtFlags[thought.id] = true;
        addMsg(thought.text, 'thought');
        break;
      }
    }
  }

  function triggerJakeEnding() {
    const overlay = document.getElementById('ending-overlay');
    const content = document.getElementById('ending-content');
    const choices = document.getElementById('ending-choices');
    overlay.classList.remove('modal-hidden');
    content.innerHTML = '';
    choices.innerHTML = '';
    const lines = [
      'Jake made it to the edge of the city and kept going.',
      'The room is quiet now. The board is clear.',
      'Jake decides what kind of legend survives the win.',
    ];
    lines.forEach((line, i) => {
      const el = document.createElement('div');
      el.className = 'ending-line';
      el.textContent = line;
      content.appendChild(el);
      setTimeout(() => el.classList.add('visible'), (i + 1) * 1200);
    });
    setTimeout(() => {
      (JAKE.endings || []).forEach((ending) => {
        const btn = document.createElement('button');
        btn.textContent = ending.title;
        btn.onclick = () => showJakeEnding(ending.id);
        choices.appendChild(btn);
      });
    }, 4200);
  }

  function showJakeEnding(endingId) {
    const ending = (JAKE.endings || []).find(entry => entry.id === endingId) || (JAKE.endings || [])[0];
    if (!ending) return;
    const content = document.getElementById('ending-content');
    const choices = document.getElementById('ending-choices');
    content.innerHTML = '';
    choices.innerHTML = '';
    const lines = [ending.title, ending.summary].concat(ending.epilogue || []);
    lines.forEach((line, i) => {
      const el = document.createElement('div');
      el.className = 'ending-line';
      el.textContent = line;
      el.style.fontSize = i === 0 ? '24px' : '16px';
      content.appendChild(el);
      setTimeout(() => el.classList.add('visible'), (i + 1) * 1200);
    });
  }

  function startJakeCampaign(fromEnding) {
    ensureExpansionState(game);
    game.meta.brianCompleted = true;
    game.meta.jakeUnlocked = true;
    game.meta.lastBrianEnding = fromEnding || game.meta.lastBrianEnding || 'D';
    game.campaign = 'jake';
    game.jake = createJakeState();
    if (typeof _unlockedPanels !== 'undefined' && _unlockedPanels.clear) _unlockedPanels.clear();
    document.getElementById('ending-overlay').classList.add('modal-hidden');
    syncCampaignChrome();
    updatePhaseUI();
    updateUI();
    renderMessages();
    saveGame(true);
  }

  updatePhaseUI = window.updatePhaseUI = function () {
    ensureExpansionState(game);
    if (!isJakeCampaign()) {
      baseUpdatePhaseUI();
      document.body.className += ' campaign-brian';
      syncCampaignChrome();
      return;
    }
    const state = getJakeState();
    document.body.className = `phase-${state.phase} campaign-jake`;
    document.getElementById('phase-label').textContent = (JAKE.phaseNames || {})[state.phase] || `Jake Phase ${state.phase}`;
    document.getElementById('phase-subtitle').textContent = (JAKE.phaseSubtitles || {})[state.phase] || '';
    syncCampaignChrome();
    updateProgressBar();
  };

  updateProgressBar = window.updateProgressBar = function () {
    if (!isJakeCampaign()) return baseUpdateProgressBar();
    const state = getJakeState();
    const phaseBase = (state.phase - 1) * 20;
    let phaseProgress = 0;
    if (state.phase === 1) phaseProgress = Math.min(1, state.totalCash / JAKE_PHASE_THRESHOLDS[1].cash);
    if (state.phase === 2) phaseProgress = Math.min(1, Math.min(state.rep / JAKE_PHASE_THRESHOLDS[2].rep, state.totalCash / JAKE_PHASE_THRESHOLDS[2].cash));
    if (state.phase === 3) phaseProgress = Math.min(1, Math.min(state.rep / JAKE_PHASE_THRESHOLDS[3].rep, totalJakeCrew() / JAKE_PHASE_THRESHOLDS[3].crew));
    if (state.phase === 4) phaseProgress = Math.min(1, state.legend / JAKE_PHASE_THRESHOLDS[4].legend);
    if (state.phase === 5) phaseProgress = Math.min(1, Math.max(state.legend / JAKE_PHASE_THRESHOLDS[5].legend, state.totalCash / JAKE_PHASE_THRESHOLDS[5].cash));
    document.getElementById('game-progress-fill').style.width = (phaseBase + phaseProgress * 20) + '%';
  };

  function applyJakePanelVisibility() {
    setPanelVisible('panel-actions', true);
    setPanelVisible('panel-upgrades', true);
    setPanelVisible('panel-status', true);
    setPanelVisible('panel-friends', true);
    setPanelVisible('panel-routines', true);
    setPanelVisible('panel-projects', true);
    setPanelVisible('panel-thoughts', true);
    setPanelVisible('panel-stats', true);
    setPanelVisible('panel-activities', true);
    setPanelVisible('panel-initiatives', false);
    setPanelVisible('panel-team', false);
    setPanelVisible('panel-opinion', false);
    setPanelVisible('panel-decay', false);
    setPanelVisible('panel-remember', false);
    setPanelVisible('panel-reality', false);
  }

  updateUI = window.updateUI = function () {
    ensureExpansionState(game);
    injectActivitiesPanel();
    if (!isJakeCampaign()) {
      baseUpdateUI();
      renderSharedActivities();
      syncCampaignChrome();
      return;
    }
    applyJakePanelVisibility();
    renderJakeResources();
    renderJakeActions();
    renderJakeUpgrades();
    renderJakeOperations();
    renderJakeProjects();
    renderJakeCrew();
    renderSharedActivities();
    renderJakeStats();
    renderMessages();
    document.getElementById('time-played').textContent = fmtTime(getJakeState().stats.totalTimePlayed);
  };

  checkThoughts = window.checkThoughts = function () {
    if (!isJakeCampaign()) return baseCheckThoughts();
    checkJakeThoughts();
  };

  checkPanelUnlocks = window.checkPanelUnlocks = function () {
    if (!isJakeCampaign()) {
      baseCheckPanelUnlocks();
      return;
    }
    applyJakePanelVisibility();
  };

  checkPhaseTransitions = window.checkPhaseTransitions = function () {
    if (!isJakeCampaign()) return baseCheckPhaseTransitions();
  };

  triggerEnding = window.triggerEnding = function () {
    ensureExpansionState(game);
    baseTriggerEnding();
    setTimeout(() => {
      const choices = document.getElementById('ending-choices');
      if (!choices || choices.querySelector('[data-become-jake]')) return;
      const btn = document.createElement('button');
      btn.textContent = 'Become Jake';
      btn.dataset.becomeJake = '1';
      btn.onclick = () => startJakeCampaign();
      choices.appendChild(btn);
    }, 9500);
  };

  showEnding = window.showEnding = function (ending) {
    ensureExpansionState(game);
    game.meta.lastBrianEnding = ending;
    baseShowEnding(ending);
    setTimeout(() => {
      const choices = document.getElementById('ending-choices');
      if (!choices || choices.querySelector('[data-become-jake]')) return;
      const btn = document.createElement('button');
      btn.textContent = 'Become Jake';
      btn.dataset.becomeJake = '1';
      btn.onclick = () => startJakeCampaign(ending);
      choices.appendChild(btn);
    }, 14500);
  };

  rebuildDerivedState = window.rebuildDerivedState = function () {
    ensureExpansionState(game);
    baseRebuildDerivedState();
    const state = getJakeState();
    state.maxEnergy = Math.max(40, 70 + (state.upgrades.j1_boots ? 20 : 0));
    if (state.energy > state.maxEnergy) state.energy = state.maxEnergy;
  };

  loadGame = window.loadGame = function () {
    const loaded = baseLoadGame();
    ensureExpansionState(game);
    if (loaded && isJakeCampaign()) {
      const messages = getJakeState().messages;
      const last = messages[messages.length - 1];
      if (last && /Welcome back, Brian/.test(last.text)) messages.pop();
      const elapsed = (Date.now() - (game.lastOnline || Date.now())) / 1000;
      if (elapsed > 10) {
        const capped = Math.min(elapsed, 86400);
        const state = getJakeState();
        const passiveCash = totalJakeCrew() * 0.35 * capped * 0.5;
        const passiveRep = totalJakeCrew() * 0.04 * capped * 0.5;
        const passiveLegend = Math.max(0, state.phase - 3) * 0.03 * capped * 0.5;
        gainJakeCash(passiveCash);
        gainJakeRep(passiveRep);
        gainJakeLegend(passiveLegend);
        addMsg(`Welcome back, Jake. While away for ${fmtTime(capped)}, you pulled in ${fmt(passiveCash)} Cash, ${fmt(passiveRep)} Rep, and ${fmt(passiveLegend)} Legend.`, 'system');
      }
    }
    return loaded;
  };

  gameTick = window.gameTick = function () {
    ensureExpansionState(game);
    const now = Date.now();
    const dt = Math.min((now - expansionLastTick) / 1000, 1);
    expansionLastTick = now;
    if (!isJakeCampaign()) {
      baseGameTick();
      if (game.activities.hustle.activeJobId) {
        game.activities.hustle.remaining -= dt;
        if (game.activities.hustle.remaining <= 0) completeHustleJob();
      }
      return;
    }

    uiCounter += dt;
    saveCounter += dt;
    tickJake(dt);
    checkPanelUnlocks();
    if (game.jake.tick % 5 === 0) checkThoughts();
    if (uiCounter >= 0.33) {
      uiCounter = 0;
      updateUI();
    }
    if (saveCounter >= 30) {
      saveCounter = 0;
      saveGame(true);
    }
  };

  document.addEventListener('keydown', function (e) {
    if (!isJakeCampaign()) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!document.getElementById('io-modal').classList.contains('modal-hidden')) return;
    e.stopImmediatePropagation();
    const keyUpper = e.key.toUpperCase();
    const visible = getJakeVisibleActions();
    const actionIndex = ACTION_KEYS.indexOf(keyUpper);
    if (actionIndex >= 0 && actionIndex < visible.length) {
      performJakeAction(visible[actionIndex].id);
      return;
    }
    if (e.key >= '1' && e.key <= '4') {
      const idx = parseInt(e.key, 10) - 1;
      if (JAKE_CREW_TYPES[idx]) buyJakeCrew(JAKE_CREW_TYPES[idx].id);
      return;
    }
  }, true);

  window.performJakeAction = performJakeAction;
  window.buyJakeUpgrade = buyJakeUpgrade;
  window.chooseJakeProject = chooseJakeProject;
  window.chooseJakeBranch = chooseJakeBranch;
  window.buyJakeCrew = buyJakeCrew;
  window.playSlots = playSlots;
  window.playCardTable = playCardTable;
  window.playDiceGame = playDiceGame;
  window.recruitBattlerUnit = recruitBattlerUnit;
  window.fightEncounter = fightEncounter;
  window.startHustle = startHustle;
  window.triggerJakeEnding = triggerJakeEnding;
  window.startJakeCampaign = startJakeCampaign;

  injectActivitiesPanel();
  syncCampaignChrome();
})();

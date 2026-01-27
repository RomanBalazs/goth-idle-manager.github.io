const GAME_CONFIG = {
  buyOptions: [1, 10, 100],
  milestones: [
    { threshold: 25, type: "profit", multiplier: 2 },
    { threshold: 50, type: "speed", multiplier: 2 },
    { threshold: 100, type: "profit", multiplier: 3 },
    { threshold: 200, type: "speed", multiplier: 2 },
    { threshold: 500, type: "profit", multiplier: 5 },
    { threshold: 1000, type: "speed", multiplier: 2 },
  ],
  globalMilestone: {
    threshold: 25,
    profitMultiplier: 2,
    speedMultiplier: 1.5,
  },
  angel: {
    k: 150,
    unit: 1e15,
    bonusPerAngel: 0.02,
  },
  offline: {
    capHours: 12,
  },
  timeWarp: {
    hours: 2,
    gglCost: 1,
  },
  crates: {
    cooldownMs: 24 * 60 * 60 * 1000,
  },
  energyMaxPerJob: 2,
  managerLevelCostGrowth: 1.1,
};

const MANAGER_RARITIES = [
  { id: "uncommon", label: "Uncommon", minLevel: 0, maxLevel: 20, liquidCost: 10, color: "uncommon" },
  { id: "common", label: "Common", minLevel: 20, maxLevel: 40, liquidCost: 10, color: "common" },
  { id: "rare", label: "Rare", minLevel: 40, maxLevel: 60, liquidCost: 10, color: "rare" },
  { id: "ultra-rare", label: "Ultra Rare", minLevel: 60, maxLevel: 80, liquidCost: 10, color: "ultra-rare" },
  { id: "epic", label: "Epic", minLevel: 80, maxLevel: 100, liquidCost: 10, color: "epic" },
  { id: "legendary", label: "Legendary", minLevel: 100, maxLevel: 150, liquidCost: 10, color: "legendary" },
  { id: "exotic", label: "Exotic", minLevel: 150, maxLevel: 200, liquidCost: 10, color: "exotic" },
];

const WORLD_CONFIGS = [
  {
    id: "earth",
    name: "Goth Earth",
    description: "Az alap világ, ahol a gót üzletláncok indulnak.",
    unlockAngels: 0,
    jobs: [
      {
        id: "starcoffee",
        name: "Starcoffee",
        description: "Jogtiszta kávébár neonfényben.",
        icon: "<img src=\"assets/starcoffee.png\" alt=\"Starcoffee ikon\" />",
        baseCost: 20,
        costGrowth: 1.12,
        baseProfit: 6,
        cycleTimeSeconds: 6,
      },
      {
        id: "mc-dominic",
        name: "MC Dominic",
        description: "Gyorsétterem goth vibe-okkal.",
        icon: "<img src=\"assets/mc-dominic.jpg\" alt=\"MC Dominic ikon\" />",
        baseCost: 120,
        costGrowth: 1.14,
        baseProfit: 22,
        cycleTimeSeconds: 10,
      },
      {
        id: "taco-ding",
        name: "Taco Ding",
        description: "Csengős taco pult, éjjeli menüvel.",
        icon: "<img src=\"assets/taco-ding.jpg\" alt=\"Taco Ding ikon\" />",
        baseCost: 520,
        costGrowth: 1.15,
        baseProfit: 80,
        cycleTimeSeconds: 16,
      },
      {
        id: "pizzahot",
        name: "PizzaHot",
        description: "Forró szeletek lilás füstben.",
        icon: "<img src=\"assets/pizzahot.png\" alt=\"PizzaHot ikon\" />",
        baseCost: 1650,
        costGrowth: 1.16,
        baseProfit: 240,
        cycleTimeSeconds: 24,
      },
      {
        id: "hotdog-stand",
        name: "GFC",
        description: "Gót Fried Chicken, éjfekete fűszerekkel.",
        icon: "<img src=\"assets/gfc.png\" alt=\"GFC ikon\" />",
        baseCost: 5200,
        costGrowth: 1.18,
        baseProfit: 820,
        cycleTimeSeconds: 32,
      },
    ],
  },
  {
    id: "moon",
    name: "Noctis Moon",
    description: "Holdbázis, ahol minden profit lassabban, de nagyobbat szól.",
    unlockAngels: 50,
    jobs: [
      {
        id: "lunar-lab",
        name: "Lunar Lab",
        description: "Kísérleti labor neon holdfénnyel.",
        icon: "🌙",
        baseCost: 180,
        costGrowth: 1.13,
        baseProfit: 10,
        cycleTimeSeconds: 7,
      },
      {
        id: "moon-diner",
        name: "Moon Diner",
        description: "Két világ közt lebegő vendéglő.",
        icon: "🍽️",
        baseCost: 900,
        costGrowth: 1.15,
        baseProfit: 52,
        cycleTimeSeconds: 14,
      },
      {
        id: "nebula-bar",
        name: "Nebula Bar",
        description: "A legfeketébb koktélok a Holdon.",
        icon: "🍸",
        baseCost: 3400,
        costGrowth: 1.17,
        baseProfit: 180,
        cycleTimeSeconds: 22,
      },
    ],
  },
  {
    id: "mars",
    name: "Crimson Mars",
    description: "Vörös porban pörgő goth vállalkozások.",
    unlockAngels: 200,
    jobs: [
      {
        id: "crimson-cafe",
        name: "Crimson Cafe",
        description: "Vörös kávé, mély árnyékok.",
        icon: "🔴",
        baseCost: 260,
        costGrowth: 1.14,
        baseProfit: 18,
        cycleTimeSeconds: 8,
      },
      {
        id: "iron-bbq",
        name: "Iron BBQ",
        description: "Mars-portól füstös grill.",
        icon: "🔥",
        baseCost: 1300,
        costGrowth: 1.16,
        baseProfit: 90,
        cycleTimeSeconds: 16,
      },
      {
        id: "dust-arcade",
        name: "Dust Arcade",
        description: "Retro játékterem vörös neonokkal.",
        icon: "🕹️",
        baseCost: 5200,
        costGrowth: 1.18,
        baseProfit: 320,
        cycleTimeSeconds: 26,
      },
    ],
  },
];

const MANAGER_CONFIGS = WORLD_CONFIGS.flatMap((world) =>
  world.jobs.map((job, index) => ({
    id: `${world.id}-${job.id}-manager`,
    worldId: world.id,
    targetJobId: job.id,
    name: ["Luna", "Nora", "Iris", "Sable", "Raven"][index % 5],
    role: `${job.name} menedzser`,
    cost: Math.round(job.baseCost * 8),
    description: `Automatikusan indítja a ${job.name} ciklusait.`,
  }))
);

const UPGRADE_CONFIGS = {
  cash: [
    {
      id: "cash-global-profit",
      name: "Neon kassza",
      description: "Globális profit x2",
      cost: 500,
      type: "profit",
      multiplier: 2,
      scope: "global",
    },
    {
      id: "cash-speed",
      name: "Sötét tempó",
      description: "Globális speed x1.5",
      cost: 1200,
      type: "speed",
      multiplier: 1.5,
      scope: "global",
    },
    {
      id: "cash-starcoffee",
      name: "Barista boost",
      description: "Starcoffee profit x3",
      cost: 900,
      type: "profit",
      multiplier: 3,
      scope: "job",
      jobId: "starcoffee",
    },
  ],
  angel: [
    {
      id: "angel-global-profit",
      name: "Zöld Szörny",
      description: "Globális profit x3",
      cost: 25,
      type: "profit",
      multiplier: 3,
      scope: "global",
    },
    {
      id: "angel-speed",
      name: "Kék Szörny",
      description: "Globális speed x2",
      cost: 40,
      type: "speed",
      multiplier: 2,
      scope: "global",
    },
    {
      id: "angel-power",
      name: "Rózsaszín Szörny",
      description: "+100% szörny bónusz",
      cost: 60,
      type: "angelPower",
      multiplier: 2,
      scope: "global",
    },
  ],
  premium: [
    {
      id: "premium-profit",
      name: "GGL Overdrive",
      description: "Permanens global profit x1.5",
      cost: 2,
      type: "profit",
      multiplier: 1.5,
      scope: "global",
    },
    {
      id: "premium-speed",
      name: "GGL Time Lace",
      description: "Permanens global speed x1.3",
      cost: 3,
      type: "speed",
      multiplier: 1.3,
      scope: "global",
    },
    {
      id: "premium-auto",
      name: "GGL Auto Chorus",
      description: "Minden munkahely automata",
      cost: 4,
      type: "autoAll",
      scope: "global",
    },
  ],
};

const GOTH_GIRLS = [
  { id: "nyx", name: "Nyx Noir", bonusType: "profit", value: 0.2, rarity: "rare" },
  { id: "vela", name: "Vela Veil", bonusType: "speed", value: 0.15, rarity: "rare" },
  { id: "mara", name: "Mara Mist", bonusType: "crit", value: 0.1, rarity: "epic" },
  { id: "echo", name: "Echo Shade", bonusType: "profit", value: 0.1, rarity: "common" },
  { id: "onyx", name: "Onyx Blade", bonusType: "speed", value: 0.1, rarity: "common" },
  { id: "ivy", name: "Ivy Glimmer", bonusType: "crit", value: 0.05, rarity: "common" },
];

const EVENT_CONFIG = {
  id: "crimson-festival",
  name: "Crimson Festival",
  durationMs: 3 * 24 * 60 * 60 * 1000,
  rewardGgl: 2,
  jobs: [
    {
      id: "event-stand",
      name: "Festival Stand",
      description: "Ideiglenes goth merch stand.",
      icon: "🎪",
      baseCost: 30,
      costGrowth: 1.13,
      baseProfit: 8,
      cycleTimeSeconds: 8,
    },
    {
      id: "event-stage",
      name: "Midnight Stage",
      description: "Kis színpad a főtéren.",
      icon: "🎸",
      baseCost: 140,
      costGrowth: 1.15,
      baseProfit: 28,
      cycleTimeSeconds: 14,
    },
  ],
};

const defaultState = {
  ggl: 0,
  currentWorldId: "earth",
  worlds: {},
  premiumUpgrades: {},
  gothGirls: {
    owned: {},
  },
  gothGirlLiquids: {
    uncommon: 0,
    common: 0,
    rare: 0,
    ultraRare: 0,
    epic: 0,
    legendary: 0,
    exotic: 0,
  },
  crates: {
    lastFree: 0,
  },
  event: {
    startTimestamp: null,
    claimed: false,
    data: null,
  },
  lastSeen: Date.now(),
  buyAmount: 1,
};

const state = loadState();

const cashEl = document.getElementById("cash");
const gglEl = document.getElementById("ggl");
const angelsEl = document.getElementById("angels");
const currentWorldEl = document.getElementById("current-world");
const workplaceList = document.getElementById("workplace-list");
const managerList = document.getElementById("manager-list");
const cashUpgradeList = document.getElementById("cash-upgrade-list");
const angelUpgradeList = document.getElementById("angel-upgrade-list");
const premiumUpgradeList = document.getElementById("premium-upgrade-list");
const prestigeRequirementsEl = document.getElementById("prestige-requirements");
const prestigeButton = document.getElementById("prestige-button");
const angelSummaryEl = document.getElementById("angel-summary");
const lifetimeSummaryEl = document.getElementById("lifetime-summary");
const worldListEl = document.getElementById("world-list");
const eventStatusEl = document.getElementById("event-status");
const eventWorkplaceList = document.getElementById("event-workplace-list");
const tabButtons = document.querySelectorAll(".menu-button");
const tabContents = document.querySelectorAll(".tab-content");
const buyButtons = document.getElementById("buy-buttons");
const timeWarpButton = document.getElementById("time-warp-button");
const crateTimerEl = document.getElementById("crate-timer");
const openCrateButton = document.getElementById("open-crate-button");
const gglCrateButton = document.getElementById("ggl-crate-button");
const cashCrateButton = document.getElementById("cash-crate-button");
const girlListEl = document.getElementById("girl-list");

function createWorldState(worldId) {
  return {
    cash: 60,
    lifetimeEarnings: 0,
    angelsClaimed: 0,
    angelsSpent: 0,
    jobs: {},
    managers: {},
    upgrades: {
      cash: {},
      angel: {},
    },
    energyAssignments: {},
  };
}

function loadState() {
  const stored = localStorage.getItem("goth-idl-state");
  if (!stored) {
    return initState(structuredClone(defaultState));
  }
  const parsed = JSON.parse(stored);
  return initState({ ...structuredClone(defaultState), ...parsed });
}

function initState(nextState) {
  WORLD_CONFIGS.forEach((world) => {
    if (!nextState.worlds[world.id]) {
      nextState.worlds[world.id] = createWorldState(world.id);
    }
  });
  if (!nextState.gothGirls.owned) {
    nextState.gothGirls.owned = {};
  }
  if (!nextState.gothGirlLiquids) {
    nextState.gothGirlLiquids = {
      uncommon: 0,
      common: 0,
      rare: 0,
      ultraRare: 0,
      epic: 0,
      legendary: 0,
      exotic: 0,
    };
  }
  return nextState;
}

function saveState() {
  state.lastSeen = Date.now();
  localStorage.setItem("goth-idl-state", JSON.stringify(state));
}

function formatNumber(value) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return value.toFixed(0);
}

function getWorldConfig(worldId) {
  return WORLD_CONFIGS.find((world) => world.id === worldId);
}

function getCurrentWorldState() {
  return state.worlds[state.currentWorldId];
}

function getWorldJobs(worldId) {
  return getWorldConfig(worldId).jobs;
}

function getJobState(worldState, jobId) {
  if (!worldState.jobs[jobId]) {
    worldState.jobs[jobId] = { quantity: 0, cycleEnd: 0, cycleStart: 0 };
  }
  return worldState.jobs[jobId];
}

function getManagerConfig(worldId, jobId) {
  return MANAGER_CONFIGS.find(
    (manager) => manager.worldId === worldId && manager.targetJobId === jobId
  );
}

function getAssignedEnergyDrinks(worldState, jobId) {
  if (!worldState.energyAssignments[jobId]) {
    worldState.energyAssignments[jobId] = [];
  }
  return worldState.energyAssignments[jobId];
}

function getManagerState(worldState, managerId) {
  const stored = worldState.managers[managerId];
  if (stored === true) {
    worldState.managers[managerId] = { owned: true, level: 1, rarityIndex: 0 };
    return worldState.managers[managerId];
  }
  if (!worldState.managers[managerId]) {
    worldState.managers[managerId] = { owned: false, level: 0, rarityIndex: 0 };
  }
  return worldState.managers[managerId];
}

function getManagerRarity(managerState) {
  return MANAGER_RARITIES[Math.min(managerState.rarityIndex, MANAGER_RARITIES.length - 1)];
}

function getLiquidKey(rarityId) {
  if (rarityId === "ultra-rare") return "ultraRare";
  return rarityId;
}

function getLevelCost(baseCost, level) {
  return Math.round(baseCost * Math.pow(GAME_CONFIG.managerLevelCostGrowth, level));
}

function getAngelTotals(worldState) {
  const total = Math.floor(
    GAME_CONFIG.angel.k * Math.sqrt(worldState.lifetimeEarnings / GAME_CONFIG.angel.unit)
  );
  const claimed = worldState.angelsClaimed;
  const available = Math.max(claimed - worldState.angelsSpent, 0);
  const upcoming = Math.max(total - claimed, 0);
  return { total, claimed, available, upcoming };
}

function getAngelEffectMultiplier(worldState) {
  const angelUpgrades = worldState.upgrades.angel;
  let multiplier = 1;
  UPGRADE_CONFIGS.angel.forEach((upgrade) => {
    if (upgrade.type === "angelPower" && angelUpgrades[upgrade.id]) {
      multiplier *= upgrade.multiplier;
    }
  });
  return multiplier;
}

function getGlobalMultipliers(worldId) {
  const worldState = state.worlds[worldId];
  const cashUpgrades = worldState.upgrades.cash;
  const angelUpgrades = worldState.upgrades.angel;
  let profit = 1;
  let speed = 1;

  UPGRADE_CONFIGS.cash.forEach((upgrade) => {
    if (upgrade.scope === "global" && cashUpgrades[upgrade.id]) {
      if (upgrade.type === "profit") profit *= upgrade.multiplier;
      if (upgrade.type === "speed") speed *= upgrade.multiplier;
    }
  });

  UPGRADE_CONFIGS.angel.forEach((upgrade) => {
    if (upgrade.scope === "global" && angelUpgrades[upgrade.id]) {
      if (upgrade.type === "profit") profit *= upgrade.multiplier;
      if (upgrade.type === "speed") speed *= upgrade.multiplier;
    }
  });

  UPGRADE_CONFIGS.premium.forEach((upgrade) => {
    if (state.premiumUpgrades[upgrade.id]) {
      if (upgrade.type === "profit") profit *= upgrade.multiplier;
      if (upgrade.type === "speed") speed *= upgrade.multiplier;
    }
  });

  const jobs = getWorldJobs(worldId);
  const allMeet = jobs.every((job) => getJobState(worldState, job.id).quantity >= GAME_CONFIG.globalMilestone.threshold);
  if (allMeet) {
    profit *= GAME_CONFIG.globalMilestone.profitMultiplier;
    speed *= GAME_CONFIG.globalMilestone.speedMultiplier;
  }

  const angels = getAngelTotals(worldState);
  const angelBonus = 1 + angels.available * GAME_CONFIG.angel.bonusPerAngel * getAngelEffectMultiplier(worldState);
  profit *= angelBonus;
  return { profit, speed };
}

function getJobMilestoneMultipliers(quantity) {
  let profit = 1;
  let speed = 1;
  GAME_CONFIG.milestones.forEach((milestone) => {
    if (quantity >= milestone.threshold) {
      if (milestone.type === "profit") profit *= milestone.multiplier;
      if (milestone.type === "speed") speed *= milestone.multiplier;
    }
  });
  return { profit, speed };
}

function getJobUpgradeMultipliers(worldState, jobId) {
  let profit = 1;
  let speed = 1;
  UPGRADE_CONFIGS.cash.forEach((upgrade) => {
    if (upgrade.scope === "job" && upgrade.jobId === jobId && worldState.upgrades.cash[upgrade.id]) {
      if (upgrade.type === "profit") profit *= upgrade.multiplier;
      if (upgrade.type === "speed") speed *= upgrade.multiplier;
    }
  });
  return { profit, speed };
}

function getEnergyDrinkMultipliers(worldState, jobId) {
  const assigned = getAssignedEnergyDrinks(worldState, jobId);
  let profit = 1;
  let speed = 1;
  assigned.forEach((upgradeId) => {
    const upgrade = UPGRADE_CONFIGS.angel.find((entry) => entry.id === upgradeId);
    if (!upgrade) return;
    if (upgrade.type === "profit") profit *= upgrade.multiplier;
    if (upgrade.type === "speed") speed *= upgrade.multiplier;
    if (upgrade.type === "angelPower") profit *= upgrade.multiplier;
  });
  return { profit, speed };
}

function getJobCycleTimeSeconds(worldId, jobId) {
  const worldState = state.worlds[worldId];
  const job = getWorldJobs(worldId).find((entry) => entry.id === jobId);
  const globalMultipliers = getGlobalMultipliers(worldId);
  const milestoneMultipliers = getJobMilestoneMultipliers(getJobState(worldState, jobId).quantity);
  const upgradeMultipliers = getJobUpgradeMultipliers(worldState, jobId);
  const drinkMultipliers = getEnergyDrinkMultipliers(worldState, jobId);
  const speedMultiplier = globalMultipliers.speed * milestoneMultipliers.speed * upgradeMultipliers.speed * drinkMultipliers.speed;
  return job.cycleTimeSeconds / speedMultiplier;
}

function getJobPayout(worldId, jobId) {
  const worldState = state.worlds[worldId];
  const job = getWorldJobs(worldId).find((entry) => entry.id === jobId);
  const jobState = getJobState(worldState, jobId);
  if (jobState.quantity <= 0) return 0;
  const globalMultipliers = getGlobalMultipliers(worldId);
  const milestoneMultipliers = getJobMilestoneMultipliers(jobState.quantity);
  const upgradeMultipliers = getJobUpgradeMultipliers(worldState, jobId);
  const drinkMultipliers = getEnergyDrinkMultipliers(worldState, jobId);
  return (
    job.baseProfit *
    jobState.quantity *
    globalMultipliers.profit *
    milestoneMultipliers.profit *
    upgradeMultipliers.profit *
    drinkMultipliers.profit
  );
}

function getJobCost(job, quantity, currentQuantity) {
  if (quantity === 1) {
    return Math.round(job.baseCost * Math.pow(job.costGrowth, currentQuantity));
  }
  const startCost = job.baseCost * Math.pow(job.costGrowth, currentQuantity);
  const total = startCost * ((Math.pow(job.costGrowth, quantity) - 1) / (job.costGrowth - 1));
  return Math.round(total);
}

function canAutoRun(worldId, jobId) {
  const worldState = state.worlds[worldId];
  const manager = getManagerConfig(worldId, jobId);
  const hasManager = manager && getManagerState(worldState, manager.id).owned;
  const hasPremiumAuto = state.premiumUpgrades["premium-auto"];
  return Boolean(hasManager || hasPremiumAuto);
}

function startJobCycle(worldId, jobId) {
  const worldState = state.worlds[worldId];
  const jobState = getJobState(worldState, jobId);
  if (jobState.quantity <= 0) return;
  const now = Date.now();
  const cycleTimeMs = getJobCycleTimeSeconds(worldId, jobId) * 1000;
  jobState.cycleStart = now;
  jobState.cycleEnd = now + cycleTimeMs;
}

function applyPayout(worldId, jobId) {
  const worldState = state.worlds[worldId];
  const payout = getJobPayout(worldId, jobId);
  worldState.cash += payout;
  worldState.lifetimeEarnings += payout;
}

function processWorldCycles(worldId) {
  const worldState = state.worlds[worldId];
  const jobs = getWorldJobs(worldId);
  const now = Date.now();
  jobs.forEach((job) => {
    const jobState = getJobState(worldState, job.id);
    if (jobState.quantity <= 0) {
      jobState.cycleEnd = 0;
      return;
    }
    if (!jobState.cycleEnd && canAutoRun(worldId, job.id)) {
      startJobCycle(worldId, job.id);
    }
    if (jobState.cycleEnd && now >= jobState.cycleEnd) {
      applyPayout(worldId, job.id);
      if (canAutoRun(worldId, job.id)) {
        startJobCycle(worldId, job.id);
      } else {
        jobState.cycleEnd = 0;
      }
    }
  });
}

function applyOfflineEarnings() {
  const now = Date.now();
  const elapsedMs = Math.min(now - state.lastSeen, GAME_CONFIG.offline.capHours * 60 * 60 * 1000);
  if (elapsedMs <= 0) return;
  WORLD_CONFIGS.forEach((world) => {
    const worldState = state.worlds[world.id];
    const elapsedSeconds = elapsedMs / 1000;
    world.jobs.forEach((job) => {
      const jobState = getJobState(worldState, job.id);
      if (!canAutoRun(world.id, job.id) || jobState.quantity <= 0) return;
      const cycleTime = getJobCycleTimeSeconds(world.id, job.id);
      const cycles = Math.floor(elapsedSeconds / cycleTime);
      if (cycles <= 0) return;
      const payout = getJobPayout(world.id, job.id) * cycles;
      worldState.cash += payout;
      worldState.lifetimeEarnings += payout;
    });
  });
}

function renderWorkplaces() {
  const worldId = state.currentWorldId;
  const worldState = getCurrentWorldState();
  const jobs = getWorldJobs(worldId);
  workplaceList.innerHTML = "";

  jobs.forEach((job) => {
    const jobState = getJobState(worldState, job.id);
    const payout = getJobPayout(worldId, job.id);
    const cycleTime = getJobCycleTimeSeconds(worldId, job.id);
    const cost = getJobCost(job, state.buyAmount, jobState.quantity);
    const progress = jobState.cycleEnd
      ? Math.min((Date.now() - jobState.cycleStart) / (jobState.cycleEnd - jobState.cycleStart), 1)
      : 0;
    const assignedDrinks = getAssignedEnergyDrinks(worldState, job.id);
    const purchasedDrinks = UPGRADE_CONFIGS.angel.filter(
      (upgrade) => worldState.upgrades.angel[upgrade.id]
    );
    const assignedDrinkIds = Object.values(worldState.energyAssignments).flat();
    const availableDrinks = purchasedDrinks.filter(
      (drink) => !assignedDrinkIds.includes(drink.id)
    );

    const card = document.createElement("div");
    card.className = "workplace-card";
    card.innerHTML = `
      <div class="workplace-icon">${job.icon}</div>
      <div class="workplace-info">
        <h3>${job.name}</h3>
        <p>${job.description}</p>
        <div class="workplace-tags">
          <span class="tag">Szint: ${jobState.quantity}</span>
          <span class="tag">Ciklus: ${cycleTime.toFixed(1)}s</span>
          <span class="tag">Payout: ${formatNumber(payout)}</span>
        </div>
        <div class="workplace-progress"><span style="width:${(progress * 100).toFixed(0)}%"></span></div>
        <div class="assignment-row">
          <span>Szörny energiaital: ${assignedDrinks.length}/${GAME_CONFIG.energyMaxPerJob}</span>
          <select ${assignedDrinks.length >= GAME_CONFIG.energyMaxPerJob || availableDrinks.length === 0 ? "disabled" : ""}>
            <option value="">Válassz</option>
            ${availableDrinks
              .map((drink) => `<option value="${drink.id}">${drink.name}</option>`)
              .join("")}
          </select>
          <button class="assign-button" ${
            assignedDrinks.length >= GAME_CONFIG.energyMaxPerJob || availableDrinks.length === 0 ? "disabled" : ""
          }>Hozzárendel</button>
        </div>
        <div class="workplace-tags">
          ${assignedDrinks
            .map((drinkId) => {
              const drink = UPGRADE_CONFIGS.angel.find((entry) => entry.id === drinkId);
              return `<span class="tag">${drink?.name ?? "Szörny energiaital"} <button data-drink="${drinkId}" class="remove-drink">✕</button></span>`;
            })
            .join("")}
        </div>
      </div>
      <div class="workplace-actions">
        <div class="workplace-stats">
          <span>Automata: ${canAutoRun(worldId, job.id) ? "Aktív" : "Kézi"}</span>
          <span>Ár: ${formatNumber(cost)}</span>
        </div>
        <button class="work-button" ${jobState.quantity <= 0 || jobState.cycleEnd ? "disabled" : ""}>
          ${jobState.cycleEnd ? "Fut..." : "Dolgozom"}
        </button>
        <button class="upgrade-button" ${worldState.cash < cost ? "disabled" : ""}>
          +${state.buyAmount} munka (${formatNumber(cost)})
        </button>
      </div>
    `;

    card.querySelector(".work-button").addEventListener("click", () => {
      if (jobState.quantity <= 0 || jobState.cycleEnd) return;
      startJobCycle(worldId, job.id);
      saveState();
      render();
    });

    card.querySelector(".upgrade-button").addEventListener("click", () => {
      if (worldState.cash < cost) return;
      worldState.cash -= cost;
      jobState.quantity += state.buyAmount;
      if (canAutoRun(worldId, job.id) && !jobState.cycleEnd) {
        startJobCycle(worldId, job.id);
      }
      saveState();
      render();
    });

    const assignButton = card.querySelector(".assign-button");
    const select = card.querySelector("select");
    assignButton.addEventListener("click", () => {
      const drinkId = select.value;
      if (!drinkId) return;
      const assignment = getAssignedEnergyDrinks(worldState, job.id);
      if (assignment.length >= GAME_CONFIG.energyMaxPerJob) return;
      assignment.push(drinkId);
      saveState();
      render();
    });

    card.querySelectorAll(".remove-drink").forEach((button) => {
      button.addEventListener("click", () => {
        const drinkId = button.dataset.drink;
        const assignment = getAssignedEnergyDrinks(worldState, job.id);
        worldState.energyAssignments[job.id] = assignment.filter((entry) => entry !== drinkId);
        saveState();
        render();
      });
    });

    workplaceList.appendChild(card);
  });
}

function renderManagers() {
  const worldId = state.currentWorldId;
  const worldState = getCurrentWorldState();
  managerList.innerHTML = "";
  MANAGER_CONFIGS.filter((manager) => manager.worldId === worldId).forEach((manager) => {
    const managerState = getManagerState(worldState, manager.id);
    const owned = managerState.owned;
    const nextLevel = managerState.level + 1;
    const levelCost = getLevelCost(manager.cost, managerState.level);
    const rarity = getManagerRarity(managerState);
    const canLevel = managerState.level < rarity.maxLevel;
    const liquidKey = getLiquidKey(rarity.id);
    const liquidCount = state.gothGirlLiquids[liquidKey] ?? 0;
    const canUpgradeRarity = managerState.level === rarity.maxLevel && managerState.rarityIndex < MANAGER_RARITIES.length - 1;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${manager.name}</h3>
        <p>${manager.role}</p>
        <p>${manager.description}</p>
        <div class="rarity-row">
          <span class="rarity-dot ${rarity.color}"></span>
          <span class="rarity-label ${rarity.color}">${rarity.label}</span>
        </div>
      </div>
      <div class="meta">
        <span>Szint: ${managerState.level}</span>
        <span>${owned ? "Aktív" : "Elérhető"}</span>
      </div>
      <div class="manager-actions">
        <button class="manager-level" ${!canLevel || worldState.cash < levelCost ? "disabled" : ""}>
          ${owned ? `Szint +1 (${formatNumber(levelCost)})` : `Felveszem (${formatNumber(levelCost)})`}
        </button>
        <button class="manager-rarity" ${
          !canUpgradeRarity || liquidCount < rarity.liquidCost ? "disabled" : ""
        }>
          Ritkaság +1 (${rarity.liquidCost} ${rarity.label} nedv)
        </button>
      </div>
    `;

    card.querySelector(".manager-level").addEventListener("click", () => {
      if (!canLevel || worldState.cash < levelCost) return;
      worldState.cash -= levelCost;
      managerState.owned = true;
      managerState.level = nextLevel;
      const jobState = getJobState(worldState, manager.targetJobId);
      if (jobState.quantity > 0 && !jobState.cycleEnd) {
        startJobCycle(worldId, manager.targetJobId);
      }
      saveState();
      render();
    });

    card.querySelector(".manager-rarity").addEventListener("click", () => {
      if (!canUpgradeRarity) return;
      const available = state.gothGirlLiquids[liquidKey] ?? 0;
      if (available < rarity.liquidCost) return;
      state.gothGirlLiquids[liquidKey] -= rarity.liquidCost;
      managerState.rarityIndex += 1;
      saveState();
      render();
    });

    managerList.appendChild(card);
  });
}

function renderUpgrades() {
  const worldState = getCurrentWorldState();
  cashUpgradeList.innerHTML = "";
  angelUpgradeList.innerHTML = "";
  premiumUpgradeList.innerHTML = "";

  const worldJobs = getWorldJobs(state.currentWorldId).map((job) => job.id);
  UPGRADE_CONFIGS.cash.filter((upgrade) => upgrade.scope !== "job" || worldJobs.includes(upgrade.jobId)).forEach((upgrade) => {
    const owned = worldState.upgrades.cash[upgrade.id];
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${upgrade.name}</h3>
        <p>${upgrade.description}</p>
      </div>
      <div class="meta">
        <span>Ár: ${formatNumber(upgrade.cost)}</span>
        <span>${owned ? "Aktív" : "Elérhető"}</span>
      </div>
      <button ${owned || worldState.cash < upgrade.cost ? "disabled" : ""}>
        ${owned ? "Megvan" : "Megveszem"}
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      if (owned || worldState.cash < upgrade.cost) return;
      worldState.cash -= upgrade.cost;
      worldState.upgrades.cash[upgrade.id] = true;
      saveState();
      render();
    });
    cashUpgradeList.appendChild(card);
  });

  const angels = getAngelTotals(worldState);
  UPGRADE_CONFIGS.angel.forEach((upgrade) => {
    const owned = worldState.upgrades.angel[upgrade.id];
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${upgrade.name}</h3>
        <p>${upgrade.description}</p>
      </div>
      <div class="meta">
        <span>Ár: ${upgrade.cost} energiaital</span>
        <span>${owned ? "Aktív" : "Elérhető"}</span>
      </div>
      <button ${owned || angels.available < upgrade.cost ? "disabled" : ""}>
        ${owned ? "Megvan" : "Megveszem"}
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      if (owned || angels.available < upgrade.cost) return;
      worldState.angelsSpent += upgrade.cost;
      worldState.upgrades.angel[upgrade.id] = true;
      saveState();
      render();
    });
    angelUpgradeList.appendChild(card);
  });

  UPGRADE_CONFIGS.premium.forEach((upgrade) => {
    const owned = state.premiumUpgrades[upgrade.id];
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${upgrade.name}</h3>
        <p>${upgrade.description}</p>
      </div>
      <div class="meta">
        <span>Ár: ${upgrade.cost} GGL</span>
        <span>${owned ? "Aktív" : "Elérhető"}</span>
      </div>
      <button ${owned || state.ggl < upgrade.cost ? "disabled" : ""}>
        ${owned ? "Megvan" : "GGL vásárlás"}
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      if (owned || state.ggl < upgrade.cost) return;
      state.ggl -= upgrade.cost;
      state.premiumUpgrades[upgrade.id] = true;
      saveState();
      render();
    });
    premiumUpgradeList.appendChild(card);
  });
}

function updatePrestigeUI() {
  const worldState = getCurrentWorldState();
  const angels = getAngelTotals(worldState);
  const requirement = GAME_CONFIG.globalMilestone.threshold;
  const jobs = getWorldJobs(state.currentWorldId);
  const eligibleJobs = jobs.filter((job) => getJobState(worldState, job.id).quantity >= requirement).length;
  const eligibleManagers = Object.values(worldState.managers).filter((manager) => manager?.owned).length;
  const meets = eligibleJobs === jobs.length && eligibleManagers >= jobs.length;

  angelSummaryEl.textContent = `Összes: ${angels.claimed} | Elérhető: ${angels.available} | Resetkor +${angels.upcoming}`;
  lifetimeSummaryEl.textContent = `${formatNumber(worldState.lifetimeEarnings)} kassza összesen`;
  prestigeRequirementsEl.textContent = `Feltétel: minden munkahely ${requirement}+ szinten + legalább ${jobs.length} menedzser. Jelenleg: ${eligibleJobs}/${jobs.length} munkahely, ${eligibleManagers} menedzser.`;
  prestigeButton.disabled = !meets || angels.upcoming <= 0;
}

function renderWorlds() {
  worldListEl.innerHTML = "";
  const currentWorldState = getCurrentWorldState();
  const currentAngels = getAngelTotals(currentWorldState).available;
  WORLD_CONFIGS.forEach((world) => {
    const unlocked = currentAngels >= world.unlockAngels;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${world.name}</h3>
        <p>${world.description}</p>
      </div>
      <div class="meta">
        <span>Belépés: ${world.unlockAngels} energiaital</span>
        <span>${world.id === state.currentWorldId ? "Aktív" : unlocked ? "Elérhető" : "Zárt"}</span>
      </div>
      <button ${world.id === state.currentWorldId || !unlocked ? "disabled" : ""}>
        ${world.id === state.currentWorldId ? "Aktív" : "Utazás"}
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      if (!unlocked) return;
      state.currentWorldId = world.id;
      saveState();
      render();
    });
    worldListEl.appendChild(card);
  });
}

function getEventState() {
  if (!state.event.data) {
    state.event.data = {
      cash: 40,
      lifetimeEarnings: 0,
      jobs: {},
      managers: {},
    };
  }
  return state.event.data;
}

function renderEvent() {
  const now = Date.now();
  if (!state.event.startTimestamp) {
    eventStatusEl.innerHTML = `
      <h3>Crimson Festival</h3>
      <p>Indítsd el az eventet, hogy külön gazdaságot építs.</p>
      <button id="start-event">Event indítása</button>
    `;
    eventWorkplaceList.innerHTML = "";
    eventStatusEl.querySelector("#start-event").addEventListener("click", () => {
      state.event.startTimestamp = Date.now();
      state.event.claimed = false;
      state.event.data = null;
      saveState();
      render();
    });
    return;
  }

  const endTime = state.event.startTimestamp + EVENT_CONFIG.durationMs;
  const remainingMs = endTime - now;
  const eventState = getEventState();
  const isActive = remainingMs > 0;
  const rewardAvailable = !isActive && !state.event.claimed;

  eventStatusEl.innerHTML = `
    <h3>${EVENT_CONFIG.name}</h3>
    <p>${isActive ? `Hátralévő idő: ${formatDuration(remainingMs)}` : "Az event lezárult."}</p>
    <p>Külön kassza: ${formatNumber(eventState.cash)}</p>
    ${rewardAvailable ? `<button id="claim-event">Jutalom: +${EVENT_CONFIG.rewardGgl} GGL</button>` : ""}
  `;

  if (rewardAvailable) {
    eventStatusEl.querySelector("#claim-event").addEventListener("click", () => {
      state.ggl += EVENT_CONFIG.rewardGgl;
      state.event.claimed = true;
      saveState();
      render();
    });
  }

  eventWorkplaceList.innerHTML = "";
  EVENT_CONFIG.jobs.forEach((job) => {
    const jobState = eventState.jobs[job.id] || { quantity: 0, cycleEnd: 0, cycleStart: 0 };
    eventState.jobs[job.id] = jobState;
    const payout = job.baseProfit * jobState.quantity;
    const cost = getJobCost(job, state.buyAmount, jobState.quantity);
    const progress = jobState.cycleEnd
      ? Math.min((Date.now() - jobState.cycleStart) / (jobState.cycleEnd - jobState.cycleStart), 1)
      : 0;

    const card = document.createElement("div");
    card.className = "workplace-card";
    card.innerHTML = `
      <div class="workplace-icon">${job.icon}</div>
      <div class="workplace-info">
        <h3>${job.name}</h3>
        <p>${job.description}</p>
        <div class="workplace-tags">
          <span class="tag">Szint: ${jobState.quantity}</span>
          <span class="tag">Payout: ${formatNumber(payout)}</span>
        </div>
        <div class="workplace-progress"><span style="width:${(progress * 100).toFixed(0)}%"></span></div>
      </div>
      <div class="workplace-actions">
        <div class="workplace-stats">
          <span>Ár: ${formatNumber(cost)}</span>
        </div>
        <button class="work-button" ${jobState.quantity <= 0 || jobState.cycleEnd || !isActive ? "disabled" : ""}>
          ${jobState.cycleEnd ? "Fut..." : "Dolgozom"}
        </button>
        <button class="upgrade-button" ${eventState.cash < cost || !isActive ? "disabled" : ""}>
          +${state.buyAmount} munka (${formatNumber(cost)})
        </button>
      </div>
    `;

    card.querySelector(".work-button").addEventListener("click", () => {
      if (!isActive || jobState.quantity <= 0 || jobState.cycleEnd) return;
      jobState.cycleStart = Date.now();
      jobState.cycleEnd = jobState.cycleStart + job.cycleTimeSeconds * 1000;
      saveState();
      render();
    });

    card.querySelector(".upgrade-button").addEventListener("click", () => {
      if (!isActive || eventState.cash < cost) return;
      eventState.cash -= cost;
      jobState.quantity += state.buyAmount;
      saveState();
      render();
    });

    eventWorkplaceList.appendChild(card);
  });
}

function processEventCycles() {
  if (!state.event.startTimestamp) return;
  const now = Date.now();
  const endTime = state.event.startTimestamp + EVENT_CONFIG.durationMs;
  if (now >= endTime) return;
  const eventState = getEventState();
  EVENT_CONFIG.jobs.forEach((job) => {
    const jobState = eventState.jobs[job.id];
    if (!jobState || jobState.quantity <= 0) return;
    if (jobState.cycleEnd && now >= jobState.cycleEnd) {
      const payout = job.baseProfit * jobState.quantity;
      eventState.cash += payout;
      eventState.lifetimeEarnings += payout;
      jobState.cycleStart = now;
      jobState.cycleEnd = now + job.cycleTimeSeconds * 1000;
    }
  });
}

function renderCrates() {
  const now = Date.now();
  const elapsed = now - state.crates.lastFree;
  const remaining = Math.max(GAME_CONFIG.crates.cooldownMs - elapsed, 0);
  crateTimerEl.textContent = remaining
    ? `Következő láda: ${formatDuration(remaining)}`
    : "Az ingyen láda elérhető!";
  openCrateButton.disabled = remaining > 0;
  gglCrateButton.disabled = state.ggl < 2;
  cashCrateButton.disabled = getCurrentWorldState().cash < 5000;

  girlListEl.innerHTML = `
    <div class="card girl-card">
      <h3>Gót lány nedv készlet</h3>
      <div class="liquid-grid">
        ${MANAGER_RARITIES.map((rarity) => {
          const key = getLiquidKey(rarity.id);
          const count = state.gothGirlLiquids[key] ?? 0;
          return `
            <div class="liquid-row">
              <span class="rarity-dot ${rarity.color}"></span>
              <span>${rarity.label}</span>
              <strong>${count}</strong>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function formatGirlBonus(girl) {
  if (girl.bonusType === "profit") return `Profit +${Math.round(girl.value * 100)}%`;
  if (girl.bonusType === "speed") return `Speed +${Math.round(girl.value * 100)}%`;
  if (girl.bonusType === "crit") return `Crit +${Math.round(girl.value * 100)}%`;
  return "";
}

function addLiquids(results) {
  results.forEach((rarityId) => {
    const key = getLiquidKey(rarityId);
    state.gothGirlLiquids[key] = (state.gothGirlLiquids[key] ?? 0) + 1;
  });
}

function rollLiquid(weights) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  let roll = Math.random() * total;
  for (const [rarity, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }
  return "uncommon";
}

function openCrate(crateType) {
  const now = Date.now();
  const results = [];
  if (crateType === "free") {
    const elapsed = now - state.crates.lastFree;
    if (elapsed < GAME_CONFIG.crates.cooldownMs) return;
    results.push("rare");
    const weights = { uncommon: 50, common: 25, rare: 15, "ultra-rare": 6, epic: 3, legendary: 1 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
    state.crates.lastFree = now;
  }
  if (crateType === "cash") {
    if (getCurrentWorldState().cash < 5000) return;
    getCurrentWorldState().cash -= 5000;
    const weights = { uncommon: 35, common: 30, rare: 20, "ultra-rare": 8, epic: 5, legendary: 2 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
  }
  if (crateType === "ggl") {
    if (state.ggl < 2) return;
    state.ggl -= 2;
    const weights = { uncommon: 20, common: 25, rare: 25, "ultra-rare": 15, epic: 10, legendary: 4, exotic: 1 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
  }
  addLiquids(results);
  saveState();
  render();
}

function updateTopBar() {
  const worldState = getCurrentWorldState();
  const angels = getAngelTotals(worldState);
  const world = getWorldConfig(state.currentWorldId);
  currentWorldEl.textContent = world.name;
  cashEl.textContent = formatNumber(worldState.cash);
  gglEl.textContent = state.ggl.toFixed(0);
  angelsEl.textContent = angels.available.toFixed(0);
}

function updateTimeWarpButton() {
  timeWarpButton.disabled = state.ggl < GAME_CONFIG.timeWarp.gglCost;
}

function render() {
  updateTopBar();
  updateTimeWarpButton();
  renderWorkplaces();
  renderManagers();
  renderUpgrades();
  updatePrestigeUI();
  renderWorlds();
  renderEvent();
  renderCrates();
}

function tick() {
  processWorldCycles(state.currentWorldId);
  processEventCycles();
  render();
}

function formatDuration(ms) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}óra ${minutes}p`;
  }
  if (minutes > 0) {
    return `${minutes}p ${seconds}mp`;
  }
  return `${seconds}mp`;
}

prestigeButton.addEventListener("click", () => {
  const worldState = getCurrentWorldState();
  const angels = getAngelTotals(worldState);
  if (angels.upcoming <= 0) return;

  worldState.cash = 60;
  worldState.jobs = {};
  worldState.managers = {};
  worldState.upgrades.cash = {};
  worldState.upgrades.angel = {};
  worldState.angelsClaimed = angels.total;
  worldState.angelsSpent = 0;
  state.ggl += 1;
  saveState();
  render();
});

buyButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const amount = Number(button.dataset.amount);
  if (!amount) return;
  state.buyAmount = amount;
  buyButtons.querySelectorAll(".pill").forEach((pill) => {
    pill.classList.toggle("active", pill === button);
  });
  saveState();
  render();
});

timeWarpButton.addEventListener("click", () => {
  if (state.ggl < GAME_CONFIG.timeWarp.gglCost) return;
  const worldId = state.currentWorldId;
  const worldState = getCurrentWorldState();
  const hours = GAME_CONFIG.timeWarp.hours;
  const seconds = hours * 3600;
  getWorldJobs(worldId).forEach((job) => {
    const jobState = getJobState(worldState, job.id);
    if (!canAutoRun(worldId, job.id) || jobState.quantity <= 0) return;
    const cycleTime = getJobCycleTimeSeconds(worldId, job.id);
    const cycles = Math.floor(seconds / cycleTime);
    if (cycles <= 0) return;
    const payout = getJobPayout(worldId, job.id) * cycles;
    worldState.cash += payout;
    worldState.lifetimeEarnings += payout;
  });
  state.ggl -= GAME_CONFIG.timeWarp.gglCost;
  saveState();
  render();
});

openCrateButton.addEventListener("click", () => openCrate("free"));
gglCrateButton.addEventListener("click", () => openCrate("ggl"));
cashCrateButton.addEventListener("click", () => openCrate("cash"));

applyOfflineEarnings();
render();
setInterval(tick, 200);

window.addEventListener("beforeunload", saveState);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    tabButtons.forEach((item) => item.classList.toggle("active", item === button));
    tabContents.forEach((content) => {
      content.classList.toggle("active", content.dataset.tab === tab);
    });
  });
});

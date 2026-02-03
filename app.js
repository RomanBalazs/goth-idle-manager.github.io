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
  // Extra speed scaling per manager level (applied on top of rarity base).
  managerSpeedBonusPerLevel: 0.005,
};

const MANAGER_RARITIES = [
  // speedMultiplier: how much faster a job cycle becomes when its manager is owned at this rarity
  { id: "uncommon", label: "Uncommon", minLevel: 0, maxLevel: 20, liquidCost: 10, color: "uncommon", speedMultiplier: 1.0 },
  { id: "common", label: "Common", minLevel: 20, maxLevel: 40, liquidCost: 10, color: "common", speedMultiplier: 3.0 },
  { id: "rare", label: "Rare", minLevel: 40, maxLevel: 60, liquidCost: 10, color: "rare", speedMultiplier: 6.0 },
  { id: "ultra-rare", label: "Ultra Rare", minLevel: 60, maxLevel: 80, liquidCost: 10, color: "ultra-rare", speedMultiplier: 9.0 },
  { id: "epic", label: "Epic", minLevel: 80, maxLevel: 100, liquidCost: 10, color: "epic", speedMultiplier: 12.0 },
  { id: "legendary", label: "Legendary", minLevel: 100, maxLevel: 150, liquidCost: 10, color: "legendary", speedMultiplier: 15.0 },
  { id: "exotic", label: "Exotic", minLevel: 150, maxLevel: 200, liquidCost: 10, color: "exotic", speedMultiplier: 20.0 },
];


const BADGES = [
  {
    id: "starter",
    icon: "🖤",
    name: "Starter",
    desc: "Az első lépés a sötétségbe.",
    unlock: () => true,
  },
  {
    id: "crate10",
    icon: "🎁",
    name: "Crate Opener",
    desc: "Nyiss 10 ládát.",
    unlock: (s) => (s.stats?.totalCratesOpened ?? 0) >= 10,
    progress: (s) => ({
      label: "Ládák",
      current: s.stats?.totalCratesOpened ?? 0,
      target: 10,
    }),
  },
  {
    id: "prestige1",
    icon: "🦇",
    name: "Reborn",
    desc: "Csinálj 1 prestige-et.",
    unlock: (s) => (s.stats?.totalPrestiges ?? 0) >= 1,
    progress: (s) => ({
      label: "Prestige",
      current: s.stats?.totalPrestiges ?? 0,
      target: 1,
    }),
  },
  {
    id: "upgrade100",
    icon: "⚙️",
    name: "Tinkerer",
    desc: "Vegyél összesen 100 munka upgrade-et.",
    unlock: (s) => (s.stats?.totalUpgradesBought ?? 0) >= 100,
    progress: (s) => ({
      label: "Upgrade",
      current: s.stats?.totalUpgradesBought ?? 0,
      target: 100,
    }),
  },
  {
    id: "manager10",
    icon: "🧑‍💼",
    name: "HR Horror",
    desc: "Vásárolj 10 menedzser szintet.",
    unlock: (s) => (s.stats?.totalManagersBought ?? 0) >= 10,
    progress: (s) => ({
      label: "Menedzserek",
      current: s.stats?.totalManagersBought ?? 0,
      target: 10,
    }),
  },
  {
    id: "earn1m",
    icon: "💰",
    name: "First Million",
    desc: "Keress összesen 1 000 000 kasszát.",
    unlock: (s) => (s.stats?.totalCashEarned ?? 0) >= 1_000_000,
    progress: (s) => ({
      label: "Összbevétel",
      current: s.stats?.totalCashEarned ?? 0,
      target: 1_000_000,
    }),
  },
];

const ADVANCEMENT_CATEGORIES = [
  {
    id: "starter",
    title: "Kezdés / Alap haladás",
    items: [
      {
        id: "first-cash",
        icon: "💰",
        name: "Első Kassza",
        desc: "Szerezz összesen 1 000 kasszát.",
        unlock: (s) => (s.stats?.totalCashEarned ?? 0) >= 1000,
        progress: (s) => ({
          current: s.stats?.totalCashEarned ?? 0,
          target: 1000,
          label: "Kassza",
        }),
      },
      {
        id: "clicker-goth",
        icon: "🖱️",
        name: "Kattintó Gót",
        desc: "Indíts el 10 manuális ciklust (\"Dolgozom\").",
        unlock: (s) => (s.stats?.totalClicks ?? 0) >= 10,
        progress: (s) => ({
          current: s.stats?.totalClicks ?? 0,
          target: 10,
          label: "Kattintások",
        }),
      },
      {
        id: "first-workplace",
        icon: "🏢",
        name: "Első Munkahely",
        desc: "Vegyél meg 1 munkahelyet.",
        unlock: () => getTotalJobLevels() >= 1,
      },
      {
        id: "scaling-25",
        icon: "📈",
        name: "Skálázás I.",
        desc: "Bármely munkahely szintje érje el a 25-öt.",
        unlock: () => getMaxJobLevel() >= 25,
        progress: () => ({
          current: getMaxJobLevel(),
          target: 25,
          label: "Max szint",
        }),
      },
    ],
  },
  {
    id: "next-bonus",
    title: "NEXT vásárlási bónusz",
    items: [
      {
        id: "next-magic",
        icon: "✨",
        name: "NEXT Varázsa",
        desc: "Használd a NEXT vagy MAX vásárlást 10×.",
        unlock: (s) => (s.stats?.totalSmartBuys ?? 0) >= 10,
        progress: (s) => ({
          current: s.stats?.totalSmartBuys ?? 0,
          target: 10,
          label: "Használatok",
        }),
      },
    ],
  },
  {
    id: "workplace-mastery",
    title: "Munkahely mastery",
    items: [
      {
        id: "workplace-maniac",
        icon: "🏗️",
        name: "Munkahely-mániás",
        desc: "Vegyél összesen 100 munkahely szintet (összesítve).",
        unlock: () => getTotalJobLevels() >= 100,
        progress: () => ({
          current: getTotalJobLevels(),
          target: 100,
          label: "Szintek",
        }),
      },
    ],
  },
  {
    id: "workplace-scaling-50",
    title: "Haladó munkahely fejlesztés",
    items: [
      {
        id: "scaling-50",
        icon: "🧱",
        name: "Skálázás II.",
        desc: "Érj el 50-es szintet bármely munkahelynél.",
        unlock: () => getMaxJobLevel() >= 50,
        progress: () => ({
          current: getMaxJobLevel(),
          target: 50,
          label: "Max szint",
        }),
      },
    ],
  },
  {
    id: "workplace-scaling-100",
    title: "Mesteri munkahely elérése",
    items: [
      {
        id: "scaling-100",
        icon: "👑",
        name: "Skálázás III.",
        desc: "Érj el 100-as szintet bármely munkahelynél.",
        unlock: () => getMaxJobLevel() >= 100,
        progress: () => ({
          current: getMaxJobLevel(),
          target: 100,
          label: "Max szint",
        }),
      },
    ],
  },
  {
    id: "automation-boost",
    title: "Automatizálási gyorsítás",
    items: [
      {
        id: "auto-rush",
        icon: "⚡",
        name: "Gyorsulás",
        desc: "Legyen legalább 3 automata ciklus futásban egyszerre.",
        unlock: () => getActiveAutoCyclesCount() >= 3,
        progress: () => ({
          current: getActiveAutoCyclesCount(),
          target: 3,
          label: "Aktív ciklus",
        }),
      },
    ],
  },
  {
    id: "global-milestone",
    title: "Teljes körű mérföldkő elérése",
    items: [
      {
        id: "all-business",
        icon: "🦇",
        name: "Mindenki dolgozik",
        desc: "Teljesíts egy \"teljes körű mérföldkövet\" (all-business milestone).",
        unlock: () => hasGlobalMilestone(),
      },
    ],
  },
  {
    id: "managers",
    title: "Menedzser és automatizálás",
    items: [
      {
        id: "first-manager",
        icon: "🧑‍💼",
        name: "Első Menedzser",
        desc: "Vegyél 1 menedzsert.",
        unlock: (s) => (s.stats?.totalManagersBought ?? 0) >= 1,
      },
      {
        id: "auto-mode",
        icon: "🤖",
        name: "Automata Üzemmód",
        desc: "1 munkahelyet tegyél automata ciklusra.",
        unlock: () => getAutomatedJobsCount() >= 1,
      },
      {
        id: "manager-swarm",
        icon: "🦾",
        name: "Menedzser-raj",
        desc: "Legyen 5 menedzsered összesen.",
        unlock: (s) => (s.stats?.totalManagersBought ?? 0) >= 5,
        progress: (s) => ({
          current: s.stats?.totalManagersBought ?? 0,
          target: 5,
          label: "Menedzserek",
        }),
      },
      {
        id: "staff-lead",
        icon: "🧑‍✈️",
        name: "Személyzetvezető",
        desc: "10 munkahely legyen automatizálva.",
        unlock: () => getAutomatedJobsCount() >= 10,
        progress: () => ({
          current: getAutomatedJobsCount(),
          target: 10,
          label: "Automata munkahelyek",
        }),
      },
      {
        id: "never-stop",
        icon: "⏱️",
        name: "Soha meg nem áll",
        desc: "30 percig folyamatosan legyen legalább 1 automata munka aktív.",
        unlock: (s) => (s.stats?.autoRunStreakMs ?? 0) >= 30 * 60 * 1000,
        progress: (s) => ({
          current: Math.floor((s.stats?.autoRunStreakMs ?? 0) / 1000),
          target: 30 * 60,
          label: "Másodperc",
        }),
      },
    ],
  },
  {
    id: "cash-upgrades",
    title: "Cash Upgrade Progression",
    items: [
      {
        id: "first-cash-upgrade",
        icon: "💸",
        name: "Első Cash Upgrade",
        desc: "Vegyél 1 Cash Upgrade-et.",
        unlock: (s) => (s.stats?.totalCashUpgradesBought ?? 0) >= 1,
      },
      {
        id: "cash-build",
        icon: "🧾",
        name: "Cash Build",
        desc: "Vegyél 10 Cash Upgrade-et.",
        unlock: (s) => (s.stats?.totalCashUpgradesBought ?? 0) >= 10,
        progress: (s) => ({
          current: s.stats?.totalCashUpgradesBought ?? 0,
          target: 10,
          label: "Cash upgrade-ek",
        }),
      },
    ],
  },
  {
    id: "energy-drinks",
    title: "Energy Drink Acquisition",
    items: [
      {
        id: "first-energy",
        icon: "🥤",
        name: "Energiaital",
        desc: "Szerezz 1 Szörny energiaitalt.",
        unlock: () => getTotalAngelsClaimed() >= 1,
      },
      {
        id: "energy-addict",
        icon: "🧪",
        name: "Energiaital függő",
        desc: "Vegyél 1 energiaitalos upgrade-et.",
        unlock: (s) => (s.stats?.totalAngelUpgradesBought ?? 0) >= 1,
      },
    ],
  },
  {
    id: "ggl-premium",
    title: "Goth Girl Liquid és Premium",
    items: [
      {
        id: "ggl-touch",
        icon: "💗",
        name: "GGL Érintés",
        desc: "Szerezz 1 Goth Girl Liquid (GGL)-t.",
        unlock: (s) => (s.stats?.totalGglEarned ?? 0) >= 1,
      },
      {
        id: "premium-taste",
        icon: "💎",
        name: "Premium ízlés",
        desc: "Vegyél 1 Premium (GGL) upgrade-et.",
        unlock: (s) => (s.stats?.totalPremiumUpgradesBought ?? 0) >= 1,
      },
    ],
  },
  {
    id: "time-warp",
    title: "Time Warp használat",
    items: [
      {
        id: "time-warp-1",
        icon: "🌀",
        name: "Time Warp I.",
        desc: "Használd a Time Warp-ot 1×.",
        unlock: (s) => (s.stats?.timeWarpUsed ?? 0) >= 1,
      },
      {
        id: "time-warp-10",
        icon: "🕒",
        name: "Time Warp II.",
        desc: "Használd a Time Warp-ot 10×.",
        unlock: (s) => (s.stats?.timeWarpUsed ?? 0) >= 10,
        progress: (s) => ({
          current: s.stats?.timeWarpUsed ?? 0,
          target: 10,
          label: "Használatok",
        }),
      },
    ],
  },
  {
    id: "prestige",
    title: "Prestige / Reset mastery",
    items: [
      {
        id: "first-prestige",
        icon: "🦇",
        name: "Első Újrakezdés",
        desc: "Prestige/Reset 1×.",
        unlock: (s) => (s.stats?.totalPrestiges ?? 0) >= 1,
      },
      {
        id: "double-reset",
        icon: "♻️",
        name: "Duplázó Reset",
        desc: "Resetelj úgy, hogy az új energiaital legalább 2× a jelenleginél.",
        unlock: (s) => (s.stats?.doubleResetCount ?? 0) >= 1,
      },
      {
        id: "reset-routine",
        icon: "🔁",
        name: "Reset Rutin",
        desc: "Prestige 5×.",
        unlock: (s) => (s.stats?.totalPrestiges ?? 0) >= 5,
        progress: (s) => ({
          current: s.stats?.totalPrestiges ?? 0,
          target: 5,
          label: "Prestige",
        }),
      },
    ],
  },
  {
    id: "performance",
    title: "Teljesítmény és bónuszok",
    items: [
      {
        id: "lifetime-legend",
        icon: "🏆",
        name: "Lifetime Legend",
        desc: "Érj el 1 quadrillion kasszát (összesen).",
        unlock: (s) => (s.stats?.totalCashEarned ?? 0) >= 1e15,
        progress: (s) => ({
          current: s.stats?.totalCashEarned ?? 0,
          target: 1e15,
          label: "Összbevétel",
        }),
      },
      {
        id: "permanent-style",
        icon: "🧿",
        name: "Permanens Stílus",
        desc: "Legyen 3 tartós (Premium) bónuszod aktív.",
        unlock: () => getTotalPremiumUpgrades() >= 3,
        progress: () => ({
          current: getTotalPremiumUpgrades(),
          target: 3,
          label: "Premium bónusz",
        }),
      },
    ],
  },
  {
    id: "worlds",
    title: "Világok felfedezése és mesterré válása",
    items: [
      {
        id: "first-world-hop",
        icon: "🚪",
        name: "Új Világ Kapuja",
        desc: "Válts át egy másik világra először.",
        unlock: (s) => (s.stats?.worldsVisited ?? []).length >= 2,
      },
      {
        id: "world-hopper",
        icon: "🌌",
        name: "Világjáró",
        desc: "Látogass meg 3 világot összesen.",
        unlock: (s) => (s.stats?.worldsVisited ?? []).length >= 3,
        progress: (s) => ({
          current: (s.stats?.worldsVisited ?? []).length,
          target: 3,
          label: "Világok",
        }),
      },
      {
        id: "world-master",
        icon: "🗺️",
        name: "Világ Master",
        desc: "Maxold ki egy világ fő \"core\" munkahelyeit (lvl 100 minden munkahely).",
        unlock: () => hasWorldCoreMaxed(100),
      },
    ],
  },
  {
    id: "events",
    title: "Event-Based Challenges",
    items: [
      {
        id: "first-event",
        icon: "🎉",
        name: "Első Event",
        desc: "Vegyél részt 1 eventen.",
        unlock: (s) => (s.stats?.eventsStarted ?? 0) >= 1,
      },
      {
        id: "event-finish",
        icon: "✅",
        name: "Event Finish",
        desc: "Fejezz be 1 eventet (érj el céljutalmat).",
        unlock: (s) => (s.stats?.eventsFinished ?? 0) >= 1,
      },
      {
        id: "event-top50",
        icon: "🥈",
        name: "Top 50%",
        desc: "Eventen végezz a felső 50%-ban.",
        unlock: () => false,
      },
      {
        id: "event-hardcarry",
        icon: "🎯",
        name: "Event Hardcarry",
        desc: "Szerezz eventen 10× ládanyitást.",
        unlock: () => false,
      },
    ],
  },
  {
    id: "crates",
    title: "Ládák / Loot",
    items: [
      {
        id: "first-free-crate",
        icon: "🎁",
        name: "Első Ingyen Láda",
        desc: "Nyisd ki az első 24 órás ingyen ládát.",
        unlock: (s) => (s.stats?.totalFreeCratesOpened ?? 0) >= 1,
      },
      {
        id: "crate-opener",
        icon: "📦",
        name: "Láda-nyitogató",
        desc: "Nyiss ki 10 ládát összesen.",
        unlock: (s) => (s.stats?.totalCratesOpened ?? 0) >= 10,
        progress: (s) => ({
          current: s.stats?.totalCratesOpened ?? 0,
          target: 10,
          label: "Ládák",
        }),
      },
      {
        id: "cash-crate",
        icon: "💵",
        name: "Cash Láda",
        desc: "Nyiss ki 5 Cash ládát.",
        unlock: (s) => (s.stats?.totalCashCratesOpened ?? 0) >= 5,
        progress: (s) => ({
          current: s.stats?.totalCashCratesOpened ?? 0,
          target: 5,
          label: "Cash ládák",
        }),
      },
      {
        id: "ggl-crate",
        icon: "💝",
        name: "GGL Láda",
        desc: "Nyiss ki 5 GGL ládát.",
        unlock: (s) => (s.stats?.totalGglCratesOpened ?? 0) >= 5,
        progress: (s) => ({
          current: s.stats?.totalGglCratesOpened ?? 0,
          target: 5,
          label: "GGL ládák",
        }),
      },
    ],
  },
  {
    id: "rare-loot",
    title: "Rare Item Acquisition",
    items: [
      {
        id: "rare-drop",
        icon: "🔮",
        name: "Ritka Nedv",
        desc: "Szerezz 1 ritka dropot a ládából.",
        unlock: (s) => (s.stats?.rareDropsFound ?? 0) >= 1,
      },
    ],
  },
  {
    id: "profile",
    title: "Profil / Badge / Küldetések",
    items: [
      {
        id: "profile-awake",
        icon: "🧛",
        name: "Profil Felélesztve",
        desc: "Adj meg nicknevet és mentsd el.",
        unlock: (s) => (s.stats?.nicknameSet ?? 0) >= 1,
      },
      {
        id: "first-badge",
        icon: "🏅",
        name: "Első Badge",
        desc: "Oldj fel 1 badge-et.",
        unlock: () => Object.keys(state.profile?.unlockedBadges ?? {}).length >= 2,
      },
      {
        id: "daily-quest",
        icon: "📅",
        name: "Napi Küldi",
        desc: "Teljesíts 1 napi küldetést.",
        unlock: (s) => (s.stats?.dailyQuestsClaimed ?? 0) >= 1,
      },
      {
        id: "weekly-quest",
        icon: "🗓️",
        name: "Heti Küldi",
        desc: "Teljesíts 1 heti küldetést.",
        unlock: (s) => (s.stats?.weeklyQuestsClaimed ?? 0) >= 1,
      },
      {
        id: "goth-empire",
        icon: "🖤",
        name: "Gót Birodalom",
        desc: "Teljesíts 25 küldetést összesen (napi+heti).",
        unlock: (s) => (s.stats?.totalQuestsClaimed ?? 0) >= 25,
        progress: (s) => ({
          current: s.stats?.totalQuestsClaimed ?? 0,
          target: 25,
          label: "Küldetések",
        }),
      },
    ],
  },
];

const ADVANCEMENTS = ADVANCEMENT_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({ ...item, categoryId: category.id }))
);

const QUEST_CONFIG = {
  dailyCount: 3,
  weeklyCount: 3,
};

const QUEST_TEMPLATES = {
  daily: [
    { key: "earn", type: "earn", title: "Kassza", icon: "💰" },
    { key: "upgrade", type: "upgrade", title: "Fejlesztés", icon: "⚙️" },
    { key: "manager", type: "manager", title: "Menedzserek", icon: "🧑‍💼" },
    { key: "crate", type: "crate", title: "Ládák", icon: "🎁" },
    { key: "level", type: "level_any", title: "Szint", icon: "📈" },
  ],
  weekly: [
    { key: "earn", type: "earn", title: "Kassza", icon: "💰" },
    { key: "upgrade", type: "upgrade", title: "Fejlesztés", icon: "⚙️" },
    { key: "manager", type: "manager", title: "Menedzserek", icon: "🧑‍💼" },
    { key: "crate", type: "crate", title: "Ládák", icon: "🎁" },
    { key: "level", type: "level_any", title: "Szint", icon: "📈" },
  ],
};


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
        icon: "<img src=\"./assets/pizzahot.png\" alt=\"PizzaHot ikon\" onerror=\"this.outerHTML='🍕'\" />",
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
  profile: {
    nickname: "Player",
    selectedBadgeId: "starter",
    unlockedBadges: { starter: true },
    badgeSort: "status",
  },
  advancements: {
    unlocked: {},
    notified: {},
  },
  stats: {
    totalClicks: 0,
    totalUpgradesBought: 0,
    totalManagersBought: 0,
    totalCratesOpened: 0,
    totalPrestiges: 0,
    totalCashEarned: 0,
    totalSmartBuys: 0,
    totalCashUpgradesBought: 0,
    totalAngelUpgradesBought: 0,
    totalPremiumUpgradesBought: 0,
    totalGglEarned: 0,
    totalFreeCratesOpened: 0,
    totalCashCratesOpened: 0,
    totalGglCratesOpened: 0,
    rareDropsFound: 0,
    eventsStarted: 0,
    eventsFinished: 0,
    dailyQuestsClaimed: 0,
    weeklyQuestsClaimed: 0,
    totalQuestsClaimed: 0,
    worldsVisited: [],
    autoRunStreakMs: 0,
    lastAutoRunCheck: 0,
    nicknameSet: 0,
    doubleResetCount: 0,
    timeWarpUsed: 0,
  },
  quests: {
    dayKey: null,
    weekKey: null,
    daily: [],
    weekly: [],
  },

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
const playerNicknameEl = document.getElementById("player-nickname");
const playerBadgeEl = document.getElementById("player-badge");
const profileNicknameInput = document.getElementById("profile-nickname");
const profileSaveNicknameButton = document.getElementById("profile-save-nickname");
const profileBadgeGrid = document.getElementById("profile-badge-grid");
const profileSelectedBadgeEl = document.getElementById("profile-selected-badge");
const profileStatsEl = document.getElementById("profile-stats");
const profileBadgeSortEl = document.getElementById("profile-badge-sort");
const advancementListEl = document.getElementById("advancement-list");


const dailyQuestListEl = document.getElementById("daily-quest-list");
const weeklyQuestListEl = document.getElementById("weekly-quest-list");
const dailyResetEl = document.getElementById("daily-reset");
const weeklyResetEl = document.getElementById("weekly-reset");
const questsPanelEl = document.querySelector('.tab-content[data-tab="quests"]');

// ===== FX / UI Feedback (payout pops, flashes, toasts) =====
const FX = {
  queue: [],
  payoutPopLast: new Map(), // key: "worldId:jobId" -> timestamp
  bannerLastAt: 0,
  toastLastAt: 0,
  topLast: { cash: null, ggl: null, angels: null },
  topWorldId: null,
};

const FX_CONFIG = {
  payoutPopThrottleMs: 900,
  bannerThrottleMs: 700,
  toastThrottleMs: 220,
  popLifetimeMs: 950,
  toastLifetimeMs: 2400,
  bannerLifetimeMs: 1600,
  unlockLifetimeMs: 2200,
};

function isTabActive(tabId) {
  const active = document.querySelector('.tab-content.active');
  return active?.dataset?.tab === tabId;
}

function fxEnsureLayers() {
  let layer = document.getElementById('fx-layer');
  if (layer) return layer;
  layer = document.createElement('div');
  layer.id = 'fx-layer';
  layer.className = 'fx-layer';
  layer.innerHTML = `
    <div id="fx-banner-host" class="fx-banner-host"></div>
    <div id="fx-unlock-host" class="fx-unlock-host"></div>
    <div id="fx-toast-host" class="fx-toast-host"></div>
  `;
  document.body.appendChild(layer);
  return layer;
}

function fxEnqueue(evt) {
  FX.queue.push({ ...evt, __t: Date.now() });
}

function fxPulse(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  window.setTimeout(() => el.classList.remove(className), 520);
}

function fxFlash(el, className = 'fx-flash') {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  window.setTimeout(() => el.classList.remove(className), 380);
}

function fxPopAt(anchorEl, text, variant = 'cash') {
  if (!anchorEl) return;
  const layer = fxEnsureLayers();
  const pop = document.createElement('div');
  pop.className = `fx-pop ${variant}`.trim();
  pop.textContent = text;

  const rect = anchorEl.getBoundingClientRect();
  const x = rect.left + rect.width * 0.5;
  const y = rect.top + rect.height * 0.15;

  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;

  layer.appendChild(pop);
  window.setTimeout(() => pop.remove(), FX_CONFIG.popLifetimeMs);
}

function fxBanner(text, variant = 'info') {
  const now = Date.now();
  if (now - FX.bannerLastAt < FX_CONFIG.bannerThrottleMs) return;
  FX.bannerLastAt = now;

  fxEnsureLayers();
  const host = document.getElementById('fx-banner-host');
  if (!host) return;

  const el = document.createElement('div');
  el.className = `fx-banner ${variant}`.trim();
  el.textContent = text;
  host.appendChild(el);

  window.setTimeout(() => el.classList.add('out'), FX_CONFIG.bannerLifetimeMs - 220);
  window.setTimeout(() => el.remove(), FX_CONFIG.bannerLifetimeMs);
}

function fxToast(title, body = '', variant = 'info') {
  const now = Date.now();
  if (now - FX.toastLastAt < FX_CONFIG.toastThrottleMs) return;
  FX.toastLastAt = now;

  fxEnsureLayers();
  const host = document.getElementById('fx-toast-host');
  if (!host) return;

  const el = document.createElement('div');
  el.className = `fx-toast ${variant}`.trim();
  el.innerHTML = `<div class="fx-toast-title">${title}</div>${body ? `<div class="fx-toast-body">${body}</div>` : ''}`;
  host.appendChild(el);

  window.setTimeout(() => el.classList.add('out'), FX_CONFIG.toastLifetimeMs - 260);
  window.setTimeout(() => el.remove(), FX_CONFIG.toastLifetimeMs);
}

function fxUnlock(title, icon, subtitle = 'Advancement feloldva') {
  fxEnsureLayers();
  const host = document.getElementById('fx-unlock-host');
  if (!host) return;

  const el = document.createElement('div');
  el.className = 'fx-unlock';
  el.innerHTML = `
    <div class="fx-unlock-icon">${icon ?? ""}</div>
    <div>
      <div class="fx-unlock-title">${title}</div>
      <div class="fx-unlock-sub">${subtitle}</div>
    </div>
  `;
  host.appendChild(el);
  window.setTimeout(() => el.classList.add('out'), FX_CONFIG.unlockLifetimeMs - 240);
  window.setTimeout(() => el.remove(), FX_CONFIG.unlockLifetimeMs);
}

function fxFlush() {
  if (!FX.queue.length) return;
  const events = FX.queue.splice(0, FX.queue.length);
  const now = Date.now();

  events.forEach((evt) => {
    if (evt.type === 'payout') {
      // Only show pops on active workplace tab + current world
      if (!isTabActive('workplaces')) return;
      if (evt.worldId !== state.currentWorldId) return;

      const key = `${evt.worldId}:${evt.jobId}`;
      const last = FX.payoutPopLast.get(key) || 0;
      if (now - last < FX_CONFIG.payoutPopThrottleMs) return;
      FX.payoutPopLast.set(key, now);

      const icon = document.querySelector(`.workplace-card[data-job-id="${evt.jobId}"] .workplace-icon`);
      if (!icon) return;
      fxPopAt(icon, `+${formatNumber(evt.amount)}`, 'cash');
      return;
    }

    if (evt.type === 'event_payout') {
      if (!isTabActive('event')) return;
      const key = `event:${evt.jobId}`;
      const last = FX.payoutPopLast.get(key) || 0;
      if (now - last < FX_CONFIG.payoutPopThrottleMs) return;
      FX.payoutPopLast.set(key, now);

      const icon = document.querySelector(`.workplace-card[data-event-job-id="${evt.jobId}"] .workplace-icon`);
      if (!icon) return;
      fxPopAt(icon, `+${formatNumber(evt.amount)}`, 'event');
      return;
    }

    if (evt.type === 'work_start') {
      const card = document.querySelector(`.workplace-card[data-job-id="${evt.jobId}"]`);
      fxFlash(card, 'fx-flash');
      return;
    }

    if (evt.type === 'buy_upgrade') {
      const card = document.querySelector(`.workplace-card[data-job-id="${evt.jobId}"]`);
      fxFlash(card, 'fx-flash');
      if (evt.milestone) fxBanner(`Mérföldkő: ${evt.milestone}`, 'good');
      return;
    }

    if (evt.type === 'buy_manager') {
      const card = document.querySelector(`.card[data-manager-id="${evt.managerId}"]`);
      fxFlash(card, 'fx-flash');
      return;
    }

    if (evt.type === 'upgrade_manager_rarity') {
      const card = document.querySelector(`.card[data-manager-id="${evt.managerId}"]`);
      fxFlash(card, 'fx-flash-good');
      fxBanner(`Ritkaság +1`, 'good');
      return;
    }

    if (evt.type === 'buy_upgrade_card') {
      fxFlash(evt.el, 'fx-flash');
      return;
    }

    if (evt.type === 'quest_complete') {
      fxBanner(`Küldetés kész! ${evt.title}`, 'good');
      fxToast('Küldetés kész!', evt.title, 'good');
      return;
    }

    if (evt.type === 'quest_claim') {
      const rewardText = typeof formatQuestRewardShort === 'function' ? formatQuestRewardShort(evt.reward) : '';
      fxToast('Jutalom felvéve', rewardText, 'good');
      return;
    }

    if (evt.type === 'crate_open') {
      fxBanner('Láda nyitva!', 'info');
      fxToast('Láda nyitva', evt.summary || '', 'info');
      return;
    }

    if (evt.type === 'prestige') {
      fxBanner('Prestige!', 'good');
      return;
    }
  });
}


function syncBuyButtons() {
  if (!buyButtons) return;
  const normalized = normalizeBuyMode(state.buyAmount);
  state.buyAmount = normalized;
  const selected = String(normalized);
  let found = false;
  buyButtons.querySelectorAll(".pill").forEach((pill) => {
    const raw = String(pill.dataset.amount ?? "");
    const isActive = raw === selected;
    pill.classList.toggle("active", isActive);
    if (isActive) found = true;
  });
  if (!found) {
    state.buyAmount = 1;
    buyButtons.querySelectorAll(".pill").forEach((pill) => {
      pill.classList.toggle("active", String(pill.dataset.amount ?? "") === "1");
    });
  }
}

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
    // ---- Profile & stats defaults (backward compatible) ----
  if (!nextState.profile) nextState.profile = structuredClone(defaultState.profile);
  if (!nextState.profile.unlockedBadges) nextState.profile.unlockedBadges = { starter: true };
  if (!nextState.profile.unlockedBadges.starter) nextState.profile.unlockedBadges.starter = true;
  if (!nextState.profile.nickname || typeof nextState.profile.nickname !== "string") nextState.profile.nickname = "Player";
  if (!nextState.profile.selectedBadgeId) {
    nextState.profile.selectedBadgeId = Object.keys(nextState.profile.unlockedBadges)[0] || "starter";
  }

  if (!nextState.profile.badgeSort) nextState.profile.badgeSort = "status";

  if (!nextState.advancements) nextState.advancements = structuredClone(defaultState.advancements);
  if (!nextState.advancements.unlocked) nextState.advancements.unlocked = {};
  if (!nextState.advancements.notified) nextState.advancements.notified = {};

  if (!nextState.stats) nextState.stats = structuredClone(defaultState.stats);
  Object.entries(defaultState.stats).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      if (!Array.isArray(nextState.stats[k])) nextState.stats[k] = structuredClone(v);
      return;
    }
    if (typeof v === "number") {
      if (typeof nextState.stats[k] !== "number") nextState.stats[k] = v;
      return;
    }
    if (typeof v === "boolean") {
      if (typeof nextState.stats[k] !== "boolean") nextState.stats[k] = v;
      return;
    }
    if (typeof v === "object" && v !== null) {
      if (typeof nextState.stats[k] !== "object") nextState.stats[k] = structuredClone(v);
      return;
    }
    if (typeof nextState.stats[k] === "undefined") nextState.stats[k] = v;
  });
  if (!Array.isArray(nextState.stats.worldsVisited)) nextState.stats.worldsVisited = [];
  if (!nextState.stats.worldsVisited.includes(nextState.currentWorldId)) {
    nextState.stats.worldsVisited.push(nextState.currentWorldId);
  }

  // ---- Quests defaults (backward compatible) ----
  if (!nextState.quests) nextState.quests = structuredClone(defaultState.quests);
  if (!Array.isArray(nextState.quests.daily)) nextState.quests.daily = [];
  if (!Array.isArray(nextState.quests.weekly)) nextState.quests.weekly = [];
  if (typeof nextState.quests.dayKey !== "string") nextState.quests.dayKey = null;
  if (typeof nextState.quests.weekKey !== "string") nextState.quests.weekKey = null;

  // Backfill quest flags
  const fixQuestFlags = (arr) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((q) => {
      if (typeof q.notifiedComplete !== 'boolean') q.notifiedComplete = false;
    });
  };
  fixQuestFlags(nextState.quests.daily);
  fixQuestFlags(nextState.quests.weekly);

  if (!nextState.gothGirls.owned) {
    nextState.gothGirls.owned = {};
  }
  if (!getWorldConfig(nextState.currentWorldId)) {
    nextState.currentWorldId = WORLD_CONFIGS[0].id;
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

// ===== Profile helpers =====
function sanitizeNickname(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 16);
}

function getTotalJobLevels() {
  return Object.values(state.worlds).reduce((sum, worldState) => {
    return sum + Object.values(worldState.jobs || {}).reduce((jobSum, jobState) => jobSum + (jobState.quantity ?? 0), 0);
  }, 0);
}

function getMaxJobLevel() {
  return Object.values(state.worlds).reduce((max, worldState) => {
    const worldMax = Object.values(worldState.jobs || {}).reduce((jobMax, jobState) => Math.max(jobMax, jobState.quantity ?? 0), 0);
    return Math.max(max, worldMax);
  }, 0);
}

function getAutomatedJobsCount() {
  return WORLD_CONFIGS.reduce((total, world) => {
    const worldState = state.worlds[world.id];
    const jobs = world.jobs || [];
    const count = jobs.filter((job) => {
      const jobState = getJobState(worldState, job.id);
      return jobState.quantity > 0 && canAutoRun(world.id, job.id);
    }).length;
    return total + count;
  }, 0);
}

function getActiveAutoCyclesCount() {
  const now = Date.now();
  return WORLD_CONFIGS.reduce((total, world) => {
    const worldState = state.worlds[world.id];
    const jobs = world.jobs || [];
    const count = jobs.filter((job) => {
      const jobState = getJobState(worldState, job.id);
      return jobState.quantity > 0 && canAutoRun(world.id, job.id) && jobState.cycleEnd && jobState.cycleEnd > now;
    }).length;
    return total + count;
  }, 0);
}

function hasGlobalMilestone() {
  return WORLD_CONFIGS.some((world) => {
    const worldState = state.worlds[world.id];
    return world.jobs.every((job) => getJobState(worldState, job.id).quantity >= GAME_CONFIG.globalMilestone.threshold);
  });
}

function hasWorldCoreMaxed(level) {
  return WORLD_CONFIGS.some((world) => {
    const worldState = state.worlds[world.id];
    return world.jobs.every((job) => getJobState(worldState, job.id).quantity >= level);
  });
}

function getTotalAngelsClaimed() {
  return Object.values(state.worlds).reduce((sum, worldState) => sum + (worldState.angelsClaimed ?? 0), 0);
}

function getTotalPremiumUpgrades() {
  return Object.values(state.premiumUpgrades || {}).filter(Boolean).length;
}

function updateAutoRunStreak() {
  if (!state.stats) return;
  const now = Date.now();
  const last = state.stats.lastAutoRunCheck || now;
  const elapsed = Math.max(0, now - last);
  state.stats.lastAutoRunCheck = now;
  if (getActiveAutoCyclesCount() > 0) {
    state.stats.autoRunStreakMs = (state.stats.autoRunStreakMs ?? 0) + elapsed;
  } else {
    state.stats.autoRunStreakMs = 0;
  }
}

function addGgl(amount) {
  if (!amount) return;
  state.ggl += amount;
  if (state.stats) state.stats.totalGglEarned = (state.stats.totalGglEarned ?? 0) + amount;
}

function ensureBadgesUnlocked() {
  let changed = false;

  BADGES.forEach((b) => {
    if (state.profile.unlockedBadges[b.id]) return;
    if (b.unlock(state)) {
      state.profile.unlockedBadges[b.id] = true;
      changed = true;
      if (!state.profile.selectedBadgeId) state.profile.selectedBadgeId = b.id;
    }
  });

  if (!state.profile.unlockedBadges[state.profile.selectedBadgeId]) {
    state.profile.selectedBadgeId = "starter";
    changed = true;
  }

  if (changed) saveState();
}

function ensureAdvancementsUnlocked() {
  let changed = false;
  ADVANCEMENTS.forEach((adv) => {
    if (state.advancements.unlocked[adv.id]) return;
    if (adv.unlock && adv.unlock(state)) {
      state.advancements.unlocked[adv.id] = true;
      changed = true;
      if (!state.advancements.notified[adv.id]) {
        fxUnlock(adv.name, adv.icon);
        state.advancements.notified[adv.id] = true;
      }
    }
  });
  if (changed) saveState();
}

function setNickname(value) {
  state.profile.nickname = sanitizeNickname(value) || "Player";
  if (state.stats && state.profile.nickname && state.profile.nickname !== "Player") {
    state.stats.nicknameSet = 1;
  }
  saveState();
  render();
}

function setSelectedBadge(badgeId) {
  if (!state.profile.unlockedBadges[badgeId]) return;
  state.profile.selectedBadgeId = badgeId;
  saveState();
  render();
}

function setBadgeSort(mode) {
  const allowed = ["status", "progress", "name"];
  state.profile.badgeSort = allowed.includes(mode) ? mode : "status";
  saveState();
  render();
}

function getSelectedBadge() {
  return BADGES.find((b) => b.id === state.profile.selectedBadgeId) || BADGES[0];
}

function renderProfileHeader() {
  ensureBadgesUnlocked();
  const badge = getSelectedBadge();
  if (playerNicknameEl) playerNicknameEl.textContent = state.profile.nickname;
  if (playerBadgeEl) playerBadgeEl.textContent = badge.icon;
}

function renderProfile() {
  const activeTab = document.querySelector(".tab-content.active")?.dataset?.tab;
  if (activeTab !== "profile") return;

  ensureBadgesUnlocked();

  if (profileNicknameInput) {
    if (document.activeElement !== profileNicknameInput && profileNicknameInput.value !== state.profile.nickname) {
      profileNicknameInput.value = state.profile.nickname;
    }
  }

  if (profileSelectedBadgeEl) {
    const b = getSelectedBadge();
    profileSelectedBadgeEl.innerHTML = `
      <div class="row">
        <span class="icon">${b.icon}</span>
        <div>
          <div class="name">${b.name}</div>
          <div class="desc">${b.desc}</div>
        </div>
      </div>
      <div class="muted small">Aktív</div>
    `;
  }

  if (profileBadgeSortEl) {
    const mode = state.profile.badgeSort || "status";
    if (profileBadgeSortEl.value !== mode) profileBadgeSortEl.value = mode;
  }

  if (profileBadgeGrid) {
    profileBadgeGrid.innerHTML = "";

    const mode = state.profile.badgeSort || "status";

    const entries = BADGES.map((b) => {
      const unlocked = Boolean(state.profile.unlockedBadges[b.id]);
      const selected = state.profile.selectedBadgeId === b.id;

      const prog = typeof b.progress === "function" ? b.progress(state) : null;
      const current = prog ? Math.min(prog.current ?? 0, prog.target ?? 0) : 0;
      const target = prog ? (prog.target ?? 0) : 0;
      const ratio = prog && target > 0 ? Math.max(0, Math.min(1, current / target)) : 0;
      const progressText = prog ? `${prog.label}: ${formatNumber(current)} / ${formatNumber(target)}` : "";

      return { b, unlocked, selected, prog, current, target, ratio, progressText };
    });

    const group = (e) => {
      if (e.selected) return 0;
      if (e.unlocked) return 1;
      return 2;
    };

    entries.sort((a, c) => {
      const ga = group(a);
      const gc = group(c);
      if (ga !== gc) return ga - gc;

      if (mode === "name") {
        return a.b.name.localeCompare(c.b.name, "hu");
      }

      // locked badges: progress desc (closer first)
      if (ga === 2) {
        if (c.ratio !== a.ratio) return c.ratio - a.ratio;
        const ra = (a.target ?? 0) - (a.current ?? 0);
        const rc = (c.target ?? 0) - (c.current ?? 0);
        if (ra !== rc) return ra - rc;
      }

      return a.b.name.localeCompare(c.b.name, "hu");
    });

    entries.forEach(({ b, unlocked, selected, prog, ratio, progressText }) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `badge ${unlocked ? "" : "locked"} ${selected ? "selected" : ""}`.trim();

      const tooltip = unlocked
        ? `${b.icon} ${b.name}\n${b.desc}${progressText ? `\n${progressText}` : ""}`
        : `${b.icon} ${b.name}\nFeltétel: ${b.desc}${progressText ? `\n${progressText}` : ""}`;

      el.setAttribute("data-tooltip", tooltip);
      el.setAttribute("aria-label", tooltip);
      if (!unlocked) el.setAttribute("aria-disabled", "true");

      const reqHtml = unlocked
        ? `<div class="desc">${b.desc}</div>`
        : `<div class="req">Feltétel: ${b.desc}</div>
           <div class="req-meta">${progressText || "Zárolva"}</div>`;

      el.innerHTML = `
        <div class="row">
          <span class="icon">${b.icon}</span>
          <span class="name">${b.name}</span>
        </div>
        ${reqHtml}
        ${!unlocked && prog ? `<div class="mini-progress"><div class="fill" style="width:${Math.round(ratio * 100)}%"></div></div>` : ""}
      `;

      el.addEventListener("click", () => {
        if (!unlocked) return;
        setSelectedBadge(b.id);
      });

      profileBadgeGrid.appendChild(el);
    });
  }

  if (profileStatsEl) {
    const s = state.stats;
    profileStatsEl.innerHTML = `
      <div class="profile-stat"><span>Kattintások</span><strong>${(s.totalClicks ?? 0).toFixed(0)}</strong></div>
      <div class="profile-stat"><span>Munka upgrade</span><strong>${(s.totalUpgradesBought ?? 0).toFixed(0)}</strong></div>
      <div class="profile-stat"><span>Menedzser szintek</span><strong>${(s.totalManagersBought ?? 0).toFixed(0)}</strong></div>
      <div class="profile-stat"><span>Nyitott ládák</span><strong>${(s.totalCratesOpened ?? 0).toFixed(0)}</strong></div>
      <div class="profile-stat"><span>Prestige</span><strong>${(s.totalPrestiges ?? 0).toFixed(0)}</strong></div>
      <div class="profile-stat"><span>Összbevétel</span><strong>${formatNumber(s.totalCashEarned ?? 0)}</strong></div>
    `;
  }
}

function renderAdvancements() {
  const activeTab = document.querySelector(".tab-content.active")?.dataset?.tab;
  if (activeTab !== "advancements") return;
  if (!advancementListEl) return;

  ensureAdvancementsUnlocked();
  advancementListEl.innerHTML = "";

  ADVANCEMENT_CATEGORIES.forEach((category) => {
    const section = document.createElement("div");
    section.className = "advancement-category";
    section.innerHTML = `<h3>${category.title}</h3>`;

    const grid = document.createElement("div");
    grid.className = "advancement-grid";

    category.items.forEach((adv) => {
      const unlocked = Boolean(state.advancements.unlocked[adv.id]);
      const prog = typeof adv.progress === "function" ? adv.progress(state) : null;
      const current = prog ? Math.min(prog.current ?? 0, prog.target ?? 0) : 0;
      const target = prog ? (prog.target ?? 0) : 0;
      const ratio = prog && target > 0 ? Math.max(0, Math.min(1, current / target)) : 0;
      const progressText = prog
        ? `${prog.label}: ${formatNumber(current)} / ${formatNumber(target)}`
        : unlocked
        ? "Feloldva"
        : "Zárolva";

      const card = document.createElement("div");
      card.className = `advancement-card ${unlocked ? "unlocked" : "locked"}`.trim();
      card.innerHTML = `
        <div class="advancement-icon">${unlocked ? adv.icon : ""}</div>
        <div class="advancement-info">
          <h4>${adv.name}</h4>
          <p>${adv.desc}</p>
          <div class="advancement-meta">
            ${prog ? `<div class="advancement-progress"><span style="width:${Math.round(ratio * 100)}%"></span></div>` : ""}
            <div class="advancement-status">${progressText}</div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    advancementListEl.appendChild(section);
  });
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

function getManagerEffectiveSpeedMultiplier(managerState) {
  const rarity = getManagerRarity(managerState);
  const base = Number(rarity.speedMultiplier ?? 1);
  const level = Math.max(0, Number(managerState.level ?? 0));
  // Fine scaling: +X% per level after level 1.
  const perLevel = Number(GAME_CONFIG.managerSpeedBonusPerLevel ?? 0);
  const levelFactor = 1 + Math.max(0, level - 1) * perLevel;
  const total = base * levelFactor;
  return Number.isFinite(total) && total > 0 ? total : 1;
}

function formatSpeedMultiplier(mult) {
  const x = Number(mult);
  if (!Number.isFinite(x) || x <= 0) return "x1";
  const rounded = Math.round(x * 100) / 100;
  return `x${rounded}`;
}

function getManagerSpeedMultiplier(worldId, jobId) {
  const worldState = state.worlds[worldId];
  const manager = getManagerConfig(worldId, jobId);
  if (!manager) return 1;
  const ms = getManagerState(worldState, manager.id);
  if (!ms.owned) return 1;
  const rarity = getManagerRarity(ms);
  return getManagerEffectiveSpeedMultiplier(ms);
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
  const managerSpeedMultiplier = getManagerSpeedMultiplier(worldId, jobId);
  const speedMultiplier = globalMultipliers.speed * milestoneMultipliers.speed * upgradeMultipliers.speed * drinkMultipliers.speed * managerSpeedMultiplier;
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

// ===== Buy amount helpers (x1/x10/x100/NEXT/MAX) =====
function normalizeBuyMode(value) {
  if (value === "max" || value === "next") return value;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.floor(n);
}

function getNextMilestoneThreshold(currentQuantity) {
  const thresholds = GAME_CONFIG.milestones.map((m) => m.threshold).sort((a, b) => a - b);
  return thresholds.find((t) => t > currentQuantity) ?? null;
}

function getMaxAffordableJobQuantity(job, currentQuantity, cash) {
  const r = job.costGrowth;
  const startCost = job.baseCost * Math.pow(r, currentQuantity);
  if (cash < startCost) return 0;

  // r is expected > 1. Handle edge-case gracefully.
  if (Math.abs(r - 1) < 1e-9) {
    return Math.max(0, Math.floor(cash / startCost));
  }

  // Invert geometric series sum to estimate max quantity.
  const raw = 1 + (cash * (r - 1)) / startCost;
  let q = Math.floor(Math.log(raw) / Math.log(r));
  if (!Number.isFinite(q) || q < 0) q = 0;

  // Safety adjust for rounding.
  while (q > 0 && getJobCost(job, q, currentQuantity) > cash) q -= 1;
  const HARD_CAP = 1_000_000;
  while (q < HARD_CAP && getJobCost(job, q + 1, currentQuantity) <= cash) q += 1;
  return q;
}

function getBuyPlan(job, currentQuantity, cash, buyModeRaw) {
  const mode = normalizeBuyMode(buyModeRaw);
  if (mode === "max") {
    const qty = getMaxAffordableJobQuantity(job, currentQuantity, cash);
    const displayQty = qty > 0 ? qty : 1;
    const cost = getJobCost(job, displayQty, currentQuantity);
    return { mode, qty, displayQty, cost, target: null, willReachMilestone: false };
  }
  if (mode === "next") {
    const target = getNextMilestoneThreshold(currentQuantity);
    const needed = target ? Math.max(target - currentQuantity, 1) : 1;
    const maxAff = getMaxAffordableJobQuantity(job, currentQuantity, cash);
    const qty = Math.min(needed, maxAff);
    const displayQty = qty > 0 ? qty : 1;
    const cost = getJobCost(job, displayQty, currentQuantity);
    return { mode, qty, displayQty, cost, target: target ?? null, willReachMilestone: qty > 0 && qty === needed };
  }

  const qty = mode;
  const cost = getJobCost(job, qty, currentQuantity);
  return { mode, qty, displayQty: qty, cost, target: null, willReachMilestone: false };
}

function formatUpgradeButtonText(plan) {
  if (plan.mode === "next" && plan.target && plan.willReachMilestone) {
    return `+${plan.displayQty} \u2192 ${plan.target} munka (${formatNumber(plan.cost)})`;
  }
  return `+${plan.displayQty} munka (${formatNumber(plan.cost)})`;
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
  if (state.stats) state.stats.totalCashEarned = (state.stats.totalCashEarned ?? 0) + payout;
  worldState.cash += payout;
  worldState.lifetimeEarnings += payout;
  questOnEvent("earn", payout);
  fxEnqueue({ type: 'payout', worldId, jobId, amount: payout });
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
      if (state.stats) state.stats.totalCashEarned = (state.stats.totalCashEarned ?? 0) + payout;
      questOnEvent("earn", payout);
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
    const buyPlan = getBuyPlan(job, jobState.quantity, worldState.cash, state.buyAmount);
    const cost = buyPlan.cost;
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
    card.dataset.jobId = job.id;
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
          ${formatUpgradeButtonText(buyPlan)}
        </button>
      </div>
    `;

    card.querySelector(".work-button").addEventListener("click", () => {
      if (jobState.quantity <= 0 || jobState.cycleEnd) return;
      startJobCycle(worldId, job.id);
      fxEnqueue({ type: "work_start", worldId, jobId: job.id });
      if (state.stats) state.stats.totalClicks = (state.stats.totalClicks ?? 0) + 1;
      saveState();
      render();
    });

    card.querySelector(".upgrade-button").addEventListener("click", () => {
      const plan = getBuyPlan(job, jobState.quantity, worldState.cash, state.buyAmount);
      const mode = plan.mode;
      let purchaseQty = 0;
      if (mode === "max") {
        purchaseQty = getMaxAffordableJobQuantity(job, jobState.quantity, worldState.cash);
      } else if (mode === "next") {
        const target = getNextMilestoneThreshold(jobState.quantity);
        const needed = target ? Math.max(target - jobState.quantity, 1) : 1;
        const maxAff = getMaxAffordableJobQuantity(job, jobState.quantity, worldState.cash);
        purchaseQty = Math.min(needed, maxAff);
      } else {
        purchaseQty = plan.qty;
      }
      if (!purchaseQty || purchaseQty <= 0) return;
      const purchaseCost = getJobCost(job, purchaseQty, jobState.quantity);
      if (worldState.cash < purchaseCost) return;
      worldState.cash -= purchaseCost;
      const prevQty = jobState.quantity;
      jobState.quantity += purchaseQty;
      if (state.stats && (mode === "next" || mode === "max")) {
        state.stats.totalSmartBuys = (state.stats.totalSmartBuys ?? 0) + 1;
      }
      // Milestone feedback (only if a new threshold was crossed)
      const hits = GAME_CONFIG.milestones
        .map((m) => m.threshold)
        .sort((a, b) => a - b)
        .filter((t) => prevQty < t && jobState.quantity >= t);
      const milestone = hits.length ? hits[hits.length - 1] : null;
      fxEnqueue({ type: "buy_upgrade", worldId, jobId: job.id, qty: purchaseQty, milestone });
      if (state.stats) state.stats.totalUpgradesBought = (state.stats.totalUpgradesBought ?? 0) + purchaseQty;
      questOnEvent("upgrade", purchaseQty);
      refreshDerivedQuestProgress();
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
    card.dataset.managerId = manager.id;
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
        <span>Sebesség: ${formatSpeedMultiplier(getManagerEffectiveSpeedMultiplier(managerState))}</span>
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
      fxEnqueue({ type: "buy_manager", worldId, managerId: manager.id, level: nextLevel });
      if (state.stats) state.stats.totalManagersBought = (state.stats.totalManagersBought ?? 0) + 1;
      questOnEvent("manager", 1);
      refreshDerivedQuestProgress();
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
      fxEnqueue({ type: "upgrade_manager_rarity", worldId, managerId: manager.id });
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
      if (state.stats) state.stats.totalCashUpgradesBought = (state.stats.totalCashUpgradesBought ?? 0) + 1;
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
      if (state.stats) state.stats.totalAngelUpgradesBought = (state.stats.totalAngelUpgradesBought ?? 0) + 1;
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
      if (state.stats) state.stats.totalPremiumUpgradesBought = (state.stats.totalPremiumUpgradesBought ?? 0) + 1;
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
      if (state.stats) {
        if (!Array.isArray(state.stats.worldsVisited)) state.stats.worldsVisited = [];
        if (!state.stats.worldsVisited.includes(world.id)) {
          state.stats.worldsVisited.push(world.id);
        }
      }
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
      if (state.stats) state.stats.eventsStarted = (state.stats.eventsStarted ?? 0) + 1;
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
      addGgl(EVENT_CONFIG.rewardGgl);
      state.event.claimed = true;
      if (state.stats) state.stats.eventsFinished = (state.stats.eventsFinished ?? 0) + 1;
      saveState();
      render();
    });
  }

  eventWorkplaceList.innerHTML = "";
  EVENT_CONFIG.jobs.forEach((job) => {
    const jobState = eventState.jobs[job.id] || { quantity: 0, cycleEnd: 0, cycleStart: 0 };
    eventState.jobs[job.id] = jobState;
    const payout = job.baseProfit * jobState.quantity;
    const buyPlan = getBuyPlan(job, jobState.quantity, eventState.cash, state.buyAmount);
    const cost = buyPlan.cost;
    const progress = jobState.cycleEnd
      ? Math.min((Date.now() - jobState.cycleStart) / (jobState.cycleEnd - jobState.cycleStart), 1)
      : 0;

    const card = document.createElement("div");
    card.className = "workplace-card";
    card.dataset.eventJobId = job.id;
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
          ${formatUpgradeButtonText(buyPlan)}
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
      if (!isActive) return;
      const plan = getBuyPlan(job, jobState.quantity, eventState.cash, state.buyAmount);
      const mode = plan.mode;
      let purchaseQty = 0;
      if (mode === "max") {
        purchaseQty = getMaxAffordableJobQuantity(job, jobState.quantity, eventState.cash);
      } else if (mode === "next") {
        const target = getNextMilestoneThreshold(jobState.quantity);
        const needed = target ? Math.max(target - jobState.quantity, 1) : 1;
        const maxAff = getMaxAffordableJobQuantity(job, jobState.quantity, eventState.cash);
        purchaseQty = Math.min(needed, maxAff);
      } else {
        purchaseQty = plan.qty;
      }
      if (!purchaseQty || purchaseQty <= 0) return;
      const purchaseCost = getJobCost(job, purchaseQty, jobState.quantity);
      if (eventState.cash < purchaseCost) return;
      eventState.cash -= purchaseCost;
      jobState.quantity += purchaseQty;
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
      fxEnqueue({ type: 'event_payout', jobId: job.id, amount: payout });
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
  let didOpen = false;

  if (crateType === "free") {
    const elapsed = now - state.crates.lastFree;
    if (elapsed < GAME_CONFIG.crates.cooldownMs) return;
    didOpen = true;
    results.push("rare");
    const weights = { uncommon: 50, common: 25, rare: 15, "ultra-rare": 6, epic: 3, legendary: 1 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
    state.crates.lastFree = now;
    if (state.stats) state.stats.totalFreeCratesOpened = (state.stats.totalFreeCratesOpened ?? 0) + 1;
  }

  if (crateType === "cash") {
    if (getCurrentWorldState().cash < 5000) return;
    didOpen = true;
    getCurrentWorldState().cash -= 5000;
    const weights = { uncommon: 35, common: 30, rare: 20, "ultra-rare": 8, epic: 5, legendary: 2 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
    if (state.stats) state.stats.totalCashCratesOpened = (state.stats.totalCashCratesOpened ?? 0) + 1;
  }

  if (crateType === "ggl") {
    if (state.ggl < 2) return;
    didOpen = true;
    state.ggl -= 2;
    const weights = { uncommon: 20, common: 25, rare: 25, "ultra-rare": 15, epic: 10, legendary: 4, exotic: 1 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
    if (state.stats) state.stats.totalGglCratesOpened = (state.stats.totalGglCratesOpened ?? 0) + 1;
  }

  if (!didOpen) return;
  if (state.stats) state.stats.totalCratesOpened = (state.stats.totalCratesOpened ?? 0) + 1;
  if (state.stats) {
    const rareSet = ["rare", "ultra-rare", "epic", "legendary", "exotic"];
    if (results.some((rarity) => rareSet.includes(rarity))) {
      state.stats.rareDropsFound = (state.stats.rareDropsFound ?? 0) + 1;
    }
  }

  questOnEvent("crate", 1);
  addLiquids(results);
  // UI feedback: summarize loot
  const counts = results.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const order = ['exotic','legendary','epic','ultra-rare','rare','uncommon','common'];
  const parts = order
    .filter((k) => counts[k])
    .map((k) => `${k} x${counts[k]}`)
    .slice(0, 3);
  const summary = parts.join(' • ');
  fxEnqueue({ type: 'crate_open', crateType, summary });
  saveState();
  render();
}


function updateTopBar() {
  const worldState = getCurrentWorldState();
  const angels = getAngelTotals(worldState);
  const world = getWorldConfig(state.currentWorldId);

  // Reset pulse baselines when world changes
  if (FX.topWorldId !== state.currentWorldId) {
    FX.topWorldId = state.currentWorldId;
    FX.topLast.cash = worldState.cash;
    FX.topLast.ggl = state.ggl;
    FX.topLast.angels = angels.available;
  }

  const prevCash = FX.topLast.cash;
  const prevGgl = FX.topLast.ggl;
  const prevAngels = FX.topLast.angels;

  currentWorldEl.textContent = world.name;
  cashEl.textContent = formatNumber(worldState.cash);
  gglEl.textContent = state.ggl.toFixed(0);
  angelsEl.textContent = angels.available.toFixed(0);

  // Pulse when values increase
  if (typeof prevCash === 'number' && worldState.cash > prevCash) fxPulse(cashEl, 'fx-pulse-cash');
  if (typeof prevGgl === 'number' && state.ggl > prevGgl) fxPulse(gglEl, 'fx-pulse-ggl');
  if (typeof prevAngels === 'number' && angels.available > prevAngels) fxPulse(angelsEl, 'fx-pulse-angels');

  FX.topLast.cash = worldState.cash;
  FX.topLast.ggl = state.ggl;
  FX.topLast.angels = angels.available;
}

function updateTimeWarpButton() {
  if (!timeWarpButton) return;
  timeWarpButton.disabled = state.ggl < GAME_CONFIG.timeWarp.gglCost;
}

function render() {
  renderProfileHeader();
  ensureAdvancementsUnlocked();
  updateTopBar();
  syncBuyButtons();
  updateTimeWarpButton();
  renderWorkplaces();
  renderManagers();
  renderUpgrades();
  updatePrestigeUI();
  renderWorlds();
  renderEvent();
  renderCrates();
  renderQuests();
  renderProfile();
  renderAdvancements();
  fxFlush();
}


function tick() {
  ensureQuests();
  updateAutoRunStreak();
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


// ===== Quests (Daily / Weekly) =====
function getDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getWeekKey(date = new Date()) {
  // Monday-based week key: YYYY-MM-DD of the Monday start (local time)
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diffToMonday);
  return getDayKey(d);
}

function msUntilNextMidnight(now = new Date()) {
  const d = new Date(now);
  const next = new Date(d);
  next.setHours(24, 0, 0, 0);
  return next - d;
}

function msUntilNextMonday(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  let daysAhead = (8 - day) % 7;
  if (daysAhead === 0) daysAhead = 7;
  const next = new Date(d);
  next.setDate(d.getDate() + daysAhead);
  next.setHours(0, 0, 0, 0);
  return next - now;
}

function hashToInt(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickUnique(templates, count, rand, requiredKeys = []) {
  const pool = templates.slice();
  // ensure required first
  const chosen = [];
  requiredKeys.forEach((key) => {
    const idx = pool.findIndex((t) => t.key === key);
    if (idx >= 0) chosen.push(pool.splice(idx, 1)[0]);
  });
  // shuffle remaining
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  while (chosen.length < count && pool.length) {
    chosen.push(pool.shift());
  }
  return chosen.slice(0, count);
}

function getQuestTier() {
  const worldState = getCurrentWorldState();
  const le = Math.max(worldState.lifetimeEarnings || 0, 0);
  const tier = Math.max(1, Math.floor(Math.log10(le + 10)));
  return tier;
}

function calcEarnTarget(multiplier) {
  const worldState = getCurrentWorldState();
  const le = Math.max(worldState.lifetimeEarnings || 0, 0);
  const cash = Math.max(worldState.cash || 0, 0);
  let base = Math.max(500, cash * 25, le * 0.003);
  base = Math.floor(base / 10) * 10;
  return Math.max(500, Math.floor(base * multiplier));
}

function calcUpgradeTarget(multiplier) {
  const tier = getQuestTier();
  return Math.max(5, Math.floor((5 + tier * 3) * multiplier));
}

function calcManagerTarget(multiplier) {
  const tier = getQuestTier();
  return Math.max(2, Math.floor((2 + tier) * multiplier));
}

function calcCrateTarget(multiplier) {
  const tier = getQuestTier();
  const base = 1 + Math.floor(tier / 4);
  return Math.max(1, Math.floor(base * multiplier));
}

function calcLevelTarget(multiplier) {
  const tier = getQuestTier();
  const base = 10 + tier * 5;
  return Math.max(10, Math.floor(base * multiplier));
}

function makeQuestId(scope, templateKey) {
  const key = scope === "daily" ? state.quests.dayKey : state.quests.weekKey;
  return `${scope}:${key}:${templateKey}`;
}

function buildQuest(scope, template) {
  const isDaily = scope === "daily";
  const multiplier = isDaily ? 1 : 7;

  let target = 0;
  if (template.type === "earn") target = calcEarnTarget(isDaily ? 1 : 8);
  if (template.type === "upgrade") target = calcUpgradeTarget(isDaily ? 1 : 4);
  if (template.type === "manager") target = calcManagerTarget(isDaily ? 1 : 4);
  if (template.type === "crate") target = calcCrateTarget(isDaily ? 1 : 6);
  if (template.type === "level_any") target = calcLevelTarget(isDaily ? 1 : 3);

  const reward = getQuestReward(template.type, target, scope);

  const desc = getQuestDescription(template.type, target);

  return {
    id: makeQuestId(scope, template.key),
    type: template.type,
    title: `${template.icon} ${template.title}`,
    desc,
    target,
    progress: 0,
    claimed: false,
    reward,
    notifiedComplete: false,
  };
}

function getQuestDescription(type, target) {
  if (type === "earn") return `Keress ${formatNumber(target)} kasszát.`;
  if (type === "upgrade") return `Vegyél összesen ${target} munka upgrade-et.`;
  if (type === "manager") return `Vásárolj ${target} menedzser szintet.`;
  if (type === "crate") return `Nyiss ${target} ládát.`;
  if (type === "level_any") return `Emelj fel egy munkahelyet ${target} szintig.`;
  return "Teljesítsd a küldetést.";
}

function getQuestReward(type, target, scope) {
  const isDaily = scope === "daily";
  if (type === "earn") {
    return isDaily
      ? { cash: Math.floor(target * 0.25), liquids: { common: 1, uncommon: 1 } }
      : { ggl: 2, liquids: { rare: 2, common: 3 } };
  }
  if (type === "upgrade") {
    return isDaily
      ? { liquids: { common: 2, uncommon: 2 } }
      : { liquids: { ultraRare: 1, epic: 1, uncommon: 5 } };
  }
  if (type === "manager") {
    return isDaily
      ? { liquids: { uncommon: 2, common: 2 } }
      : { ggl: 1, liquids: { rare: 3, uncommon: 6 } };
  }
  if (type === "crate") {
    return isDaily
      ? { liquids: { rare: 1, common: 2 } }
      : { liquids: { epic: 2, rare: 4 } };
  }
  if (type === "level_any") {
    return isDaily
      ? { cash: Math.floor(target * 30), liquids: { uncommon: 1, common: 2 } }
      : { ggl: 1, liquids: { legendary: 1, epic: 2 } };
  }
  return isDaily ? { liquids: { common: 2 } } : { liquids: { rare: 2 } };
}

function ensureQuests() {
  if (!state.quests) state.quests = structuredClone(defaultState.quests);

  const now = new Date();
  const dayKey = getDayKey(now);
  const weekKey = getWeekKey(now);

  let changed = false;

  if (state.quests.dayKey !== dayKey || !Array.isArray(state.quests.daily) || state.quests.daily.length === 0) {
    state.quests.dayKey = dayKey;
    const rand = mulberry32(hashToInt(`${dayKey}|daily`));
    const templates = pickUnique(QUEST_TEMPLATES.daily, QUEST_CONFIG.dailyCount, rand, ["earn"]);
    state.quests.daily = templates.map((t) => buildQuest("daily", t));
    changed = true;
  }

  if (state.quests.weekKey !== weekKey || !Array.isArray(state.quests.weekly) || state.quests.weekly.length === 0) {
    state.quests.weekKey = weekKey;
    const rand = mulberry32(hashToInt(`${weekKey}|weekly`));
    const templates = pickUnique(QUEST_TEMPLATES.weekly, QUEST_CONFIG.weeklyCount, rand, ["earn", "upgrade"]);
    state.quests.weekly = templates.map((t) => buildQuest("weekly", t));
    changed = true;
  }

  // Derived progress quests (level_any) should reflect current state immediately
  refreshDerivedQuestProgress();

  if (changed) saveState();
}

function isQuestComplete(q) {
  return (q.progress || 0) >= (q.target || 0);
}

function clampProgress(q) {
  q.progress = Math.min(Math.max(q.progress || 0, 0), q.target || 0);
}

function questOnEvent(type, amount = 1) {
  if (!state.quests) return;
  const applyTo = (arr, scope) => {
    arr.forEach((q) => {
      if (q.claimed) return;
      if (q.type !== type) return;
      const wasComplete = isQuestComplete(q);
      q.progress = (q.progress || 0) + amount;
      clampProgress(q);
      const nowComplete = isQuestComplete(q);
      if (!wasComplete && nowComplete && !q.notifiedComplete) {
        q.notifiedComplete = true;
        fxEnqueue({ type: 'quest_complete', scope, questId: q.id, title: q.title });
      }
    });
  };
  if (Array.isArray(state.quests.daily)) applyTo(state.quests.daily, 'daily');
  if (Array.isArray(state.quests.weekly)) applyTo(state.quests.weekly, 'weekly');
}

function refreshDerivedQuestProgress() {
  if (!state.quests) return;
  const worldState = getCurrentWorldState();
  const jobs = getWorldJobs(state.currentWorldId);
  const maxLevel = jobs.reduce((acc, job) => {
    const q = getJobState(worldState, job.id).quantity || 0;
    return Math.max(acc, q);
  }, 0);

  const applyTo = (arr, scope) => {
    arr.forEach((q) => {
      if (q.claimed) return;
      if (q.type !== 'level_any') return;
      const wasComplete = isQuestComplete(q);
      q.progress = maxLevel;
      clampProgress(q);
      const nowComplete = isQuestComplete(q);
      if (!wasComplete && nowComplete && !q.notifiedComplete) {
        q.notifiedComplete = true;
        fxEnqueue({ type: 'quest_complete', scope, questId: q.id, title: q.title });
      }
    });
  };

  if (Array.isArray(state.quests.daily)) applyTo(state.quests.daily, 'daily');
  if (Array.isArray(state.quests.weekly)) applyTo(state.quests.weekly, 'weekly');
}

function normalizeLiquidKey(key) {
  if (!key) return null;
  if (key === "ultra-rare") return "ultraRare";
  return key;
}

function applyQuestReward(reward) {
  if (!reward) return;
  if (reward.cash) getCurrentWorldState().cash += reward.cash;
  if (reward.ggl) addGgl(reward.ggl);

  if (reward.liquids) {
    Object.entries(reward.liquids).forEach(([k, v]) => {
      const key = normalizeLiquidKey(k);
      if (!key) return;
      if (typeof state.gothGirlLiquids[key] !== "number") state.gothGirlLiquids[key] = 0;
      state.gothGirlLiquids[key] += v;
    });
  }
}

function formatQuestRewardShort(reward) {
  if (!reward) return "";
  const parts = [];
  if (reward.cash) parts.push(`+${formatNumber(reward.cash)} kassza`);
  if (reward.ggl) parts.push(`+${reward.ggl} GGL`);
  if (reward.liquids) {
    const show = Object.entries(reward.liquids)
      .slice(0, 2)
      .map(([k, v]) => `${v} ${normalizeLiquidKey(k)}`);
    if (show.length) parts.push(show.join(", "));
  }
  return parts.join(" • ");
}

function claimQuest(scope, questId) {
  const list = scope === "daily" ? state.quests.daily : state.quests.weekly;
  const q = list?.find((item) => item.id === questId);
  if (!q) return;
  if (q.claimed) return;
  if (!isQuestComplete(q)) return;

  applyQuestReward(q.reward);
  q.claimed = true;
  if (state.stats) {
    if (scope === "daily") state.stats.dailyQuestsClaimed = (state.stats.dailyQuestsClaimed ?? 0) + 1;
    if (scope === "weekly") state.stats.weeklyQuestsClaimed = (state.stats.weeklyQuestsClaimed ?? 0) + 1;
    state.stats.totalQuestsClaimed = (state.stats.totalQuestsClaimed ?? 0) + 1;
  }
  fxEnqueue({ type: 'quest_claim', title: q.title, reward: q.reward });

  saveState();
  render();
}

function renderQuestList(listEl, scope, quests) {
  if (!listEl) return;
  if (!Array.isArray(quests)) {
    listEl.innerHTML = "";
    return;
  }

  const html = quests
    .map((q) => {
      const pct = q.target ? Math.min(100, Math.floor(((q.progress || 0) / q.target) * 100)) : 0;
      const progressText = q.type === "earn" ? `${formatNumber(q.progress || 0)} / ${formatNumber(q.target || 0)}` : `${q.progress || 0} / ${q.target || 0}`;
      const complete = isQuestComplete(q);
      const claimed = q.claimed;
      const claimLabel = claimed ? "Felvéve" : complete ? "Felveszem" : "Folyamatban";
      const disabled = claimed || !complete;
      const classes = ["quest-card"];
      if (complete) classes.push("complete");
      if (claimed) classes.push("claimed");

      return `
      <div class="${classes.join(" ")}">
        <div class="quest-top">
          <div class="quest-title">${q.title}</div>
          <div class="quest-reward">${formatQuestRewardShort(q.reward)}</div>
        </div>
        <div class="quest-desc">${q.desc}</div>
        <div class="quest-progress"><span style="width:${pct}%"></span></div>
        <div class="quest-meta">
          <div class="muted small">${progressText}</div>
          <button class="quest-claim ${claimed ? "secondary" : ""}" data-quest-claim="1" data-quest-scope="${scope}" data-quest-id="${q.id}" ${disabled ? "disabled" : ""}>
            ${claimLabel}
          </button>
        </div>
      </div>`;
    })
    .join("");

  listEl.innerHTML = html;
}

function renderQuests() {
  const activeTab = document.querySelector(".tab-content.active")?.dataset?.tab;
  if (activeTab !== "quests") return;

  ensureQuests();

  if (dailyResetEl) dailyResetEl.textContent = formatDuration(msUntilNextMidnight(new Date()));
  if (weeklyResetEl) weeklyResetEl.textContent = formatDuration(msUntilNextMonday(new Date()));

  renderQuestList(dailyQuestListEl, "daily", state.quests.daily);
  renderQuestList(weeklyQuestListEl, "weekly", state.quests.weekly);
}


if (prestigeButton) prestigeButton.addEventListener("click", () => {
  const worldState = getCurrentWorldState();
  const angels = getAngelTotals(worldState);
  if (angels.upcoming <= 0) return;
  if (state.stats) state.stats.totalPrestiges = (state.stats.totalPrestiges ?? 0) + 1;
  if (state.stats && angels.available > 0 && angels.upcoming >= angels.available * 2) {
    state.stats.doubleResetCount = (state.stats.doubleResetCount ?? 0) + 1;
  }


  worldState.cash = 500;
  worldState.jobs = {};
  worldState.managers = {};
  worldState.upgrades.cash = {};
  worldState.upgrades.angel = {};
  worldState.angelsClaimed = angels.total;
  worldState.angelsSpent = 0;
  addGgl(1);
  fxEnqueue({ type: 'prestige' });
  saveState();
  render();
});

if (buyButtons) buyButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const raw = String(button.dataset.amount ?? "");
  const amount = raw === "max" || raw === "next" ? raw : Number(raw);
  if (!amount) return;
  state.buyAmount = amount;
  syncBuyButtons();
  saveState();
  render();
});

if (timeWarpButton) timeWarpButton.addEventListener("click", () => {
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
  if (state.stats) state.stats.timeWarpUsed = (state.stats.timeWarpUsed ?? 0) + 1;
  saveState();
  render();
});

if (openCrateButton) openCrateButton.addEventListener("click", () => openCrate("free"));
if (gglCrateButton) gglCrateButton.addEventListener("click", () => openCrate("ggl"));
if (cashCrateButton) cashCrateButton.addEventListener("click", () => openCrate("cash"));

ensureQuests();
applyOfflineEarnings();
render();
setInterval(tick, 200);

window.addEventListener("beforeunload", saveState);

if (questsPanelEl) {
  questsPanelEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-quest-claim]");
    if (!btn) return;
    const scope = btn.dataset.questScope;
    const questId = btn.dataset.questId;
    claimQuest(scope, questId);
  });
}


tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    tabButtons.forEach((item) => item.classList.toggle("active", item === button));
    tabContents.forEach((content) => {
      content.classList.toggle("active", content.dataset.tab === tab);
    });
    render();
  });
});

if (profileSaveNicknameButton) {
  profileSaveNicknameButton.addEventListener("click", () => {
    setNickname(profileNicknameInput?.value ?? "");
  });
}

if (profileNicknameInput) {
  profileNicknameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setNickname(profileNicknameInput.value);
      profileNicknameInput.blur();
    }
  });
}

if (profileBadgeSortEl) {
  profileBadgeSortEl.addEventListener("change", () => {
    setBadgeSort(profileBadgeSortEl.value);
  });
}

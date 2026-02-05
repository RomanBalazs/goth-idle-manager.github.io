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

// ===== Advancements / Achievements =====
const ADVANCEMENT_CATEGORIES = [
  { id: "basic", name: "Alapvető Haladási Mérföldkövek és Ikonok" },
  { id: "buy_modes", name: "NEXT Vásárlási Bónusz" },
  { id: "level_total", name: "Munkahely Szint Gyűjtés" },
  { id: "level_50", name: "Haladó Munkahely Fejlesztés (50. Szint)" },
  { id: "level_100", name: "Mesteri Munkahely Elérése (100. Szint)" },
  { id: "automation_speed", name: "Automatizálási Gyorsítás" },
  { id: "all_business", name: "Teljes Körű Mérföldkő Elérése" },
  { id: "managers", name: "Manager and Automation Goals" },
  { id: "cash_upgrades", name: "Cash Upgrade Progression" },
  { id: "energy", name: "Energy Drink Acquisitions and Upgrades" },
  { id: "ggl", name: "Goth Girl Liquid and Premium Upgrades" },
  { id: "timewarp", name: "Time Warp Ability Usage Milestones" },
  { id: "prestige", name: "Mastery Prestige and Reset" },
  { id: "performance", name: "Teljesítmény és Bónuszok Elérése" },
  { id: "worlds", name: "Világok Felfedezése és Mesterré Válása" },
  { id: "events", name: "Event-Based Challenges" },
  { id: "loot", name: "Loot Box Rewards" },
  { id: "rare", name: "Rare Item Acquisition" },
  { id: "profile", name: "Profile Initialization" },
  { id: "badges", name: "Unlocking Your First Badge" },
  { id: "tasks", name: "Daily and Weekly Tasks" },
  { id: "empire", name: "Achieving the Gothic Empire" },
];

const ADVANCEMENTS = [
  // Alap
  {
    id: "first_cash",
    category: "basic",
    name: "Első Kassza",
    icon: "💵",
    desc: "Szerezz összesen 1 000 kasszát.",
    progress: (s) => ({ current: s.stats?.totalCashEarned ?? 0, target: 1000, kind: "number" }),
    check: (s) => (s.stats?.totalCashEarned ?? 0) >= 1000,
  },
  {
    id: "clicker_goth",
    category: "basic",
    name: "Kattintó Gót",
    icon: "🖱️",
    desc: "Indíts el 10 manuális ciklust (Dolgozom).",
    progress: (s) => ({ current: s.stats?.totalClicks ?? 0, target: 10, kind: "count" }),
    check: (s) => (s.stats?.totalClicks ?? 0) >= 10,
  },
  {
    id: "first_workplace",
    category: "basic",
    name: "Első Munkahely",
    icon: "🏪",
    desc: "Vegyél meg 1 munkahelyet.",
    progress: (s) => ({ current: advCountOwnedWorkplacesAllWorlds(s), target: 1, kind: "count" }),
    check: (s) => advCountOwnedWorkplacesAllWorlds(s) >= 1,
  },
  {
    id: "scaling_25",
    category: "basic",
    name: "Skálázás I.",
    icon: "📈",
    desc: "Bármely munkahely szintje érje el a 25-öt.",
    progress: (s) => ({ current: advMaxJobLevelAllWorlds(s), target: 25, kind: "count" }),
    check: (s) => advMaxJobLevelAllWorlds(s) >= 25,
  },

  // NEXT / MAX
  {
    id: "next_magic",
    category: "buy_modes",
    name: "NEXT Varázsa",
    icon: "✨",
    desc: "Használd a NEXT vagy MAX vásárlást 10×.",
    progress: (s) => ({ current: s.tracking?.buyNextOrMaxUses ?? 0, target: 10, kind: "count" }),
    check: (s) => (s.tracking?.buyNextOrMaxUses ?? 0) >= 10,
  },

  // Munkahely mastery
  {
    id: "workplace_maniac",
    category: "level_total",
    name: "Munkahely-mániás",
    icon: "🧱",
    desc: "Vegyél összesen 100 munkahely szintet (összesítve).",
    progress: (s) => ({ current: s.stats?.totalUpgradesBought ?? 0, target: 100, kind: "count" }),
    check: (s) => (s.stats?.totalUpgradesBought ?? 0) >= 100,
  },

  // 50
  {
    id: "scaling_50",
    category: "level_50",
    name: "Skálázás II.",
    icon: "🚀",
    desc: "Érj el 50-es szintet bármely munkahelynél.",
    progress: (s) => ({ current: advMaxJobLevelAllWorlds(s), target: 50, kind: "count" }),
    check: (s) => advMaxJobLevelAllWorlds(s) >= 50,
  },

  // 100
  {
    id: "scaling_100",
    category: "level_100",
    name: "Skálázás III.",
    icon: "👑",
    desc: "Érj el 100-as szintet bármely munkahelynél.",
    progress: (s) => ({ current: advMaxJobLevelAllWorlds(s), target: 100, kind: "count" }),
    check: (s) => advMaxJobLevelAllWorlds(s) >= 100,
  },

  // Automation speed
  {
    id: "acceleration",
    category: "automation_speed",
    name: "Gyorsulás",
    icon: "⏩",
    desc: "Legyen legalább 3 automata ciklus futásban egyszerre.",
    progress: (s) => ({ current: advActiveAutoCyclesCurrentWorld(s), target: 3, kind: "count" }),
    check: (s) => advActiveAutoCyclesCurrentWorld(s) >= 3,
  },

  // All-business milestone
  {
    id: "everyone_working",
    category: "all_business",
    name: "Mindenki dolgozik",
    icon: "🤝",
    desc: "Teljesíts egy teljes körű mérföldkövet (minden munkahely 25+ szinten).",
    progress: (s) => ({ current: advBestAllBusinessProgress(s).current, target: advBestAllBusinessProgress(s).target, kind: "count" }),
    check: (s) => advBestAllBusinessProgress(s).current >= advBestAllBusinessProgress(s).target,
  },

  // Managers & automation
  {
    id: "first_manager",
    category: "managers",
    name: "Első Menedzser",
    icon: "🧑‍💼",
    desc: "Vegyél 1 menedzsert.",
    progress: (s) => ({ current: advOwnedManagersCountAllWorlds(s), target: 1, kind: "count" }),
    check: (s) => advOwnedManagersCountAllWorlds(s) >= 1,
  },
  {
    id: "auto_mode",
    category: "managers",
    name: "Automata Üzemmód",
    icon: "🤖",
    desc: "1 munkahelyet tegyél automata ciklusra.",
    progress: (s) => ({ current: advAutomatedJobsCountAllWorlds(s), target: 1, kind: "count" }),
    check: (s) => advAutomatedJobsCountAllWorlds(s) >= 1,
  },
  {
    id: "manager_swarm",
    category: "managers",
    name: "Menedzser-raj",
    icon: "🐝",
    desc: "Legyen 5 menedzsered összesen.",
    progress: (s) => ({ current: advOwnedManagersCountAllWorlds(s), target: 5, kind: "count" }),
    check: (s) => advOwnedManagersCountAllWorlds(s) >= 5,
  },
  {
    id: "staff_chief",
    category: "managers",
    name: "Személyzetvezető",
    icon: "📋",
    desc: "10 munkahely legyen automatizálva.",
    progress: (s) => ({ current: advAutomatedJobsCountAllWorlds(s), target: 10, kind: "count" }),
    check: (s) => advAutomatedJobsCountAllWorlds(s) >= 10,
  },
  {
    id: "never_stops",
    category: "managers",
    name: "Soha meg nem áll",
    icon: "⏱️",
    desc: "30 percig folyamatosan legyen legalább 1 automata munka aktív.",
    progress: (s) => ({ current: s.tracking?.autoActiveStreakMs ?? 0, target: 30 * 60 * 1000, kind: "time" }),
    check: (s) => (s.tracking?.autoActiveStreakMs ?? 0) >= 30 * 60 * 1000,
  },

  // Cash upgrades
  {
    id: "first_cash_upgrade",
    category: "cash_upgrades",
    name: "Első Cash Upgrade",
    icon: "🛠️",
    desc: "Vegyél 1 Cash Upgrade-et.",
    progress: (s) => ({ current: s.tracking?.cashUpgradesBought ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.cashUpgradesBought ?? 0) >= 1,
  },
  {
    id: "cash_build",
    category: "cash_upgrades",
    name: "Cash Build",
    icon: "🏗️",
    desc: "Vegyél 10 Cash Upgrade-et.",
    progress: (s) => ({ current: s.tracking?.cashUpgradesBought ?? 0, target: 10, kind: "count" }),
    check: (s) => (s.tracking?.cashUpgradesBought ?? 0) >= 10,
  },

  // Energy
  {
    id: "energy_1",
    category: "energy",
    name: "Energiaital",
    icon: "🧪",
    desc: "Szerezz 1 Szörny energiaitalt.",
    progress: (s) => ({ current: advTotalAngelsClaimedAllWorlds(s), target: 1, kind: "count" }),
    check: (s) => advTotalAngelsClaimedAllWorlds(s) >= 1,
  },
  {
    id: "energy_upgrade_1",
    category: "energy",
    name: "Energiaital függő",
    icon: "⚗️",
    desc: "Vegyél 1 energiaitalos upgrade-et.",
    progress: (s) => ({ current: s.tracking?.angelUpgradesBought ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.angelUpgradesBought ?? 0) >= 1,
  },

  // GGL
  {
    id: "ggl_touch",
    category: "ggl",
    name: "GGL Érintés",
    icon: "💧",
    desc: "Szerezz 1 Goth Girl Liquid (GGL)-t.",
    progress: (s) => ({ current: s.ggl ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.ggl ?? 0) >= 1,
  },
  {
    id: "premium_taste",
    category: "ggl",
    name: "Premium ízlés",
    icon: "💎",
    desc: "Vegyél 1 Premium (GGL) upgrade-et.",
    progress: (s) => ({ current: s.tracking?.premiumUpgradesBought ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.premiumUpgradesBought ?? 0) >= 1,
  },

  // Time Warp
  {
    id: "timewarp_1",
    category: "timewarp",
    name: "Time Warp I.",
    icon: "🌀",
    desc: "Használd a Time Warp-ot 1×.",
    progress: (s) => ({ current: s.tracking?.timeWarpUses ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.timeWarpUses ?? 0) >= 1,
  },
  {
    id: "timewarp_10",
    category: "timewarp",
    name: "Time Warp II.",
    icon: "🌀",
    desc: "Használd a Time Warp-ot 10×.",
    progress: (s) => ({ current: s.tracking?.timeWarpUses ?? 0, target: 10, kind: "count" }),
    check: (s) => (s.tracking?.timeWarpUses ?? 0) >= 10,
  },

  // Prestige / reset
  {
    id: "prestige_1",
    category: "prestige",
    name: "Első Újrakezdés",
    icon: "🔁",
    desc: "Prestige/Reset 1×.",
    progress: (s) => ({ current: s.stats?.totalPrestiges ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.stats?.totalPrestiges ?? 0) >= 1,
  },

  // Performance
  {
    id: "double_reset",
    category: "performance",
    name: "Duplázó Reset",
    icon: "✖️2",
    desc: "Resetelj úgy, hogy az új energiaital legalább 2× a jelenleginél.",
    progress: (s) => ({ current: s.tracking?.doubleResetDone ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.doubleResetDone ?? 0) >= 1,
  },
  {
    id: "reset_routine",
    category: "performance",
    name: "Reset Rutin",
    icon: "🧘",
    desc: "Prestige 5×.",
    progress: (s) => ({ current: s.stats?.totalPrestiges ?? 0, target: 5, kind: "count" }),
    check: (s) => (s.stats?.totalPrestiges ?? 0) >= 5,
  },
  {
    id: "lifetime_legend",
    category: "performance",
    name: "Lifetime Legend",
    icon: "🪙",
    desc: "Érj el magas lifetime kasszát: 1 quadrillion (összesen).",
    progress: (s) => ({ current: s.stats?.totalCashEarned ?? 0, target: 1_000_000_000_000_000, kind: "number" }),
    check: (s) => (s.stats?.totalCashEarned ?? 0) >= 1_000_000_000_000_000,
  },
  {
    id: "permanent_style",
    category: "performance",
    name: "Permanens Stílus",
    icon: "🧿",
    desc: "Legyen 3 tartós (Premium) bónuszod aktív.",
    progress: (s) => ({ current: advOwnedPremiumUpgradesCount(s), target: 3, kind: "count" }),
    check: (s) => advOwnedPremiumUpgradesCount(s) >= 3,
  },

  // Worlds
  {
    id: "first_world_switch",
    category: "worlds",
    name: "Új Világ Kapuja",
    icon: "🚪",
    desc: "Válts át egy másik világra először.",
    progress: (s) => ({ current: advVisitedWorldCount(s), target: 2, kind: "count" }),
    check: (s) => advVisitedWorldCount(s) >= 2,
  },
  {
    id: "world_traveler",
    category: "worlds",
    name: "Világjáró",
    icon: "🧭",
    desc: "Látogass meg 3 világot összesen.",
    progress: (s) => ({ current: advVisitedWorldCount(s), target: 3, kind: "count" }),
    check: (s) => advVisitedWorldCount(s) >= 3,
  },
  {
    id: "world_master",
    category: "worlds",
    name: "Világ Master",
    icon: "🌍",
    desc: "Maxold ki egy világ fő munkahelyeit (lvl 100 minden munkahely).",
    progress: (s) => advWorldMasterProgress(s),
    check: (s) => advWorldMasterProgress(s).current >= advWorldMasterProgress(s).target,
  },

  // Events
  {
    id: "first_event",
    category: "events",
    name: "Első Event",
    icon: "🎟️",
    desc: "Vegyél részt 1 eventen.",
    progress: (s) => ({ current: s.event?.startTimestamp ? 1 : 0, target: 1, kind: "count" }),
    check: (s) => Boolean(s.event?.startTimestamp),
  },
  {
    id: "event_finish",
    category: "events",
    name: "Event Finish",
    icon: "🏁",
    desc: "Fejezz be 1 eventet (érj el céljutalmat).",
    progress: (s) => ({ current: s.event?.claimed ? 1 : 0, target: 1, kind: "count" }),
    check: (s) => Boolean(s.event?.claimed),
  },
  {
    id: "event_top50",
    category: "events",
    name: "Top 50%",
    icon: "🥇",
    desc: "Eventen végezz a felső 50%-ban (ranglista később).",
    progress: () => ({ current: 0, target: 1, kind: "count" }),
    check: () => false,
    disabled: true,
  },
  {
    id: "event_hardcarry",
    category: "events",
    name: "Event Hardcarry",
    icon: "🎒",
    desc: "Szerezz eventen 10× ládanyitást.",
    progress: (s) => ({ current: s.tracking?.eventCratesOpened ?? 0, target: 10, kind: "count" }),
    check: (s) => (s.tracking?.eventCratesOpened ?? 0) >= 10,
  },

  // Loot
  {
    id: "first_free_crate",
    category: "loot",
    name: "Első Ingyen Láda",
    icon: "🎁",
    desc: "Nyisd ki az első 24 órás ingyen ládát.",
    progress: (s) => ({ current: s.tracking?.freeCratesOpened ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.freeCratesOpened ?? 0) >= 1,
  },
  {
    id: "crate_opener",
    category: "loot",
    name: "Láda-nyitogató",
    icon: "📦",
    desc: "Nyiss ki 10 ládát összesen.",
    progress: (s) => ({ current: s.stats?.totalCratesOpened ?? 0, target: 10, kind: "count" }),
    check: (s) => (s.stats?.totalCratesOpened ?? 0) >= 10,
  },
  {
    id: "cash_crates",
    category: "loot",
    name: "Cash Láda",
    icon: "💰",
    desc: "Nyiss ki 5 Cash ládát.",
    progress: (s) => ({ current: s.tracking?.cashCratesOpened ?? 0, target: 5, kind: "count" }),
    check: (s) => (s.tracking?.cashCratesOpened ?? 0) >= 5,
  },
  {
    id: "ggl_crates",
    category: "loot",
    name: "GGL Láda",
    icon: "💧",
    desc: "Nyiss ki 5 GGL ládát.",
    progress: (s) => ({ current: s.tracking?.gglCratesOpened ?? 0, target: 5, kind: "count" }),
    check: (s) => (s.tracking?.gglCratesOpened ?? 0) >= 5,
  },

  // Rare
  {
    id: "rare_liquid",
    category: "rare",
    name: "Ritka Nedv",
    icon: "🧬",
    desc: "Szerezz 1 ritka dropot a ládából (Ultra-Rare+).",
    progress: (s) => ({ current: s.tracking?.rareDropsFromCrate ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.rareDropsFromCrate ?? 0) >= 1,
  },

  // Profile
  {
    id: "profile_revived",
    category: "profile",
    name: "Profil Felélesztve",
    icon: "🪪",
    desc: "Adj meg nicknevet és mentsd el.",
    progress: (s) => ({ current: s.tracking?.nicknameSaved ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.nicknameSaved ?? 0) >= 1,
  },

  // Badge
  {
    id: "first_badge",
    category: "badges",
    name: "Első Badge",
    icon: "🏷️",
    desc: "Oldj fel 1 badge-et.",
    progress: (s) => ({ current: advUnlockedBadgesCount(s), target: 2, kind: "count" }),
    check: (s) => advUnlockedBadgesCount(s) >= 2,
  },

  // Tasks
  {
    id: "daily_quest",
    category: "tasks",
    name: "Napi Küldi",
    icon: "📅",
    desc: "Teljesíts 1 napi küldetést.",
    progress: (s) => ({ current: s.tracking?.dailyQuestsClaimed ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.dailyQuestsClaimed ?? 0) >= 1,
  },
  {
    id: "weekly_quest",
    category: "tasks",
    name: "Heti Küldi",
    icon: "🗓️",
    desc: "Teljesíts 1 heti küldetést.",
    progress: (s) => ({ current: s.tracking?.weeklyQuestsClaimed ?? 0, target: 1, kind: "count" }),
    check: (s) => (s.tracking?.weeklyQuestsClaimed ?? 0) >= 1,
  },

  // Empire
  {
    id: "goth_empire",
    category: "empire",
    name: "Gót Birodalom",
    icon: "🏰",
    desc: "Teljesíts 25 küldetést összesen (napi+heti).",
    progress: (s) => ({ current: s.tracking?.totalQuestsClaimed ?? 0, target: 25, kind: "count" }),
    check: (s) => (s.tracking?.totalQuestsClaimed ?? 0) >= 25,
  },
];

// ===== Advancements helpers =====
function advUnlocked(id) {
  return Boolean(state.advancements?.unlocked?.[id]);
}

function unlockAdvancement(id) {
  const adv = ADVANCEMENTS.find((a) => a.id === id);
  if (!adv) return false;
  if (advUnlocked(id)) return false;
  if (!state.advancements) state.advancements = { unlocked: {}, unlockedAt: {} };
  if (!state.advancements.unlocked) state.advancements.unlocked = {};
  if (!state.advancements.unlockedAt) state.advancements.unlockedAt = {};
  state.advancements.unlocked[id] = true;
  state.advancements.unlockedAt[id] = Date.now();
  fxEnqueue({ type: "adv_unlock", id, name: adv.name, icon: adv.icon || "⬜" });
  return true;
}

function checkAdvancements() {
  let changed = false;
  for (const adv of ADVANCEMENTS) {
    if (!adv || !adv.id) continue;
    if (adv.disabled) continue;
    if (advUnlocked(adv.id)) continue;
    try {
      if (typeof adv.check === "function" && adv.check(state)) {
        if (unlockAdvancement(adv.id)) changed = true;
      }
    } catch (err) {
      console.warn("Advancement check failed:", adv.id, err);
    }
  }
  if (changed) saveState();
}

function canAutoRunFor(s, worldId, jobId) {
  const worldState = s.worlds?.[worldId];
  if (!worldState) return false;
  const manager = getManagerConfig(worldId, jobId);
  const hasManager = manager && getManagerState(worldState, manager.id).owned;
  const hasPremiumAuto = Boolean(s.premiumUpgrades?.["premium-auto"]);
  return Boolean(hasManager || hasPremiumAuto);
}

function advMaxJobLevelAllWorlds(s) {
  let max = 0;
  WORLD_CONFIGS.forEach((world) => {
    const ws = s.worlds?.[world.id];
    if (!ws) return;
    world.jobs.forEach((job) => {
      const q = ws.jobs?.[job.id]?.quantity ?? 0;
      if (q > max) max = q;
    });
  });
  return max;
}

function advCountOwnedWorkplacesAllWorlds(s) {
  let count = 0;
  WORLD_CONFIGS.forEach((world) => {
    const ws = s.worlds?.[world.id];
    if (!ws) return;
    world.jobs.forEach((job) => {
      const q = ws.jobs?.[job.id]?.quantity ?? 0;
      if (q > 0) count += 1;
    });
  });
  return count;
}

function advOwnedManagersCountAllWorlds(s) {
  let count = 0;
  WORLD_CONFIGS.forEach((world) => {
    const ws = s.worlds?.[world.id];
    if (!ws) return;
    MANAGER_CONFIGS.filter((m) => m.worldId === world.id).forEach((m) => {
      if (getManagerState(ws, m.id).owned) count += 1;
    });
  });
  return count;
}

function advAutomatedJobsCountAllWorlds(s) {
  let count = 0;
  WORLD_CONFIGS.forEach((world) => {
    const ws = s.worlds?.[world.id];
    if (!ws) return;
    world.jobs.forEach((job) => {
      const q = ws.jobs?.[job.id]?.quantity ?? 0;
      if (q <= 0) return;
      if (canAutoRunFor(s, world.id, job.id)) count += 1;
    });
  });
  return count;
}

function advActiveAutoCyclesCurrentWorld(s) {
  const worldId = s.currentWorldId;
  const ws = s.worlds?.[worldId];
  if (!ws) return 0;
  const now = Date.now();
  let count = 0;
  getWorldJobs(worldId).forEach((job) => {
    const st = ws.jobs?.[job.id];
    const q = st?.quantity ?? 0;
    if (q <= 0) return;
    if (!canAutoRunFor(s, worldId, job.id)) return;
    if (st?.cycleEnd && st.cycleEnd > now) count += 1;
  });
  return count;
}

function advBestAllBusinessProgress(s) {
  const req = GAME_CONFIG.globalMilestone.threshold;
  let best = { current: 0, target: 0, worldId: null };
  WORLD_CONFIGS.forEach((world) => {
    const ws = s.worlds?.[world.id];
    if (!ws) return;
    const total = world.jobs.length;
    const reached = world.jobs.filter((job) => (ws.jobs?.[job.id]?.quantity ?? 0) >= req).length;
    const ratio = total ? reached / total : 0;
    const bestRatio = best.target ? best.current / best.target : 0;
    if (ratio > bestRatio) best = { current: reached, target: total, worldId: world.id };
  });
  return best;
}

function advWorldMasterProgress(s) {
  const req = 100;
  let best = { current: 0, target: 0, kind: "count", worldId: null };
  WORLD_CONFIGS.forEach((world) => {
    const ws = s.worlds?.[world.id];
    if (!ws) return;
    const total = world.jobs.length;
    const reached = world.jobs.filter((job) => (ws.jobs?.[job.id]?.quantity ?? 0) >= req).length;
    const ratio = total ? reached / total : 0;
    const bestRatio = best.target ? best.current / best.target : 0;
    if (ratio > bestRatio) best = { current: reached, target: total, kind: "count", worldId: world.id };
  });
  return best;
}

function advTotalAngelsClaimedAllWorlds(s) {
  let total = 0;
  WORLD_CONFIGS.forEach((world) => {
    const ws = s.worlds?.[world.id];
    if (!ws) return;
    total += ws.angelsClaimed ?? 0;
  });
  return total;
}

function advOwnedPremiumUpgradesCount(s) {
  return Object.values(s.premiumUpgrades || {}).filter(Boolean).length;
}

function advUnlockedBadgesCount(s) {
  return Object.values(s.profile?.unlockedBadges || {}).filter(Boolean).length;
}

function advVisitedWorldCount(s) {
  return Object.values(s.tracking?.visitedWorlds || {}).filter(Boolean).length;
}

function updateAutoActiveStreak() {
  if (!state.tracking) return;
  const now = Date.now();
  const last = state.tracking.lastAutoActiveCheckAt || now;
  const dt = Math.max(0, now - last);
  state.tracking.lastAutoActiveCheckAt = now;

  let active = false;
  WORLD_CONFIGS.some((world) => {
    const ws = state.worlds?.[world.id];
    if (!ws) return false;
    return world.jobs.some((job) => {
      const st = ws.jobs?.[job.id];
      const q = st?.quantity ?? 0;
      if (q <= 0) return false;
      if (!canAutoRunFor(state, world.id, job.id)) return false;
      if (st?.cycleEnd && st.cycleEnd > now) {
        active = true;
        return true;
      }
      return false;
    });
  });

  if (active) {
    state.tracking.autoActiveStreakMs = (state.tracking.autoActiveStreakMs ?? 0) + dt;
  } else {
    state.tracking.autoActiveStreakMs = 0;
  }
}

function formatAdvProgressText(progress) {
  const kind = progress?.kind || "count";
  const cur = progress?.current ?? 0;
  const tgt = progress?.target ?? 1;
  if (kind === "time") return `${formatDuration(cur)} / ${formatDuration(tgt)}`;
  if (kind === "number") return `${formatNumber(cur)} / ${formatNumber(tgt)}`;
  return `${cur} / ${tgt}`;
}

function getAdvProgressPct(progress) {
  const cur = progress?.current ?? 0;
  const tgt = progress?.target ?? 1;
  if (!tgt || tgt <= 0) return 0;
  return Math.max(0, Math.min(1, cur / tgt));
}

function renderAdvancements() {
  const activeTab = document.querySelector(".tab-content.active")?.dataset?.tab;
  if (!["advancement", "advancements", "milestones"].includes(activeTab)) return;
  if (!advancementSummaryEl || !advancementListEl) return;

  const total = ADVANCEMENTS.length;
  const unlocked = Object.values(state.advancements?.unlocked || {}).filter(Boolean).length;
  const pct = total ? Math.floor((unlocked / total) * 100) : 0;

  advancementSummaryEl.innerHTML = `
    <div class="adv-summary">
      <div>
        <h3>Fejlesztési Mérföldkövek / Advancement</h3>
        <p class="muted">Kategóriák szerint rendezett feloldások. A feloldás bal felül jelenik meg.</p>
      </div>
      <div class="meta">
        <span>Feloldva: ${unlocked} / ${total}</span>
        <span>${pct}%</span>
      </div>
    </div>
    <div class="adv-progress"><span style="width:${pct}%"></span></div>
  `;

  const byCat = new Map();
  ADVANCEMENT_CATEGORIES.forEach((c) => byCat.set(c.id, []));
  ADVANCEMENTS.forEach((a) => {
    if (!byCat.has(a.category)) byCat.set(a.category, []);
    byCat.get(a.category).push(a);
  });

  const html = ADVANCEMENT_CATEGORIES.map((cat) => {
    const list = byCat.get(cat.id) || [];
    if (!list.length) return "";
    const items = list
      .map((adv) => {
        const isUnlocked = advUnlocked(adv.id);
        const progress = isUnlocked
          ? { current: 1, target: 1, kind: "count" }
          : typeof adv.progress === "function"
          ? adv.progress(state)
          : { current: 0, target: 1, kind: "count" };

        const pct2 = isUnlocked ? 1 : getAdvProgressPct(progress);
        const status = adv.disabled ? "Hamarosan" : isUnlocked ? "Feloldva" : "Zárolva";
        const cls = `adv-item ${isUnlocked ? "unlocked" : ""} ${adv.disabled ? "disabled" : ""}`.trim();

        return `
          <div class="${cls}">
            <div class="adv-iconbox">${adv.icon || ""}</div>
            <div class="adv-content">
              <div class="adv-row">
                <div class="adv-name">${adv.name}</div>
                <div class="adv-status">${status}</div>
              </div>
              <div class="adv-desc muted">${adv.desc || ""}</div>
              <div class="adv-progress"><span style="width:${Math.floor(pct2 * 100)}%"></span></div>
              <div class="adv-progress-text muted">${formatAdvProgressText(isUnlocked ? { current: 1, target: 1, kind: "count" } : progress)}</div>
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="adv-category">
        <h4>${cat.name}</h4>
        <div class="adv-category-items">
          ${items}
        </div>
      </div>
    `;
  }).join("");

  advancementListEl.innerHTML = html || `<p class="muted">Nincs megjeleníthető advancement.</p>`;
}



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
    cashPurchases: 0,
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
  stats: {
    totalClicks: 0,
    totalUpgradesBought: 0,
    totalManagersBought: 0,
    totalCratesOpened: 0,
    totalPrestiges: 0,
    totalCashEarned: 0,
  },
  quests: {
    dayKey: null,
    weekKey: null,
    daily: [],
    weekly: [],
  },
  advancements: {
    unlocked: {},
    unlockedAt: {},
  },
  tracking: {
    buyNextOrMaxUses: 0,
    timeWarpUses: 0,
    cashUpgradesBought: 0,
    angelUpgradesBought: 0,
    premiumUpgradesBought: 0,
    freeCratesOpened: 0,
    cashCratesOpened: 0,
    gglCratesOpened: 0,
    rareDropsFromCrate: 0,
    eventCratesOpened: 0,
    visitedWorlds: {},
    dailyQuestsClaimed: 0,
    weeklyQuestsClaimed: 0,
    totalQuestsClaimed: 0,
    nicknameSaved: 0,
    doubleResetDone: 0,
    autoActiveStreakMs: 0,
    lastAutoActiveCheckAt: 0,
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
const advancementSummaryEl = document.getElementById("advancement-summary") || document.getElementById("milestone-summary");
const advancementListEl = document.getElementById("advancement-list") || document.getElementById("milestone-list");


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
  advLastAt: 0,
  topLast: { cash: null, ggl: null, angels: null },
  topWorldId: null,
};

const FX_CONFIG = {
  payoutPopThrottleMs: 900,
  bannerThrottleMs: 700,
  toastThrottleMs: 220,
  advToastThrottleMs: 240,
  popLifetimeMs: 950,
  toastLifetimeMs: 2400,
  advToastLifetimeMs: 2600,
  bannerLifetimeMs: 1600,
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
    <div id="fx-toast-host" class="fx-toast-host"></div>
    <div id="fx-adv-host" class="fx-adv-host"></div>
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

function fxAdvUnlock(icon, name) {
  const now = Date.now();
  if (now - FX.advLastAt < FX_CONFIG.advToastThrottleMs) return;
  FX.advLastAt = now;

  fxEnsureLayers();
  const host = document.getElementById('fx-adv-host');
  if (!host) return;

  const el = document.createElement('div');
  el.className = 'fx-adv-toast';
  el.innerHTML = `
    <div class="fx-adv-icon">${icon || '⬜'}</div>
    <div>
      <div class="fx-adv-title">Feloldva</div>
      <div class="fx-adv-name">${name || ''}</div>
    </div>
  `;
  host.appendChild(el);

  window.setTimeout(() => el.classList.add('out'), FX_CONFIG.advToastLifetimeMs - 260);
  window.setTimeout(() => el.remove(), FX_CONFIG.advToastLifetimeMs);
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
      if (!isTabActive('events')) return;
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
      fxCrateReveal(evt.crateType, evt.results || [], evt.summary || '');
      return;
    }

    if (evt.type === 'prestige') {
      fxBanner('Prestige!', 'good');
      return;
    }

    if (evt.type === 'adv_unlock') {
      fxAdvUnlock(evt.icon, evt.name);
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

  // ---- Crates defaults (backward compatible) ----
  if (!nextState.crates) nextState.crates = structuredClone(defaultState.crates);
  if (typeof nextState.crates.lastFree !== "number") nextState.crates.lastFree = 0;
  if (typeof nextState.crates.cashPurchases !== "number") nextState.crates.cashPurchases = 0;

    // ---- Profile & stats defaults (backward compatible) ----
  if (!nextState.profile) nextState.profile = structuredClone(defaultState.profile);
  if (!nextState.profile.unlockedBadges) nextState.profile.unlockedBadges = { starter: true };
  if (!nextState.profile.unlockedBadges.starter) nextState.profile.unlockedBadges.starter = true;
  if (!nextState.profile.nickname || typeof nextState.profile.nickname !== "string") nextState.profile.nickname = "Player";
  if (!nextState.profile.selectedBadgeId) {
    nextState.profile.selectedBadgeId = Object.keys(nextState.profile.unlockedBadges)[0] || "starter";
  }

  if (!nextState.profile.badgeSort) nextState.profile.badgeSort = "status";

  if (!nextState.stats) nextState.stats = structuredClone(defaultState.stats);
  Object.entries(defaultState.stats).forEach(([k, v]) => {
    if (typeof nextState.stats[k] !== "number") nextState.stats[k] = v;
  });

  // ---- Advancements / tracking defaults (backward compatible) ----
  if (!nextState.advancements) nextState.advancements = structuredClone(defaultState.advancements);
  if (!nextState.advancements.unlocked || typeof nextState.advancements.unlocked !== "object") nextState.advancements.unlocked = {};
  if (!nextState.advancements.unlockedAt || typeof nextState.advancements.unlockedAt !== "object") nextState.advancements.unlockedAt = {};

  if (!nextState.tracking) nextState.tracking = structuredClone(defaultState.tracking);
  if (!nextState.tracking.visitedWorlds || typeof nextState.tracking.visitedWorlds !== "object") nextState.tracking.visitedWorlds = {};

  Object.entries(defaultState.tracking).forEach(([k, v]) => {
    if (k === "visitedWorlds") return;
    if (typeof v === "number" && typeof nextState.tracking[k] !== "number") nextState.tracking[k] = v;
  });

  // Always mark current world as visited
  nextState.tracking.visitedWorlds[nextState.currentWorldId] = true;

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

function setNickname(value) {
  const next = sanitizeNickname(value) || "Player";
  state.profile.nickname = next;
  if (state.tracking) {
    state.tracking.nicknameSaved = 1;
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

function formatMilestoneEffect(milestone) {
  if (milestone.type === "profit") return `Profit x${milestone.multiplier}`;
  if (milestone.type === "speed") return `Sebesség x${milestone.multiplier}`;
  return "Bónusz";
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
      // Tracking: NEXT/MAX purchase usage
      if (state.tracking && (mode === "next" || mode === "max")) {
        state.tracking.buyNextOrMaxUses = (state.tracking.buyNextOrMaxUses ?? 0) + 1;
      }
      worldState.cash -= purchaseCost;
      const prevQty = jobState.quantity;
      jobState.quantity += purchaseQty;
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
      if (state.tracking) state.tracking.cashUpgradesBought = (state.tracking.cashUpgradesBought ?? 0) + 1;
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
      if (state.tracking) state.tracking.angelUpgradesBought = (state.tracking.angelUpgradesBought ?? 0) + 1;
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
      if (state.tracking) state.tracking.premiumUpgradesBought = (state.tracking.premiumUpgradesBought ?? 0) + 1;
      saveState();
      render();
    });
    premiumUpgradeList.appendChild(card);
  });
}


function renderMilestones() {
  // Legacy name kept for compatibility. The UI is now "Advancement".
  renderAdvancements();
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
      if (state.tracking) {
        if (!state.tracking.visitedWorlds) state.tracking.visitedWorlds = {};
        state.tracking.visitedWorlds[world.id] = true;
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

// ===== Crates / Loot UI =====
const CRATE_UI = {
  free: { icon: "🎁", title: "Ingyen láda" },
  cash: { icon: "💰", title: "Cash láda" },
  ggl: { icon: "🧪", title: "GGL láda" },
};

function getCrateIcon(crateType) {
  return CRATE_UI[crateType]?.icon || "🎁";
}

function getCashCrateBasePrice() {
  return 5000;
}

// Cash crate price grows +20% each purchase (compound).
function getCashCratePrice() {
  const n = state?.crates?.cashPurchases ?? 0;
  return Math.max(1, Math.round(getCashCrateBasePrice() * Math.pow(1.2, n)));
}

function decorateCratePanel(buttonEl, crateType) {
  if (!buttonEl) return;
  const panel = buttonEl.closest(".crate-panel");
  if (!panel) return;
  if (panel.dataset.iconified === "1") return;
  const h3 = panel.querySelector("h3");
  if (h3 && !h3.querySelector(".crate-mini-icon")) {
    const label = h3.textContent.trim();
    h3.innerHTML = `<span class="crate-mini-icon" aria-hidden="true">${getCrateIcon(crateType)}</span>${label}`;
  }
  panel.dataset.iconified = "1";
}

// Crate reveal modal (flashy opening)
const CRATE_REVEAL = { open: false };

function fxEnsureCrateRevealLayer() {
  let layer = document.getElementById("crate-reveal-layer");
  if (layer) return layer;

  layer = document.createElement("div");
  layer.id = "crate-reveal-layer";
  layer.className = "crate-reveal-layer";
  layer.innerHTML = `
    <div class="crate-reveal-backdrop"></div>
    <div class="crate-reveal-modal" role="dialog" aria-modal="true">
      <button class="crate-reveal-x" aria-label="Bezárás">✕</button>

      <div class="crate-reveal-head">
        <div class="crate-reveal-title">
          <span class="crate-reveal-title-ico" aria-hidden="true">🎁</span>
          <span class="crate-reveal-title-text">Láda nyitás</span>
        </div>
        <div id="crate-reveal-sub" class="crate-reveal-sub"></div>
      </div>

      <div class="crate-reveal-crate">
        <div id="crate-reveal-cratebox" class="crate-reveal-cratebox" aria-hidden="true">🎁</div>
        <div class="crate-reveal-glow" aria-hidden="true"></div>
      </div>

      <div id="crate-reveal-grid" class="crate-reveal-grid"></div>

      <div class="crate-reveal-actions">
        <button id="crate-reveal-ok" class="cta">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(layer);

  const close = () => fxHideCrateReveal();
  layer.querySelector(".crate-reveal-backdrop")?.addEventListener("click", close);
  layer.querySelector(".crate-reveal-x")?.addEventListener("click", close);
  layer.querySelector("#crate-reveal-ok")?.addEventListener("click", close);

  // Escape to close (single listener)
  if (!window.__crateRevealEscBound) {
    window.__crateRevealEscBound = true;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && CRATE_REVEAL.open) fxHideCrateReveal();
    });
  }
  return layer;
}

function fxHideCrateReveal() {
  const layer = document.getElementById("crate-reveal-layer");
  if (!layer) return;
  CRATE_REVEAL.open = false;
  document.body.classList.remove("crate-reveal-open");

  // Keep it visible during the out animation, then fully hide.
  if (!layer.classList.contains("show")) return;
  layer.classList.add("hide");
  window.setTimeout(() => {
    layer.classList.remove("show");
    layer.classList.remove("hide");
  }, 200);
}

function getRarityMeta(rarityId) {
  const meta = MANAGER_RARITIES.find((r) => r.id === rarityId);
  return meta || { id: rarityId, label: rarityId, color: "common" };
}

function fxCrateReveal(crateType, results = [], summary = "") {
  const layer = fxEnsureCrateRevealLayer();
  const modal = layer.querySelector(".crate-reveal-modal");
  const titleIco = layer.querySelector(".crate-reveal-title-ico");
  const titleText = layer.querySelector(".crate-reveal-title-text");
  const sub = layer.querySelector("#crate-reveal-sub");
  const crateBox = layer.querySelector("#crate-reveal-cratebox");
  const grid = layer.querySelector("#crate-reveal-grid");

  if (titleIco) titleIco.textContent = getCrateIcon(crateType);
  if (titleText) titleText.textContent = CRATE_UI[crateType]?.title || "Láda";
  if (sub) sub.textContent = summary ? summary : "5 jutalom feloldva";

  if (crateBox) crateBox.textContent = getCrateIcon(crateType);

  // Build loot cards
  const cards = results.slice(0, 5).map((rarityId) => {
    const meta = getRarityMeta(rarityId);
    const cls = meta.color || meta.id;
    return `
      <div class="crate-loot-card ${cls}" data-rarity="${meta.id}">
        <div class="crate-loot-top">
          <span class="crate-loot-drop" aria-hidden="true">💧</span>
          <span class="crate-loot-rarity">${meta.label}</span>
        </div>
        <div class="crate-loot-qty">+1</div>
      </div>
    `;
  }).join("");

  if (grid) grid.innerHTML = cards;

  // Show + animate
  CRATE_REVEAL.open = true;
  document.body.classList.add("crate-reveal-open");
  layer.classList.remove("hide");
  layer.classList.add("show");

  if (modal) {
    modal.classList.remove("opening");
    void modal.offsetWidth;
    modal.classList.add("opening");
  }

  // Stagger loot cards
  const els = Array.from(layer.querySelectorAll(".crate-loot-card"));
  els.forEach((el) => el.classList.remove("in"));
  els.forEach((el, idx) => {
    window.setTimeout(() => el.classList.add("in"), 260 + idx * 110);
  });
}


function renderCrates() {
  const now = Date.now();
  const elapsed = now - state.crates.lastFree;
  const remaining = Math.max(GAME_CONFIG.crates.cooldownMs - elapsed, 0);
  crateTimerEl.textContent = remaining
    ? `Következő láda: ${formatDuration(remaining)}`
    : "Az ingyen láda elérhető!";
  if (openCrateButton) openCrateButton.disabled = remaining > 0;
  const cashPrice = getCashCratePrice();
  if (gglCrateButton) gglCrateButton.disabled = state.ggl < 2;
  if (cashCrateButton) cashCrateButton.disabled = getCurrentWorldState().cash < cashPrice;

  // UI: add small icons + dynamic price labels
  decorateCratePanel(openCrateButton, "free");
  decorateCratePanel(gglCrateButton, "ggl");
  decorateCratePanel(cashCrateButton, "cash");

  if (openCrateButton) openCrateButton.innerHTML = `<span class="crate-btn-ico" aria-hidden="true">${getCrateIcon("free")}</span>Láda nyitása`;
  if (gglCrateButton) gglCrateButton.innerHTML = `<span class="crate-btn-ico" aria-hidden="true">${getCrateIcon("ggl")}</span>GGL vásárlás (2)`;
  if (cashCrateButton) cashCrateButton.innerHTML = `<span class="crate-btn-ico" aria-hidden="true">${getCrateIcon("cash")}</span>Vásárlás (${formatNumber(cashPrice)})`;

  const cashPanel = cashCrateButton?.closest(".crate-panel");
  const cashP = cashPanel?.querySelector("p");
  if (cashP) cashP.textContent = `5 nedv, alap esélyek (${formatNumber(cashPrice)} kassza • +20% / vásárlás).`;

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
  }

  if (crateType === "cash") {
    const price = getCashCratePrice();
    if (getCurrentWorldState().cash < price) return;
    didOpen = true;
    getCurrentWorldState().cash -= price;
    state.crates.cashPurchases = (state.crates.cashPurchases ?? 0) + 1;
    const weights = { uncommon: 35, common: 30, rare: 20, "ultra-rare": 8, epic: 5, legendary: 2 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
  }

  if (crateType === "ggl") {
    if (state.ggl < 2) return;
    didOpen = true;
    state.ggl -= 2;
    const weights = { uncommon: 20, common: 25, rare: 25, "ultra-rare": 15, epic: 10, legendary: 4, exotic: 1 };
    while (results.length < 5) {
      results.push(rollLiquid(weights));
    }
  }

  if (!didOpen) return;

  // Tracking by crate type
  if (state.tracking) {
    if (crateType === "free") state.tracking.freeCratesOpened = (state.tracking.freeCratesOpened ?? 0) + 1;
    if (crateType === "cash") state.tracking.cashCratesOpened = (state.tracking.cashCratesOpened ?? 0) + 1;
    if (crateType === "ggl") state.tracking.gglCratesOpened = (state.tracking.gglCratesOpened ?? 0) + 1;

    // Count "rare drop" as any rarity >= rare (rare/ultra-rare/epic/legendary/exotic)
    const rareSet = new Set(["rare", "ultra-rare", "epic", "legendary", "exotic"]);
    if (results.some((r) => rareSet.has(r))) {
      state.tracking.rareDropsFromCrate = (state.tracking.rareDropsFromCrate ?? 0) + 1;
    }

    // If an event is active, count it toward event crate openings
    if (state.event?.startTimestamp) {
      const endTime = state.event.startTimestamp + EVENT_CONFIG.durationMs;
      if (Date.now() < endTime) {
        state.tracking.eventCratesOpened = (state.tracking.eventCratesOpened ?? 0) + 1;
      }
    }
  }

  if (state.stats) state.stats.totalCratesOpened = (state.stats.totalCratesOpened ?? 0) + 1;

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
  fxEnqueue({ type: 'crate_open', crateType, summary, results });
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
  checkAdvancements();
  updateTopBar();
  syncBuyButtons();
  updateTimeWarpButton();
  renderWorkplaces();
  renderManagers();
  renderUpgrades();
  renderMilestones();
  updatePrestigeUI();
  renderWorlds();
  renderEvent();
  renderCrates();
  renderQuests();
  renderProfile();
  fxFlush();
}


function tick() {
  ensureQuests();
  processWorldCycles(state.currentWorldId);
  processEventCycles();
  updateAutoActiveStreak();
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
  if (reward.ggl) state.ggl += reward.ggl;

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
  if (state.tracking) {
    if (scope === "daily") state.tracking.dailyQuestsClaimed = (state.tracking.dailyQuestsClaimed ?? 0) + 1;
    if (scope === "weekly") state.tracking.weeklyQuestsClaimed = (state.tracking.weeklyQuestsClaimed ?? 0) + 1;
    state.tracking.totalQuestsClaimed = (state.tracking.totalQuestsClaimed ?? 0) + 1;
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

  // Tracking: double reset (new angels at least 2x the previous claimed)
  if (state.tracking) {
    const prevClaimed = worldState.angelsClaimed ?? 0;
    const newTotal = angels.total ?? 0;
    if (prevClaimed > 0 && newTotal >= prevClaimed * 2) {
      state.tracking.doubleResetDone = 1;
    }
  }

  worldState.cash = 500;
  worldState.jobs = {};
  worldState.managers = {};
  worldState.upgrades.cash = {};
  worldState.upgrades.angel = {};
  worldState.angelsClaimed = angels.total;
  worldState.angelsSpent = 0;
  state.ggl += 1;
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
  if (state.tracking) state.tracking.timeWarpUses = (state.tracking.timeWarpUses ?? 0) + 1;
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
    if (state.stats) state.stats.totalCashEarned = (state.stats.totalCashEarned ?? 0) + payout;
  });
  state.ggl -= GAME_CONFIG.timeWarp.gglCost;
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

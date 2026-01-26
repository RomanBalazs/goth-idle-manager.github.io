const workplaces = [
  {
    id: "noir-cafe",
    name: "Noir Café",
    description: "Kávés, sötét tónusú coworking-bar. Teljesen kitalált márka.",
    baseIncome: 6,
    baseCost: 20,
    requiredPrestige: 0,
  },
  {
    id: "midnight-bites",
    name: "Midnight Bites",
    description: "Alternatív gyorsétterem, neonfényes burgerekkel.",
    baseIncome: 22,
    baseCost: 120,
    requiredPrestige: 0,
  },
  {
    id: "lilac-library",
    name: "Lilac Library",
    description: "Egy hangulatos könyv-lounge esti rendezvényekkel.",
    baseIncome: 80,
    baseCost: 520,
    requiredPrestige: 1,
  },
  {
    id: "moonbeam-arcade",
    name: "Moonbeam Arcade",
    description: "VHS-es retro játékterem, füstös hangulattal.",
    baseIncome: 240,
    baseCost: 1650,
    requiredPrestige: 2,
  },
  {
    id: "obsidian-studio",
    name: "Obsidian Studio",
    description: "Podcast stúdió, ahol gót műsorokat gyártanak.",
    baseIncome: 820,
    baseCost: 5200,
    requiredPrestige: 3,
  },
];

const managers = [
  {
    id: "luna",
    name: "Luna Vitrin",
    role: "Café koordinátor",
    boost: "+15% bevétel a Noir Café-ra",
    boostValue: 0.15,
    baseCost: 150,
    target: "noir-cafe",
    requiredPrestige: 0,
  },
  {
    id: "nora",
    name: "Nora Neon",
    role: "Bites menedzser",
    boost: "+12% bevétel a Midnight Bites-ra",
    boostValue: 0.12,
    baseCost: 420,
    target: "midnight-bites",
    requiredPrestige: 0,
  },
  {
    id: "iris",
    name: "Iris Ivy",
    role: "Könyvtár kurátor",
    boost: "+18% bevétel a Lilac Library-ra",
    boostValue: 0.18,
    baseCost: 1200,
    target: "lilac-library",
    requiredPrestige: 1,
  },
  {
    id: "sable",
    name: "Sable Switch",
    role: "Arcade vezető",
    boost: "+20% bevétel a Moonbeam Arcade-ra",
    boostValue: 0.2,
    baseCost: 3200,
    target: "moonbeam-arcade",
    requiredPrestige: 2,
  },
  {
    id: "raven",
    name: "Raven Quartz",
    role: "Stúdió producer",
    boost: "+25% bevétel az Obsidian Studio-ra",
    boostValue: 0.25,
    baseCost: 7600,
    target: "obsidian-studio",
    requiredPrestige: 3,
  },
];

const specialManagers = [
  {
    id: "aurora",
    name: "Aurora Frost",
    role: "GGL legenda",
    boost: "+35% bevétel minden munkahelyre",
    gglCost: 2,
  },
  {
    id: "maven",
    name: "Maven Velvet",
    role: "GGL mentor",
    boost: "+1 automatikus szint minden munkahelyen",
    gglCost: 3,
  },
];

const defaultState = {
  cash: 60,
  ggl: 0,
  prestigeCount: 0,
  workplaces: {},
  managers: {},
  specialManagers: {},
};

const state = loadState();

const cashEl = document.getElementById("cash");
const gglEl = document.getElementById("ggl");
const prestigeEl = document.getElementById("prestige");
const workplaceList = document.getElementById("workplace-list");
const managerList = document.getElementById("manager-list");
const specialManagerList = document.getElementById("special-manager-list");
const prestigeRequirementsEl = document.getElementById("prestige-requirements");
const prestigeButton = document.getElementById("prestige-button");

function loadState() {
  const stored = localStorage.getItem("goth-idl-state");
  if (!stored) {
    return structuredClone(defaultState);
  }
  const parsed = JSON.parse(stored);
  return {
    ...structuredClone(defaultState),
    ...parsed,
  };
}

function saveState() {
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

function getProductionMultiplier() {
  return 1 + state.prestigeCount * 0.2;
}

function getWorkplaceLevel(id) {
  return state.workplaces[id]?.level ?? 0;
}

function getWorkplaceIncome(workplace) {
  const level = getWorkplaceLevel(workplace.id);
  const base = workplace.baseIncome * level;
  let bonus = 1;

  managers.forEach((manager) => {
    if (manager.target === workplace.id && state.managers[manager.id]) {
      bonus += manager.boostValue;
    }
  });

  if (state.specialManagers.aurora) {
    bonus += 0.35;
  }

  return base * bonus * getProductionMultiplier();
}

function getWorkplaceCost(workplace) {
  const level = getWorkplaceLevel(workplace.id);
  return Math.round(workplace.baseCost * Math.pow(1.12, level));
}

function canAccessPrestigeRequirement() {
  const requirementBase = 5 * Math.pow(1.2, state.prestigeCount);
  const requiredCount = Math.ceil(requirementBase);
  const requiredLevel = 20;

  const eligibleWorkplaces = workplaces.filter(
    (workplace) => getWorkplaceLevel(workplace.id) >= requiredLevel
  ).length;

  const eligibleManagers = Object.values(state.managers).filter(Boolean).length;

  return {
    requiredCount,
    requiredLevel,
    eligibleWorkplaces,
    eligibleManagers,
    meets:
      eligibleWorkplaces >= requiredCount &&
      eligibleManagers >= requiredCount,
  };
}

function unlockItemsForPrestige() {
  workplaces.forEach((workplace) => {
    if (workplace.requiredPrestige <= state.prestigeCount) {
      if (!state.workplaces[workplace.id]) {
        state.workplaces[workplace.id] = { level: 0 };
      }
    }
  });
  managers.forEach((manager) => {
    if (manager.requiredPrestige <= state.prestigeCount) {
      if (state.managers[manager.id] === undefined) {
        state.managers[manager.id] = false;
      }
    }
  });
}

function renderWorkplaces() {
  workplaceList.innerHTML = "";
  workplaces
    .filter((workplace) => workplace.requiredPrestige <= state.prestigeCount)
    .forEach((workplace) => {
      const level = getWorkplaceLevel(workplace.id);
      const income = getWorkplaceIncome(workplace);
      const cost = getWorkplaceCost(workplace);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div>
          <h3>${workplace.name}</h3>
          <p>${workplace.description}</p>
        </div>
        <div class="meta">
          <span>Szint: ${level}</span>
          <span>Termelés: ${formatNumber(income)}/mp</span>
        </div>
        <button ${state.cash < cost ? "disabled" : ""}>
          +1 szint (${formatNumber(cost)})
        </button>
      `;

      const button = card.querySelector("button");
      button.addEventListener("click", () => {
        if (state.cash < cost) return;
        state.cash -= cost;
        state.workplaces[workplace.id] = { level: level + 1 };
        saveState();
        render();
      });

      workplaceList.appendChild(card);
    });
}

function renderManagers() {
  managerList.innerHTML = "";
  managers
    .filter((manager) => manager.requiredPrestige <= state.prestigeCount)
    .forEach((manager) => {
      const owned = state.managers[manager.id];
      const cost = Math.round(manager.baseCost * Math.pow(1.3, state.prestigeCount));
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div>
          <h3>${manager.name}</h3>
          <p>${manager.role}</p>
          <p>${manager.boost}</p>
        </div>
        <div class="meta">
          <span>Ár: ${formatNumber(cost)}</span>
          <span>${owned ? "Megszerezve" : "Elérhető"}</span>
        </div>
        <button ${owned || state.cash < cost ? "disabled" : ""}>
          ${owned ? "Aktív" : "Felveszem"}
        </button>
      `;

      const button = card.querySelector("button");
      button.addEventListener("click", () => {
        if (owned || state.cash < cost) return;
        state.cash -= cost;
        state.managers[manager.id] = true;
        saveState();
        render();
      });

      managerList.appendChild(card);
    });
}

function renderSpecialManagers() {
  specialManagerList.innerHTML = "";
  specialManagers.forEach((manager) => {
    const owned = state.specialManagers[manager.id];
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div>
        <h3>${manager.name}</h3>
        <p>${manager.role}</p>
        <p>${manager.boost}</p>
      </div>
      <div class="meta">
        <span>Ár: ${manager.gglCost} GGL</span>
        <span>${owned ? "Megszerezve" : "Elérhető"}</span>
      </div>
      <button ${owned || state.ggl < manager.gglCost ? "disabled" : ""}>
        ${owned ? "Aktív" : "GGL vásárlás"}
      </button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => {
      if (owned || state.ggl < manager.gglCost) return;
      state.ggl -= manager.gglCost;
      state.specialManagers[manager.id] = true;
      if (manager.id === "maven") {
        workplaces.forEach((workplace) => {
          const current = getWorkplaceLevel(workplace.id);
          state.workplaces[workplace.id] = { level: current + 1 };
        });
      }
      saveState();
      render();
    });

    specialManagerList.appendChild(card);
  });
}

function updatePrestigeUI() {
  const status = canAccessPrestigeRequirement();
  prestigeRequirementsEl.textContent =
    `Szükséges: ${status.requiredCount} menedzser + ${status.requiredCount} munkahely ` +
    `(${status.requiredLevel}+ szint). Jelenleg: ${status.eligibleManagers} menedzser, ` +
    `${status.eligibleWorkplaces} munkahely.`;

  prestigeButton.disabled = !status.meets;
}

function render() {
  cashEl.textContent = formatNumber(state.cash);
  gglEl.textContent = state.ggl.toFixed(0);
  prestigeEl.textContent = state.prestigeCount.toFixed(0);
  renderWorkplaces();
  renderManagers();
  renderSpecialManagers();
  updatePrestigeUI();
}

function tick() {
  const income = workplaces
    .filter((workplace) => workplace.requiredPrestige <= state.prestigeCount)
    .reduce((total, workplace) => total + getWorkplaceIncome(workplace), 0);
  state.cash += income / 10;
  render();
}

prestigeButton.addEventListener("click", () => {
  const status = canAccessPrestigeRequirement();
  if (!status.meets) return;

  state.prestigeCount += 1;
  state.ggl += 1;
  state.cash = defaultState.cash;
  state.workplaces = {};
  state.managers = {};
  state.specialManagers = {
    aurora: state.specialManagers.aurora ?? false,
    maven: state.specialManagers.maven ?? false,
  };

  unlockItemsForPrestige();
  saveState();
  render();
});

unlockItemsForPrestige();
render();
setInterval(tick, 100);

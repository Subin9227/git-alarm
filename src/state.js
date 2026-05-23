const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_STATE = {
  lastCheckedSha: null,
  lastRunAt: null,
  notifiedFiles: []
};

async function loadState(statePath) {
  try {
    const raw = await fs.readFile(statePath, "utf8");
    return {
      ...DEFAULT_STATE,
      ...JSON.parse(raw)
    };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { ...DEFAULT_STATE };
    }
    throw error;
  }
}

async function saveState(statePath, state) {
  const directory = path.dirname(statePath);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

module.exports = {
  loadState,
  saveState
};

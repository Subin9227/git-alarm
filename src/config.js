const REQUIRED_ENV_VARS = [
  "DISCORD_WEBHOOK_URL",
  "SOURCE_REPO_TOKEN"
];

const DEFAULT_SOURCE_REPO = "100-hours-a-week/alex-notes";
const DEFAULT_STATE_PATH = "data/state.json";

function getConfig() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    forceTestAlert: process.env.FORCE_TEST_ALERT === "true",
    githubToken: process.env.SOURCE_REPO_TOKEN,
    sourceRepo: process.env.SOURCE_REPO || DEFAULT_SOURCE_REPO,
    statePath: process.env.STATE_PATH || DEFAULT_STATE_PATH
  };
}

module.exports = {
  getConfig
};

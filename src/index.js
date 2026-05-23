const { getConfig } = require("./config");
const { sendDiscordAlert } = require("./discord");
const { compareCommits, getFileContent, getLatestCommit, getRepo } = require("./github");
const { parseMarkdownFile } = require("./parser");
const { loadState, saveState } = require("./state");

function isMarkdownFile(path) {
  return path.toLowerCase().endsWith(".md");
}

async function main() {
  const config = getConfig();
  const state = await loadState(config.statePath);

  const repo = await getRepo(config.sourceRepo, config.githubToken);
  const latestCommit = await getLatestCommit(config.sourceRepo, repo.default_branch, config.githubToken);

  if (!state.lastCheckedSha) {
    await saveState(config.statePath, {
      ...state,
      lastCheckedSha: latestCommit.sha,
      lastRunAt: new Date().toISOString()
    });

    console.log(`Initialized baseline at commit ${latestCommit.sha}.`);
    return;
  }

  if (state.lastCheckedSha === latestCommit.sha) {
    await saveState(config.statePath, {
      ...state,
      lastRunAt: new Date().toISOString()
    });

    console.log("No new commits.");
    return;
  }

  const comparison = await compareCommits(
    config.sourceRepo,
    state.lastCheckedSha,
    latestCommit.sha,
    config.githubToken
  );

  const newMarkdownFiles = (comparison.files || []).filter(
    (file) => file.status === "added" && isMarkdownFile(file.filename)
  );

  const unseenFiles = newMarkdownFiles.filter(
    (file) => !state.notifiedFiles.includes(file.filename)
  );

  const alertItems = [];
  for (const file of unseenFiles) {
    const content = await getFileContent(config.sourceRepo, file.filename, config.githubToken);
    const parsed = parseMarkdownFile({ path: file.filename, content });

    alertItems.push({
      ...parsed,
      path: file.filename,
      htmlUrl: file.blob_url,
      commitUrl: comparison.html_url,
      timestamp: latestCommit.commit.author.date
    });
  }

  if (alertItems.length > 0) {
    await sendDiscordAlert(config.discordWebhookUrl, config.sourceRepo, alertItems);
  }

  const nextNotifiedFiles = new Set(state.notifiedFiles);
  for (const file of unseenFiles) {
    nextNotifiedFiles.add(file.filename);
  }

  await saveState(config.statePath, {
    lastCheckedSha: latestCommit.sha,
    lastRunAt: new Date().toISOString(),
    notifiedFiles: Array.from(nextNotifiedFiles)
  });

  console.log(`Checked ${config.sourceRepo}. Alerts sent: ${alertItems.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

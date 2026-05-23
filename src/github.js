const GITHUB_API_BASE = "https://api.github.com";

async function githubRequest(path, token, options = {}) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "git-alarm",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API request failed (${response.status}): ${body}`);
  }

  return response.json();
}

async function getRepo(sourceRepo, token) {
  return githubRequest(`/repos/${sourceRepo}`, token);
}

async function getLatestCommit(sourceRepo, branch, token) {
  const commits = await githubRequest(
    `/repos/${sourceRepo}/commits?sha=${encodeURIComponent(branch)}&per_page=1`,
    token
  );

  if (!Array.isArray(commits) || commits.length === 0) {
    throw new Error("No commits found in the source repository.");
  }

  return commits[0];
}

async function compareCommits(sourceRepo, base, head, token) {
  return githubRequest(
    `/repos/${sourceRepo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`,
    token
  );
}

async function getFileContent(sourceRepo, path, token) {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${sourceRepo}/contents/${path}`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "git-alarm",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch file content (${response.status}): ${body}`);
  }

  return response.text();
}

module.exports = {
  compareCommits,
  getFileContent,
  getLatestCommit,
  getRepo
};

function extractTitle(markdown, fallback) {
  const heading = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^#\s+/.test(line));

  if (!heading) {
    return fallback;
  }

  return heading.replace(/^#\s+/, "").trim() || fallback;
}

function extractSummary(markdown, maxLength = 500) {
  const normalized = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "본문 요약을 추출하지 못했습니다.";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trim()}...`;
}

function parseMarkdownFile({ path, content }) {
  const fileName = path.split("/").pop() || path;
  return {
    fileName,
    title: extractTitle(content, fileName),
    summary: extractSummary(content)
  };
}

module.exports = {
  parseMarkdownFile
};

async function sendDiscordAlert(webhookUrl, repoName, items) {
  if (items.length === 0) {
    return;
  }

  const embeds = items.slice(0, 10).map((item) => ({
    title: item.title,
    url: item.htmlUrl,
    description: item.summary,
    color: 3447003,
    fields: [
      {
        name: "Repository",
        value: repoName,
        inline: true
      },
      {
        name: "File",
        value: item.path,
        inline: true
      },
      {
        name: "Commit",
        value: item.commitUrl,
        inline: false
      }
    ],
    footer: {
      text: "git-alarm"
    },
    timestamp: item.timestamp
  }));

  const payload = {
    username: "git-alarm",
    content:
      items.length === 1
        ? "새 Markdown 파일이 올라왔습니다."
        : `새 Markdown 파일 ${items.length}개가 올라왔습니다.`,
    embeds
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord webhook request failed (${response.status}): ${body}`);
  }
}

async function sendDiscordTestAlert(webhookUrl, repoName) {
  const payload = {
    username: "git-alarm",
    content: "Discord 테스트 알림입니다.",
    embeds: [
      {
        title: "git-alarm test",
        description: "수동 실행으로 보낸 테스트 메시지입니다.",
        color: 5763719,
        fields: [
          {
            name: "Repository",
            value: repoName,
            inline: true
          },
          {
            name: "Type",
            value: "manual test",
            inline: true
          }
        ],
        footer: {
          text: "git-alarm"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord webhook test request failed (${response.status}): ${body}`);
  }
}

module.exports = {
  sendDiscordAlert,
  sendDiscordTestAlert
};

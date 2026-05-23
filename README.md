# git-alarm

`100-hours-a-week/alex-notes` 저장소에 새 `.md` 파일이 추가되면 Discord로 알림을 보내는 GitHub Actions 프로젝트입니다.

## How It Works

1. GitHub Actions가 매시간 실행됩니다.
2. 이전에 확인한 커밋 SHA와 최신 커밋 SHA를 비교합니다.
3. 새로 추가된 `.md` 파일만 찾습니다.
4. 문서 제목과 요약을 뽑아 Discord Webhook으로 전송합니다.
5. 마지막 확인 상태를 `data/state.json`에 저장합니다.

첫 실행은 기준점만 저장하고 알림은 보내지 않습니다.

## Required Secrets

- `DISCORD_WEBHOOK_URL`
- `SOURCE_REPO_TOKEN`

## Local Run

환경 변수를 설정한 뒤 아래 명령으로 실행할 수 있습니다.

```powershell
$env:DISCORD_WEBHOOK_URL="your-webhook-url"
$env:SOURCE_REPO_TOKEN="your-token"
node src/index.js
```

## Trigger Manually

1. GitHub 저장소에서 `Actions` 탭으로 이동합니다.
2. `Check Alex Notes` 워크플로우를 선택합니다.
3. `Run workflow`를 눌러 수동 실행합니다.

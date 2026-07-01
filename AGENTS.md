# mokjang — Agent / Codex Instructions

## Language

- 기본 한국어로 응답. 명시적 요청 시에만 다른 언어 사용.

## Project

- 교회 목장(소그룹) 관리 서비스. 주요 사용자는 교회 스태프/리더.
- 도메인: members, managers, worship, education, calendar/schedule, visitations, tasks, reports, church-event, notification, permissions, subscription.

## Monorepo

- turbo + npm workspaces. Apps: `@mokjang/app`(포트 3001), `@mokjang/landing`. 공유 패키지: `@mokjang/{components,constants,models,utils,assets}`.
- 루트에서 `npm run dev|build|lint|typecheck|format` (turbo, `--filter=@mokjang/*`). 단일: `npm --workspace @mokjang/app run <script>`.

## Core Rules

- TypeScript. Next.js 14 App Router.
- Atomic Design + MVVM. 컴포넌트 폴더는 소문자 kebab-case.
- 전역 상태는 Redux Toolkit. 스타일은 styled-components v6 (다른 스타일 시스템 혼용 금지).
- i18n는 next-international (ko/en, 기본 한국어), 라우트는 `[locale]` scoped.
- 데이터는 기존 Supabase/Postgres 구조를 따른다.

## Barrel Rule (중요)

- 모든 `index.ts` 배럴은 `scripts/make-barrels.mjs`로 자동 생성된다.
- `index.ts`를 손으로 수정하지 말 것. 소스 추가 후 `npm run barrels`(또는 `barrels:*`).

## Color / Constants Rule

- 색상 값 하드코딩 금지. `packages/constants/src/color.ts` 또는 `apps/app/src/utils/color.ts`에서 import.
- enum/상수는 별도 파일에 두고 import. 공유 타입은 `@mokjang/models`.

## Middleware

- 표준 Next.js 컨벤션 사용: `middleware.ts` + export `middleware` (`apps/app/src/middleware.ts`, `apps/landing/src/middleware.ts`).

## Safety

- `.env`, secrets, 배포 설정, 프로덕션/DB 스키마는 조용히 변경하지 말 것. 변경 전 설명하고 확인받는다.
- 파일 삭제, 대량 치환, 데이터 삭제 등 파괴적 변경 전 경고.
- 자동 커밋하지 말 것. 먼저 보고.

## Testing

- 자동화된 테스트 러너 없음. 머지 전 게이트는 `npm run typecheck` + `npm run lint`.

## Subagent / Delegation Rule

- 메인 세션이 멀티스텝 작업의 코디네이터다. Claude Code 에이전트 정의는 `.claude/agents/`에 있다.
- Codex 서브에이전트는 그 파일을 자동 상속하지 않는다. 위임 시 메인 세션이 해당 `.claude/agents/<agent>.md`의 역할·범위·제약·보고 형식을 읽어 프롬프트에 포함한다.
- 경계가 명확한 작업만 위임. 스키마 위험·secret 의존·조정이 무거운 작업은 메인 세션이 직접 처리.
- 에이전트 매핑:
  - `product-agent`: 기능 목적, 범위, 사용자 흐름, 화면 단위 기획.
  - `uiux-agent`: 화면 구조, 정보 위계, 모바일/데스크탑 사용성.
  - `frontend-agent`: UI 구현, Atomic Design, MVVM, Redux Toolkit, styled-components, next-international.
  - `backend-agent`: Supabase, API route, 응답 계약, 안전한 데이터 흐름.
  - `qa-agent`: 구현 후 검토, 회귀, i18n, 상태, 스타일, 누락 상태.
  - `manager-agent`: 작업 분해/결과 취합. 메인 세션이 이미 코디네이터이므로 절제해서 사용.

## Subagent Reporting Rule

- 위임된 구현 에이전트는 다음으로 보고를 마친다:

```text
- Changed files: <file list>
- Reason: <reason>
- Risks: <risks or confirmation needed>
- Suggested commit message: <commit message>
```

## Change Report

코드 변경 후에는 다음만 보고:

- Changed files
- Reason for the changes
- Risks or items that still need confirmation
- Suggested commit message

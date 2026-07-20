# mokjang CLAUDE.md

> 글로벌 규칙(언어, 안전, 코드 변경 보고 형식 등)은 `~/.claude/CLAUDE.md`를 따른다.
> 이 파일은 mokjang 프로젝트 고유 규칙만 적는다.

## Project

- 교회 목장(소그룹) 관리 서비스. 주요 사용자는 교회 스태프/리더.
- 도메인: members, managers, worship, education, calendar/schedule, visitations, tasks, reports, church-event, notification, permissions, subscription.

## Monorepo Layout (turbo + npm workspaces)

- `apps/app` (`@mokjang/app`) — 메인 앱. dev 포트 3001.
- `apps/landing` (`@mokjang/landing`) — 랜딩.
- `packages/*` — 공유 패키지: `components`, `constants`, `models`, `utils`, `assets`.
- 루트 스크립트: `npm run dev`(app+landing 병렬), `build`, `lint`, `typecheck`, `format` 모두 `turbo run ... --filter=@mokjang/*`.
- 단일 워크스페이스만 돌릴 때: `npm --workspace @mokjang/app run <script>` 또는 `npm run dev:app` / `dev:landing`.

## Barrel Files (중요)

- 모든 `index.ts` 배럴은 **자동 생성**된다 (`scripts/make-barrels.mjs`).
- `index.ts`를 **손으로 수정하지 말 것.** 소스 파일을 추가/수정한 뒤 `npm run barrels` 실행.
- 부분 생성: `barrels:components`, `barrels:constants`, `barrels:utils`, `barrels:assets`, `barrels:models`.

## Frontend Conventions

- TypeScript, Next.js 14 (App Router).
- Atomic Design + MVVM.
- 컴포넌트 폴더는 **소문자 kebab-case** (예: `button/`, `join-request/`, `member/`).
- 공유 컴포넌트는 `packages/components`, 도메인 전용은 `apps/app/src/components/{atoms,molecules,organisms}`.
- 스타일: **styled-components v6**. Tailwind 등 다른 스타일 시스템 섞지 말 것.
- 전역 상태: **Redux Toolkit** (`apps/app/src/redux/store.ts`, reducers는 `apps/app/src/redux/reducers`). 화면 간 공유/진짜 전역만 Redux, 나머지는 로컬 상태.

## Color / Constants Rule

- **색상 값 하드코딩 금지.** 상수 파일에서 import:
  - 공유: `packages/constants/src/color.ts`
  - 앱 유틸: `apps/app/src/utils/color.ts`
- enum/상수는 별도 파일(`packages/constants` 또는 `apps/app/src/constants`)에 두고 import. 매직 넘버/하드코딩 문자열 최소화.

## i18n

- **next-international** 사용. 로케일은 `apps/app/locales` (ko, en). 기본 언어 한국어.
- 라우트는 locale-scoped: `apps/app/src/app/[locale]/...`.
- 사용자 노출 텍스트는 가능한 한 i18n으로 관리.

## Middleware

- 표준 Next.js 컨벤션 사용: `apps/app/src/middleware.ts`, `apps/landing/src/middleware.ts` (export `middleware`).

## Data / Backend

- Supabase 클라이언트: `apps/app/src/lib/supabaseClient.ts`.
- API route: `apps/app/src/app/api/**/route.ts`. 도메인별 API 헬퍼: `apps/app/src/api/<domain>/`.
- 파일 스토리지: AWS S3 (`@aws-sdk/client-s3`, presigned upload).
- 공유 데이터 타입은 `@mokjang/models`.
- 환경변수는 `.env` (turbo build env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 등).

## Testing

- 현재 자동화된 테스트 러너 없음. 머지 전 게이트는 `npm run typecheck` + `npm run lint`.

## Tooling Notes

- `.claude/hooks/`의 PostToolUse 훅이 편집 후 prettier 포맷 + 변경 워크스페이스 typecheck(advisory, non-blocking)를 돌린다.
- 민감 파일(`.env`, `secrets/`) 읽기/그렙은 훅이 차단한다.

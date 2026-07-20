# fresh-dev

모든 캐시와 의존성을 완전히 초기화하고 개발 서버를 시작합니다. (turbo 모노레포)

다음 순서로 실행하세요:

1. Next 빌드/터보 캐시 삭제: `rm -rf apps/*/.next .turbo apps/*/.turbo packages/*/.turbo`
2. `node_modules` 삭제 (루트 + 워크스페이스): `rm -rf node_modules apps/*/node_modules packages/*/node_modules`
3. npm 캐시 정리: `npm cache clean --force`
4. 의존성 재설치: `npm install`
5. 배럴 재생성: `npm run barrels`
6. 개발 서버 시작: `npm run dev` (app + landing 병렬)
   - app만: `npm run dev:app` / landing만: `npm run dev:landing`

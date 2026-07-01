#!/usr/bin/env node

// 파일 편집 후 가벼운 품질 안내 훅 (non-blocking).
// mokjang은 turbo 모노레포라 루트 typecheck/lint가 전체 워크스페이스를 돌린다.
// 매 편집마다 전체 게이트를 blocking으로 돌리면 리팩토링 도중 작업이 막히므로,
// 여기서는 변경된 워크스페이스만 typecheck하고 결과를 advisory(stderr)로만 알린다.
// 실제 머지 게이트는 /ship-pr 커맨드에서 강제한다.

const { execSync } = require("node:child_process");

async function readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString());
}

function isSupportedFile(filePath) {
    return /\.(ts|tsx)$/.test(filePath);
}

// 변경된 파일이 속한 워크스페이스를 추정한다.
function workspaceFor(filePath) {
    const m = filePath.match(/(?:^|\/)(apps|packages)\/([^/]+)\//);
    if (!m) return null;
    const dir = m[1]; // apps | packages
    const name = m[2];
    // 패키지명 규칙: @mokjang/<name> (단 apps/app -> @mokjang/app)
    return `@mokjang/${name}`;
}

async function main() {
    const input = await readStdin();
    const filePath = input.tool_input?.file_path || "";

    if (!filePath || !isSupportedFile(filePath)) {
        process.exit(0);
    }

    const workspace = workspaceFor(filePath);
    if (!workspace) {
        process.exit(0);
    }

    try {
        execSync(`npm --workspace ${workspace} run typecheck`, {
            stdio: "pipe",
        });
        process.exit(0);
    } catch (error) {
        const detail = String(
            error.stdout || error.stderr || error.message
        ).slice(0, 4000);
        console.error(
            [
                `[hook] typecheck 경고 (${workspace}) — 변경 파일: ${filePath}`,
                "",
                detail,
                "",
                "리팩토링 중간 상태일 수 있으니 작업을 막지는 않습니다.",
                "최종 커밋/머지 전에 `npm run typecheck`로 전체를 확인하세요.",
            ].join("\n")
        );
        // non-blocking: exit 0 으로 작업 흐름을 끊지 않는다.
        process.exit(0);
    }
}

main().catch((error) => {
    console.error(`[hook] run-quality-gate error: ${error.message}`);
    process.exit(0);
});

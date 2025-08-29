// scripts/make-barrels.mjs
import fs from 'fs';
import path from 'path';

const CONFIGS = {
  constants: { root: path.resolve('packages/constants'), includeExts: ['.ts'] },
  components: {
    root: path.resolve('packages/components'),
    includeExts: ['.ts', '.tsx'],
  },
  utils: { root: path.resolve('packages/utils'), includeExts: ['.ts'] },
  assets: {
    root: path.resolve('packages/assets'),
    includeExts: ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
};

const EXCLUDE_FILES = new RegExp(
  String.raw`(^index\.ts$)|(\.d\.ts$)|(\.test\.(ts|tsx)$)|(\.stories\.(ts|tsx)$)|(^\.DS_Store$)`
);

// kebab/snake/camel → PascalCase (숫자 시작 방지)
function toPascal(filename) {
  const base = filename.replace(/\.[^.]+$/, ''); // 확장자 제거
  const parts = base
    .replace(/[^a-zA-Z0-9]+/g, ' ') // 구분자 통일
    .trim()
    .split(/\s+/);

  let name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

  if (/^\d/.test(name)) name = '_' + name; // 숫자 시작 방지
  return name || 'Asset';
}

function generateBarrelRecursively(dir, includeExts) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = entries
    .filter(
      (e) =>
        e.isFile() &&
        includeExts.some((ext) => e.name.toLowerCase().endsWith(ext)) &&
        !EXCLUDE_FILES.test(e.name)
    )
    .map((e) => e.name);

  const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  // 하위 폴더 먼저
  for (const folder of folders) {
    generateBarrelRecursively(path.join(dir, folder), includeExts);
  }

  const lines = [];

  for (const file of files.sort()) {
    const ext = path.extname(file).toLowerCase();
    const withoutExt = file.replace(
      /\.(ts|tsx|png|jpg|jpeg|gif|svg|webp)$/,
      ''
    );

    if (ext === '.ts' || ext === '.tsx') {
      // 코드 파일은 재-익스포트
      lines.push(`export * from "./${withoutExt}";`);
    } else {
      // 자산 파일은 default를 PascalCase 이름으로 재-익스포트
      const varName = toPascal(file);
      lines.push(`export { default as ${varName} } from "./${file}";`);
    }
  }

  // 하위 폴더 re-export
  for (const folder of folders.sort()) {
    lines.push(`export * from "./${folder}";`);
  }

  const outPath = path.join(dir, 'index.ts');
  if (lines.length === 0) {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  } else {
    fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
  }
}

function main() {
  const arg = process.argv[2]; // 'constants' | 'components' | 'utils' | 'assets'
  const targets = arg && CONFIGS[arg] ? [arg] : Object.keys(CONFIGS);

  for (const key of targets) {
    const { root, includeExts } = CONFIGS[key];
    if (!fs.existsSync(root)) {
      console.warn(`[skip] ${key}: not found -> ${root}`);
      continue;
    }
    generateBarrelRecursively(root, includeExts);
    console.log(`[ok] barrels generated for ${key}: ${root}`);
  }
}

main();

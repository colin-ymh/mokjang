// scripts/make-barrels.mjs
import fs from 'fs';
import path from 'path';

const CONFIGS = {
  constants: {
    root: path.resolve('packages/constants/src'),
    includeExts: ['.ts'],
  },
  components: {
    root: path.resolve('packages/components/src'),
    includeExts: ['.ts', '.tsx'],
  },
  utils: {
    root: path.resolve('packages/utils/src'),
    includeExts: ['.ts'],
  },
  assets: {
    root: path.resolve('packages/assets/src'),
    includeExts: ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
};

const EXCLUDE_FILES = new RegExp(
  String.raw`(^index\.ts$)|(\.d\.ts$)|(\.test\.(ts|tsx)$)|(\.stories\.(ts|tsx)$)|(^\.DS_Store$)`
);

// 예약어 방지용
const RESERVED = new Set([
  'default',
  'class',
  'function',
  'var',
  'let',
  'const',
  'enum',
  'export',
  'import',
  'extends',
  'super',
  'this',
  'new',
  'case',
  'switch',
  'if',
  'else',
  'try',
  'catch',
  'finally',
  'return',
  'break',
  'continue',
  'do',
  'while',
  'for',
  'in',
  'of',
]);

function safeIdentifier(name) {
  let n = name.replace(/[^a-zA-Z0-9_]/g, '_');
  if (/^\d/.test(n)) n = '_' + n;
  if (RESERVED.has(n.toLowerCase())) n = '_' + n;
  return n || 'Asset';
}

// kebab/snake/camel → PascalCase (숫자 시작 방지)
function toPascal(filename) {
  const base = filename.replace(/\.[^.]+$/, ''); // 확장자 제거
  const parts = base
    .replace(/[^a-zA-Z0-9]+/g, ' ') // 구분자 통일
    .trim()
    .split(/\s+/);
  let name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  if (/^\d/.test(name)) name = '_' + name;
  return name || 'Asset';
}

function generateBarrelRecursively(dir, includeExts, opts = {}) {
  const { namespaceFoldersAtRoot = false, rootDir = dir } = opts;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = entries
    .filter(
      (e) =>
        e.isFile() &&
        includeExts.some((ext) => e.name.toLowerCase().endsWith(ext)) &&
        !EXCLUDE_FILES.test(e.name)
    )
    .map((e) => e.name);

  const folders = entries
    .filter(
      (e) =>
        e.isDirectory() &&
        e.name !== 'node_modules' &&
        e.name !== 'dist' &&
        e.name !== 'types' &&
        e.name !== '__tests__' &&
        e.name !== '__mocks__' &&
        !e.name.startsWith('.')
    )
    .map((e) => e.name);

  // 하위 폴더 먼저
  for (const folder of folders) {
    generateBarrelRecursively(path.join(dir, folder), includeExts, {
      namespaceFoldersAtRoot,
      rootDir,
    });
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
      const varName = safeIdentifier(toPascal(file));
      lines.push(`export { default as ${varName} } from "./${file}";`);
    }
  }

  // 하위 폴더 re-export
  for (const folder of folders.sort()) {
    if (namespaceFoldersAtRoot && dir === rootDir) {
      const ns = safeIdentifier(toPascal(folder));
      lines.push(`export * as ${ns} from "./${folder}";`);
    } else {
      lines.push(`export * from "./${folder}";`);
    }
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
    // assets 루트에서만 네임스페이스 내보내기 활성화
    const isAssets = key === 'assets';
    generateBarrelRecursively(root, includeExts, {
      namespaceFoldersAtRoot: isAssets,
      rootDir: root,
    });
    console.log(`[ok] barrels generated for ${key}: ${root}`);
  }
}

main();

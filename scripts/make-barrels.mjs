// scripts/make-barrels.mjs
import fs from 'fs';
import path from 'path';

function resolveRootFor(key) {
  // 워크스페이스 패키지 폴더에서 실행되는 경우: cwd/src 사용
  const cwdSrc = path.join(process.cwd(), 'src');
  if (fs.existsSync(cwdSrc)) return cwdSrc;
  // 모노레포 루트에서 실행되는 경우: packages/<key>/src 사용
  return path.resolve(`packages/${key}/src`);
}

const CONFIGS = {
  constants: { root: resolveRootFor('constants'), includeExts: ['.ts'] },
  components: {
    root: resolveRootFor('components'),
    includeExts: ['.ts', '.tsx'],
  },
  utils: { root: resolveRootFor('utils'), includeExts: ['.ts'] },
  assets: {
    root: resolveRootFor('assets'),
    includeExts: ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
  models: { root: resolveRootFor('models'), includeExts: ['.ts'] },
};

const EXCLUDE_FILES = new RegExp(
  String.raw`(^index\.ts$)|(\.d\.ts$)|(\.test\.(ts|tsx)$)|(\.stories\.(ts|tsx)$)|(^\.DS_Store$)`
);

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

function toPascal(filename) {
  const base = filename.replace(/\.[^.]+$/, '');
  const parts = base
    .replace(/[^a-zA-Z0-9]+/g, ' ')
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
      lines.push(`export * from "./${withoutExt}";`);
    } else {
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
  const arg = process.argv[2]; // 'constants' | 'components' | 'utils' | 'assets' | 'models'
  const targets = arg && CONFIGS[arg] ? [arg] : Object.keys(CONFIGS);

  for (const key of targets) {
    const { root, includeExts } = CONFIGS[key];
    if (!fs.existsSync(root)) {
      console.warn(`[skip] ${key}: not found -> ${root}`);
      continue;
    }
    const isAssets = key === 'assets';
    generateBarrelRecursively(root, includeExts, {
      namespaceFoldersAtRoot: isAssets,
      rootDir: root,
    });
    console.log(`[ok] barrels generated for ${key}: ${root}`);
  }
}

main();

import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const LOCALES_ROOT = path.join(REPO_ROOT, 'packages/core/src/locales');

const ns = (process.argv[2] || '').trim();
if (!ns) {
  console.error('Usage: pnpm run locale:add <namespace>');
  process.exit(1);
}

const NAMESPACE_SAFE = /^[a-z0-9-]+$/i;
if (!NAMESPACE_SAFE.test(ns)) {
  console.error(`Invalid namespace "${ns}". Use letters, numbers, or dashes only.`);
  process.exit(1);
}

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function ensureFile(p, contents = '{}\n') {
  try {
    await fs.promises.access(p, fs.constants.F_OK);
  } catch {
    await fs.promises.writeFile(p, contents, 'utf8');
  }
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function toIdentifier(kebab) {
  const parts = kebab
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .split('-')
    .filter(Boolean);
  if (parts.length === 0) return 'ns';
  const camel =
    parts[0] +
    parts
      .slice(1)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
  return /^[0-9]/.test(camel) ? `_${camel}` : camel;
}

function dedupeIdents(pairs) {
  const used = new Set();
  return pairs.map(({ file, ident }) => {
    let name = ident;
    let i = 2;
    while (used.has(name)) {
      name = `${ident}${i++}`;
    }
    used.add(name);
    return { file, ident: name };
  });
}

function buildLangIndexTs(jsonFiles) {
  const pairs = jsonFiles
    .map((f) => ({ file: f, ident: toIdentifier(path.basename(f, '.json')) }))
    .sort((a, b) => a.ident.localeCompare(b.ident));

  const unique = dedupeIdents(pairs);

  const imports = unique.map(({ file, ident }) => `import ${ident} from './${file}';`).join('\n');
  const exportsObj = unique.map(({ ident }) => `  ${ident},`).join('\n');

  return `${imports}

export default {
${exportsObj}
} as const;
`;
}

function buildRootIndexTs(langDirs) {
  const langs = [...new Set(langDirs)].sort((a, b) => a.localeCompare(b));
  const imports = langs.map((l) => `import ${l} from './${l}';`).join('\n');
  const exportsObj = langs.map((l) => `  ${l},`).join('\n');
  return `${imports}

export default {
${exportsObj}
} as const;
`;
}

async function updateLanguageIndex(langDir) {
  const files = (await fs.promises.readdir(langDir))
    .filter((f) => f.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b));

  const indexPath = path.join(langDir, 'index.ts');
  const indexContent = buildLangIndexTs(files);
  await fs.promises.writeFile(indexPath, indexContent, 'utf8');
}

async function updateRootIndex() {
  const langDirs = (await fs.promises.readdir(LOCALES_ROOT))
    .map((d) => path.join(LOCALES_ROOT, d))
    .filter(isDir)
    .map((p) => path.basename(p));

  const indexPath = path.join(LOCALES_ROOT, 'index.ts');
  const content = buildRootIndexTs(langDirs);
  await fs.promises.writeFile(indexPath, content, 'utf8');
}

(async function run() {
  if (!isDir(LOCALES_ROOT)) {
    console.error(`Locales root not found: ${LOCALES_ROOT}`);
    process.exit(1);
  }

  const languages = (await fs.promises.readdir(LOCALES_ROOT))
    .map((d) => path.join(LOCALES_ROOT, d))
    .filter(isDir)
    .map((p) => path.basename(p));

  if (languages.length === 0) {
    console.error(`No language folders found under: ${LOCALES_ROOT}`);
    process.exit(1);
  }

  for (const lang of languages) {
    const langDir = path.join(LOCALES_ROOT, lang);
    await ensureDir(langDir);

    const jsonPath = path.join(langDir, `${ns}.json`);
    await ensureFile(jsonPath, '{}\n');

    await updateLanguageIndex(langDir);
     
    console.log(`✔ Updated ${path.relative(REPO_ROOT, path.join(langDir, 'index.ts'))}`);
  }

  await updateRootIndex();
   
  console.log(`✔ Updated ${path.relative(REPO_ROOT, path.join(LOCALES_ROOT, 'index.ts'))}`);
   
  console.log('Done.');
})();

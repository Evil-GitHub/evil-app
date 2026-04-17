const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const hooks = {
  'commit-msg': `echo "Checking commit message format..."
npx --no-install commitlint --edit "$1"
`,
  'pre-commit': `echo "Running staged file checks..."
npx lint-staged

echo "Running full lint..."
npm run lint

echo "Running tests..."
npm test -- --runInBand
`,
};

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function getGitConfig(name) {
  try {
    return execSync(`git config --get ${name}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!isGitRepository()) {
  console.log('当前目录不是 Git 仓库，跳过 Husky 初始化。');
  process.exit(0);
}

const huskyDir = path.resolve(process.cwd(), '.husky');

if (!fs.existsSync(huskyDir)) {
  console.warn('未找到 .husky 目录，跳过 Husky 初始化。');
  process.exit(0);
}

if (getGitConfig('core.hooksPath') !== '.husky/_') {
  run('npx husky');
}

for (const [file, content] of Object.entries(hooks)) {
  const filePath = path.join(huskyDir, file);
  fs.writeFileSync(filePath, content);
}

const prePushPath = path.join(huskyDir, 'pre-push');
if (fs.existsSync(prePushPath)) {
  fs.rmSync(prePushPath);
}

for (const file of fs.readdirSync(huskyDir)) {
  const filePath = path.join(huskyDir, file);

  if (!fs.statSync(filePath).isFile()) {
    continue;
  }

  try {
    fs.chmodSync(filePath, 0o755);
    console.log(`设置执行权限：${file}`);
  } catch (error) {
    console.warn(`设置权限失败：${file}`, error);
  }
}

console.log('Husky 初始化完成！');

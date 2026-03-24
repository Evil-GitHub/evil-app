const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
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

run('npx husky');

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

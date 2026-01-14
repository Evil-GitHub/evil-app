const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

// 安装 husky 钩子（幂等）
run('npx husky install');

const huskyDir = path.resolve(process.cwd(), '.husky');

function addHook(name, cmd) {
  const hookFile = path.join(huskyDir, name);
  if (!fs.existsSync(hookFile)) {
    run(`npx husky add ${hookFile} "${cmd}"`);
    console.log(`✅ 创建 husky 钩子：${name}`);
  } else {
    console.log(`ℹ️ 钩子已存在，跳过：${name}`);
  }
}

// 创建常用钩子
addHook('pre-commit', 'npx lint-staged');
addHook('commit-msg', 'npx --no -- commitlint --edit $1');
addHook('pre-push', 'npm run tsc');

// 设置钩子执行权限
fs.readdirSync(huskyDir).forEach((file) => {
  const filePath = path.join(huskyDir, file);
  try {
    fs.chmodSync(filePath, '755');
    console.log(`✅ 设置执行权限：${file}`);
  } catch (e) {
    console.warn(`⚠️ 设置权限失败：${file}`, e);
  }
});

console.log('🎉 husky 钩子安装和配置完成！');

// save as generate-readme.js, then run: node generate-readme.js

const fs = require('fs');
const path = require('path');

const readmeContent = `# Ant Design Pro 项目

本项目基于 Ant Design Pro 初始化，以下为快速使用指南。

## 环境准备

- **Node.js 版本要求 >= 20**  
  推荐使用 [nvm](https://github.com/nvm-sh/nvm) 或类似工具管理 Node 版本。

- 安装依赖：

\`\`\`bash
npm install
\`\`\`

或

\`\`\`bash
yarn
\`\`\`

> **注意：** 安装依赖过程中会自动执行 \`prepare\` 脚本，完成 Husky Git 钩子的安装。  
> 请务必执行依赖安装，否则提交时的 Git 钩子（如 commitlint 和 lint-staged）不会生效。

---

## 提供的脚本

以下脚本定义在 \`package.json\`，可根据需要修改或新增。

### 启动项目

\`\`\`bash
npm start
\`\`\`

### 构建项目

\`\`\`bash
npm run build
\`\`\`

### 代码格式检查

\`\`\`bash
npm run lint
\`\`\`

自动修复部分格式问题：

\`\`\`bash
npm run lint:fix
\`\`\`

### 运行测试

\`\`\`bash
npm test
\`\`\`

---

## Git 钩子与提交规范

项目采用 Husky 管理 Git 钩子，确保代码质量：

- **pre-commit**：运行 \`lint-staged\`，对暂存文件进行格式校验及自动修复。
- **commit-msg**：运行 \`commitlint\`，校验提交信息格式。
- **pre-push**：运行完整 TypeScript 类型检查（\`tsc --noEmit\`），防止类型错误代码推送。

**注意：**

- 克隆仓库后务必执行依赖安装，确保钩子安装完成。
- 本地 Node 版本需 >=20。
- 手动运行类型检查：

\`\`\`bash
npm run tsc
\`\`\`

---

## 其他说明

如有问题请联系项目维护人员。
`;

const filePath = path.resolve(process.cwd(), 'README.md');

fs.writeFileSync(filePath, readmeContent, { encoding: 'utf-8' });
console.log('✅ README.md 文件已生成！');

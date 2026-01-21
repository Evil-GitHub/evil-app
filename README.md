## 环境准备

- **Node.js 版本要求 >= 20**
  推荐使用 [nvm](https://github.com/nvm-sh/nvm) 或类似工具管理 Node 版本。

- 安装依赖：

```bash
npm install
```

或

```bash
yarn
```

> **注意：** 安装依赖过程中会自动执行 `prepare` 脚本，完成 Husky Git 钩子的安装。
> 请务必执行依赖安装，否则提交时的 Git 钩子（如 commitlint 和 lint-staged）不会生效。

---

## 提供的脚本

以下脚本定义在 `package.json`，可根据需要修改或新增。

---

## 环境变量与地址说明

完整的环境变量说明（包括 API 地址决策逻辑、APP_MODE 行为及常见启动脚本组合），已拆分到独立文档：

- [ENVIRONMENT.md](./ENVIRONMENT.md)

### 启动项目

```bash
yarn start
```

### 构建项目

```bash
yarn build
```

### 代码格式检查

```bash
yarn lint
```

自动修复部分格式问题：

```bash
yarn lint:fix
```

### 运行测试

```bash
yarn test
```

---

## Git 钩子与提交规范

项目采用 Husky 管理 Git 钩子，确保代码质量：

- **pre-commit**：运行 `lint-staged`，对暂存文件进行格式校验及自动修复。
- **commit-msg**：运行 `commitlint`，校验提交信息格式。
- **pre-push**：运行完整 TypeScript 类型检查（`tsc --noEmit`），防止类型错误代码推送。

**注意：**

- 克隆仓库后务必执行依赖安装，确保钩子安装完成。
- 本地 Node 版本需 >= 20。
- 手动运行类型检查：

```bash
yarn tsc
```

---

## 常见问题及解决方案

- **Git 钩子未生效**
  请确保 `.husky` 目录及钩子文件有执行权限，必要时执行：

```bash
chmod +x .husky/*
```

- **提交消息格式不正确**
  请遵循团队约定的提交规范格式，例如：

```
feat: 新增功能描述
fix: 修复问题描述
```

- **推送被阻止类型检查失败**
  请修复类型错误后再提交。

---

## 联系方式

如有任何疑问或建议，请联系项目维护人员。

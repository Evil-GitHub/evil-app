## 环境变量与地址说明

### 核心环境变量

| 变量名               | 来源                        | 取值示例                    | 作用说明                                |
| -------------------- | --------------------------- | --------------------------- | --------------------------------------- |
| `REACT_APP_ENV`      | 启动/构建脚本、config.\*.ts | `dev` `pre` `prod` `test`   | 业务环境标识，控制代理等逻辑            |
| `UMI_ENV`            | 启动/构建脚本               | `dev` `pre` `prod`          | Umi 配置环境，决定使用 config.dev.ts 等 |
| `APP_MODE`           | 启动/构建脚本、config.\*.ts | `standalone` `microservice` | 单机版 / 微服务版                       |
| `MAIN_APP_HOME_PATH` | 启动/构建脚本、config.\*.ts | `/` `/console`              | 微服务版时主应用首页路径                |
| `OPENAPI_ADDRESS`    | 启动/构建脚本、config.ts    | URL                         | OPEN API 基础地址，优先级最高           |
| `REQUEST_ADDRESS`    | 启动/构建脚本、config.ts    | URL                         | 请求基础地址，优先作为 baseURL          |

这些变量在 `config/config.ts` 中通过 `define` 注入到前端，前端代码统一通过 `process.env.xxx` 访问。

### API 地址决策逻辑

默认地址定义（见 `config/config.ts`）：

- 微服务 API：
  - `MICRO_OPENAPI_ADDRESS = http://192.168.100.102:32367`
  - `MICRO_REQUEST_ADDRESS = http://192.168.100.102:32333`
- 单机版 API：
  - `STANDALONE_OPENAPI_ADDRESS = http://192.168.100.102:30330`
  - `STANDALONE_REQUEST_ADDRESS = http://192.168.100.102:30330`

最终注入到前端的 `OPENAPI_ADDRESS` / `REQUEST_ADDRESS` 由如下规则计算：

- 若显式传入 `OPENAPI_ADDRESS` / `REQUEST_ADDRESS` 环境变量，则直接使用；
- 否则，根据 `REACT_APP_ENV + APP_MODE` 自动选择：

| 场景              | 条件                                           | `OPENAPI_ADDRESS`                              | `REQUEST_ADDRESS`            |
| ----------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------- |
| 本地单机开发      | `REACT_APP_ENV=dev` 且 `APP_MODE≠microservice` | `LOCAL_OPENAPI_ADDRESS`（默认 localhost:9000） | `LOCAL_REQUEST_ADDRESS`      |
| 本地微服务开发    | `REACT_APP_ENV=dev` 且 `APP_MODE=microservice` | `MICRO_OPENAPI_ADDRESS`                        | `MICRO_REQUEST_ADDRESS`      |
| 预发/生产微服务版 | `REACT_APP_ENV≠dev` 且 `APP_MODE=microservice` | `MICRO_OPENAPI_ADDRESS`                        | `MICRO_REQUEST_ADDRESS`      |
| 预发/生产单机版   | `REACT_APP_ENV≠dev` 且 `APP_MODE≠microservice` | `STANDALONE_OPENAPI_ADDRESS`                   | `STANDALONE_REQUEST_ADDRESS` |

### APP_MODE 与返回首页

`APP_MODE` 同时决定：

- 是否启用微前端（`qiankun`）；
- `goHome` 行为：
  - `APP_MODE="microservice"`：跳转到主应用 `origin + MAIN_APP_HOME_PATH`
  - 其他：跳转到当前应用 `/` 路由。

### 常用脚本与环境组合

常见组合（完整内容可查看 `package.json`）：

- 本地单机开发（默认）：
  - `yarn start` 或 `yarn start:dev` → `REACT_APP_ENV=dev`，单机模式；
- 本地微服务开发：
  - `yarn start:dev:micro` → `REACT_APP_ENV=dev`，`APP_MODE=microservice`，使用微服务 API；
- 预发/生产构建：
  - `yarn build:pre` → `UMI_ENV=pre`，`REACT_APP_ENV=pre`；
  - `yarn build:prod` → `UMI_ENV=prod`，`REACT_APP_ENV=prod`，默认单机版；
  - `yarn build:prod:micro` → `UMI_ENV=prod`，`REACT_APP_ENV=prod`，`APP_MODE=microservice`，微服务版。

如需临时切换目标后端，可在命令前增加 `OPENAPI_ADDRESS` / `REQUEST_ADDRESS` 环境变量覆盖默认值。


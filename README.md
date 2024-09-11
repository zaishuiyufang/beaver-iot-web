# Milesight IoT 应用构建助手

本仓库包含了 IOT 云生态所有前端项目，基于 Pnpm 的 Workspace 进行管理。基础技术栈包括：

- 视图库：react
- 请求库：axios
- 组件库：@mui/material
- 状态管理：zustand
- 国际化：react-intl-universal
- 通用 Hook：ahooks

## 目录结构

```
mip-web
├── apps
│   └── web        # Web 应用
│
├── packages
│   ├── locales             # 国际化处理库
│   ├── shared              # 共享资源库
│   └── spec                # 项目规范库
├── README.md
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## 开发维护

### 基础环境配置

1. 安装 Node，Pnpm

    可以在 [Node 官网](https://nodejs.org/)下载最新的稳定版本（推荐下载 [nvm](https://github.com/nvm-sh/nvm) 管理本机 Node 版本）。

    > 为保证开发同学本地调试环境的一致性，请将本地基础依赖版本配置为 `node>=16.14`，`pnpm>=7.0`，低于此版本的基础环境将不做额外的兼容支持。

    以 nvm 使用为例：

    ```bash
    # 安装最新稳定版
    nvm install 16.17.1

    # 使用 node@16.17.1 版本
    nvm use 16.17.1

    # 切换 16.17.1 为默认版本
    nvm alias default 16.17.1

    # 安装 pnpm
    npm install -g pnpm

    # 或者，从官网下载 Pnpm https://pnpm.io/zh/installation
    # PowerShell on Windows
    iwr https://get.pnpm.io/install.ps1 -useb | iex
    ```

    > 在 Windows 环境，若使用 NVM 切换 node 版本报权限错误，可右键「以管理员身份运行」打开终端，重新执行命令。

2. 克隆仓库到本地

    生成 SSH Key（如果本地已有，可跳过）：

    ```bash
    # 一路「回车」即可
    ssh-keygen -t rsa -C "your_email@yeastar.com"

    # 拷贝公钥
    # Git Bash on Windows
    cat ~/.ssh/id_rsa.pub | clip

    # Mac
    cat ~/.ssh/id_rsa.pub | pbcopy
    ```

    将生成并拷贝的 SSH 公钥，复制粘贴到 Gitlab 的 `用户设置 -> SSH 密钥` 中。然后，即可免密克隆项目到本地：

    ```bash
    # 克隆仓库
    git clone git@gitlab.yeastar.com:yeastar/mip/mip-web.git

    # 进入项目目录
    cd mip-web

    # 配置提交的用户名及邮箱
    # 若需全局修改，可增加 --global 参数
    git config user.name xxx
    git config user.email xxx@yeastar.com
    ```

    > 访问 Gitlab 仓库需开通 LDAP 账户，可找运维 @徐世华 帮忙处理。账户开通后，再找项目负责人开通相应的仓库权限。

### 启动本地开发服务

```bash
# 下载依赖
pnpm i

# 启动本地开发服务
# packages 中以 `@milesight` 命名的依赖包也会同时启动开发服务
pnpm run start
```

### 国际化语言包开发

智慧办公项目产品面向海外用户，因此我们所有展现在页面上的文案都需要经过国际化处理。前端依赖了 [react-intl-universal](https://github.com/alibaba/react-intl-universal)，文案处理步骤通常为：

1. 开发根据[国际化 key 规范](https://doc.weixin.qq.com/doc/w3_m_HnqAsZjvUYCX?scode=AMgAYAe8AAY8lvBdUEAUAAMga9AMs)，定义相应文案的 key 值
2. 在 `locales/lang/en` 目录对应的模块增加相应国际化文案
3. 在代码中使用，比如：
    ```jsx
    <h2>intl.get('common.button.confirm')<h2>
    ```
4. 提交代码库，待提测前 2~3 天，利用辅助工具，执行 `pnpm run i18n:export` 校验并导出所有增删的 key（该命令只校验新增文案，若要校验所有文案请使用 `pnpm run i18n:export-all`）
5. 将映射表发到企微「智慧办公文案处理沟通群」，at 产品 @赵玉萍 处理
6. 产品处理好文案后，会在群里回复
7. 开发同学拿到文案包后，解压放入代码仓库 `packages/locales/import` 目录，覆盖原同名文件
8. 在根目录执行 `pnpm run i18n:import`，完成国际化语言包的分包处理
9. 检查格式无误后，开发同学即可将改动的 key 提交代码库，完成本次国际化语言包的处理

### 部署发版

> Todo: 待补充..

### 常用命令

| 命令 | 说明 |
| ---- | ---- |
| `pnpm run start` | 启动开发服务 |
| `pnpm run dev` | 启动开发服务，包括 admin, open 两个子应用 |
| `pnpm run dev:pkgs` | 启动 packages 开发服务（以 `@iot` 开头命名的库） |
| `pnpm run i18n:import` | 国际化文案导入 |
| `pnpm run i18n:export` | 国际化文案导出，会同步执行文案校验（只校验新增文案） |
| `pnpm run i18n:export-all` | 国际化文案导出，会同步执行文案校验（校验所有文案） |


## 相关链接

- [Material UI](https://mui.com/material-ui)
- [Zustand](https://zustand.docs.pmnd.rs)

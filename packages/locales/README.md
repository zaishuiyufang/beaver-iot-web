# 国际化语言文案库

本仓库存放了 Workplace 项目国际化的所有文案。

## 命名规范

项目中 key 的命名规范需要严格按照产品拟定的[文档](https://doc.weixin.qq.com/doc/w3_AS0A0wb3AIcgC5bgLNkTqOVylrK8G?scode=AL8APwePADMdUF4fZMAbMA0gb3AIc)来编写，此处提炼几点需特别注意的事项：

1. 命名按照 `[一级功能菜单明].[次级功能名].[...].[key 的功能名]` 格式命名，层级为 **3~4** 层（当前文案中存在超过 4 层以上的命名，属于历史遗留问题），最后一层必须是描述当前功能的功能名称，一般是用翻译的英文翻译来命名，如下：
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665561275864-eb3c8ea1-26be-482f-b74f-4351809aceea.png)
    - 一级功能菜单当名为 `meet_room` 表示该 `key` 属于会议功能模块
    - 二级功能名为 `notification`，表示该 `key` 具体属于会议模块下的通知模块
    - 三级的 `title` 则表示该 `key` 用到的地方是会议通知模板的标题处
    - 最后一级 `key` 名则定义了该 `key` 的具体功能名称是会议即将结束

    **注意**：一级/二级菜单名等同于页面路由的名字，相当于是一个个页面，**这个名字是由产品定义好，研发再沿用，涉及到新增菜单，需与产品确认名字**，例如：
    - 会议室模块：`meet_room`
    - 会议室日历预约模块：`meet_room.room_booking`

2. `key` 名只能是**小写、下划线（`_`）** 拼接的字符，文案中的变量名必须使用整型的数字占位（**避免客户将多语言中的变量名也翻译**），例如：
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665559440633-ad1f6bb4-9d9e-4096-9d11-ba9de58eb538.png)

3. 若编写的 `key` 名属于 OEM 定制项目，则需要在 `key` 名的末尾加上 `_oem_[id]` 标识，id 需要与产品事先定义好，例如谦鹭定制项目的 oem id 是 `12`，那这个项目的定制需求命名的 `key` 如下：
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665559318627-d8205db2-567c-46ac-adae-a3787e427d77.png)

4. 若新增的 `key` 名属于全局所有模块共用的，`key` 名的一级名必须采用预设的全局一级名进行定义，目前支持的全局一级名一共有四个：`common`、`valid`、`header` 和 `menu`，通常用的是 `common` 和 `menu`，具体案例如下：
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665565761177-1afee696-e1f1-4ac1-aee6-ef1af946fcab.png)
    - `common`: 各功能模块通用的
    - `menu`: 菜单栏(比如：管理端的侧边栏)
    - `header`: 页面头部
    - `valid`: 表单的规则校验

### 与后端配置注意事项

1. 若后台提供了错误码，前端需要依据这个错误码归属的功能模块进行命名，且最后一层的 `key` 名的前缀必须带上 `error`，标识这是错误码文案 `key`，如下两种类型的错误码 `key` 命名：
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665563105937-c337604b-6e9b-4da8-8209-1c54a08cdcb4.png)

    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665563183717-c2fa8573-446b-48c4-8f96-9f48de0d027a.png)

    后端新增了 `approval_conference_not_exist` 和 `user_is_frozen` 错误码，分别属于会议模块和登录模块的错误码，则 `key` 名必须遵照上述命名。

2. 消息通知模块（会议、工位和访客）中涉及到的模板中定义的 `key` 名，因为模板都是一样的，所以前后端在这部分定义的 `key` 名必须复用，开发人员需要与后端沟通好这部分的 `key` 名，避免重复定义，案例如下：
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665566303550-e74cff12-a89d-435e-b630-202a85aadcfe.png)

    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665566443382-bdf2e089-7709-4e8c-b68d-577460742a35.png)

3. 后端的多语言 `key` 目前也是放到了前端这边一起发给产品翻译，所以前端多语言 `key` 的库中会包含一些前端代码里没有用到的 `key` 名，目前有导入功能中下载模板文件时的一些 `key`，如下
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665566744788-30492012-5732-43c3-bfe4-3c9b90d8f9b4.png)

    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665566763781-90c5deef-38d6-4c75-8064-cc34be1388b9.png)

    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665566777190-062c5d2f-33a0-4536-96ca-6b2f98831c50.png)

## 协作流程

1. 给到产品翻译的 `key` **必须是当前迭代新增的**，不用给所有的文案 `key`
2. 每次**提测前 2-3 天**由研发输出当前迭代新增的 `key`，是一个 json 的文件，然后在【文案交流群里】 @玉萍
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665567197711-1f76c88a-b2df-4143-b560-392f291fe6d4.png)
    同时附带上期望翻译回来的时间，这个时间一般是赶在下一轮提测前，不然产品会依照文案的量弹性导出翻译回来，**这时注意和测试说明，文案翻译不是最新的**：
    ![](https://cdn.nlark.com/yuque/0/2022/png/12444257/1665568605491-6e83cb3f-25e0-4b3d-aff2-86347d5d18f5.png)
3. 前端同学们开发不同模块新增 `key` 时，**需要注意彼此间是否有能复用 `key`，避免声明同翻译不同 `key` 名的 `key`**（若声明了，产品那边会再次让研发返工调整）
4. 提测前导出一份 `key` 给到产品后，若在改 bug 期间发现有少许遗漏的 `key`（一般是几个），则**需要在【key 的协作记录表】中按照模板进行登记**，若量比较多，则再进行一次 `key` 的统一导出
5. 新人编写的 `key` 由 `key` 负责人审核，通过后才能提交到 commit，目前的前端 `key` 负责人是 @征中

## 开始开发

当前我们大仓中集成了国际化文案辅助工具，可使用命令行快速对增删改的 `key` 进行导入、导出、校验等处理。开发同学在使用国际化文案时应注意以下几点：

1. 项目源码中不应定义默认值，比如：
    ```js
    // 正确
    intl.get('auth.free_trial.tip');

    // 错误
    intl.get('auth.free_trial.tip').d('账户注册成功后，将为您自动创建企业{1}。');
    intl.get('auth.free_trial.tip').defaultMessage('账户注册成功后，将为您自动创建企业{1}。');
    ```
2. 开发同学应在 `packages/locales/src/lang/en` 目录下对增删改的 `key` 进行统一操作，因为辅助工具是基于该目录进行快速的导入、导出、校验等处理

### 文案导入

在 `smart-office-web` 项目根目录执行 `pnpm run locales:import` 命令，会把 `locales/locales-import` 目录下，产品翻译好的文案导入到 `locales/src` 源码目录下。

### 文案导出

在 `smart-office-web` 项目根目录执行 `pnpm run locales:export` 命令，会把 `locales/src/lang/en` 目录下，开发新增的文案导出到 `locales/export` 目录下。

### 文案校验

在 `smart-office-web` 项目根目录执行 `pnpm run locales:check` 命令，会校验 `locales/src/lang/en` 目录下文案 `key` & `value` 的规范性问题，同时会将开发新增、删除的 `key` 以及校验日志导出到 `locales/.checklog` 目录下。


## 参考文档

- [【Yeastar】产品软件文案规范及工作流程](https://doc.weixin.qq.com/doc/w3_AS0A0wb3AIcgC5bgLNkTqOVylrK8G?scode=AL8APwePADMdUF4fZMAbMA0gb3AIc)
- [前端规范系列 - 多语言 Key](https://www.yuque.com/r/notes/share/50b3d2ab-7ce9-46af-b5ed-976242199868)




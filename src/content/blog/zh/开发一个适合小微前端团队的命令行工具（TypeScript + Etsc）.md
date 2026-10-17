---
title: "开发一个适合小微前端团队的命令行工具（TypeScript + Etsc）"
description: "因卓诶原文链接 一个虚假的故事（狗头） 设想一下，如果10人以下的前端小团队要合作去协同一个项目; 这个时候leader说: \\\"小明, 我们这次使用vue3吧，你去搭建一个项目吧！\\\" 小明第一次开发vue3的项目，但是身为老司机却丝毫不慌，它按照官方文档一…"
date: 2021-09-05
lang: zh
translationKey: "2021-09-05_573_开发一个适合小微前端团队的命令行工具（TypeScript + Etsc）"
categories:
  - "前端"
views: 6484
draft: false
---

![扫码_搜索联合传播样式-白色版.png](https://static.yinzhuoei.com/typecho/2021/09/05/435632711743942/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E7%99%BD%E8%89%B2%E7%89%88.png)

[因卓诶原文链接](https://www.yinzhuoei.com/index.php/archives/573/)

## 一个虚假的故事（狗头）

设想一下，如果10人以下的前端小团队要合作去协同一个项目;

这个时候leader说: \"小明, 我们这次使用vue3吧，你去搭建一个项目吧！\"

小明第一次开发vue3的项目，但是身为老司机却丝毫不慌，它按照官方文档一步一步的构建脚手架，去添加各种依赖，然后把之前vue2或者其他项目的公用代码复制过来。

1天过去了...

小红拿到了最新的脚手架代码，打开自己的webstorm；小蓝打开了自己的sublime；小紫打开了自己的vscode。数周之后，leader查看仓库，发现小红，小紫，小蓝的代码/架构风格迥异，而且代码毫无章法的蜷缩在仓库中，甚至出现了很多组件/公用方法重复的问题。几周之后慢慢迭代，慢慢地成为了“屎山”。当团队的人越来越多，这个代码可能就越“屎”。

---

## 前言

我从一毕业从事工作开始到今天，小团队接触的特别多，这种情况其实非常常见。但是由于时间和其他原因，一直没有机会把我开源项目的那一套技术栈搬过来；上周终于不是很忙就筹备了二个项目，用来解决小型团队的常见问题，成本不高，只需要一个包。在开始介绍之前，我们罗列一下问题列表:

1. 开发工具不统一
2. 代码规范以及美观性
3. 初始化一个项目做的准备工作太多
4. 技术迭代不够快

我们今天这篇文章主要讲述2个项目:

[enjoy-project-tool仓库](https://github.com/seho-code-life/project_tool)
[enjoy-project-template仓库](https://github.com/seho-code-life/project_template)

命令行工具主要的作用就是拉取我们的代码模板，这个大家见怪不怪了，但是我仍需要描述一些细节给第一次做命令行的兄弟们看。至于项目模板，我开源的仓库的readme已经做了很多很多介绍以及使用方式，这里就不阐述过多了。

可以一边看完整代码，一边code

## 准备

使用nodejs开发命令行工具是对前端工程师最友好的方式，我们可以直接通过node去执行我们的js文件，所以我们随便npm init一个新的工程，然后更改我们的package.json

```json
{
  \"name\": \"enjoy-project-tool\",
  \"version\": \"1.0.0\",
  \"description\": \"\",
  \"main\": \"dist/main.js\",
  \"scripts\": {
    \"run\": \"nodemon\",
    \"lint\": \"eslint \'src/**/*\' --fix\",
    \"prettier\": \"prettier --write \'**/*.{ts,js,json,markdown}\'\",
    \"lint-staged\": \"lint-staged\",
    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"
  },
  \"lint-staged\": {
    \"*.{ts,js,json,markdown}\": [
      \"prettier --write\",
      \"eslint --fix\",
      \"git add\"
    ]
  },
  \"bin\": {
    \"enjoy\": \"dist/main.js\"
  },
  \"author\": \"\",
  \"license\": \"ISC\",
  \"dependencies\": {
    \"chalk\": \"^4.1.2\",
    \"commander\": \"^8.1.0\",
    \"download-git-repo\": \"^3.0.2\",
    \"inquirer\": \"^8.1.2\",
    \"ora\": \"^5.4.1\"
  },
  \"devDependencies\": {
    \"@types/inquirer\": \"^7.3.3\",
    \"@types/node\": \"^16.7.10\",
    \"@typescript-eslint/eslint-plugin\": \"^4.30.0\",
    \"@typescript-eslint/parser\": \"^4.30.0\",
    \"esbuild-node-tsc\": \"^1.6.1\",
    \"eslint\": \"^7.32.0\",
    \"eslint-config-prettier\": \"^8.3.0\",
    \"eslint-plugin-prettier\": \"^4.0.0\",
    \"husky\": \"^7.0.2\",
    \"lint-staged\": \"^11.1.2\",
    \"nodemon\": \"^2.0.12\",
    \"prettier\": \"^2.3.2\",
    \"typescript\": \"^4.4.2\"
  }
}
```

给大家描述一下，我们用什么技术栈去开发这个命令行工具？

首先我们需要typescript，使用esbuild-node-tsc（简称ETSC）去编译我们的ts代码；
其次我们使用husky和lint-staged以及eslint去对我们的代码做git提交之前的校验；
prettier主要做一个代码美化；
使用nodemon便于我们开发调试自动编译

如果你对上面的技术栈不是特别了解，没关系。我们再讲述具体实现的时候还会提到它们的。

开发命令行工具我们需要给node暴露一个js文件，那么这个文件我们可以存储dist目录下，并且我们需要描述一个名称，让node环境通过名称去找到对应的js文件并且运行，所以我们就在package.json中写下了这一行代码:

```json
\"bin\": {
    \"enjoy\": \"dist/main.js\"
  },
```

那么到时候我们可以使用如下的命令访问到我们的程序:

```shell
enjoy
```

我们只需要把我们写好的ts代码去编译到dist目录下就大功告成了~

## hello world

纯属个人习惯，我把main.ts文件放到了src目录之下，然后我写下了下面的代码：

```shell
#!/usr/bin/env node

console.log(\"hello world\")
```

> #!/usr/bin/env node 必须加入这段代码，让代码使用node进行执行

这个时候我们需要配置一下ts和etsc：

根目录新建 **tsconfig.json**

```json
{
  \"compilerOptions\": {
    \"target\": \"es6\",
    \"module\": \"CommonJS\",
    \"outDir\": \"./dist\",
    \"strict\": true,
    \"esModuleInterop\": true,
    \"moduleResolution\": \"Node\",
    \"allowSyntheticDefaultImports\": true,
    \"resolveJsonModule\": true,
    \"forceConsistentCasingInFileNames\": true,
    \"typeRoots\": [\"./node_modules/@types\", \"./typings\"]
  },
  \"include\": [\"./src/*.ts\"]
}
```

这个配置文件我们需要关心include，以及target，module，outdir，typeRoots；

```
include: 包含ts的目录
target: 我们编写的ts代码的版本,es6/es5...
module: 我们编译之后的模块类型，ems还是cjs，这里我们选择的是cjs
outDir: 输出js的目录
typeRoots: 类型声明文件存放的目录，我们一会需要在typings这个目录下去定义我们的类型
```

typescript自带了tsc用于编译ts文件，但是我们使用了etsc只因为它速度更快，etsc默认是开箱即用的，只用你根目录下的tsconfig.json配置它就能工作。但是我们仍需要它把编译之后的代码进行压缩，所以我们需要对etsc进行额外的配置，我们需要新建**etsc.config.js**

```js
module.exports = {
  esbuild: {
    minify: true
  }
};
```

这个时候我们项目根目录运行etsc的命令，就可以看到根目录出现了dist文件夹并且其中有main.js的文件。我们就可以用nodejs去运行它了。

我们在命令行输入:

```shell
npm link
```

> npm link 命令可以把你写的工程 链接 到你电脑的全局环境，方便调试，而且不需要install

这个时候我们在命令行输入: enjoy

就可以在控制台显示出我们写的hello world了

## 优化开发体验

我们已经成功的打印出了hello world，我们每一次编辑main.ts文件都需要运行etsc命令，这就不是昊哥干的事情。所以我们用nodemon去监听文件的编辑，然后让nodemon去触发etsc的命令。我们需要在根目录新建一个nodemon.json：

```json
{
  \"watch\": [\"src/*\"],
  \"ext\": \"ts\",
  \"exec\": \"etsc\",
  \"legacyWatch\": true
}
```

然后在package.json中我们已经写入了脚本命令:

```shell
\"run\": \"nodemon\",
```

执行

```shell
npm run run
```

这个时候nodemon服务已经启动了，我们更改main.ts，nodemon会自动去执行etsc命令，直接就把文件编译到dist里面了，然后我们就可以无缝的去在命令行调试最新的结果（npm link之后就不需要再次执行这个npm link了）

## 核心代码开发

commander这个库是用于nodejs开发命令行的最佳工具，我们可以使用这个包去完成很多事情，比如命令的控制等，我们可以在main.ts中写入以下代码:

```ts
#!/usr/bin/env node

// 命令行
import { program } from \'commander\';

program
  .command(\'create\')
  .description(\'create template (创建模板)\')
  .action(async () => {
    // 回调函数
    console.log(\"回调函数\")
  });

program.parse(process.argv);
```

program也可以支持命令行的version版本，这一块我就不描述了，具体可以查阅文档。

运行enjoy就能看到如下内容:

![1630837375700.jpg](https://static.yinzhuoei.com/typecho/2021/09/05/373933331437505/1630837375700.jpg)

commander帮助我们把一些必要的生成完毕了，我们可以直接运用enjoy create就可以把我们刚刚注册的create的回调函数触发。

我们目前这个命令行工具支持创建模板的功能，所以我有必要把create这个操作抽离出去，所以我新建了一个ts文件专门处理create的逻辑。

然后代码改写:

```ts
program
  .command(\'create\')
  .description(\'create template (创建模板)\')
  .action(async () => {
    await import(\'./create.js\');
  });

program.parse(process.argv);
```

我们新建的create.ts内容如下

```ts
#!/usr/bin/env node

import inquirer from \'inquirer\';
import ora from \'ora\';
import fs from \'fs\';
import { exec } from \'child_process\';
import download from \'download-git-repo\';
import chalk from \'chalk\';

const spinner = ora(\'下载模板中, 请稍后...\');

// 模板字典
const template: { name: string; value: string }[] = [
  {
    name: \'vue3-vite2-ts-template （ant-design-vue）模板文档: https://github.com/seho-code-life/project_template/tree/vue3-vite2-ts-template(release)\',
    value: \'seho-code-life/project_template#vue3-vite2-ts-template(release)\'
  },
  {
    name: \'node-command-ts-template                 模板文档: https://github.com/seho-code-life/project_template/tree/node-command-cli\',
    value: \'seho-code-life/project_template#node-command-cli\'
  }
];

// 安装项目依赖
const install = (params: { projectName: string }) => {
  const { projectName } = params;
  spinner.text = \'正在安装依赖，如果您的网络情况较差，这可能是一杯茶的功夫\';
  // 执行install
  exec(`cd ${projectName} && npm i`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    } else if (stdout) {
      spinner.text = `安装成功, 进入${projectName}开始撸码～`;
      spinner.succeed();
    } else {
      spinner.text = `自动安装失败, 请查看错误，且之后自行安装依赖～`;
      spinner.fail();
      console.error(stderr);
    }
  });
};

// 修改下载好的模板package.json
const editPackageInfo = (params: { projectName: string }) => {
  const { projectName } = params;
  // 获取项目路径
  const path = `${process.cwd()}/${projectName}`;
  // 读取项目中的packagejson文件
  fs.readFile(`${path}/package.json`, (err, data) => {
    if (err) throw err;
    // 获取json数据并修改项目名称和版本号
    const _data = JSON.parse(data.toString());
    // 修改package的name名称
    _data.name = projectName;
    const str = JSON.stringify(_data, null, 4);
    // 写入文件
    fs.writeFile(`${path}/package.json`, str, function (err) {
      if (err) throw err;
    });
    spinner.text = `下载完成, 正在自动安装项目依赖...`;
    install({ projectName });
  });
};

// 下载模板
const downloadTemplate = (params: { repository: string; projectName: string }) => {
  const { repository, projectName } = params;
  download(repository, projectName, (err) => {
    if (!err) {
      editPackageInfo({ projectName });
    } else {
      console.log(err);
      spinner.stop(); // 停止
      console.log(chalk.red(\'拉取模板出现未知错误\'));
    }
  });
};

// 定义问题列表
const questions = [
  {
    type: \'input\',
    name: \'projectName\',
    message: \'项目文件夹名称:\',
    validate(val?: string) {
      if (!val) {
        // 验证一下输入是否正确
        return \'请输入文件名\';
      }
      if (fs.existsSync(val)) {
        // 判断文件是否存在
        return \'文件已存在\';
      } else {
        return true;
      }
    }
  },
  {
    type: \'list\',
    name: \'template\',
    choices: template,
    message: \'请选择要拉取的模板\'
  }
];

inquirer.prompt(questions).then((answers) => {
  // 获取答案
  const { template: templateUrl, projectName } = answers;
  spinner.start();
  spinner.color = \'green\';
  // 开始下载模板
  downloadTemplate({
    repository: templateUrl,
    projectName
  });
});
```

inquirer这个工具可以帮助我们引导用户在命令行做出“输入/选择等”的操作，但是前提我们定义了一个数组，这个数组就是questions，模板内容存储到了一个[公开的仓库](https://github.com/seho-code-life/project_template)（不同类型的模板，分为不同的分支），我们通过download-git-repo这个包去进行下载。模板通过这个repo这个包下载完毕之后，我们调用editPackageInfo去更改packagejson中的信息（比如项目名称）；之后我们就可以自动帮助用户去下载依赖，install方法主要就是通过node去运行安装的命令，这里非常简单，就不做过多描述。

而这里的chalk依赖主要是帮助我们去做命令行上的一些色彩显示，比如警告，错误，成功，我们都可以去打印出好看好玩的颜色，让整个命令行的ui变得高大上。
ora这个依赖则帮助我们去做了loading，以及关键文案的提示。

这样我们就完成了一个带有拉取模板功能的命令行工具，我们再次运行create命令，就能正常运行了。

## 上传之前的准备

在文章的开始我们提到了一个小故事，并且总结了几个开发的问题，我们开发完毕的命令行工具仅仅解决了初始化项目时间成本的问题，但是剩余的三个问题一个也没得到解决，而这一part才是真正实用的东西，在开始我们安装了非常多的依赖，比如eslint以及husky，lint-staged等等，我们这一part主要就是使用这几个依赖打造一个标准的git提交流程，让多人协作变得稳重和统一。

而我们刚刚使用的命令行工具，其中拉取的模板，也同样是这样的校验流程。

我们先从大家最熟悉的eslint开始配置，eslint的配置其实每个团队有自己的方案，但是大多数默认还是用eslint官方的默认配置，所以我这就不做过多花里胡哨的配置。

**.eslintrc.js**

```ts
module.exports = {
  root: true,
  env: { browser: true, node: true },
  parser: \'@typescript-eslint/parser\',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: \'module\'
  },
  plugins: [\'@typescript-eslint\'],
  extends: [\'plugin:@typescript-eslint/recommended\', \'plugin:prettier/recommended\'],
  rules: {
    // 支持ts-ignore
    \'@typescript-eslint/ban-ts-ignore\': \'off\',
    \'@typescript-eslint/no-var-requires\': 0
  }
};
```

这是一个相对标准的ts工程的eslint，非常适合我们命令行项目，所以我就直接拿过来用了。

> 这个工程我们需要注意，我们在之后会用到prettier这个美化插件，我们这边配置的extends中有 plugin:prettier/recommended ，因为可能eslint和prettier有冲突，我们这里以prettier为优先，所以不要动它们两个插件的引用顺序。

**.eslintignore**

```shell
node_modules
dist
```

在现有的package.json中我们也写入了一个命令

```json
\"lint\": \"eslint \'src/**/*\' --fix\",
```

这个时候我们尝试一下运行命令，它就能帮助我们自动校验以及fix修复。

除此之外我们在package.json中还定义了一个prettier命令，我们直接运行，就可以发现所有的代码都被美化了格式了。

我们同样可以定义prettier的配置文件以及ignore

**.prettierrc**

```json
{
  \"singleQuote\": true,
  \"trailingComma\": \"none\",
  \"printWidth\": 160,
  \"tabWidth\": 2,
  \"tabs\": false,
  \"semi\": true,
  \"quoteProps\": \"as-needed\",
  \"bracketSpacing\": true,
  \"jsxBracketSameLine\": true,
  \"htmlWhitespaceSensitivity\": \"ignore\",
  \"useTabs\": false,
  \"jsxSingleQuote\": false,
  \"arrowParens\": \"always\",
  \"rangeStart\": 0,
  \"proseWrap\": \"always\",
  \"endOfLine\": \"lf\"
}
```

**.prettierignore**

```shell
dist/
node_modules
*.log
```

这个时候你可能会问，不仅仅是代码，我们团队不同的ide，空格和tab等等都有差异这该怎么办? 我们可以在根目录定义

**.editorconfig**

```shell
# Editor configuration, see http://editorconfig.org

# 表示是最顶层的 EditorConfig 配置文件
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

我们可以通过这个小小文件来约束每一个编辑器编写出来的代码特征，甚至在个别ide，我们可以去做自定义的配置，比如说vscode，我可以在根目录新建

**.vscode/settings.json**

```json
{
  \"npm-scripts.showStartNotification\": false,
  \"editor.defaultFormatter\": \"esbenp.prettier-vscode\",
  \"typescript.preferences.importModuleSpecifier\": \"relative\",
  \"editor.codeActionsOnSave\": {
    \"source.fixAll.eslint\": true
  }
}
```

这个配置完成之后，我们可以用到里面一个很实用的功能，就是保存自动eslint fix修复，我们再回到vscode里面，就不用每次保存都需要手动格式化代码啦。

我们现在已经完成了代码统一和美化，以及ide的统一的工作了，现在应该要着手git了，我们在项目提交git之前，需要做一次lint+prettier确保远程仓库的代码统一标准。

那么如何去在提交之前去做校验逻辑呢？husky就可以帮助我们做到这些，我们尝试运行这个命令:

```shell
1. husky install
2. npx husky add .husky/pre-commit \"npm run lint-staged\"
```

执行完毕之后会在根目录出现一个husky文件夹，其中有一个pre-commit的文件，在这个shell中我们可以看到npm run lint-staged的命令

而在文章开始的package.json中就已经定义好了这一段代码:

```json
\"lint-staged\": {
    \"*.{ts,js,json,markdown}\": [
      \"prettier --write\",
      \"eslint --fix\",
      \"git add\"
    ]
  },
```

那么lint-staged是什么呢？我们在工程中，通过husky拦截到了git的commit事件，这个时候如果进行一次lint和美化那么是全局意义上的操作，这是非常耗费时间和性能的，所以我们只需要对git的暂存区的文件做lint就可以了，而lint-staged就可以帮助我们去对暂存区的文件进行一系列操作的工具。我们在package.json中就定义了如果暂存区的文件是ts,js,json,markdown的话就要依次执行下面的三个命令。

那么到这里为止，我们的代码就开发完毕了，我们已经成功的完成了自动校验，以及拦截，美化，ide统一/加强。我们开发的命令行工具虽然只有一个拉取模板的小功能但是确实解决了大部分团队的痛点问题，文章开头提到的问题也一一得到了解决。但是我觉得还不够，要在上一点好玩的东西....

## GithubAction自动发布到NPM

我们开发出来的命令行工具势必要发布在npm中的，或者是你们团队npm私库都是要易于管理。所以我们将这个工程新建一个dev分支，我们在dev上面开发，当合并到master之后，就自动触发一个action，帮助我们自动发布...

但是在准备之前我们需要在工程的根目录新建

**.npmignore**

```shell
src/
etsc.config.js
tsconfig.json
nodemon.json
typeings/
.*
```

我们把相关ts，开发文件进行屏蔽。

接着我们去写workflows (新建)

**.github/workflows/npm-publish.yml**

```yml
name: npm-publish
on:
  push:
    branches:
      - master # Change this to your default branch
jobs:
  npm-publish:
    name: npm-publish
    runs-on: ubuntu-latest
    steps:
      - name: 切换仓库
        uses: actions/checkout@master
      - name: 准备Node环境
        uses: actions/setup-node@master
        with:
          node-version: 12.13.0
      - name: 安装依赖以及编译
        run: npm i && npx etsc
      - name: 推送到NPM
        uses: JS-DevTools/npm-publish@v1
        with:
          token: ${{ secrets.NPM_AUTH_TOKEN }}
```

我们推送到NPM用到了JS-DevTools/npm-publish@v1这个action，这个action好像是最火的推送npm的action，使用方式也非常的简单。我们只需要把本地的package.json的version管理好就可以了，然后我们需要去npm官网，去新建一个token:

![WX20210905-195041.png](https://static.yinzhuoei.com/typecho/2021/09/05/426533782955431/WX20210905-195041.png)

生成之后的token我们拿到存此工程的仓库去设置：

![WX20210905-195236.png](https://static.yinzhuoei.com/typecho/2021/09/05/427922656999802/WX20210905-195236.png)

生成的token名称就是: **NPM_AUTH_TOKEN**

这个时候我们把代码提交到master主分支，就可以发现action已经在运行了，稍等片刻就已经构建完成了。然后npm的包也发布了～

![WX20210905-195458.png](https://static.yinzhuoei.com/typecho/2021/09/05/429073268310925/WX20210905-195458.png)

[enjoy-project-tool npm包](https://www.npmjs.com/package/enjoy-project-tool)

## 结束

这篇文章说实话算水文了，用到的技术也很简单，希望如果团队还没有这种东西的话就自己着手尝试一下，这个东西很简单，顶多一个早晨的时间就写完了，但是能换来团队很大的便利，这就很值得了。抛砖引玉，我估计有很多用在线的校验平台，其实道理都差不多，我们今天写的这个算是丐版（但是我依然觉得做本地的校验非常有必要）。我把tool和对应的项目模板开源了，会一直维护这个项目。不管是公司用还是自己用，都是非常方便（嘻嘻）

关注公众号老铁们，求你们了～～

---
title: "Building a CLI Tool for Small Frontend Teams with TypeScript + Etsc"
description: "A practical guide to building an efficient project scaffolding and linting CLI tool for small frontend teams using TypeScript, Etsc, Commander, Husky, and GitHub Actions."
date: 2021-09-05
lang: en
translationKey: "2021-09-05_573_开发一个适合小微前端团队的命令行工具（TypeScript + Etsc）"
categories:
  - "Frontend"
views: 6484
draft: false
---

![扫码_搜索联合传播样式-白色版.png](https://static.yinzhuoei.com/typecho/2021/09/05/435632711743942/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E7%99%BD%E8%89%B2%E7%89%88.png)

[Original Link](https://www.yinzhuoei.com/index.php/archives/573/)

## A Fictional Story (doge)

Imagine a small frontend team of fewer than 10 developers collaborating on the same project;

The tech lead says: "Xiao Ming, let's use Vue 3 this time. Go ahead and scaffold the project!"

It's Xiao Ming's first time working with Vue 3, but being a seasoned dev, he doesn't panic at all. Following the official documentation step-by-step, he initializes the scaffolding, adds various dependencies, and copies over utility code from previous Vue 2 or other projects.

A day passes...

Xiao Hong pulls the latest scaffolded code and opens WebStorm; Xiao Lan opens Sublime; Xiao Zi opens VS Code. A few weeks later, the lead checks the repository and discovers that Xiao Hong, Xiao Zi, and Xiao Lan have wildly divergent code styles and architecture patterns. Code sprawls across the repo with zero consistency, and duplicate components and utility functions pop up everywhere. As weeks of iterations continue, it steadily degenerates into a "pile of crap". As the team grows, the codebase becomes even more messy.

---

## Introduction

Ever since I graduated and started working, I've worked extensively with small teams, and this scenario is actually very common. However, due to time constraints and other reasons, I never had the chance to bring over the tech stack from my open-source projects. Last week, things finally slowed down a bit, so I prepared two projects to tackle common pain points for small teams at minimal cost—all in a single package. Before diving in, let's list the core issues:

1. Inconsistent development tools (IDEs)
2. Inconsistent code formatting and aesthetics
3. Excessive prep work needed to initialize a project
4. Slow tech stack iteration

In this article, we'll mainly discuss two repositories:

[enjoy-project-tool repository](https://github.com/seho-code-life/project_tool)
[enjoy-project-template repository](https://github.com/seho-code-life/project_template)

The CLI tool's primary purpose is pulling our project templates. While that might seem mundane, there are still a few subtle details worth explaining for folks building a CLI for the first time. As for the project templates, the README in the open-source repo already provides extensive introductions and usage instructions, so I won't rehash them here.

You can read through the complete code while coding along.

## Getting Started

Using Node.js to develop a CLI tool is the most developer-friendly approach for frontend engineers. We can directly execute our JavaScript files via Node. So let's run `npm init` in a new project and adjust our `package.json`:

```json
{
  "name": "enjoy-project-tool",
  "version": "1.0.0",
  "description": "",
  "main": "dist/main.js",
  "scripts": {
    "run": "nodemon",
    "lint": "eslint 'src/**/*' --fix",
    "prettier": "prettier --write '**/*.{ts,js,json,markdown}'",
    "lint-staged": "lint-staged",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "lint-staged": {
    "*.{ts,js,json,markdown}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  },
  "bin": {
    "enjoy": "dist/main.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^8.1.0",
    "download-git-repo": "^3.0.2",
    "inquirer": "^8.1.2",
    "ora": "^5.4.1"
  },
  "devDependencies": {
    "@types/inquirer": "^7.3.3",
    "@types/node": "^16.7.10",
    "@typescript-eslint/eslint-plugin": "^4.30.0",
    "@typescript-eslint/parser": "^4.30.0",
    "esbuild-node-tsc": "^1.6.1",
    "eslint": "^7.32.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^4.0.0",
    "husky": "^7.0.2",
    "lint-staged": "^11.1.2",
    "nodemon": "^2.0.12",
    "prettier": "^2.3.2",
    "typescript": "^4.4.2"
  }
}
```

Let's break down the tech stack we're using to build this CLI tool:

First, we need TypeScript, using `esbuild-node-tsc` (ETSC for short) to compile our TS code;
Second, we use `husky`, `lint-staged`, and `eslint` to validate our code before git commits;
`prettier` is mainly for code beautification and formatting;
`nodemon` provides automatic compilation during development and debugging.

If you aren't very familiar with the tech stack above, don't worry. We will cover them when explaining the implementation details.

To build a CLI tool, we need to expose a JS file to Node. We can place this file in the `dist` directory and define a command name so that the Node environment can locate and run the corresponding JS file. So we add this line to `package.json`:

```json
"bin": {
    "enjoy": "dist/main.js"
  },
```

Then we can invoke our program in the terminal with:

```shell
enjoy
```

All we need to do is compile our TS code into the `dist` directory, and we're good to go!

## Hello World

Out of personal preference, I placed the `main.ts` file under the `src` directory and wrote the following code:

```shell
#!/usr/bin/env node

console.log("hello world")
```

> `#!/usr/bin/env node`: This shebang line is mandatory so the system executes the code with Node.

Now we need to configure TS and ETSC. Create **tsconfig.json** in the root directory:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "CommonJS",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "typeRoots": ["./node_modules/@types", "./typings"]
  },
  "include": ["./src/*.ts"]
}
```

In this config file, we need to pay attention to `include`, `target`, `module`, `outDir`, and `typeRoots`:

```
include: directory containing TS files
target: TS compilation target version (es6/es5...)
module: compiled module format (ESM or CJS; here we choose CJS)
outDir: output directory for JS files
typeRoots: directory where type declarations are stored; we'll define our types under typings shortly
```

TypeScript comes with `tsc` to compile TS files, but we choose `etsc` simply because it's much faster. `etsc` works out of the box based on the `tsconfig.json` in your root directory. However, we also want it to minify the compiled code, so we need extra configuration in **etsc.config.js**:

```js
module.exports = {
  esbuild: {
    minify: true
  }
};
```

Now run the `etsc` command in the project root, and you'll see a `dist` folder generated containing `main.js`. We can run it with Node.js.

In the terminal, run:

```shell
npm link
```

> The `npm link` command symlinks your project globally on your machine, making debugging convenient without having to install it repeatedly.

Now if we run `enjoy` in the terminal:

The console prints our "hello world"!

## Optimizing the Developer Experience

We've successfully printed hello world, but having to run `etsc` manually every time we edit `main.ts` gets tedious. So we use `nodemon` to watch file edits and trigger the `etsc` command automatically. Create a **nodemon.json** in the root directory:

```json
{
  "watch": ["src/*"],
  "ext": "ts",
  "exec": "etsc",
  "legacyWatch": true
}
```

Then in `package.json` we already added the script command:

```shell
"run": "nodemon",
```

Execute:

```shell
npm run run
```

Now the nodemon service is running. Whenever we edit `main.ts`, nodemon automatically executes `etsc`, compiling files straight to `dist`. Then we can seamlessly test the latest results in the terminal (once linked via `npm link`, you don't need to run it again).

## Core Feature Development

The `commander` library is the go-to tool for building CLI apps in Node.js. We can use it to handle command routing, options, and more. In `main.ts`, we can write:

```ts
#!/usr/bin/env node

// CLI
import { program } from 'commander';

program
  .command('create')
  .description('create template')
  .action(async () => {
    // Callback
    console.log("callback executed");
  });

program.parse(process.argv);
```

`program` also supports CLI `--version`. I won't elaborate on that here; check the official documentation for details.

Running `enjoy` outputs:

![1630837375700.jpg](https://static.yinzhuoei.com/typecho/2021/09/05/373933331437505/1630837375700.jpg)

Commander helps us generate the essentials. We can directly run `enjoy create` to trigger the callback we just registered.

Since this CLI tool supports template scaffolding, it's best to extract the `create` logic into a separate TS file.

Refactored code:

```ts
program
  .command('create')
  .description('create template')
  .action(async () => {
    await import('./create.js');
  });

program.parse(process.argv);
```

Content of the new `create.ts`:

```ts
#!/usr/bin/env node

import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs';
import { exec } from 'child_process';
import download from 'download-git-repo';
import chalk from 'chalk';

const spinner = ora('Downloading template, please wait...');

// Template registry
const template: { name: string; value: string }[] = [\
  {\
    name: 'vue3-vite2-ts-template (ant-design-vue) template docs: https://github.com/seho-code-life/project_template/tree/vue3-vite2-ts-template(release)',\
    value: 'seho-code-life/project_template#vue3-vite2-ts-template(release)'\
  },\
  {\
    name: 'node-command-ts-template                 template docs: https://github.com/seho-code-life/project_template/tree/node-command-cli',\
    value: 'seho-code-life/project_template#node-command-cli'\
  }\
];

// Install project dependencies
const install = (params: { projectName: string }) => {\
  const { projectName } = params;\
  spinner.text = 'Installing dependencies... If your connection is slow, this might take a moment.';\
  // Execute install\
  exec(`cd ${projectName} && npm i`, (error, stdout, stderr) => {\
    if (error) {\
      console.error(`exec error: ${error}`);\
      return;\
    } else if (stdout) {\
      spinner.text = `Installed successfully. Enter ${projectName} and start coding!`;\
      spinner.succeed();\
    } else {\
      spinner.text = `Automatic installation failed. Please check errors and install dependencies manually.`;\
      spinner.fail();\
      console.error(stderr);\
    }\
  });\
};

// Update package.json of downloaded template
const editPackageInfo = (params: { projectName: string }) => {\
  const { projectName } = params;\
  // Get project path\
  const path = `${process.cwd()}/${projectName}`;\
  // Read project's package.json\
  fs.readFile(`${path}/package.json`, (err, data) => {\
    if (err) throw err;\
    // Parse json and update project name and version\
    const _data = JSON.parse(data.toString());\
    // Update package name\
    _data.name = projectName;\
    const str = JSON.stringify(_data, null, 4);\
    // Write back to file\
    fs.writeFile(`${path}/package.json`, str, function (err) {\
      if (err) throw err;\
    });\
    spinner.text = `Download complete, automatically installing dependencies...`;\
    install({ projectName });\
  });\
};

// Download template
const downloadTemplate = (params: { repository: string; projectName: string }) => {\
  const { repository, projectName } = params;\
  download(repository, projectName, (err) => {\
    if (!err) {\
      editPackageInfo({ projectName });\
    } else {\
      console.log(err);\
      spinner.stop(); // Stop spinner\
      console.log(chalk.red('An unexpected error occurred while pulling the template'));\
    }\
  });\
};

// Define question prompts
const questions = [\
  {\
    type: 'input',\
    name: 'projectName',\
    message: 'Project folder name:',\
    validate(val?: string) {\
      if (!val) {\
        // Validate input\
        return 'Please enter a folder name';\
      }\
      if (fs.existsSync(val)) {\
        // Check if directory already exists\
        return 'Directory already exists';\
      } else {\
        return true;\
      }\
    }\
  },\
  {\
    type: 'list',\
    name: 'template',\
    choices: template,\
    message: 'Please choose a template to pull:'\
  }\
];

inquirer.prompt(questions).then((answers) => {\
  // Retrieve answers\
  const { template: templateUrl, projectName } = answers;\
  spinner.start();\
  spinner.color = 'green';\
  // Start downloading template\
  downloadTemplate({\
    repository: templateUrl,\
    projectName\
  });\
});
```

`inquirer` helps prompt users for interactive CLI input and selection. Before prompting, we define an array called `questions`. The template contents are stored in a [public repository](https://github.com/seho-code-life/project_template) (different templates live on different branches), and we download them via `download-git-repo`. After downloading the template via this package, we invoke `editPackageInfo` to update information in `package.json` (such as the project name). Then we can automatically install project dependencies for the user. The `install` method simply executes the install command via Node; it's straightforward, so we won't dwell on it.

`chalk` helps add color formatting to the terminal output (warnings, errors, success messages), giving the CLI a polished, attractive UI.
`ora` provides elegant loading spinners and status prompts.

With this, we've completed a CLI tool that scaffolds templates. Running the `create` command now works as expected.

## Preparing for Release

At the start of the article, we shared a little story and outlined several frontend pain points. The CLI tool we just built only solves the initial project setup cost, while the other three issues remain unaddressed. This section is where the real value lies. Earlier we installed several dependencies such as `eslint`, `husky`, and `lint-staged`. Here we use them to construct a standardized Git commit workflow, ensuring team collaboration stays consistent and reliable.

The templates downloaded by our CLI tool also use this exact validation workflow.

Let's start by configuring ESLint. While every team has its own preferences, most follow the official ESLint defaults, so we won't add unnecessary bloat here.

**.eslintrc.js**

```ts
module.exports = {
  root: true,
  env: { browser: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    // Support ts-ignore
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-var-requires': 0
  }
};
```

This is a fairly standard ESLint configuration for TypeScript projects, perfectly suited for our CLI project, so we can use it directly.

> Note on this project: We will use Prettier later for code formatting. In `extends`, we include `plugin:prettier/recommended`. To avoid conflicts between ESLint and Prettier, Prettier takes precedence, so do not alter the order of these two plugins.

**.eslintignore**

```shell
node_modules
dist
```

In `package.json`, we also added a script command:

```json
"lint": "eslint 'src/**/*' --fix",
```

Try running this command, and it will automatically validate and fix issues for us.

In addition, we defined a `prettier` command in `package.json`. Running it formats and beautifies all our code.

We can likewise define Prettier's configuration file and ignore file:

**.prettierrc**

```json
{
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 160,
  "tabWidth": 2,
  "tabs": false,
  "semi": true,
  "quoteProps": "as-needed",
  "bracketSpacing": true,
  "jsxBracketSameLine": true,
  "htmlWhitespaceSensitivity": "ignore",
  "useTabs": false,
  "jsxSingleQuote": false,
  "arrowParens": "always",
  "rangeStart": 0,
  "proseWrap": "always",
  "endOfLine": "lf"
}
```

**.prettierignore**

```shell
dist/
node_modules
*.log
```

At this point, you might wonder: what about differences across different team IDEs, tabs vs spaces, etc.? We can define this at the root directory:

**.editorconfig**

```shell
# Editor configuration, see http://editorconfig.org

# Topmost EditorConfig file
root = true

[*] # Applies to all files
charset = utf-8 # Character set utf-8
indent_style = space # Indentation style (tab | space)
indent_size = 2 # Indent size
end_of_line = lf # Line ending style (lf | cr | crlf)
trim_trailing_whitespace = true # Trim trailing whitespace
insert_final_newline = true # Insert newline at EOF

[*.md] # Rules specific to markdown files
max_line_length = off
trim_trailing_whitespace = false
```

Through this small file, we standardize code formatting rules across different editors. We can even add custom configurations for specific IDEs like VS Code (`.vscode/settings.json`):

**.vscode/settings.json**

```json
{
  "npm-scripts.showStartNotification": false,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

With this set up, saving a file triggers ESLint automatic fixes, so we don't need to manually reformat code every time.

Now that we've unified code style, formatting, and IDE settings, let's address Git. Before committing code, we should run lint + prettier to ensure the remote repository adheres to uniform standards.

How can we run checks prior to commits? `husky` enables this seamlessly. Run:

```shell
1. husky install
2. npx husky add .husky/pre-commit "npm run lint-staged"
```

This creates a `.husky` directory with a `pre-commit` hook containing `npm run lint-staged`.

And in `package.json`, we already configured:

```json
"lint-staged": {
    "*.{ts,js,json,markdown}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  },
```

What is `lint-staged`? Through Husky, we intercept Git's commit event. Running lint and formatting across the entire project at this point would be slow and inefficient. We only need to lint staged files in Git, and `lint-staged` allows us to run tasks specifically against staged files. In `package.json`, we specified that any staged `.ts`, `.js`, `.json`, or `.markdown` files will run prettier, eslint --fix, and git add.

Now our code implementation is complete: automated validation, Git pre-commit interception, code formatting, and unified IDE tooling. Although our CLI tool only has a small template-pulling feature, it directly addresses common team friction points. But why stop there? Let's add something even more fun...

## Automated NPM Publishing with GitHub Actions

The CLI tool we built will ultimately be published to NPM (or your team's private registry) for easy version management. Let's create a `dev` branch for development, and whenever code merges into `master`, trigger an Action to automatically publish to NPM...

First, create this file in the root directory:

**.npmignore**

```shell
src/
etsc.config.js
tsconfig.json
nodemon.json
typeings/
.*
```

We exclude TS source files and dev configs from the published package.

Next, configure the workflow:

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
      - name: Checkout repository
        uses: actions/checkout@master
      - name: Set up Node environment
        uses: actions/setup-node@master
        with:
          node-version: 12.13.0
      - name: Install dependencies and compile
        run: npm i && npx etsc
      - name: Publish to NPM
        uses: JS-DevTools/npm-publish@v1
        with:
          token: ${{ secrets.NPM_AUTH_TOKEN }}
```

For publishing to NPM, we use `JS-DevTools/npm-publish@v1`, one of the most popular and straightforward actions for NPM publishing. We only need to keep `version` in `package.json` properly bumped. Then generate a token on npmjs.com:

![WX20210905-195041.png](https://static.yinzhuoei.com/typecho/2021/09/05/426533782955431/WX20210905-195041.png)

Store the generated token in the GitHub repository secrets:

![WX20210905-195236.png](https://static.yinzhuoei.com/typecho/2021/09/05/427922656999802/WX20210905-195236.png)

Name the token secret: **NPM_AUTH_TOKEN**.

Now when we push code to `master`, the Action runs, builds the project, and publishes the package to NPM!

![WX20210905-195458.png](https://static.yinzhuoei.com/typecho/2021/09/05/429073268310925/WX20210905-195458.png)

[enjoy-project-tool npm package](https://www.npmjs.com/package/enjoy-project-tool)

## Conclusion

Truth be told, this article covers relatively simple techniques. But if your team doesn't have tooling like this in place yet, it's definitely worth spending a morning setting it up. It takes very little time to build, yet brings tremendous consistency and convenience to the entire team. There are also online verification platforms and CI pipelines that serve similar purposes, but having local pre-commit checks is still essential. I've open-sourced both the tool and the template repositories and will continue maintaining them. Whether used for company projects or personal setups, they're super handy!

Feel free to follow and star if you find it helpful!

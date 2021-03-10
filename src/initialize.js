const process = require("process");
const { exec } = require("child_process");
const ora = require("ora");
const chalk = require("chalk");
const path = require("path");

let projectName = "";

/**
 * 初始化模版项目
 * @param {string} name 项目名
 */
const initTemplate = (name) => {
  const projectPath = path.join(process.cwd(), name);
  projectName = name;
  process.chdir(projectPath);
  gitInit();
  npmInstall();
};

// 初始化git仓库
const gitInit = () => {
  const gitInitSpinner = ora(
    `cd ${chalk.green.bold(projectName)} 目录, 执行 ${chalk.green.bold(
      "git init"
    )}`
  );
  gitInitSpinner.start();

  const subProcess = exec("git init");

  subProcess.on("close", (code) => {
    if (+code === 0) {
      gitInitSpinner.color = "green";
      gitInitSpinner.succeed(subProcess.stdout.read());
    } else {
      gitInitSpinner.color = "red";
      gitInitSpinner.fail(subProcess.stderr.read());
    }
  });
};

// 安装依赖
const npmInstall = () => {
  const installSpinner = ora(
    `正在执行${chalk.green.bold("npm install")} 安装项目依赖中, 请稍后...`
  );
  installSpinner.start();
  exec("npm install", (error, stdout, stderr) => {
    if (error) {
      installSpinner.color = "red";
      installSpinner.fail(
        chalk.red("安装项目依赖失败，请手动执行 npm install 重新安装😭")
      );
      console.log(error);
    } else {
      installSpinner.color = "green";
      installSpinner.succeed("安装成功");
      console.log(chalk.green("创建项目成功！"));
      console.log(chalk.green("输入npm run serve启动项目"));
    }
  });
};

module.exports = initTemplate;

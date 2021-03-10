const path = require("path");
const process = require("process");
const ora = require("ora");
const download = require("download-git-repo");
const chalk = require("chalk");
const fse = require("fs-extra");
const constants = require("./constants");
const initTemplate = require("./initialize");
const {
  readdirSync,
  injectTemplate,
  commitEdit,
  logFileInfo,
} = require("./util");

/**
 * 下载模版
 * @param {string} projectName 项目名
 * @param {object} option 选项
 * @param {object} config 配置
 */
const getTemplate = (projectName, option, config) => {
  projectName = projectName || option.projectName;
  const projectPath = path.join(process.cwd(), projectName);
  const downloadPath = path.join(projectPath, "cli_download");

  const { gitUrl } = config;
  const { template } = option;

  const spinner = ora("正在从远程git仓库下载template");
  spinner.start();

  const sourcePath = `direct:${gitUrl}${template}`;

  // 开始下载模版
  download(sourcePath, downloadPath, { clone: true }, (err) => {
    if (err) {
      spinner.color = "red";
      spinner.fail(`${chalk.red("请检查git地址是否正确?😅")}`);
      return;
    }
    spinner.color = "green";
    spinner.succeed("下载成功");

    const { INJECT_FILES } = constants;

    const copyFiles = readdirSync(downloadPath, INJECT_FILES); // 读取要复制的文件

    // 将从仓库下载的模版文件复制到项目目录，并输出文件列表、文件大小等信息
    copyFiles.map((file) => {
      fse.copySync(path.join(downloadPath, file), path.join(projectPath, file));
      logFileInfo("创建", file, projectPath);
    });

    INJECT_FILES.map((file) => {
      injectTemplate(
        path.join(downloadPath, file),
        path.join(projectName, file),
        { ...option }
      );
    });

    // 提交注入
    commitEdit(() => {
      INJECT_FILES.map((file) => {
        logFileInfo("创建", file, projectPath);
        // 删除下载文件cli_download
        fse.remove(downloadPath);

        // 初始化模版项目
        initTemplate(projectName);
      });
    });
  });
};

module.exports = getTemplate;

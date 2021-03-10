const inquirer = require("inquirer");
const fse = require("fs-extra");
const chalk = require("chalk");
const getTemplate = require("./download");
const constants = require("./constants");

module.exports = (projectName) => {
  let prompts = [];

  if (!fse.existsSync(constants.getConfigPath())) {
    console.log(
      `${chalk.red(
        constants.getConfigPath()
      )} 路径下不存在配置文件 ${chalk.greenBright(".zizrc")}`
    );
    console.log(
      `${chalk.cyanBright(
        "本脚手架通过配置文件动态拉取模版，请创建配置文件哦"
      )}`
    );
    return;
  }
  try {
    const buf = fse.readFileSync(constants.getConfigPath());
    const config = JSON.parse(buf.toString());

    const { templateList } = config;

    if (!projectName || fse.existsSync(projectName)) {
      if (!projectName) console.log(`${chalk.red("项目名不能为空")}`);
      else console.log(`${chalk.red(projectName)} 已经存在，请重新输入项目名`);

      prompts.push({
        type: "input",
        name: "projectName",
        message: "项目名:",
        validate(input) {
          if (!input) {
            return `${chalk.red("项目名不能为空")}`;
          }
          if (fse.existsSync(input)) {
            return `${chalk.red(input)} 已经存在，请重新输入项目名`;
          }
          return true;
        },
      });
    }

    // 项目描述
    prompts.push({
      type: "input",
      name: "description",
      message: "项目描述:",
    });

    // 选择模板
    prompts.push({
      type: "list",
      message: "选择模版:",
      name: "template",
      choices: Object.keys(templateList).map((templateName) => {
        return { name: templateName, value: templateList[templateName] };
      }),
    });

    inquirer.prompt(prompts).then((answer) => {
      // 进入下载模版逻辑
      getTemplate(projectName, answer, config);
    });
  } catch (err) {
    console.log(err);
  }
};

const fse = require("fs-extra");
const memFs = require("mem-fs");
const editor = require("mem-fs-editor");
const chalk = require("chalk");
const path = require("path");

// memFs 修改文件，并按照ejs进行解析
const store = memFs.create();
let memFsEditor = editor.create(store);

/**
 * 同步读取目录
 * @param {string} dir 目录
 * @param {array} exclude 排除指定文件列表
 */
function readdirSync(dir, exclude) {
  try {
    const files = fse.readdirSync(dir);
    const res = [];
    files.map((file) => {
      let isExclude = false;
      exclude.map((item) =>
        file.indexOf(item) !== -1 ? (isExclude = true) : null
      );
      !isExclude && res.push(file);
    });
    return res;
  } catch (err) {
    console.log(err);
    return [];
  }
}

/**
 * 解析模版 并注入上下文
 * @param {string} source 源目录
 * @param {string} dest 目标目录
 * @param {object} ctx ejs模版上下文
 */
function injectTemplate(source, dest, ctx) {
  memFsEditor.copyTpl(source, dest, ctx);
}

/**
 * 提交对模版的修改
 * @param {function} callback
 */
function commitEdit(callback) {
  memFsEditor.commit(() => {
    callback();
  });
}

/**
 * 格式化输出文件信息
 * @param {string} action 操作 e.g 创建
 * @param {string} file 文件名
 * @param {string} filePath 文件路径
 */
function logFileInfo(action, file, filePath) {
  const state = fse.statSync(path.join(filePath, file));

  let output = `${action}${filePath}/${file}`.padEnd(100, "\040\040\040\040");

  console.log(
    `${chalk.green("✔ ")}${chalk.green(`${output}`)}${(
      state.size / 1024
    ).toFixed(2)} KiB`
  );
}

module.exports = {
  readdirSync,
  injectTemplate,
  commitEdit,
  logFileInfo,
};

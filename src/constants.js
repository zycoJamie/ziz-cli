const os = require("os");
_CONFIG_PATH = `${os.homedir}/Desktop/.zizrc`;

INJECT_FILES = ["package.json"]; // 需要ejs解析，并注入上下文的文件列表

module.exports = {
  // 获取配置路径
  getConfigPath() {
    return _CONFIG_PATH;
  },
  // 设置配置路径
  setConfigPath(path) {
    _CONFIG_PATH = path;
  },
  INJECT_FILES,
};

#! /usr/bin/env node

const program = require("commander");

const createAction = require("./create-action");
const configAction = require("./config-action");

// 创建命令

// ziz create
program
  .usage("<command> [options]")
  .command("create [name]")
  .action(createAction);


// ziz config -r
program
  .command("config")
  .option("-r, --register", "register your config file, typing your file path")
  .action(configAction);

program.parse(process.argv);

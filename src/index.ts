#!/usr/bin/env ts-node
import { program } from "commander";
import { name, version } from "@@/package.json";

import { test_command } from "@/actions/test_command";
import { create_config_file } from "@/actions/create_config_file";


program
  .usage(name)
  .version(version)

program
  .command("init")
  .description("创建运行时配置文件")
  .action(create_config_file);

program
  .command("test")
  .description("这是测试命令")
  .action(test_command);

program.parse();
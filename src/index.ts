import { program } from "commander";

import { testCommand } from "@/actions/testCommand";
import { createConfigFile } from "@/actions/createConfigFile";

import { name, version } from "../package.json";

program
  .usage(name)
  .version(version)

program
  .command("init")
  .description("创建运行时配置文件")
  .action(createConfigFile);

program
  .command("test")
  .description("这是测试命令")
  .action(testCommand);

program.parse();
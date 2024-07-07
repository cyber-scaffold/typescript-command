import { Command } from "commander";
import { yellow, magenta, red } from "colors";

import { IOCContainer } from "@/commons/Application/IOCContainer";
// import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

import { TestProcessService } from "@/services/TestProcessService";

// export const test_command_argument=new Argument("<actions>","动作类型描述").choices(["init","info"]);
// export const test_command_option=new Option("-t,--test_option <string>").default("test_option_value");

/** 这个方法用户在命令行上注册调用句柄 **/
export async function definition(program: Command) {
  program
    .command("test")
    .description(magenta("这是测试命令"))
    .addHelpText("after", yellow([
      "",
      "Example call:",
      "  command 1",
      "  command 2",
      " "
    ].join("\n")))
    .action(async () => {
      /** 创建请求级别的作用域 **/
      await IOCContainer.get(TestProcessService).execute();
    });
  return true;
};
import { Command } from "commander";
import { yellow, magenta, red } from "colors";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/commons/Application/IOCContainer";
import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";
import { TransientService } from "@/services/TransientService";

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
      const testController = IOCContainer.get(TestController);
      await testController.execute();
    });
  return true;
};

@injectable()
export class TestController {

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager,
    @inject(TransientService) private readonly transientService: TransientService
  ) { };

  public async execute(params?: any): Promise<any> {
    await this.transientService.execute();
  };

};
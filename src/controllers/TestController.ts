import { Command } from "commander";
import { injectable, inject } from "inversify";
import { CommandControllerInterface } from "@/commons/Interfaces/CommandControllerInterface";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";
import { MainServices } from "@/services/MainServices";

// export const test_command_argument=new Argument("<actions>","动作类型描述").choices(["init","info"]);
// export const test_command_option=new Option("-t,--test_option <string>").default("test_option_value");

@injectable()
export class TestController implements CommandControllerInterface {

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager,
    @inject(MainServices) private readonly mainServices: MainServices
  ) { };

  /** 这个方法用户在命令行上注册调用句柄 **/
  public async definition(program: Command) {
    program
      .command("test")
      .description("这是测试命令")
      .action(async () => {
        await this.execute();
      });
    return true;
  };

  public async execute(params?: any): Promise<any> {
    await this.mainServices.execute();
  };

};
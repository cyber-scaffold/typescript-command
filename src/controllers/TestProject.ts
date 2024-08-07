import { Command } from "commander";
import { yellow, magenta, red } from "colors";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/commons/Application/IOCContainer";

import { TestService } from "@/services/TestService";


/** 这个方法用户在命令行上注册调用句柄 **/
export async function definition(rootCommand: Command) {
  rootCommand
    .command("project")
    .description(magenta("测试具体的项目"))
    .addHelpText("after", yellow([
      "",
      "Example call:",
      "  command test project",
      " "
    ].join("\n")))
    .action(async () => {
      await IOCContainer.get(TestProject).execute();
      return process.exit(0);
    });
  return true;
};


@injectable()
export class TestProject {

  constructor(
    @inject(TestService) private readonly $TestService: TestService
  ) { };

  public async execute() {
    this.$TestService.execute();
  };

};

IOCContainer.bind(TestProject).toSelf().inRequestScope();
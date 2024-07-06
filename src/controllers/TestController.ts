import { Command } from "commander";
import { yellow, magenta, red } from "colors";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/commons/Application/IOCContainer";
// import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

import { SessionInfoService } from "@/services/SessionInfoService";
import { TransientFactoryServiceFactory, TransientFactoryServiceProvider } from "@/services/TransientFactoryService";

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
      const requestScopeContainer = IOCContainer.createChild();
      /** 在独立的请求级别作用域上绑定控制器处理 **/
      requestScopeContainer.bind(ControllerProcess).toSelf().inSingletonScope();
      /** 执行处理 **/
      const controllerProcess = requestScopeContainer.get(ControllerProcess);
      await controllerProcess.execute();
    });
  return true;
};

@injectable()
export class ControllerProcess {

  constructor(
    // @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager,
    @inject(SessionInfoService) private readonly sessionInfoService: SessionInfoService,
    @inject(TransientFactoryServiceFactory) private readonly transientFactoryServiceProvider: TransientFactoryServiceProvider
  ) { };

  public async execute(params?: any): Promise<any> {
    console.log("transient scope service run 1 time", await this.transientFactoryServiceProvider().execute());
    console.log("transient scope service run 2 time", await this.transientFactoryServiceProvider().execute());
    console.log("request scope service run 1 time", await this.sessionInfoService.getSessionInfo());
    console.log("request scope service run 2 time", await this.sessionInfoService.getSessionInfo());
  };

};
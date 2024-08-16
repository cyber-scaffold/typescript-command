import { v4 as uuidv4 } from "uuid";
import { injectable, interfaces, inject } from "inversify";

import { IOCContainer } from "@/commons/Application/IOCContainer";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

export type TransientFactoryServiceProvider = () => TransientFactoryService;

export function TransientFactoryServiceFactory(context: interfaces.Context): TransientFactoryServiceProvider {
  return function TransientFactoryServiceProvider(): TransientFactoryService {
    return context.container.get(TransientFactoryService);
  };
};

/**
 * @description 测试inTransientScope在工厂模式下的行为
 * **/
@injectable()
export class TransientFactoryService {

  private id = uuidv4();

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  public async execute() {
    return this.id;
  };

};

IOCContainer.bind(TransientFactoryService).toSelf().inTransientScope();
IOCContainer.bind(TransientFactoryServiceFactory).toFactory(TransientFactoryServiceFactory);
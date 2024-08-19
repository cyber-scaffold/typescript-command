import { injectable, inject } from "inversify";

import { IOCContainer } from "@/commons/Application/IOCContainer";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

import { TransientFactoryServiceFactory, TransientFactoryServiceProvider } from "@/services/TransientFactoryService";
import { RequestFactoryServiceFactory, RequestFactoryServiceProvider } from "@/services/RequestFactoryService";
import { SessionInfoService } from "@/services/SessionInfoService";

@injectable()
export class TestService {

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager,
    @inject(SessionInfoService) private readonly $SessionInfoService: SessionInfoService,
    @inject(RequestFactoryServiceFactory) private readonly $RequestFactoryServiceProvider: RequestFactoryServiceProvider,
    @inject(TransientFactoryServiceFactory) private readonly $TransientFactoryServiceProvider: TransientFactoryServiceProvider
  ) { };

  public async execute(params?: any): Promise<any> {
    console.log("transient factory scope service run 1 time", await this.$TransientFactoryServiceProvider().execute());
    console.log("transient factory scope service run 2 time", await this.$TransientFactoryServiceProvider().execute());
    console.log("request factory scope service run 1 time", await this.$RequestFactoryServiceProvider().execute());
    console.log("request factory scope service run 2 time", await this.$RequestFactoryServiceProvider().execute());
    console.log("request scope service run 1 time", await this.$SessionInfoService.getSessionInfo());
    console.log("request scope service run 2 time", await this.$SessionInfoService.getSessionInfo());
  };

};

IOCContainer.bind(TestService).toSelf().inRequestScope();
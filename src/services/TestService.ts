import { injectable, inject } from "inversify";

import { SessionInfoService } from "@/services/SessionInfoService";
import { RequestFactoryServiceFactory, RequestFactoryServiceProvider } from "@/services/RequestFactoryService";
import { TransientFactoryServiceFactory, TransientFactoryServiceProvider } from "@/services/TransientFactoryService";

@injectable()
export class TestService {

  constructor(
    // @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager,
    @inject(SessionInfoService) private readonly $SessionInfoService: SessionInfoService,
    @inject(RequestFactoryServiceFactory) private readonly requestFactoryServiceProvider: RequestFactoryServiceProvider,
    @inject(TransientFactoryServiceFactory) private readonly transientFactoryServiceProvider: TransientFactoryServiceProvider
  ) { };

  public async execute(params?: any): Promise<any> {
    console.log("transient factory scope service run 1 time", await this.transientFactoryServiceProvider().execute());
    console.log("transient factory scope service run 2 time", await this.transientFactoryServiceProvider().execute());
    console.log("request factory scope service run 1 time", await this.requestFactoryServiceProvider().execute());
    console.log("request factory scope service run 2 time", await this.requestFactoryServiceProvider().execute());
    console.log("request scope service run 1 time", await this.$SessionInfoService.getSessionInfo());
    console.log("request scope service run 2 time", await this.$SessionInfoService.getSessionInfo());
  };

};
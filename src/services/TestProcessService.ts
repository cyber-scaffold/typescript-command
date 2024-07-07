import { injectable, inject } from "inversify";

import { SessionInfoService } from "@/services/SessionInfoService";
import { TransientFactoryServiceFactory, TransientFactoryServiceProvider } from "@/services/TransientFactoryService";

@injectable()
export class TestProcessService {

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
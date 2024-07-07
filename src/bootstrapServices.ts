import { IOCContainer } from "@/commons/Application/IOCContainer";

import { SessionInfoService } from "@/services/SessionInfoService";
import { TestProcessService } from "@/services/TestProcessService";
import { TransientFactoryService, TransientFactoryServiceFactory } from "@/services/TransientFactoryService";

export async function bootstrapServices() {
  IOCContainer.bind(SessionInfoService).toSelf().inRequestScope();

  IOCContainer.bind(TestProcessService).toSelf().inRequestScope();

  IOCContainer.bind(TransientFactoryService).toSelf().inTransientScope();
  IOCContainer.bind(TransientFactoryServiceFactory).toFactory(TransientFactoryServiceFactory);

};
import { IOCContainer } from "@/commons/Application/IOCContainer";

import { MainService, MainServiceFactory } from "@/services/MainService";

export async function bootstrapServices() {
  IOCContainer.bind(MainService).toSelf();
  IOCContainer.bind(MainServiceFactory).toFactory(MainServiceFactory);
};
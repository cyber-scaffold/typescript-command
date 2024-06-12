import { IOCContainer } from "@/commons/Application/IOCContainer";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

export async function bootstrapApplication() {
  IOCContainer.bind(ApplicationConfigManager).toSelf().inSingletonScope();
  await IOCContainer.get(ApplicationConfigManager).initialize();
};
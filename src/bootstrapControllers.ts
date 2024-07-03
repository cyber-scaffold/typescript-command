import { program } from "commander";
import { IOCContainer } from "@/commons/Application/IOCContainer";

import { TestController } from "@/controllers/TestController";

export async function bootstrapControllers() {
  IOCContainer.bind(TestController).toSelf().inSingletonScope();
  await IOCContainer.get(TestController).definition(program);

};
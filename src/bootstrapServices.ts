import { IOCContainer } from "@/commons/Application/IOCContainer";

import { MainServices } from "@/services/MainServices";

export async function bootstrapServices() {
  IOCContainer.bind(MainServices).toSelf();
};
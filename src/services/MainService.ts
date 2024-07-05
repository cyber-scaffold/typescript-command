import { injectable, interfaces, inject } from "inversify";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

export type MainServiceProvider = () => MainService;

export function MainServiceFactory(context: interfaces.Context): MainServiceProvider {
  return function MainServiceProvider(): MainService {
    return context.container.get(MainService);
  };
};

@injectable()
export class MainService {

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager
  ) { };

  public async execute() {
    console.log("asdassa");
  };

};
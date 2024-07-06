import { v4 as uuidv4 } from "uuid";
import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";


@injectable()
export class TransientService {

  private id = uuidv4();

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager
  ) { };

  public async execute() {
    return this.id;
  };

};
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@@/frameworks/cores/IOCContainer";
import { FrameworkBasicConfig } from "@@/frameworks/commons/FrameworkBasicConfig"

@injectable()
export class ClearDirectory {

  constructor (
    @inject(FrameworkBasicConfig) private readonly $FrameworkBasicConfig: FrameworkBasicConfig
  ) { };

  public async execute() {
    const { projectDirectory } = this.$FrameworkBasicConfig.getRuntimeConfig();
    await promisify(fs.rm)(path.resolve(projectDirectory, "./dist/"), { recursive: true, force: true });
    await promisify(fs.rm)(path.resolve(projectDirectory, "./types/"), { recursive: true, force: true });
  };

};

IOCContainer.bind(ClearDirectory).toSelf().inRequestScope();
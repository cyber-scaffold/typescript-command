#!/usr/bin/env node
import { green } from "colors";
import { program } from "commander";

import { IOCContainer } from "@/cores/IOCContainer";
import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

import { TestProject } from "@/controllers/TestProject";

import { readPackageJSON } from "@/utils/readPackageJSON";

setImmediate(async () => {
  try {
    const { name, version } = await readPackageJSON();
    program.name(green(name)).usage(["", green(`${name} <command> <subcommand> [options]`)].join("\n")).version(version);

    const testCommand = program.command("test").description("这是test相关的命令,是根节点");
    IOCContainer.get(TestProject).definition(testCommand);

    program.parse();
    await IOCContainer.get(ApplicationConfigManager).initialize();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
